import type { JwtAlgorithm, JwtKeyFormat } from "../core/jwt-signer"

type JwtSignerMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  payloadCardTitle: string
  payloadCardDescription: string
  payloadLabel: string
  payloadPlaceholder: string
  claimsHelperTitle: string
  claimsHelperDescription: string
  iatNowLabel: string
  iatNowDescription: string
  claimCurrentValueLabel: string
  claimSigningValueLabel: string
  claimNotSetLabel: string
  claimInvalidValueLabel: string
  claimsInvalidPayloadMessage: string
  expLabel: string
  expDescription: string
  expQuick15m: string
  expQuick1h: string
  expQuick24h: string
  expQuick7d: string
  clearExpButton: string
  headerLabel: string
  headerDescription: string
  headerPlaceholder: string
  optionsCardTitle: string
  optionsCardDescription: string
  algorithmLabel: string
  keyFormatLabel: string
  keyFormatSecret: string
  keyFormatPem: string
  keyFormatJwk: string
  keyLabelSecret: string
  keyLabelPrivate: string
  keyLabelJwk: string
  keyDescriptionSecret: string
  keyDescriptionPrivate: string
  keyDescriptionJwk: string
  keyPlaceholderSecret: string
  keyPlaceholderPem: string
  keyPlaceholderJwk: string
  signButton: string
  signingButton: string
  loadSampleButton: string
  resetButton: string
  resultCardTitle: string
  resultCardDescription: string
  emptyResultTitle: string
  emptyResultDescription: string
  tokenLabel: string
  copyTokenLabel: string
  copiedLabel: string
  downloadTokenLabel: string
  detailsTitle: string
  headerPreviewLabel: string
  payloadPreviewLabel: string
  signaturePreviewLabel: string
  securityNoteTitle: string
  securityNoteDescription: string
  hmacNote: string
  privateKeyNote: string
  errorTitle: string
  errorInvalidPayloadJson: string
  errorPayloadMustBeObject: string
  errorInvalidHeaderJson: string
  errorHeaderMustBeObject: string
  errorKeyRequired: string
  errorSecretKeyFormat: string
  errorPrivateKeyFormat: string
  errorInvalidJwk: string
  errorInvalidPem: string
  errorUnsupportedAlgorithm: string
  errorWebCryptoUnavailable: string
  errorSigningFailed: string
}>

type AlgorithmOption = Readonly<{
  value: JwtAlgorithm
  label: string
}>

type KeyFormatOption = Readonly<{
  value: JwtKeyFormat
  label: string
}>

export type { AlgorithmOption, JwtSignerMessages, KeyFormatOption }
