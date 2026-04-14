type HmacGeneratorMessages = Readonly<{
  configurationLabel: string
  secretKeyLabel: string
  secretKeyPlaceholder: string
  algorithmLabel: string
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hmacOutputLabel: string
  hmacOutputDescription: string
  emptyStateDescription: string
  hexLabel: string
  base64Label: string
  copyResultLabel: string
  copiedLabel: string
}>

type HmacGeneratorPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  HmacGeneratorMessages

export type { HmacGeneratorMessages, HmacGeneratorPageMessages }
