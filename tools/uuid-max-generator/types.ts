type UuidMaxMessagesCatalog = Readonly<{
  valueTitle: string
  valueDescription: string
  canonicalLabel: string
  rawHexLabel: string
  urnLabel: string
  copyUuidLabel: string
  copyHexLabel: string
  copyUrnLabel: string
  copiedLabel: string
  detailsTitle: string
  detailsDescription: string
  allBitsLabel: string
  allBitsValue: string
  versionLabel: string
  versionValue: string
  variantLabel: string
  variantValue: string
  stableLabel: string
  stableValue: string
}>

type UuidMaxMessages = UuidMaxMessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidMaxMessages, UuidMaxMessagesCatalog }
