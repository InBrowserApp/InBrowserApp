type UuidV7MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  modeLabel: string
  singleModeLabel: string
  batchModeLabel: string
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

type UuidV7GenerationMode = "single" | "batch"

export type { UuidV7GenerationMode, UuidV7Messages, UuidV7MessagesCatalog }
