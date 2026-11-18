import type messages from "./messages/en.json"

export type Messages = typeof messages

export type Frame = {
  id: string
  file: File
  thumbnail: string
  width: number
  height: number
  duration: string
}

export type GifResult = {
  gif: Blob
  poster: Blob
}

export type GifRequest = {
  frames: { file: File; duration: number }[]
  width: number
  height: number
  scale: number
  plays: number
}
