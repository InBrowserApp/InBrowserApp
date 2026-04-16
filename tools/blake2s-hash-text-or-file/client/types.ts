import type { Blake2sDigest } from "../core/blake2s"

type Blake2sHashTextOrFileMessages = Readonly<{
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

type Blake2sHashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Blake2sHashTextOrFileMessages

type Blake2sDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: Blake2sDigest }
  | {
      status: "error"
      reason?: "invalidBase64"
      message: string
    }

export type {
  Blake2sDigestState,
  Blake2sHashTextOrFileMessages,
  Blake2sHashTextOrFilePageMessages,
}
