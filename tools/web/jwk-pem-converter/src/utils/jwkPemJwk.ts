import { base64UrlToBytes, bytesToBase64 } from './jwkPemBase64'
import {
  encodeBitString,
  encodeInteger,
  encodeOctetString,
  encodeOid,
  encodeSequence,
} from './jwkPemAsn1'
import { EC_CURVE_OIDS, OKP_CURVE_OIDS } from './jwkPemConstants'
import { JwkPemError, type EcCurve, type OkpCurve, type PemOutputType } from './jwkPemTypes'
import { exportDerFromJwk } from './jwkPemWebCrypto'

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
