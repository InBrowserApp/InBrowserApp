type Base85EncoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  alphabet: string
  alphabetAscii85: string
  alphabetZ85: string
  inputTitle: string
  inputPlaceholder: string
  outputTitle: string
  outputPlaceholder: string
  download: string
  readFailed: string
  invalidBase85: string
  loadSample: string
  clearLabel: string
  copyLabel: string
  copiedLabel: string
  importFromFileLabel: string
}>

export type { Base85EncoderMessages }
