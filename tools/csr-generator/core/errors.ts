type CsrGeneratorErrorKey =
  | "errorMissingSubjectOrSan"
  | "errorInvalidPem"
  | "errorUnsupportedPem"
  | "errorEncryptedKey"
  | "errorUnsupportedCurve"
  | "errorUnsupportedKeyType"
  | "errorMissingPrivateKey"
  | "errorInvalidSanIp"
  | "errorWebCryptoUnavailable"

class CsrGeneratorError extends Error {
  constructor(
    readonly key: CsrGeneratorErrorKey,
    readonly params?: Readonly<Record<string, string>>
  ) {
    super(key)
    this.name = "CsrGeneratorError"
  }
}

export { CsrGeneratorError }
export type { CsrGeneratorErrorKey }
