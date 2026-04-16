import type { Blake3Digest } from "../core/blake3"

type Blake3HashTextOrFileMessages = Readonly<{
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

type Blake3HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Blake3HashTextOrFileMessages

type Blake3DigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: Blake3Digest }
  | {
      status: "error"
      reason?: "invalidBase64"
      message: string
    }

export type {
  Blake3DigestState,
  Blake3HashTextOrFileMessages,
  Blake3HashTextOrFilePageMessages,
}
