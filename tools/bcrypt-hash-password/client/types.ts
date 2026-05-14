import type { ToolMeta } from "@workspace/tool-sdk"

type BcryptHashPasswordMessagesCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  showPasswordLabel: string
  hidePasswordLabel: string
  costLabel: string
  costDescription: string
  costInvalidMessage: string
  generateLabel: string
  generatingLabel: string
  resetLabel: string
  outputTitle: string
  outputDescription: string
  emptyTitle: string
  emptyDescription: string
  errorTitle: string
  copyHashLabel: string
  copiedLabel: string
  hashValueLabel: string
  hashDetailsLabel: string
  versionLabel: string
  costValueLabel: string
  saltLabel: string
  checksumLabel: string
  generatedSummary: string
  privacyNote: string
}>

type BcryptHashPasswordMessages = BcryptHashPasswordMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type { BcryptHashPasswordMessages, BcryptHashPasswordMessagesCatalog }
