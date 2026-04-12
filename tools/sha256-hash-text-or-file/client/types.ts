type Sha256HashTextOrFileMessages = Readonly<{
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

type Sha256HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Sha256HashTextOrFileMessages

export type { Sha256HashTextOrFileMessages, Sha256HashTextOrFilePageMessages }
