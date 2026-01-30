import 'reflect-metadata'

import { AsnConvert } from '@peculiar/asn1-schema'
import { PrivateKey, PrivateKeyInfo, Version } from '@peculiar/asn1-pkcs8'
import { RSAPrivateKey } from '@peculiar/asn1-rsa'
import { ECParameters, ECPrivateKey, id_ecPublicKey } from '@peculiar/asn1-ecc'
import { AlgorithmIdentifier } from '@peculiar/asn1-x509'
import { isIP } from 'is-ip'
import { container } from 'tsyringe'
import {
  DNS,
  EMAIL,
  IP,
  URL,
  GeneralName,
  PemConverter,
  Pkcs10CertificateRequestGenerator,
  SubjectAlternativeNameExtension,
  diAlgorithm,
  type JsonName,
} from '@peculiar/x509'
import { EC_CURVE_HASH, base64UrlToBytes, formatKeyAlgorithmLabel } from './csr-key-utils'

export type KeySource = 'generate' | 'import'
export type KeyAlgorithm = 'rsa' | 'ecdsa' | 'ed25519' | 'ed448'
export type RsaKeySize = 2048 | 3072 | 4096
export type EcCurve = 'P-256' | 'P-384' | 'P-521'
export type HashAlgorithm = 'SHA-256' | 'SHA-384' | 'SHA-512'

export type SubjectInput = {
  commonName: string
  organization: string
  organizationalUnit: string
  country: string
  state: string
  locality: string
  emailAddress: string
}

export type SanInput = {
  dns: string[]
  ip: string[]
  email: string[]
  uri: string[]
}

export type CsrCreateInput = {
  keySource: KeySource
  algorithm: KeyAlgorithm
  rsaKeySize: RsaKeySize
  rsaHash: HashAlgorithm
  ecCurve: EcCurve
  keyPem: string
  subject: SubjectInput
  san: SanInput
}

export type CsrOutput = {
  csrPem: string
  privateKeyPem?: string
  keyAlgorithmLabel: string
}

export { base64UrlToBytes, formatKeyAlgorithmLabel }

type ImportedKeyAlgorithm =
  | { type: 'rsa' }
  | { type: 'ecdsa'; curve: EcCurve }
  | { type: 'ed25519' }
  | { type: 'ed448' }

type ParsedPemKey = {
  pkcs8: ArrayBuffer
  algorithm: ImportedKeyAlgorithm
}

type ImportAlgorithm = Algorithm | RsaHashedImportParams | EcKeyImportParams

type GenerateKeyResult = {
  keys: CryptoKeyPair
  signingAlgorithm: Algorithm | EcdsaParams
  keyAlgorithmLabel: string
}

type ImportKeyResult = {
  keys: CryptoKeyPair
  signingAlgorithm: Algorithm | EcdsaParams
  keyAlgorithmLabel: string
}

export class CsrGeneratorError extends Error {
  constructor(
    public key: string,
    public params?: Record<string, string>,
  ) {
    super(key)
  }
}

const RSA_OID = '1.2.840.113549.1.1.1'
const EC_OID = '1.2.840.10045.2.1'

const OKP_OIDS: Record<string, KeyAlgorithm | 'x25519' | 'x448'> = {
  '1.3.101.112': 'ed25519',
  '1.3.101.113': 'ed448',
  '1.3.101.110': 'x25519',
  '1.3.101.111': 'x448',
}

const EC_CURVE_OIDS: Record<EcCurve, string> = {
  'P-256': '1.2.840.10045.3.1.7',
  'P-384': '1.3.132.0.34',
  'P-521': '1.3.132.0.35',
}

const EC_OID_TO_CURVE = Object.fromEntries(
  Object.entries(EC_CURVE_OIDS).map(([curve, oid]) => [oid, curve]),
) as Record<string, EcCurve>

const SUPPORTED_PRIVATE_KEY_TYPES = new Set(['PRIVATE KEY', 'RSA PRIVATE KEY', 'EC PRIVATE KEY'])

const ED448_OID = '1.3.101.113'
let ed448AlgorithmRegistered = false

class Ed448Algorithm {
  toAsnAlgorithm(algorithm: Algorithm): AlgorithmIdentifier | null {
    if (algorithm.name?.toLowerCase() === 'ed448') {
      return new AlgorithmIdentifier({ algorithm: ED448_OID })
    }
    return null
  }

  toWebAlgorithm(algorithm: AlgorithmIdentifier): Algorithm | null {
    if (algorithm.algorithm === ED448_OID) {
      return { name: 'Ed448' }
    }
    return null
  }
}

