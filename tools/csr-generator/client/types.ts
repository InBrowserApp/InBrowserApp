import type { ToolMeta } from "@workspace/tool-sdk"
import type { CsrResult } from "../core/csr"

type CsrGeneratorMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  keySourceLabel: string
  keySourceGenerate: string
  keySourceImport: string
  algorithmLabel: string
  algorithmRsa: string
  algorithmEcdsa: string
  rsaKeySizeLabel: string
  rsaHashLabel: string
  ecCurveLabel: string
  importLabel: string
  importPlaceholder: string
  importDescription: string
  subjectTitle: string
  subjectDescription: string
  subjectCommonNameLabel: string
  subjectCommonNamePlaceholder: string
  subjectOrganizationLabel: string
  subjectOrganizationalUnitLabel: string
  subjectCountryLabel: string
  subjectCountryPlaceholder: string
  subjectStateLabel: string
  subjectLocalityLabel: string
  subjectEmailLabel: string
  sanTitle: string
  sanDescription: string
  sanDnsLabel: string
  sanDnsPlaceholder: string
  sanIpLabel: string
  sanIpPlaceholder: string
  sanEmailLabel: string
  sanEmailPlaceholder: string
  sanUriLabel: string
  sanUriPlaceholder: string
  generateLabel: string
  generatingLabel: string
  resetLabel: string
  outputTitle: string
  outputDescription: string
  emptyTitle: string
  emptyDescription: string
  errorTitle: string
  errorMissingSubjectOrSan: string
  errorMissingPrivateKey: string
  errorInvalidPem: string
  errorUnsupportedPem: string
  errorLegacyPem: string
  errorEncryptedKey: string
  errorUnsupportedKeyType: string
  errorUnsupportedCurve: string
  errorInvalidSanIp: string
  errorWebCryptoUnavailable: string
  errorImportFailed: string
  errorGenerationFailed: string
  csrTitle: string
  csrDescription: string
  privateKeyTitle: string
  privateKeyDescription: string
  privateKeyWarningTitle: string
  privateKeyWarningDescription: string
  keyAlgorithmLabel: string
  copyCsrLabel: string
  copyPrivateKeyLabel: string
  copiedLabel: string
  downloadCsrLabel: string
  downloadPrivateKeyLabel: string
}>

type CsrGeneratorMessages = CsrGeneratorMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

type CsrGenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; result: CsrResult }
  | { status: "error"; message: string }

export type {
  CsrGenerationState,
  CsrGeneratorMessages,
  CsrGeneratorMessagesCatalog,
}
