import type messages from "./messages/en.json"

export type Messages = typeof messages

export type ExtensionStatus = keyof Messages["status"]

export type Inspection = Readonly<{
  fileName: string
  fileSize: number
  browserMime: string
  extension: string
  detected: { ext: string; mime: string } | null
  extensions: string[]
  status: ExtensionStatus
  hex: string
}>
