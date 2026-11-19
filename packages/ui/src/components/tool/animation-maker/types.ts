import type messages from "../../../lib/animation-maker-messages/en.json"

export type Messages = typeof messages

export type Frame = {
  id: string
  file: File
  thumbnail: string
  width: number
  height: number
  duration: string
}
