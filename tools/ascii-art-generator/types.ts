type AsciiArtGeneratorLocalizedCatalog = Readonly<{
  inputLabel: string
  inputPlaceholder: string
  fontLabel: string
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
