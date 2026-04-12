type NanoidMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  countLabel: string
  lengthLabel: string
  alphabetPresetLabel: string
  customAlphabetLabel: string
  customAlphabetPlaceholder: string
  alphabetTooShort: string
  alphabetDuplicate: string
  alphabetUniqueLabel: string
  alphabetDuplicatesLabel: string
  alphabetNoDuplicatesLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  copyResultsLabel: string
  copiedLabel: string
  regenerateLabel: string
  presetUrlSafe: string
  presetAlphanumeric: string
  presetLowercase: string
  presetUppercase: string
  presetNumbers: string
  presetHexLowercase: string
  presetHexUppercase: string
  presetCustom: string
}>

type NanoidMessages = NanoidMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { NanoidMessages, NanoidMessagesCatalog }
