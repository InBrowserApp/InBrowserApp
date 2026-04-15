import type { Blake2bDigest } from "../core/blake2b"

type Blake2bHashTextOrFileMessages = Readonly<{
  configurationLabel: string
  outputLengthLabel: string
  keyLabel: string
  keyPlaceholder: string
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
  invalidBase64Title: string
  invalidBase64Description: string
}>

type Blake2bHashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Blake2bHashTextOrFileMessages

type Blake2bDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: Blake2bDigest }
  | {
      status: "error"
      reason?: "invalidBase64"
      message: string
    }

export type {
  Blake2bDigestState,
  Blake2bHashTextOrFileMessages,
  Blake2bHashTextOrFilePageMessages,
}