function ensureEd448AlgorithmRegistered() {
  if (ed448AlgorithmRegistered) return
  container.registerSingleton(diAlgorithm, Ed448Algorithm)
  ed448AlgorithmRegistered = true
}

function ensureKeyPair(keys: CryptoKey | CryptoKeyPair): CryptoKeyPair {
  if ('privateKey' in keys && 'publicKey' in keys) {
    return keys
  }
  throw new CsrGeneratorError('errorUnsupportedKeyType')
}

export async function createCsr(
  input: CsrCreateInput,
  cryptoProvider: Crypto = globalThis.crypto,
): Promise<CsrOutput> {
  ensureEd448AlgorithmRegistered()
  const subject = buildSubjectJson(input.subject)
  const sanNames = buildSanNames(input.san)

  if (!subject && sanNames.length === 0) {
    throw new CsrGeneratorError('errorMissingSubjectOrSan')
  }

  const keyResult =
    input.keySource === 'generate'
      ? await generateKeyPair(input, cryptoProvider)
      : await importKeyPair(input, cryptoProvider)

  const extensions = sanNames.length ? [new SubjectAlternativeNameExtension(sanNames)] : undefined

  const csr = await Pkcs10CertificateRequestGenerator.create(
    {
      name: subject ?? undefined,
      keys: keyResult.keys,
      signingAlgorithm: keyResult.signingAlgorithm,
      extensions,
    },
    cryptoProvider,
  )

  const csrPem = csr.toString('pem')

  let privateKeyPem: string | undefined
  if (input.keySource === 'generate') {
    const pkcs8 = await cryptoProvider.subtle.exportKey('pkcs8', keyResult.keys.privateKey)
    privateKeyPem = PemConverter.encode(pkcs8, PemConverter.PrivateKeyTag)
  }

  return {
    csrPem,
    privateKeyPem,
    keyAlgorithmLabel: keyResult.keyAlgorithmLabel,
  }
}

export function buildSubjectJson(subject: SubjectInput): JsonName | null {
  const name: Record<string, string[]> = {}
  const addField = (key: string, value: string) => {
    const trimmed = value.trim()
    if (trimmed) {
      name[key] = [trimmed]
    }
  }

  addField('CN', subject.commonName)
  addField('O', subject.organization)
  addField('OU', subject.organizationalUnit)
  addField('C', subject.country)
  addField('ST', subject.state)
  addField('L', subject.locality)
  addField('emailAddress', subject.emailAddress)

  return Object.keys(name).length ? [name] : null
}

export function buildSanNames(san: SanInput): GeneralName[] {
  const names: GeneralName[] = []
  const addNames = (values: string[], builder: (value: string) => GeneralName) => {
    values
      .map((value) => value.trim())
      .filter((value) => value.length > 0)
      .forEach((value) => names.push(builder(value)))
  }

  addNames(san.dns, (value) => new GeneralName(DNS, value))
  addNames(san.email, (value) => new GeneralName(EMAIL, value))
  addNames(san.uri, (value) => new GeneralName(URL, value))

  san.ip
    .map((value) => value.trim())
    .filter((value) => value.length > 0)
    .forEach((value) => {
      if (!isIP(value)) {
        throw new CsrGeneratorError('errorInvalidSanIp', { message: value })
      }
      names.push(new GeneralName(IP, value))
    })

  return names
}

export function parsePrivateKeyPem(pem: string): ParsedPemKey {
  if (!PemConverter.isPem(pem)) {
    throw new CsrGeneratorError('errorInvalidPem')
  }

  const blocks = PemConverter.decodeWithHeaders(pem)
  const encrypted = blocks.find((block) => block.type === 'ENCRYPTED PRIVATE KEY')
  if (encrypted) {
    throw new CsrGeneratorError('errorEncryptedKey')
  }

  const block = blocks.find((item) => SUPPORTED_PRIVATE_KEY_TYPES.has(item.type))
  if (!block) {
    throw new CsrGeneratorError('errorUnsupportedPem')
  }

  if (block.type === 'PRIVATE KEY') {
    return parsePkcs8(block.rawData)
  }

  if (block.type === 'RSA PRIVATE KEY') {
    return convertPkcs1Rsa(block.rawData)
  }

  return convertEcPrivateKey(block.rawData)
}

