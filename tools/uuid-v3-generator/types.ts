type UuidV3MessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  namespaceLabel: string
  namespaceDescription: string
  namespaceInvalid: string
  namespacePresetLegend: string
  namespacePresetDescription: string
  namespaceDnsLabel: string
  namespaceUrlLabel: string
  namespaceOidLabel: string
  namespaceX500Label: string
  nameLabel: string
  nameDescription: string
  namePlaceholder: string
  resultTitle: string
  resultDescription: string
  resultLabel: string
  resultPlaceholder: string
  resultInvalidPlaceholder: string
  copyUuidLabel: string
  copiedLabel: string
  versionBadgeLabel: string
  variantBadgeLabel: string
  deterministicBadgeLabel: string
}>

type UuidV3Messages = UuidV3MessagesCatalog & {
  meta: {
    name: string
    description: string
  }
}

export type { UuidV3Messages, UuidV3MessagesCatalog }
