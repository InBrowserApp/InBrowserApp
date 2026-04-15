type LoremIpsumMessagesCatalog = Readonly<{
  optionsTitle: string
  wordsLabel: string
  sentencesLabel: string
  paragraphsLabel: string
  countLabel: string
  localeLabel: string
  resultsTitle: string
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
