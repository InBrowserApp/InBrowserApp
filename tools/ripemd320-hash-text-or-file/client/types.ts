type Ripemd320HashTextOrFileMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
  hashTextError: string
  hashFileError: string
}>

type Ripemd320HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Ripemd320HashTextOrFileMessages

export type {
  Ripemd320HashTextOrFileMessages,
  Ripemd320HashTextOrFilePageMessages,
}
