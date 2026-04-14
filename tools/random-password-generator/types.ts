type PasswordMode = "random" | "words" | "separator" | "pin"

type CharsetOption = "upper" | "lower" | "digits" | "symbols"

type HistoryEntry = Readonly<{
  id: string
  mode: PasswordMode
  value: string
}>

type RandomPasswordGeneratorMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  modeLabel: string
  randomTabLabel: string
  wordsTabLabel: string
  separatorTabLabel: string
  pinTabLabel: string
  randomLengthLabel: string
  characterSetLabel: string
  uppercaseLabel: string
  lowercaseLabel: string
  digitsLabel: string
  symbolsLabel: string
  excludeSimilarLabel: string
  wordsCountLabel: string
  separatorLabel: string
  capitalizeWordsLabel: string
  includeNumberLabel: string
  blockLengthLabel: string
  blockCountLabel: string
  blockSeparatorLabel: string
  pinLengthLabel: string
  allowLeadingZeroLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  generateLabel: string
  copyResultLabel: string
  copiedLabel: string
  downloadLabel: string
  hideResultLabel: string
  showResultLabel: string
}>

type RandomPasswordGeneratorMessages =
  RandomPasswordGeneratorMessagesCatalog & {
    meta: {
      name: string
      description: string
    }
  }

export type {
  CharsetOption,
  HistoryEntry,
  PasswordMode,
  RandomPasswordGeneratorMessages,
  RandomPasswordGeneratorMessagesCatalog,
}
