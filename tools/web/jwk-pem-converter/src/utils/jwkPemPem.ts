import * as ed25519 from '@noble/ed25519'
import { base64ToBytes, bytesToBase64Url, isBase64Input } from './jwkPemBase64'
import {
  decodeOid,
  encodeBitString,
  encodeInteger,
  encodeNull,
  encodeOctetString,
  encodeOid,
  encodeSequence,
  extractBitString,
  readAsn1Children,
  readAsn1Element,
} from './jwkPemAsn1'
import { EC_OID, EC_OID_TO_CURVE, OKP_OIDS, RSA_OID } from './jwkPemConstants'
import {
  JwkPemError,
  type Asn1Element,
  type EcCurve,
  type KeyType,
  type OkpCurve,
  type PemBlock,
  type PemConversionResult,
  type WarningEntry,
} from './jwkPemTypes'
import { exportJwkFromDer } from './jwkPemWebCrypto'

export function parsePemBlocks(input: string): PemBlock[] {
  const blocks: PemBlock[] = []
  const pattern = /-----BEGIN ([^-]+)-----([\s\S]*?)-----END \1-----/g

  for (const match of input.matchAll(pattern)) {
    const label = match[1]?.trim()
    const body = match[2]?.replace(/[\r\n\s]/g, '')
    if (!label || !body) {
      continue
    }
    try {
      blocks.push({ label, der: base64ToBytes(body) })
    } catch {
      continue
    }
  }

  return blocks
}

export async function pemToJwk(input: string): Promise<PemConversionResult> {
  const blocks = parsePemBlocks(input)
  if (!blocks.length) {
    if (isBase64Input(input.trim())) {
      return convertDerInput(base64ToBytes(input.trim()))
    }
    throw new JwkPemError('errorInvalidPem')
  }

  const jwkKeys: JsonWebKey[] = []
  const warnings: WarningEntry[] = []

  for (const block of blocks) {
    try {
      const jwk = await convertPemBlock(block)
      jwkKeys.push(jwk)
    } catch (error) {
      if (error instanceof JwkPemError) {
        warnings.push({ key: error.key, params: error.params })
      } else {
        warnings.push({ key: 'errorUnsupportedPemLabel' })
      }
    }
  }

  if (!jwkKeys.length) {
    throw new JwkPemError('errorInvalidPem')
  }

  if (jwkKeys.length === 1) {
    return { jwk: jwkKeys[0]!, warnings }
  }

  return { jwk: { keys: jwkKeys }, warnings }
}

async function convertDerInput(der: Uint8Array): Promise<PemConversionResult> {
  const kind = detectDerKeyType(der)
  if (kind === 'pkcs8') {
    return { jwk: await convertPkcs8(der), warnings: [] }
  }
  if (kind === 'spki') {
    return { jwk: await convertSpki(der), warnings: [] }
  }
  throw new JwkPemError('errorInvalidPem')
}

async function convertPemBlock(block: PemBlock): Promise<JsonWebKey> {
  const label = block.label.toUpperCase()
  if (label === 'PUBLIC KEY') {
    return convertSpki(block.der)
  }
  if (label === 'PRIVATE KEY') {
    return convertPkcs8(block.der)
  }
  if (label === 'RSA PRIVATE KEY') {
    const wrapped = buildPkcs8FromPkcs1(block.der)
    return convertPkcs8(wrapped)
  }
  if (label === 'RSA PUBLIC KEY') {
    const wrapped = buildSpkiFromRsaPublicKey(block.der)
    return convertSpki(wrapped)
  }
  if (label === 'EC PRIVATE KEY') {
    const wrapped = buildPkcs8FromSec1(block.der)
    return convertPkcs8(wrapped)
  }
  throw new JwkPemError('errorUnsupportedPemLabel', { label: block.label })
}

async function convertSpki(der: Uint8Array): Promise<JsonWebKey> {
  const algorithm = parseSpkiAlgorithm(der)
  if (algorithm.type === 'OKP') {
    return parseOkpSpki(der)
  }
  if (algorithm.type === 'RSA') {
    return exportJwkFromDer(der, 'spki', {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    } as RsaHashedImportParams)
  }
  if (algorithm.type === 'EC') {
    return exportJwkFromDer(der, 'spki', {
      name: 'ECDSA',
      namedCurve: algorithm.curve,
    } as EcKeyImportParams)
  }
  throw new JwkPemError('errorUnsupportedAlgorithm', { algorithm: algorithm.oid })
}

