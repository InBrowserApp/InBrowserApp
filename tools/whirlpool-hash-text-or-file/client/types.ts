type WhirlpoolHashTextOrFileMessages = Readonly<{
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

type WhirlpoolHashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  WhirlpoolHashTextOrFileMessages

export type {
  WhirlpoolHashTextOrFileMessages,
  WhirlpoolHashTextOrFilePageMessages,
}