function parsePkcs8(raw: ArrayBuffer): ParsedPemKey {
  const info = AsnConvert.parse(raw, PrivateKeyInfo)
  const algorithm = info.privateKeyAlgorithm.algorithm

  if (algorithm === RSA_OID) {
    return { pkcs8: raw, algorithm: { type: 'rsa' } }
  }

  if (algorithm === EC_OID) {
    const curveOid = info.privateKeyAlgorithm.parameters
      ? AsnConvert.parse(info.privateKeyAlgorithm.parameters, ECParameters).namedCurve
      : undefined
    const curve = curveOid ? EC_OID_TO_CURVE[curveOid] : undefined
    if (!curve) {
      throw new CsrGeneratorError('errorUnsupportedCurve')
    }
    return { pkcs8: raw, algorithm: { type: 'ecdsa', curve } }
  }

  const okp = OKP_OIDS[algorithm]
  if (okp === 'x25519' || okp === 'x448') {
    throw new CsrGeneratorError('errorUnsupportedKeyType')
  }
  if (okp === 'ed25519' || okp === 'ed448') {
    return { pkcs8: raw, algorithm: { type: okp } }
  }

  throw new CsrGeneratorError('errorUnsupportedKeyType')
}

function convertPkcs1Rsa(raw: ArrayBuffer): ParsedPemKey {
  const rsa = AsnConvert.parse(raw, RSAPrivateKey)
  const info = new PrivateKeyInfo({
    version: Version.v1,
    privateKeyAlgorithm: new AlgorithmIdentifier({ algorithm: RSA_OID, parameters: null }),
    privateKey: new PrivateKey(AsnConvert.serialize(rsa)),
  })
  return {
    pkcs8: AsnConvert.serialize(info),
    algorithm: { type: 'rsa' },
  }
}

function convertEcPrivateKey(raw: ArrayBuffer): ParsedPemKey {
  const ec = AsnConvert.parse(raw, ECPrivateKey)
  const curveOid = ec.parameters?.namedCurve
  const curve = curveOid ? EC_OID_TO_CURVE[curveOid] : undefined
  if (!curve) {
    throw new CsrGeneratorError('errorUnsupportedCurve')
  }

  const info = new PrivateKeyInfo({
    version: Version.v1,
    privateKeyAlgorithm: new AlgorithmIdentifier({
      algorithm: id_ecPublicKey,
      parameters: AsnConvert.serialize(new ECParameters({ namedCurve: curveOid })),
    }),
    privateKey: new PrivateKey(AsnConvert.serialize(ec)),
  })

  return {
    pkcs8: AsnConvert.serialize(info),
    algorithm: { type: 'ecdsa', curve },
  }
}

async function generateKeyPair(
  input: CsrCreateInput,
  cryptoProvider: Crypto,
): Promise<GenerateKeyResult> {
  switch (input.algorithm) {
    case 'rsa': {
      const signingAlgorithm = {
        name: 'RSASSA-PKCS1-v1_5',
        hash: { name: input.rsaHash },
      }
      const keys = await cryptoProvider.subtle.generateKey(
        {
          name: 'RSASSA-PKCS1-v1_5',
          modulusLength: input.rsaKeySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: { name: input.rsaHash },
        },
        true,
        ['sign', 'verify'],
      )
      return {
        keys: ensureKeyPair(keys),
        signingAlgorithm,
        keyAlgorithmLabel: formatKeyAlgorithmLabel({
          algorithm: 'rsa',
          rsaKeySize: input.rsaKeySize,
          rsaHash: input.rsaHash,
        }),
      }
    }
    case 'ecdsa': {
      const hash = EC_CURVE_HASH[input.ecCurve]
      const signingAlgorithm = {
        name: 'ECDSA',
        hash: { name: hash },
      }
      const keys = await cryptoProvider.subtle.generateKey(
        {
          name: 'ECDSA',
          namedCurve: input.ecCurve,
        },
        true,
        ['sign', 'verify'],
      )
      return {
        keys: ensureKeyPair(keys),
        signingAlgorithm,
        keyAlgorithmLabel: formatKeyAlgorithmLabel({
          algorithm: 'ecdsa',
          ecCurve: input.ecCurve,
        }),
      }
    }
    case 'ed25519': {
      const signingAlgorithm = { name: 'Ed25519' }
      const keys = await cryptoProvider.subtle.generateKey(signingAlgorithm, true, [
        'sign',
        'verify',
      ])
      return {
        keys: ensureKeyPair(keys),
        signingAlgorithm,
        keyAlgorithmLabel: formatKeyAlgorithmLabel({ algorithm: 'ed25519' }),
      }
    }
    case 'ed448': {
      const signingAlgorithm = { name: 'Ed448' }
      const keys = await cryptoProvider.subtle.generateKey(signingAlgorithm, true, [
        'sign',
        'verify',
      ])
      return {
        keys: ensureKeyPair(keys),
        signingAlgorithm,
        keyAlgorithmLabel: formatKeyAlgorithmLabel({ algorithm: 'ed448' }),
      }
    }
    default:
      throw new CsrGeneratorError('errorUnsupportedKeyType')
  }
}

