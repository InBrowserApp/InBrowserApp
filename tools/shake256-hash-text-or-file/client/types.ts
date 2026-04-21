type Shake256HashTextOrFileMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  outputLengthLabel: string
  outputLengthPlaceholder: string
  outputLengthInvalid: string
  hashTextError: string
  hashFileError: string
  hashResultLabel: string
  hashResultDescription: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type Shake256HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Shake256HashTextOrFileMessages

export type {
  Shake256HashTextOrFileMessages,
  Shake256HashTextOrFilePageMessages,
}
