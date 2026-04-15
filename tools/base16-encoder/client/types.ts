type Base16EncoderMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
  plainTextLabel: string
  plainTextPlaceholder: string
  importFromFileLabel: string
  hexOutputLabel: string
  hexOutputEmptyDescription: string
  downloadHexLabel: string
  copyResultLabel: string
  copiedLabel: string
  resetLabel: string
  fileReadFailedTitle: string
  previewTruncatedLabel: string
}>

export type { Base16EncoderMessages }
