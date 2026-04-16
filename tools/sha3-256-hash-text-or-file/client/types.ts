type Sha3256HashTextOrFileMessages = Readonly<{
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
}>

type Sha3256HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Sha3256HashTextOrFileMessages

export type { Sha3256HashTextOrFileMessages, Sha3256HashTextOrFilePageMessages }
