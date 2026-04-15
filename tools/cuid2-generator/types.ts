type Cuid2MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  countLabel: string
  lengthLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type Cuid2Messages = Cuid2MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { Cuid2Messages, Cuid2MessagesCatalog }
