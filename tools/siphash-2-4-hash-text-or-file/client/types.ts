type SipHash24HashTextOrFileMessages = Readonly<{
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

type SipHash24HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  SipHash24HashTextOrFileMessages

export type {
  SipHash24HashTextOrFileMessages,
  SipHash24HashTextOrFilePageMessages,
}
