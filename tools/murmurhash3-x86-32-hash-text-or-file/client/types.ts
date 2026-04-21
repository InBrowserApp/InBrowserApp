type MurmurHash3HashTextOrFileMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  seedSectionLabel: string
  seedLabel: string
  seedPlaceholder: string
  seedInvalid: string
  hashResultLabel: string
  hashResultDescription: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type MurmurHash3HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  MurmurHash3HashTextOrFileMessages

export type {
  MurmurHash3HashTextOrFileMessages,
  MurmurHash3HashTextOrFilePageMessages,
}
