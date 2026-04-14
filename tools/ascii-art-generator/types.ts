type AsciiArtGeneratorLocalizedCatalog = Readonly<{
  inputLabel: string
  inputDescription: string
  inputPlaceholder: string
  loadSample: string
  clearText: string
  fontLabel: string
  fontDescription: string
  fontSearchPlaceholder: string
  optionsLabel: string
  optionsDescription: string
  alignLabel: string
  widthLabel: string
  widthHint: string
  leftAlign: string
  centerAlign: string
  rightAlign: string
  outputLabel: string
  outputPlaceholder: string
  downloadLabel: string
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
