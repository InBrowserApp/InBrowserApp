import type { ToolMeta } from "@workspace/tool-sdk"

import type { ParsedSshPublicKey } from "../core/parse"

type SshPublicKeyFingerprintMessages = Readonly<{
  inputTitle: string
  inputDescription: string
  inputLabel: string
  inputPlaceholder: string
  inputHint: string
  importFromFileLabel: string
  useSampleLabel: string
  clearLabel: string
  resultsTitle: string
  resultsDescription: string
  resultsEmptyTitle: string
  resultsEmptyDescription: string
  parseErrorTitle: string
  errorNoKeys: string
  errorReadFile: string
  errorWebCryptoUnavailable: string
  keyLabel: string
  keyTypeLabel: string
  keySizeLabel: string
  curveLabel: string
  commentLabel: string
  bitsLabel: string
  missingValueLabel: string
  fingerprintSha256Label: string
  fingerprintMd5Label: string
  copyResultLabel: string
  copiedLabel: string
}>

type SshPublicKeyFingerprintPageMessages = SshPublicKeyFingerprintMessages &
  Readonly<{
    meta: ToolMeta
  }>

type FingerprintParseState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; entries: ParsedSshPublicKey[] }
  | { status: "error"; message: string }

export type {
  FingerprintParseState,
  SshPublicKeyFingerprintMessages,
  SshPublicKeyFingerprintPageMessages,
}
