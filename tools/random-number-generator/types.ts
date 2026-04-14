type NumberType = "integer" | "decimal"

type PresetOption = "dice" | "ten" | "hundred" | "lotto"

type HistoryEntry = Readonly<{
  id: string
  values: string[]
}>

type RandomNumberGeneratorMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  presetsLabel: string
  presetDiceLabel: string
  presetTenLabel: string
  presetHundredLabel: string
  presetLottoLabel: string
  minLabel: string
  maxLabel: string
  countLabel: string
  allowRepeatLabel: string
  numberTypeLabel: string
  integerLabel: string
  decimalLabel: string
  decimalPlacesLabel: string
  rangeError: string
  countError: string
  resultsTitle: string
  resultsDescription: string
  resultsPlaceholder: string
  startRandomLabel: string
  stopRandomLabel: string
  copyResultLabel: string
  copiedLabel: string
  downloadLabel: string
  enterFullscreenLabel: string
  exitFullscreenLabel: string
  historyTitle: string
  historyDescription: string
  historyEmptyLabel: string
  clearHistoryLabel: string
}>

type RandomNumberGeneratorMessages = RandomNumberGeneratorMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type {
  HistoryEntry,
  NumberType,
  PresetOption,
  RandomNumberGeneratorMessages,
  RandomNumberGeneratorMessagesCatalog,
}
