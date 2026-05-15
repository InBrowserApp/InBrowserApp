import type { ToolMeta } from "@workspace/tool-sdk"

type PgpKeyGeneratorMessagesCatalog = Readonly<{
  identityTitle: string
  identityDescription: string
  nameLabel: string
  namePlaceholder: string
  emailLabel: string
  emailPlaceholder: string
  commentLabel: string
  commentPlaceholder: string
  passphraseLabel: string
  passphrasePlaceholder: string
  passphraseDescription: string
  showSecretLabel: string
  hideSecretLabel: string
  securityTitle: string
  securityDescription: string
  algorithmLabel: string
  eccLabel: string
  eccDescription: string
  rsaLabel: string
  rsaDescription: string
  rsaKeySizeLabel: string
  expirationDaysLabel: string
  expirationDaysPlaceholder: string
  expirationDaysDescription: string
  privacyNoteTitle: string
  privacyNoteDescription: string
  generateLabel: string
  generatingLabel: string
  regenerateLabel: string
  resetLabel: string
  identityRequiredHint: string
  expirationInvalidError: string
  resultTitle: string
  resultDescription: string
  emptyTitle: string
  emptyDescription: string
  summaryUserIdLabel: string
  summaryKeyIdLabel: string
  summaryFingerprintLabel: string
  summaryProtectionLabel: string
  protectedLabel: string
  unprotectedLabel: string
  publicKeyTitle: string
  publicKeyDescription: string
  privateKeyTitle: string
  privateKeyDescription: string
  revocationCertificateTitle: string
  revocationCertificateDescription: string
  copyLabel: string
  copiedLabel: string
  downloadLabel: string
  errorTitle: string
}>

type PgpKeyGeneratorMessages = PgpKeyGeneratorMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

export type { PgpKeyGeneratorMessages, PgpKeyGeneratorMessagesCatalog }
