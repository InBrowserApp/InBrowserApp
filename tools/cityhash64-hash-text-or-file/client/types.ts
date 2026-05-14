type CityHash64HashTextOrFileMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  seedSectionLabel: string
  seedLabel: string
  seedDescription: string
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

type CityHash64HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  CityHash64HashTextOrFileMessages

export type {
  CityHash64HashTextOrFileMessages,
  CityHash64HashTextOrFilePageMessages,
}
