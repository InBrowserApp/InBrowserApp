import { decodeBase64Url, decodeBase64UrlText } from "./jwt-base64"
import {
  JwtDecodeError,
  isJsonObject,
  type DecodeJwtResult,
  type DecodedJwt,
} from "./jwt-types"

function parseJwt(token: string): DecodedJwt {
  const trimmed = token.trim()

  if (trimmed === "") {
    throw new JwtDecodeError("empty-token")
  }

  const parts = trimmed.split(".")

  if (parts.length !== 3) {
    throw new JwtDecodeError("invalid-segment-count")
  }

  const headerSegment = parts[0]
  const payloadSegment = parts[1]
  const signatureSegment = parts[2] as string

  if (!headerSegment || !payloadSegment) {
    throw new JwtDecodeError("empty-header-or-payload")
  }

  const header = parseJsonSegment(headerSegment, "header")
  if (!isJsonObject(header)) {
    throw new JwtDecodeError("header-not-object")
  }

  const payload = parseJsonSegment(payloadSegment, "payload")
  const payloadObject = isJsonObject(payload) ? payload : null
  const signature = parseSignatureSegment(signatureSegment)

  return {
    header,
    payload,
    payloadObject,
    headerJson: stringifyJson(header),
    payloadJson: stringifyJson(payload),
    signingInput: `${headerSegment}.${payloadSegment}`,
    signature,
    signatureSegment,
    algorithm: getHeaderString(header, "alg"),
    keyId: getHeaderString(header, "kid"),
  }
}

function decodeJwt(token: string): DecodeJwtResult {
  try {
    return { ok: true, value: parseJwt(token) }
  } catch (error) {
    if (error instanceof JwtDecodeError) {
      return { ok: false, code: error.code }
    }

    return { ok: false, code: "invalid-payload-json" }
  }
}

function parseJsonSegment(segment: string, part: "header" | "payload") {
  let json: string

  try {
    json = decodeBase64UrlText(segment)
  } catch {
    throw new JwtDecodeError(
      part === "header" ? "invalid-header-base64" : "invalid-payload-base64"
    )
  }

  try {
    return JSON.parse(json) as unknown
  } catch {
    throw new JwtDecodeError(
      part === "header" ? "invalid-header-json" : "invalid-payload-json"
    )
  }
}

function parseSignatureSegment(segment: string): Uint8Array {
  try {
    return decodeBase64Url(segment)
  } catch {
    throw new JwtDecodeError("invalid-signature-base64")
  }
}

function getHeaderString(
  header: Record<string, unknown>,
  key: string
): string | null {
  const value = header[key]
  return typeof value === "string" ? value : null
}

function stringifyJson(value: unknown): string {
  return JSON.stringify(value, null, 2)
}

export { decodeJwt, parseJwt }
