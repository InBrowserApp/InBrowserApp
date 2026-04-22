type KsuidMessagesCatalog = Readonly<{
  optionsTitle: string
  countLabel: string
  timestampModeLabel: string
  timestampNowLabel: string
  timestampCustomLabel: string
  customDateTimeLabel: string
  customUnixSecondsLabel: string
  setNowLabel: string
  ksuidEpochLabel: string
  timestampInvalid: string
  timestampOutOfRange: string
  resultsTitle: string
  resultsPlaceholder: string
  generatedAtLabel: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type KsuidMessages = KsuidMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { KsuidMessages, KsuidMessagesCatalog }
