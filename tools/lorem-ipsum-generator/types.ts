type LoremIpsumMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  wordsLabel: string
  sentencesLabel: string
  paragraphsLabel: string
  countLabel: string
  localeLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  copyResultsLabel: string
  copiedLabel: string
  downloadResultsLabel: string
  regenerateLabel: string
}>

type LoremIpsumMessages = LoremIpsumMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { LoremIpsumMessages, LoremIpsumMessagesCatalog }
