type SipHash128HashTextOrFileMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  keyLabel: string
  keyDescription: string
  keyPlaceholder: string
  keyInvalidLabel: string
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  emptyStateDescription: string
  fileHashErrorLabel: string
  textHashErrorLabel: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type SipHash128HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  SipHash128HashTextOrFileMessages

export type {
  SipHash128HashTextOrFileMessages,
  SipHash128HashTextOrFilePageMessages,
}
