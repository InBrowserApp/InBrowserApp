import type messages from "./messages/en.json"

export type Messages = typeof messages
export type ImageFormat = "image/jpeg" | "image/png"

export type Frame = {
  time: number
  blob: Blob
  preview: Blob
  name: string
}
