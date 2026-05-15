/* v8 ignore file -- type-only module */

type UlidMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  generationModeLabel: string
  generationModeDescription: string
  generationSingleLabel: string
  generationBatchLabel: string
  countLabel: string
  countDescription: string
  timestampModeLabel: string
  timestampModeDescription: string
  timestampNowLabel: string
  timestampCustomLabel: string
  customDateTimeLabel: string
  customUnixMillisecondsLabel: string
  setNowLabel: string
  monotonicBatchLabel: string
  monotonicBatchDescription: string
  timestampInvalid: string
  timestampOutOfRange: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  generatedAtLabel: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type UlidMessages = UlidMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UlidMessages, UlidMessagesCatalog }
