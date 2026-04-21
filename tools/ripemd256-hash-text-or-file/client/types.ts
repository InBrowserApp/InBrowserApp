type Ripemd256HashTextOrFileMessages = Readonly<{
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

type Ripemd256HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Ripemd256HashTextOrFileMessages

export type {
  Ripemd256HashTextOrFileMessages,
  Ripemd256HashTextOrFilePageMessages,
}
