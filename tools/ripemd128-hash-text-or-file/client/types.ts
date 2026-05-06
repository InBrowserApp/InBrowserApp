type Ripemd128HashTextOrFileMessages = Readonly<{
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

type Ripemd128HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Ripemd128HashTextOrFileMessages

export type {
  Ripemd128HashTextOrFileMessages,
  Ripemd128HashTextOrFilePageMessages,
}
