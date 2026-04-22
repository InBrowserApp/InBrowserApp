type Base85DecoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  alphabet: string
  alphabetAscii85: string
  alphabetZ85: string
  base85InputLabel: string
  base85InputPlaceholder: string
  importFromFileLabel: string
  decodedOutputLabel: string
  decodedOutputEmptyDescription: string
  downloadFileLabel: string
  copyLabel: string
  copiedLabel: string
  loadSample: string
  invalidBase85Title: string
  fileReadFailedTitle: string
  previewTruncatedLabel: string
}>

export type { Base85DecoderMessages }
