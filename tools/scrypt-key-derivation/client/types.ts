type ScryptKeyDerivationMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  saltFormatLabel: string
  costFactorLabel: string
  blockSizeLabel: string
  parallelismLabel: string
  lengthLabel: string
  costFactorRangeInvalidMessage: string
  costFactorPowerInvalidMessage: string
  costFactorMemoryInvalidMessage: string
  blockSizeInvalidMessage: string
  parallelismInvalidMessage: string
  lengthInvalidMessage: string
  memoryEstimateLabel: string
  saltLabel: string
  saltDescription: string
  textSaltLabel: string
  importFromFileLabel: string
  generateSaltLabel: string
  saltInvalidHexMessage: string
  saltInvalidBase64Message: string
  derivedKeyLabel: string
  derivedKeyDescription: string
  emptyStateDescription: string
  deriveError: string
  hexLabel: string
  base64Label: string
  copyResultLabel: string
  copiedLabel: string
}>

type ScryptKeyDerivationPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  ScryptKeyDerivationMessages

export type { ScryptKeyDerivationMessages, ScryptKeyDerivationPageMessages }
