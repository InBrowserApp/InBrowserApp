type AsciiArtGeneratorLocalizedCatalog = Readonly<{
  inputLabel: string
  inputDescription: string
  inputPlaceholder: string
  fontLabel: string
  fontDescription: string
  fontSearchPlaceholder: string
  outputLabel: string
  outputPlaceholder: string
  copyLabel: string
  copiedLabel: string
}>

type AsciiArtGeneratorMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  AsciiArtGeneratorLocalizedCatalog

export type { AsciiArtGeneratorLocalizedCatalog, AsciiArtGeneratorMessages }
