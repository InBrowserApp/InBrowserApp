type UuidV1MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  modeLabel: string
  modeDescription: string
  singleModeLabel: string
  batchModeLabel: string
  countLabel: string
  countDescription: string
  macAddressLabel: string
  macAddressDescription: string
  randomMacAddressLabel: string
  clockSequenceLabel: string
  clockSequenceDescription: string
  randomClockSequenceLabel: string
  macAddressRequired: string
  macAddressInvalid: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  generatedAtLabel: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type UuidV1Messages = UuidV1MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV1Messages, UuidV1MessagesCatalog }
