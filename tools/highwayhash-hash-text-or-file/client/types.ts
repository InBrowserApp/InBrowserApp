import type { HighwayHashDigest } from "../core/highwayhash"

type HighwayHashTextOrFileMessages = Readonly<{
  configurationLabel: string
  configurationDescription: string
  outputSizeLabel: string
  outputSize64Label: string
  outputSize128Label: string
  outputSize256Label: string
  keyLabel: string
  keyDescription: string
  keyPlaceholder: string
  keyInvalidLabel: string
  inputLabel: string
  plainTextLabel: string
  plainTextDescription: string
  importFromFileLabel: string
  hashResultLabel: string
  hashResultDescription: string
  emptyStateDescription: string
  fileHashErrorLabel: string
  textHashErrorLabel: string
  hexLabel: string
  base64Label: string
  decimalLabel: string
  binaryLabel: string
  copyResultLabel: string
  copiedLabel: string
}>

type HighwayHashTextOrFilePageMessages = Readonly<{
  meta: {
    name: string
    description: string
  }
}> &
  HighwayHashTextOrFileMessages

type HighwayHashDigestState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ready"; digest: HighwayHashDigest }
  | { status: "error"; message: string }

export type {
  HighwayHashDigestState,
  HighwayHashTextOrFileMessages,
  HighwayHashTextOrFilePageMessages,
}
