import type { Shake256Digest } from "../core/shake256"

type Shake256HashTextOrFileMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  outputLengthLabel: string
  outputLengthPlaceholder: string
  outputLengthDescription: string
  outputLengthInvalid: string
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
}>

type Shake256HashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  Shake256HashTextOrFileMessages

type Shake256DigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: Shake256Digest }
  | { status: "error"; message: string }

export type {
  Shake256DigestState,
  Shake256HashTextOrFileMessages,
  Shake256HashTextOrFilePageMessages,
}
