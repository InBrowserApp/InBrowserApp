type Base58EncoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  options: string
  alphabet: string
  alphabetBitcoin: string
  alphabetFlickr: string
  alphabetRipple: string
  inputTitle: string
  inputPlaceholder: string
  outputTitle: string
  outputPlaceholder: string
  download: string
  readFailed: string
  loadSample: string
  clearLabel: string
  copyLabel: string
  copiedLabel: string
  importFromFileLabel: string
}>

export type { Base58EncoderMessages }
