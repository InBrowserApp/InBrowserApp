import type { ToolMeta } from "@workspace/tool-sdk"

import type { CsrGeneratorErrorKey } from "../core/errors"

type CsrGeneratorMessagesCatalog = Readonly<{
  keySettingsTitle: string
  keySettingsDescription: string
  keySourceLabel: string
  generateKeyLabel: string
  importKeyLabel: string
  algorithmLabel: string
  rsaLabel: string
  ecdsaLabel: string
  rsaKeySizeLabel: string
  rsaHashLabel: string
  ecCurveLabel: string
  privateKeyLabel: string
  privateKeyPlaceholder: string
  privateKeyDescription: string
  privateKeyFileLabel: string
  privateKeyFileHint: string
  privacyNoteTitle: string
  privacyNoteDescription: string
  subjectTitle: string
  subjectDescription: string
  commonNameLabel: string
  commonNamePlaceholder: string
  organizationLabel: string
  organizationalUnitLabel: string
  countryLabel: string
  stateLabel: string
  localityLabel: string
  emailAddressLabel: string
  subjectHint: string
  sanTitle: string
  sanDescription: string
  sanDnsLabel: string
  sanIpLabel: string
  sanEmailLabel: string
  sanUriLabel: string
  sanDnsPlaceholder: string
  sanIpPlaceholder: string
  sanEmailPlaceholder: string
  sanUriPlaceholder: string
  sanHint: string
  generateLabel: string
  generatingLabel: string
  regenerateLabel: string
  resetLabel: string
  resultTitle: string
  resultDescription: string
  emptyTitle: string
  emptyDescription: string
  errorTitle: string
  summaryAlgorithmLabel: string
  summarySubjectLabel: string
  summarySanLabel: string
  summaryGeneratedAtLabel: string
  noSubjectLabel: string
  noSanLabel: string
  csrTitle: string
  csrDescription: string
  privateKeyTitle: string
  privateKeyOutputDescription: string
  importedKeyNote: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
  readFileError: string
}> &
  Readonly<Record<CsrGeneratorErrorKey, string>>

type CsrGeneratorMessages = CsrGeneratorMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type { CsrGeneratorMessages, CsrGeneratorMessagesCatalog }
