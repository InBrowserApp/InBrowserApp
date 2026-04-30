type ConversionMode = "jwk" | "pem"

type JwkPemConverterLocaleMessages = Readonly<{
  tabJwkToPem: string
  tabPemToJwk: string
  conversionErrorTitle: string
  errorInvalidJson: string
  errorInvalidJwk: string
  errorMissingField: string
  errorUnsupportedKty: string
  errorUnsupportedCurve: string
  errorMissingPrivateKey: string
  errorMissingPublicKey: string
  errorInvalidPem: string
  errorUnsupportedPemLabel: string
  errorUnsupportedAlgorithm: string
  errorWebCryptoUnavailable: string
  errorWebCryptoFailed: string
  errorOkpPublicKeyMissing: string
  warningsTitle: string
  jwkInputTitle: string
  jwkInputPlaceholder: string
  jwkInputHint: string
  keySelectLabel: string
  keySelectHint: string
  unknownKey: string
  outputTypeLabel: string
  outputTypePublic: string
  outputTypePrivate: string
  pemInputTitle: string
  pemInputPlaceholder: string
  pemInputHint: string
  prettyJson: string
  outputTitle: string
  outputDescription: string
  downloadButton: string
  useSampleLabel: string
  clearLabel: string
  importFromFileLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type JwkPemConverterMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  JwkPemConverterLocaleMessages

export type {
  ConversionMode,
  JwkPemConverterLocaleMessages,
  JwkPemConverterMessages,
}
