import * as ed25519 from '@noble/ed25519'

export type KeyType = 'RSA' | 'EC' | 'OKP' | 'Unknown'
export type OkpCurve = 'Ed25519' | 'Ed448' | 'X25519' | 'X448'
export type EcCurve = 'P-256' | 'P-384' | 'P-521'
export type PemOutputType = 'public' | 'private'
type WebCryptoAlgorithm = RsaHashedImportParams | EcKeyImportParams | AesKeyAlgorithm

export class JwkPemError extends Error {
  constructor(
    public key: string,
    public params?: Record<string, string>,
  ) {
    super(key)
  }
}

const RSA_OID = '1.2.840.113549.1.1.1'
const EC_OID = '1.2.840.10045.2.1'

const OKP_OIDS: Record<string, OkpCurve> = {
  '1.3.101.112': 'Ed25519',
  '1.3.101.113': 'Ed448',
  '1.3.101.110': 'X25519',
  '1.3.101.111': 'X448',
}

const OKP_CURVE_OIDS: Record<OkpCurve, string> = {
  Ed25519: '1.3.101.112',
  Ed448: '1.3.101.113',
  X25519: '1.3.101.110',
  X448: '1.3.101.111',
}

const EC_CURVE_OIDS: Record<EcCurve, string> = {
  'P-256': '1.2.840.10045.3.1.7',
  'P-384': '1.3.132.0.34',
  'P-521': '1.3.132.0.35',
}

const EC_OID_TO_CURVE = Object.fromEntries(
  Object.entries(EC_CURVE_OIDS).map(([curve, oid]) => [oid, curve]),
) as Record<string, EcCurve>

export type PemBlock = {
  label: string
  der: Uint8Array
}

export type WarningEntry = {
  key: string
  params?: Record<string, string>
}

export type PemConversionResult = {
  jwk: JsonWebKey | { keys: JsonWebKey[] }
  warnings: WarningEntry[]
}

type Asn1Element = {
  tag: number
  length: number
  headerLength: number
  start: number
  valueStart: number
  valueEnd: number
  end: number
}

export function parseJwkJson(input: string): JsonWebKey[] {
  let parsed: unknown
  try {
    parsed = JSON.parse(input)
  } catch {
    throw new JwkPemError('errorInvalidJson')
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new JwkPemError('errorInvalidJwk')
  }

  if (Array.isArray((parsed as { keys?: unknown }).keys)) {
    const keys = (parsed as { keys: unknown[] }).keys.filter(
      (key): key is JsonWebKey => !!key && typeof key === 'object',
    )
    if (!keys.length) {
      throw new JwkPemError('errorInvalidJwk')
    }
    return keys
  }

  return [parsed as JsonWebKey]
}

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

export function isBase64Input(value: string): boolean {
  const cleaned = value.replace(/\s+/g, '')
  if (!cleaned) return false
  return /^[A-Za-z0-9+/=]+$/.test(cleaned)
}

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]!)
  }
  return btoa(binary)
}

