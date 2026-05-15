import type { ToolMeta } from "@workspace/tool-sdk"
import type { SshKeyPair } from "../core/ssh-keygen"

type SshKeyGeneratorMessagesCatalog = Readonly<{
  optionsTitle: string
  optionsDescription: string
  algorithmLabel: string
  algorithmEd25519: string
  algorithmRsa: string
  algorithmDescription: string
  rsaSizeLabel: string
  rsaSizeDescription: string
  commentLabel: string
  commentPlaceholder: string
  commentDescription: string
  generateLabel: string
  generatingLabel: string
  resetLabel: string
  outputTitle: string
  outputDescription: string
  emptyTitle: string
  emptyDescription: string
  errorTitle: string
  errorWebCryptoUnavailable: string
  errorGenerationFailed: string
  publicKeyTitle: string
  publicKeyDescription: string
  privateKeyTitle: string
  privateKeyDescription: string
  fingerprintLabel: string
  keyDetailsLabel: string
  keyTypeLabel: string
  keySizeLabel: string
  commentValueLabel: string
  bitsLabel: string
  noCommentLabel: string
  generatedSummary: string
  copyPublicKeyLabel: string
  copyPrivateKeyLabel: string
  copyFingerprintLabel: string
  copiedLabel: string
  downloadPublicKeyLabel: string
  downloadPrivateKeyLabel: string
  privateKeyWarningTitle: string
  privateKeyWarningDescription: string
}>

type SshKeyGeneratorMessages = SshKeyGeneratorMessagesCatalog &
  Readonly<{
    meta: ToolMeta
  }>

type KeyGenerationState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; result: SshKeyPair }
  | { status: "error"; message: string }

export type {
  KeyGenerationState,
  SshKeyGeneratorMessages,
  SshKeyGeneratorMessagesCatalog,
}