async function convertPkcs8(der: Uint8Array): Promise<JsonWebKey> {
  const algorithm = parsePkcs8Algorithm(der)
  if (algorithm.type === 'OKP') {
    return parseOkpPkcs8(der)
  }
  if (algorithm.type === 'RSA') {
    return exportJwkFromDer(der, 'pkcs8', {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    } as RsaHashedImportParams)
  }
  if (algorithm.type === 'EC') {
    return exportJwkFromDer(der, 'pkcs8', {
      name: 'ECDSA',
      namedCurve: algorithm.curve,
    } as EcKeyImportParams)
  }
  throw new JwkPemError('errorUnsupportedAlgorithm', { algorithm: algorithm.oid })
}

export function detectDerKeyType(der: Uint8Array): 'spki' | 'pkcs8' | 'unknown' {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  if (!children.length) return 'unknown'
  const first = children[0]!
  if (first.tag === 0x02) {
    return 'pkcs8'
  }
  if (first.tag === 0x30) {
    return 'spki'
  }
  return 'unknown'
}

export function parseSpkiAlgorithm(der: Uint8Array): {
  type: KeyType
  curve?: EcCurve
  oid: string
} {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[0])

  if (alg.oid === RSA_OID) {
    return { type: 'RSA', oid: alg.oid }
  }

  if (alg.oid === EC_OID) {
    const curve = alg.paramsOid ? EC_OID_TO_CURVE[alg.paramsOid] : undefined
    if (!curve) {
      throw new JwkPemError('errorUnsupportedCurve', { crv: alg.paramsOid ?? 'unknown' })
    }
    return { type: 'EC', curve, oid: alg.oid }
  }

  if (alg.oid in OKP_OIDS) {
    return { type: 'OKP', oid: alg.oid }
  }

  return { type: 'Unknown', oid: alg.oid }
}

export function parsePkcs8Algorithm(der: Uint8Array): {
  type: KeyType
  curve?: EcCurve
  oid: string
} {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[1])

  if (alg.oid === RSA_OID) {
    return { type: 'RSA', oid: alg.oid }
  }

  if (alg.oid === EC_OID) {
    const curve = alg.paramsOid ? EC_OID_TO_CURVE[alg.paramsOid] : undefined
    if (!curve) {
      throw new JwkPemError('errorUnsupportedCurve', { crv: alg.paramsOid ?? 'unknown' })
    }
    return { type: 'EC', curve, oid: alg.oid }
  }

  if (alg.oid in OKP_OIDS) {
    return { type: 'OKP', oid: alg.oid }
  }

  return { type: 'Unknown', oid: alg.oid }
}

export function parseOkpSpki(der: Uint8Array): JsonWebKey {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[0])
  const curve = OKP_OIDS[alg.oid]
  if (!curve) {
    throw new JwkPemError('errorUnsupportedAlgorithm', { algorithm: alg.oid })
  }

  const publicKeyElement = children[1]
  if (!publicKeyElement || publicKeyElement.tag !== 0x03) {
    throw new JwkPemError('errorInvalidPem')
  }

  const publicKey = extractBitString(der, publicKeyElement)
  return {
    kty: 'OKP',
    crv: curve,
    x: bytesToBase64Url(publicKey),
  }
}

