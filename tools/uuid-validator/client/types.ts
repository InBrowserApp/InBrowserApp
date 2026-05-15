import type { UuidValidationResult } from "../core/uuid"

type UuidValidatorMessagesCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  uuidLabel: string
  placeholder: string
  validTitle: string
  invalidTitle: string
  validDescription: string
  invalidEmpty: string
  invalidFormat: string
  invalidVersion: string
  invalidVariant: string
  resultsTitle: string
  resultsDescription: string
  emptyTitle: string
  emptyDescription: string
  statusLabel: string
  normalizedLabel: string
  versionLabel: string
  variantLabel: string
  byteLengthLabel: string
  hexLabel: string
  formatCheckLabel: string
  versionCheckLabel: string
  variantCheckLabel: string
  passLabel: string
  failLabel: string
  notAvailable: string
  yesLabel: string
  noLabel: string
  copyLabel: string
  copiedLabel: string
  segmentsTitle: string
  timeLowLabel: string
  timeMidLabel: string
  timeHighAndVersionLabel: string
  clockSequenceLabel: string
  nodeLabel: string
  version1: string
  version2: string
  version3: string
  version4: string
  version5: string
  version6: string
  version7: string
  version8: string
  versionNil: string
  versionMax: string
  variantRfc4122: string
  variantNcs: string
  variantMicrosoft: string
  variantFuture: string
  variantSpecial: string
}>

type UuidValidatorMessages = UuidValidatorMessagesCatalog & {
  meta: Readonly<{
    name: string
    description: string
  }>
}

type UuidValidationAnalysis = UuidValidationResult

export type {
  UuidValidationAnalysis,
  UuidValidatorMessages,
  UuidValidatorMessagesCatalog,
}
