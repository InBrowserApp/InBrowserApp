type UuidV7MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  countLabel: string
  countDescription: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  batchSummaryLabel: string
  versionLabel: string
  timestampLabel: string
  timestampMillisecondsLabel: string
  generatedCountLabel: string
  unavailableLabel: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type UuidV7Messages = UuidV7MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV7Messages, UuidV7MessagesCatalog }
