type SriHashGeneratorMessages = Readonly<{
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  sha256SriLabel: string
  sha384SriLabel: string
  sha512SriLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type SriHashGeneratorPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  SriHashGeneratorMessages

export type { SriHashGeneratorMessages, SriHashGeneratorPageMessages }