export function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export function bytesToBase64Url(bytes: Uint8Array): string {
  return bytesToBase64(bytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function base64UrlToBytes(input: string): Uint8Array {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4 === 0 ? '' : '='.repeat(4 - (base64.length % 4))
  return base64ToBytes(`${base64}${padding}`)
}

export function wrapPem(label: string, der: Uint8Array): string {
  const base64 = bytesToBase64(der)
  const lines = base64.match(/.{1,64}/g) ?? []
  return `-----BEGIN ${label}-----\n${lines.join('\n')}\n-----END ${label}-----\n`
}

export async function jwkToPem(jwk: JsonWebKey, outputType: PemOutputType): Promise<string> {
  if (!jwk.kty) {
    throw new JwkPemError('errorMissingField', { field: 'kty' })
  }

  if (jwk.kty === 'OKP') {
    return jwkToOkpPem(jwk, outputType)
  }

  if (jwk.kty === 'RSA') {
    const sanitized = sanitizeRsaJwk(jwk, outputType)
    const der = await exportDerFromJwk(sanitized, outputType, {
      name: 'RSA-OAEP',
      hash: 'SHA-256',
    } as RsaHashedImportParams)
    return wrapPem(outputType === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY', der)
  }

  if (jwk.kty === 'EC') {
    const sanitized = sanitizeEcJwk(jwk, outputType)
    const der = await exportDerFromJwk(sanitized, outputType, {
      name: 'ECDSA',
      namedCurve: sanitized.crv as EcCurve,
    } as EcKeyImportParams)
    return wrapPem(outputType === 'public' ? 'PUBLIC KEY' : 'PRIVATE KEY', der)
  }

  throw new JwkPemError('errorUnsupportedKty', { kty: String(jwk.kty) })
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

function getKeyUsages(algorithm: WebCryptoAlgorithm, outputType: PemOutputType): KeyUsage[] {
  const name = (algorithm as { name?: string }).name
  if (name === 'RSA-OAEP') {
    return outputType === 'public' ? ['encrypt'] : ['decrypt']
  }
  if (name === 'ECDSA') {
    return outputType === 'public' ? ['verify'] : ['sign']
  }
  return []
}

async function exportDerFromJwk(
  jwk: JsonWebKey,
  outputType: PemOutputType,
  algorithm: WebCryptoAlgorithm,
): Promise<Uint8Array> {
  const subtle = getWebCrypto()
  try {
    const key = await subtle.importKey(
      'jwk',
      jwk,
      algorithm,
      true,
      getKeyUsages(algorithm, outputType),
    )
    const format = outputType === 'public' ? 'spki' : 'pkcs8'
    const exported = await subtle.exportKey(format, key)
    return new Uint8Array(exported)
  } catch {
    throw new JwkPemError('errorWebCryptoFailed')
  }
}

async function exportJwkFromDer(
  der: Uint8Array,
  format: 'spki' | 'pkcs8',
  algorithm: WebCryptoAlgorithm,
): Promise<JsonWebKey> {
  const subtle = getWebCrypto()
  try {
    const outputType: PemOutputType = format === 'spki' ? 'public' : 'private'
    const derBuffer = der.buffer.slice(
      der.byteOffset,
      der.byteOffset + der.byteLength,
    ) as ArrayBuffer
    const key = await subtle.importKey(
      format,
      derBuffer,
      algorithm,
      true,
      getKeyUsages(algorithm, outputType),
    )
    return (await subtle.exportKey('jwk', key)) as JsonWebKey
  } catch {
    throw new JwkPemError('errorWebCryptoFailed')
  }
}

function getWebCrypto(): SubtleCrypto {
  if (!globalThis.crypto?.subtle) {
    throw new JwkPemError('errorWebCryptoUnavailable')
  }
  return globalThis.crypto.subtle
}

function sanitizeRsaJwk(jwk: JsonWebKey, outputType: PemOutputType): JsonWebKey {
  if (!jwk.n || !jwk.e) {
    throw new JwkPemError('errorMissingField', { field: 'n/e' })
  }
  if (outputType === 'private' && !jwk.d) {
    throw new JwkPemError('errorMissingPrivateKey')
  }

  const sanitized: JsonWebKey = {
    kty: 'RSA',
    n: jwk.n,
    e: jwk.e,
  }

  if (outputType === 'private') {
    sanitized.d = jwk.d
    if (jwk.p) sanitized.p = jwk.p
    if (jwk.q) sanitized.q = jwk.q
    if (jwk.dp) sanitized.dp = jwk.dp
    if (jwk.dq) sanitized.dq = jwk.dq
    if (jwk.qi) sanitized.qi = jwk.qi
  }

  return sanitized
}

function sanitizeEcJwk(jwk: JsonWebKey, outputType: PemOutputType): JsonWebKey {
  if (!jwk.crv) {
    throw new JwkPemError('errorMissingField', { field: 'crv' })
  }
  if (!jwk.x || !jwk.y) {
    throw new JwkPemError('errorMissingPublicKey')
  }
  if (outputType === 'private' && !jwk.d) {
    throw new JwkPemError('errorMissingPrivateKey')
  }

  if (!(jwk.crv in EC_CURVE_OIDS)) {
    throw new JwkPemError('errorUnsupportedCurve', { crv: String(jwk.crv) })
  }

  const sanitized: JsonWebKey = {
    kty: 'EC',
    crv: jwk.crv,
    x: jwk.x,
    y: jwk.y,
  }

  if (outputType === 'private') {
    sanitized.d = jwk.d
  }

  return sanitized
}

function jwkToOkpPem(jwk: JsonWebKey, outputType: PemOutputType): string {
  if (!jwk.crv) {
    throw new JwkPemError('errorMissingField', { field: 'crv' })
  }

  if (!(jwk.crv in OKP_CURVE_OIDS)) {
    throw new JwkPemError('errorUnsupportedCurve', { crv: String(jwk.crv) })
  }

  if (outputType === 'public') {
    if (!jwk.x) {
      throw new JwkPemError('errorMissingPublicKey')
    }
    const spki = encodeOkpSpki(jwk.crv as OkpCurve, base64UrlToBytes(jwk.x))
    return wrapPem('PUBLIC KEY', spki)
  }

  if (!jwk.d) {
    throw new JwkPemError('errorMissingPrivateKey')
  }

  const pkcs8 = encodeOkpPkcs8(jwk.crv as OkpCurve, base64UrlToBytes(jwk.d))
  return wrapPem('PRIVATE KEY', pkcs8)
}

function detectDerKeyType(der: Uint8Array): 'spki' | 'pkcs8' | 'unknown' {
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

function parseSpkiAlgorithm(der: Uint8Array): {
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

function parsePkcs8Algorithm(der: Uint8Array): {
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

function parseOkpSpki(der: Uint8Array): JsonWebKey {
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

async function parseOkpPkcs8(der: Uint8Array): Promise<JsonWebKey> {
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

function extractOkpPublicKey(children: Asn1Element[], der: Uint8Array): Uint8Array | undefined {
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

function encodeOkpSpki(curve: OkpCurve, publicKey: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(OKP_CURVE_OIDS[curve]))
  const bitString = encodeBitString(publicKey)
  return encodeSequence(alg, bitString)
}

function encodeOkpPkcs8(curve: OkpCurve, privateKey: Uint8Array): Uint8Array {
  const alg = encodeSequence(encodeOid(OKP_CURVE_OIDS[curve]))
  const version = encodeInteger(0)
  const inner = encodeOctetString(privateKey)
  const privateKeyInfo = encodeOctetString(inner)
  return encodeSequence(version, alg, privateKeyInfo)
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

function buildPkcs8FromSec1(sec1: Uint8Array): Uint8Array {
  const curveOid = extractSec1CurveOid(sec1)
  if (!curveOid) {
    throw new JwkPemError('errorUnsupportedCurve', { crv: 'unknown' })
  }

  const alg = encodeSequence(encodeOid(EC_OID), encodeOid(curveOid))
  const version = encodeInteger(0)
  const privateKey = encodeOctetString(sec1)
  return encodeSequence(version, alg, privateKey)
}

function extractSec1CurveOid(sec1: Uint8Array): string | undefined {
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

function parseAlgorithmIdentifier(
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

function readAsn1Element(bytes: Uint8Array, offset: number): Asn1Element {
  const tag = bytes[offset]
  if (tag === undefined) {
    throw new JwkPemError('errorInvalidPem')
  }

  const lengthByte = bytes[offset + 1]
  if (lengthByte === undefined) {
    throw new JwkPemError('errorInvalidPem')
  }

  let length = 0
  let headerLength = 2

  if (lengthByte < 0x80) {
    length = lengthByte
  } else {
    const numBytes = lengthByte & 0x7f
    if (numBytes === 0 || offset + 2 + numBytes > bytes.length) {
      throw new JwkPemError('errorInvalidPem')
    }
    length = 0
    for (let i = 0; i < numBytes; i += 1) {
      length = (length << 8) | bytes[offset + 2 + i]!
    }
    headerLength = 2 + numBytes
  }

  const valueStart = offset + headerLength
  const valueEnd = valueStart + length
  if (valueEnd > bytes.length) {
    throw new JwkPemError('errorInvalidPem')
  }

  return {
    tag,
    length,
    headerLength,
    start: offset,
    valueStart,
    valueEnd,
    end: valueEnd,
  }
}

function readAsn1Children(bytes: Uint8Array, element: Asn1Element): Asn1Element[] {
  const children: Asn1Element[] = []
  let offset = element.valueStart
  while (offset < element.valueEnd) {
    const child = readAsn1Element(bytes, offset)
    children.push(child)
    offset = child.end
  }
  if (offset !== element.valueEnd) {
    throw new JwkPemError('errorInvalidPem')
  }
  return children
}

function decodeOid(bytes: Uint8Array): string {
  if (!bytes.length) {
    return ''
  }
  const first = bytes[0]!
  const values: number[] = [Math.floor(first / 40), first % 40]

  let value = 0
  for (let i = 1; i < bytes.length; i += 1) {
    value = (value << 7) | (bytes[i]! & 0x7f)
    if ((bytes[i]! & 0x80) === 0) {
      values.push(value)
      value = 0
    }
  }

  return values.join('.')
}

function encodeOid(oid: string): Uint8Array {
  const parts = oid.split('.').map((part) => Number(part))
  if (parts.length < 2) {
    throw new JwkPemError('errorInvalidPem')
  }

  const first = parts[0]! * 40 + parts[1]!
  const bytes: number[] = [first]

  for (const part of parts.slice(2)) {
    const stack: number[] = []
    let value = part
    do {
      stack.unshift(value & 0x7f)
      value >>= 7
    } while (value > 0)

    for (let i = 0; i < stack.length; i += 1) {
      const isLast = i === stack.length - 1
      bytes.push(isLast ? stack[i]! : stack[i]! | 0x80)
    }
  }

  return encodeTag(0x06, new Uint8Array(bytes))
}

function encodeLength(length: number): Uint8Array {
  if (length < 0x80) {
    return new Uint8Array([length])
  }

  const bytes: number[] = []
  let value = length
  while (value > 0) {
    bytes.unshift(value & 0xff)
    value >>= 8
  }

  return new Uint8Array([0x80 | bytes.length, ...bytes])
}

function encodeTag(tag: number, value: Uint8Array): Uint8Array {
  return concatBytes(new Uint8Array([tag]), encodeLength(value.length), value)
}

function encodeSequence(...parts: Uint8Array[]): Uint8Array {
  return encodeTag(0x30, concatBytes(...parts))
}

function encodeOctetString(value: Uint8Array): Uint8Array {
  return encodeTag(0x04, value)
}

function encodeBitString(value: Uint8Array): Uint8Array {
  return encodeTag(0x03, concatBytes(new Uint8Array([0]), value))
}

function encodeInteger(value: number): Uint8Array {
  if (value === 0) {
    return new Uint8Array([0x02, 0x01, 0x00])
  }
  if (value < 0x80) {
    return new Uint8Array([0x02, 0x01, value])
  }
  const bytes: number[] = []
  let current = value
  while (current > 0) {
    bytes.unshift(current & 0xff)
    current >>= 8
  }
  return encodeTag(0x02, new Uint8Array(bytes))
}

function encodeNull(): Uint8Array {
  return new Uint8Array([0x05, 0x00])
}

function extractBitString(der: Uint8Array, element: Asn1Element): Uint8Array {
  const bytes = der.slice(element.valueStart, element.valueEnd)
  if (!bytes.length) {
    return new Uint8Array()
  }
  return bytes.slice(1)
}

function concatBytes(...arrays: Uint8Array[]): Uint8Array {
  const length = arrays.reduce((sum, arr) => sum + arr.length, 0)
  const result = new Uint8Array(length)
  let offset = 0
  for (const arr of arrays) {
    result.set(arr, offset)
    offset += arr.length
  }
  return result
}

export const __test__ = {
  buildPkcs8FromSec1,
  decodeOid,
  detectDerKeyType,
  encodeBitString,
  encodeInteger,
  encodeNull,
  encodeOctetString,
  encodeOid,
  encodeSequence,
  encodeTag,
  exportDerFromJwk,
  extractBitString,
  extractOkpPublicKey,
  extractSec1CurveOid,
  getKeyUsages,
  parseAlgorithmIdentifier,
  parseOkpPkcs8,
  parseOkpSpki,
  parsePkcs8Algorithm,
  parseSpkiAlgorithm,
  readAsn1Children,
  readAsn1Element,
}
