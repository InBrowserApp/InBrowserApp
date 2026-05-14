import type { ToolMeta } from "@workspace/tool-sdk"

import type { ParsedCertificateEntry } from "../core/types"

type CertificatePublicKeyParserLocaleMessages = Readonly<{
  inputTitle: string
  inputDescription: string
  inputLabel: string
  inputPlaceholder: string
  inputHint: string
  selectedFileHint: string
  importFromFileLabel: string
  useSampleLabel: string
  clearLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsEmptyTitle: string
  resultsEmptyDescription: string
  loadingTitle: string
  loadingDescription: string
  parseErrorTitle: string
  warningsTitle: string
  copyJsonLabel: string
  copyLabel: string
  copiedLabel: string
  certificateTypeLabel: string
  publicKeyTypeLabel: string
  certificateLabel: string
  publicKeyLabel: string
  subjectLabel: string
  issuerLabel: string
  serialNumberLabel: string
  notBeforeLabel: string
  notAfterLabel: string
  signatureAlgorithmLabel: string
  publicKeyAlgorithmLabel: string
  keySizeLabel: string
  curveLabel: string
  fingerprintsTitle: string
  sha1FingerprintLabel: string
  sha256FingerprintLabel: string
  extensionsTitle: string
  subjectAlternativeNamesLabel: string
  keyUsageLabel: string
  extendedKeyUsageLabel: string
  basicConstraintsLabel: string
  subjectKeyIdentifierLabel: string
  authorityKeyIdentifierLabel: string
  notAvailable: string
  bitsLabel: string
  invalidInput: string
  invalidPem: string
  parseFailed: string
  unsupportedPemBlock: string
  readFileError: string
  webCryptoUnavailable: string
}>

type CertificatePublicKeyParserMessages =
  CertificatePublicKeyParserLocaleMessages &
    Readonly<{
      meta: ToolMeta
    }>

type CertificateParseState =
  | Readonly<{ status: "idle" }>
  | Readonly<{ status: "loading" }>
  | Readonly<{ status: "error"; message: string }>
  | Readonly<{
      status: "ready"
      entries: readonly ParsedCertificateEntry[]
      warnings: readonly string[]
    }>

export type {
  CertificateParseState,
  CertificatePublicKeyParserLocaleMessages,
  CertificatePublicKeyParserMessages,
}
