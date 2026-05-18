type UuidV4MessagesCatalog = Readonly<{
  resultTitle: string
  resultDescription: string
  uuidLabel: string
  regenerateLabel: string
  copyLabel: string
  copiedLabel: string
  detailsTitle: string
  detailsDescription: string
  versionLabel: string
  versionValue: string
  variantLabel: string
  variantValue: string
  entropyLabel: string
  entropyValue: string
  privacyTitle: string
  privacyDescription: string
  errorTitle: string
  cryptoUnavailableMessage: string
}>

type UuidV4Messages = UuidV4MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV4Messages, UuidV4MessagesCatalog }