export async function parseOkpPkcs8(der: Uint8Array): Promise<JsonWebKey> {
  const top = readAsn1Element(der, 0)
  const children = readAsn1Children(der, top)
  const alg = parseAlgorithmIdentifier(der, children[1])
  const curve = OKP_OIDS[alg.oid]
  if (!curve) {
    throw new JwkPemError('errorUnsupportedAlgorithm', { algorithm: alg.oid })
  }

  const privateKeyElement = children[2]
  if (!privateKeyElement || privateKeyElement.tag !== 0x04) {
    throw new JwkPemError('errorInvalidPem')
  }

  const privateKeyWrapper = der.slice(privateKeyElement.valueStart, privateKeyElement.valueEnd)
  const innerElement = readAsn1Element(privateKeyWrapper, 0)
  if (innerElement.tag !== 0x04) {
    throw new JwkPemError('errorInvalidPem')
  }

  const privateKey = privateKeyWrapper.slice(innerElement.valueStart, innerElement.valueEnd)
  const publicKey = extractOkpPublicKey(children, der)

  const jwk: JsonWebKey = {
    kty: 'OKP',
    crv: curve,
    d: bytesToBase64Url(privateKey),
  }

  const publicKeyBytes = publicKey ?? (await deriveOkpPublicKey(curve, privateKey))
  if (!publicKeyBytes) {
    throw new JwkPemError('errorOkpPublicKeyMissing')
  }

  jwk.x = bytesToBase64Url(publicKeyBytes)
  return jwk
}

export function extractOkpPublicKey(
  children: Asn1Element[],
  der: Uint8Array,
): Uint8Array | undefined {
  const candidate = children.find((child) => child.tag === 0xa1)
  if (!candidate) return undefined

  const inner = readAsn1Children(der, candidate)
  const bitString = inner[0]
  if (!bitString || bitString.tag !== 0x03) {
    return undefined
  }

  return extractBitString(der, bitString)
}

async function deriveOkpPublicKey(
  curve: OkpCurve,
  privateKey: Uint8Array,
): Promise<Uint8Array | null> {
  if (curve === 'Ed25519') {
    return await ed25519.getPublicKeyAsync(privateKey)
  }
  return null
}

function buildPkcs8FromPkcs1(pkcs1: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(RSA_OID), encodeNull())
  const version = encodeInteger(0)
  const privateKey = encodeOctetString(pkcs1)
  return encodeSequence(version, alg, privateKey)
}

function buildSpkiFromRsaPublicKey(pkcs1Public: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(RSA_OID), encodeNull())
  const bitString = encodeBitString(pkcs1Public)
  return encodeSequence(alg, bitString)
}

export function buildPkcs8FromSec1(sec1: Uint8Array): Uint8Array {
  const curveOid = extractSec1CurveOid(sec1)
  if (!curveOid) {
    throw new JwkPemError('errorUnsupportedCurve', { crv: 'unknown' })
  }

  const alg = encodeSequence(encodeOid(EC_OID), encodeOid(curveOid))
  const version = encodeInteger(0)
  const privateKey = encodeOctetString(sec1)
  return encodeSequence(version, alg, privateKey)
}

export function extractSec1CurveOid(sec1: Uint8Array): string | undefined {
  const top = readAsn1Element(sec1, 0)
  const children = readAsn1Children(sec1, top)

  for (const child of children) {
    if (child.tag === 0xa0) {
      const inner = readAsn1Children(sec1, child)
      const oidElement = inner[0]
      if (!oidElement || oidElement.tag !== 0x06) {
        return undefined
      }
      const oidBytes = sec1.slice(oidElement.valueStart, oidElement.valueEnd)
      return decodeOid(oidBytes)
    }
  }

  return undefined
}

export function parseAlgorithmIdentifier(
  der: Uint8Array,
  element?: Asn1Element,
): {
  oid: string
  paramsOid?: string
} {
  if (!element) {
    throw new JwkPemError('errorInvalidPem')
  }
  if (element.tag !== 0x30) {
    throw new JwkPemError('errorInvalidPem')
  }

  const children = readAsn1Children(der, element)
  if (!children.length) {
    throw new JwkPemError('errorInvalidPem')
  }

  const oidElement = children[0]
  if (!oidElement || oidElement.tag !== 0x06) {
    throw new JwkPemError('errorInvalidPem')
  }

  const oid = decodeOid(der.slice(oidElement.valueStart, oidElement.valueEnd))
  const paramsElement = children[1]
  if (!paramsElement || paramsElement.tag !== 0x06) {
    return { oid }
  }

  const paramsOid = decodeOid(der.slice(paramsElement.valueStart, paramsElement.valueEnd))
  return { oid, paramsOid }
}
