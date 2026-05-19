import type { HashAlgorithm, HashDigest } from "../core/hash"

type HashTextOrFileTemplateMessages = Readonly<{
  algorithmLabel: string
  algorithmDescription: string
  algorithmLabels: Readonly<Record<HashAlgorithm, string>>
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  emptyResultLabel: string
  hashErrorMessage: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type HashTextOrFileTemplatePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  HashTextOrFileTemplateMessages

type HashDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: HashDigest }
  | { status: "error"; message: string }

export type {
  HashDigestState,
  HashTextOrFileTemplateMessages,
  HashTextOrFileTemplatePageMessages,
}
