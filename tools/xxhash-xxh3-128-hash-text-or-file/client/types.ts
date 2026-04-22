type XxHashXxh3128HashTextOrFileMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
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

type XxHashXxh3128HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  XxHashXxh3128HashTextOrFileMessages

export type {
  XxHashXxh3128HashTextOrFileMessages,
  XxHashXxh3128HashTextOrFilePageMessages,
}
