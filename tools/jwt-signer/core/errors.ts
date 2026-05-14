type JwtSignerErrorCode =
  | "errorInvalidPayloadJson"
  | "errorPayloadMustBeObject"
  | "errorInvalidHeaderJson"
  | "errorHeaderMustBeObject"
  | "errorKeyRequired"
  | "errorSecretKeyFormat"
  | "errorPrivateKeyFormat"
  | "errorInvalidJwk"
  | "errorInvalidPem"
  | "errorUnsupportedAlgorithm"
  | "errorWebCryptoUnavailable"
  | "errorSigningFailed"

class JwtSignerError extends Error {
  constructor(
    public code: JwtSignerErrorCode,
    public params: Record<string, string> = {}
  ) {
    super(code)
  }
}

export { JwtSignerError }
export type { JwtSignerErrorCode }
