type CsrErrorCode =
  | "MISSING_SUBJECT_OR_SAN"
  | "INVALID_SAN_IP"
  | "MISSING_PRIVATE_KEY"
  | "INVALID_PEM"
  | "UNSUPPORTED_PEM"
  | "LEGACY_PEM"
  | "ENCRYPTED_KEY"
  | "UNSUPPORTED_KEY_TYPE"
  | "UNSUPPORTED_CURVE"
  | "WEB_CRYPTO_UNAVAILABLE"
  | "IMPORT_FAILED"
  | "GENERATION_FAILED"

class CsrGeneratorError extends Error {
  readonly code: CsrErrorCode
  readonly detail?: string

  constructor(code: CsrErrorCode, detail?: string) {
    super(detail ? `${code}: ${detail}` : code)
    this.code = code
    this.detail = detail
  }
}

export { CsrGeneratorError }
export type { CsrErrorCode }
