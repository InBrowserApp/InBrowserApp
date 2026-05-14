import type { ToolMeta } from "@workspace/tool-sdk"

type BcryptHashPasswordVerifierMessagesCatalog = Readonly<{
  inputTitle: string
  inputDescription: string
  passwordLabel: string
  passwordPlaceholder: string
  hashLabel: string
  hashDescription: string
  hashPlaceholder: string
  show: string
  hide: string
  verifyLabel: string
  verifyingLabel: string
  resetLabel: string
  sampleLabel: string
  resultTitle: string
  resultDescription: string
  emptyTitle: string
  emptyDescription: string
  loadingTitle: string
  loadingDescription: string
  matchTitle: string
  matchDescription: string
  mismatchTitle: string
  mismatchDescription: string
  invalidHashTitle: string
  invalidHashDescription: string
  invalidHashHelp: string
  privacyHint: string
  detailsTitle: string
  versionLabel: string
  costLabel: string
  formatLabel: string
}>

type BcryptHashPasswordVerifierMessages =
  BcryptHashPasswordVerifierMessagesCatalog &
    Readonly<{
      meta: ToolMeta
    }>

export type {
  BcryptHashPasswordVerifierMessages,
  BcryptHashPasswordVerifierMessagesCatalog,
}