async function importKeyPair(
  input: CsrCreateInput,
  cryptoProvider: Crypto,
): Promise<ImportKeyResult> {
  if (!input.keyPem.trim()) {
    throw new CsrGeneratorError('errorMissingPrivateKey')
  }

  const parsed = parsePrivateKeyPem(input.keyPem)
  const privateKey = await importPrivateKey(parsed, input, cryptoProvider)
  const { publicKey, publicJwk } = await derivePublicKey(privateKey, cryptoProvider)
  const signingAlgorithm = getSigningAlgorithm(parsed.algorithm, input)

  return {
    keys: { privateKey, publicKey },
    signingAlgorithm,
    keyAlgorithmLabel: formatKeyLabelFromJwk(parsed.algorithm, publicJwk, input.rsaHash),
  }
}

async function importPrivateKey(
  parsed: ParsedPemKey,
  input: CsrCreateInput,
  cryptoProvider: Crypto,
): Promise<CryptoKey> {
  const algorithm = getImportAlgorithm(parsed.algorithm, input)
  return await cryptoProvider.subtle.importKey('pkcs8', parsed.pkcs8, algorithm, true, ['sign'])
}

function getImportAlgorithm(
  algorithm: ImportedKeyAlgorithm,
  input: CsrCreateInput,
): ImportAlgorithm {
  switch (algorithm.type) {
    case 'rsa':
      return { name: 'RSASSA-PKCS1-v1_5', hash: { name: input.rsaHash } }
    case 'ecdsa':
      return { name: 'ECDSA', namedCurve: algorithm.curve }
    case 'ed25519':
      return { name: 'Ed25519' }
    case 'ed448':
      return { name: 'Ed448' }
    /* c8 ignore next 2 */
    default:
      return { name: 'RSASSA-PKCS1-v1_5', hash: { name: input.rsaHash } }
  }
}

function getSigningAlgorithm(
  algorithm: ImportedKeyAlgorithm,
  input: CsrCreateInput,
): Algorithm | EcdsaParams {
  switch (algorithm.type) {
    case 'rsa':
      return { name: 'RSASSA-PKCS1-v1_5', hash: { name: input.rsaHash } }
    case 'ecdsa':
      return { name: 'ECDSA', hash: { name: EC_CURVE_HASH[algorithm.curve] } }
    case 'ed25519':
      return { name: 'Ed25519' }
    case 'ed448':
      return { name: 'Ed448' }
    /* c8 ignore next 2 */
    default:
      return { name: 'RSASSA-PKCS1-v1_5', hash: { name: input.rsaHash } }
  }
}

async function derivePublicKey(
  privateKey: CryptoKey,
  cryptoProvider: Crypto,
): Promise<{ publicKey: CryptoKey; publicJwk: JsonWebKey }> {
  const jwk = await cryptoProvider.subtle.exportKey('jwk', privateKey)
  const publicJwk = toPublicJwk(jwk)
  const publicKey = await cryptoProvider.subtle.importKey(
    'jwk',
    publicJwk,
    privateKey.algorithm as Algorithm,
    true,
    ['verify'],
  )
  return { publicKey, publicJwk }
}

function toPublicJwk(jwk: JsonWebKey): JsonWebKey {
  const publicJwk: JsonWebKey = {
    ...jwk,
    d: undefined,
    p: undefined,
    q: undefined,
    dp: undefined,
    dq: undefined,
    qi: undefined,
    oth: undefined,
    key_ops: ['verify'],
    ext: true,
  }

  delete publicJwk.d
  delete publicJwk.p
  delete publicJwk.q
  delete publicJwk.dp
  delete publicJwk.dq
  delete publicJwk.qi
  delete publicJwk.oth

  return publicJwk
}

function formatKeyLabelFromJwk(
  algorithm: ImportedKeyAlgorithm,
  jwk: JsonWebKey,
  rsaHash?: HashAlgorithm,
): string {
  if (algorithm.type === 'rsa' && jwk.n) {
    const size = base64UrlToBytes(jwk.n).length * 8
    return formatKeyAlgorithmLabel({ algorithm: 'rsa', rsaKeySize: size, rsaHash })
  }

  if (algorithm.type === 'ecdsa') {
    return formatKeyAlgorithmLabel({ algorithm: 'ecdsa', ecCurve: algorithm.curve })
  }

  return formatKeyAlgorithmLabel({ algorithm: algorithm.type })
}
