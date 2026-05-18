type UuidV1V6ConverterMessagesCatalog = Readonly<{
  v1Title: string
  v1Description: string
  v1Label: string
  v1Placeholder: string
  v6Title: string
  v6Description: string
  v6Label: string
  v6Placeholder: string
  copyV1Label: string
  copyV6Label: string
  copiedLabel: string
  loadSampleLabel: string
  clearLabel: string
  emptyHint: string
  invalidV1Format: string
  invalidV1Version: string
  invalidV1Variant: string
  invalidV6Format: string
  invalidV6Version: string
  invalidV6Variant: string
}>

type UuidV1V6ConverterMessages = UuidV1V6ConverterMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV1V6ConverterMessages, UuidV1V6ConverterMessagesCatalog }
