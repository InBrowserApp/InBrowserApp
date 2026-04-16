type MorseCodeConverterMessagesCatalog = Readonly<{
  resultTitle: string
  resultDescription: string
  textLabel: string
  morseCodeLabel: string
  textPlaceholder: string
  morsePlaceholder: string
  validLabel: string
  invalidLabel: string
  invalidMorseCode: string
  unsupportedTextMessage: string
  loadSample: string
  clearLabel: string
  copyLabel: string
  copiedLabel: string
  play: string
  stop: string
}>

type MorseCodeConverterMessages = MorseCodeConverterMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

type ResultStatus = "idle" | "valid" | "invalid"

type ActiveSource = "text" | "morse"

export type {
  ActiveSource,
  MorseCodeConverterMessages,
  MorseCodeConverterMessagesCatalog,
  ResultStatus,
}
