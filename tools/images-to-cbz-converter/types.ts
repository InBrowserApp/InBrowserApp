import type messages from "./messages/en.json"

export type Messages = typeof messages

export type ComicImage = {
  blob: Blob
  path: string
  extension: string
  modifiedAt: Date
}
