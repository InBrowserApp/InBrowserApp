const JWT_ALGORITHMS = [
  "HS256",
  "HS384",
  "HS512",
  "RS256",
  "RS384",
  "RS512",
  "PS256",
  "PS384",
  "PS512",
  "ES256",
  "ES384",
  "ES512",
] as const

type JwtAlgorithm = (typeof JWT_ALGORITHMS)[number]
type AlgorithmSelection = "auto" | JwtAlgorithm
type JwtJsonObject = Record<string, unknown>

type JwtDecodeErrorCode =
  | "empty-token"
  | "invalid-segment-count"
  | "empty-header-or-payload"
  | "invalid-header-base64"
  | "invalid-payload-base64"
  | "invalid-signature-base64"
  | "invalid-header-json"
  | "invalid-payload-json"
  | "header-not-object"

type JwtVerifyErrorCode =
  | "key-required"
  | "missing-algorithm"
  | "unsupported-algorithm"
  | "algorithm-mismatch"
  | "invalid-key-json"
  | "invalid-jwk"
  | "empty-jwks"
  | "jwk-kid-not-found"
  | "unsupported-key-format"
  | "unsupported-pem-label"
  | "key-import-failed"
  | "webcrypto-unavailable"

type DecodedJwt = Readonly<{
  header: JwtJsonObject
  payload: unknown
  payloadObject: JwtJsonObject | null
  headerJson: string
  payloadJson: string
  signingInput: string
  signature: Uint8Array
  signatureSegment: string
  algorithm: string | null
  keyId: string | null
}>

type DecodeJwtResult =
  | Readonly<{ ok: true; value: DecodedJwt }>
  | Readonly<{ ok: false; code: JwtDecodeErrorCode }>

type JwtVerificationResult =
  | Readonly<{ status: "verified"; algorithm: JwtAlgorithm }>
  | Readonly<{
      status: "failed"
      algorithm: JwtAlgorithm
      code: "signature-invalid"
    }>
  | Readonly<{
      status: "error"
      code: JwtVerifyErrorCode
      algorithm?: string
    }>

class JwtDecodeError extends Error {
  readonly code: JwtDecodeErrorCode

  constructor(code: JwtDecodeErrorCode) {
    super(code)
    this.name = "JwtDecodeError"
    this.code = code
  }
}

class JwtVerifyError extends Error {
  readonly code: JwtVerifyErrorCode

  constructor(code: JwtVerifyErrorCode) {
    super(code)
    this.name = "JwtVerifyError"
    this.code = code
  }
}

function isJwtAlgorithm(value: string): value is JwtAlgorithm {
  return JWT_ALGORITHMS.includes(value as JwtAlgorithm)
}

function isJsonObject(value: unknown): value is JwtJsonObject {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

export {
  JWT_ALGORITHMS,
  JwtDecodeError,
  JwtVerifyError,
  isJsonObject,
  isJwtAlgorithm,
}
export type {
  AlgorithmSelection,
  DecodeJwtResult,
  DecodedJwt,
  JwtAlgorithm,
  JwtDecodeErrorCode,
  JwtVerificationResult,
  JwtVerifyErrorCode,
}
