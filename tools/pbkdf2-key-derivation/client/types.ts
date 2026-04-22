type Pbkdf2KeyDerivationMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  algorithmLabel: string
  saltFormatLabel: string
  iterationsLabel: string
  lengthLabel: string
  iterationsInvalidMessage: string
  lengthInvalidMessage: string
  saltLabel: string
  saltDescription: string
  textSaltLabel: string
  importFromFileLabel: string
  saltInvalidHexMessage: string
  saltInvalidBase64Message: string
  derivedKeyLabel: string
  derivedKeyDescription: string
  emptyStateDescription: string
  hexLabel: string
  base64Label: string
  copyResultLabel: string
  copiedLabel: string
}>

type Pbkdf2KeyDerivationPageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Pbkdf2KeyDerivationMessages

export type { Pbkdf2KeyDerivationMessages, Pbkdf2KeyDerivationPageMessages }
