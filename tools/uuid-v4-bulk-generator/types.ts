type UuidV4BulkMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  countLabel: string
  countHelp: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
  generationError: string
}>

type UuidV4BulkMessages = UuidV4BulkMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV4BulkMessages, UuidV4BulkMessagesCatalog }
