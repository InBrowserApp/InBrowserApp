import type catalog from "./messages/en.json"

export type Messages = typeof catalog
export type Controls = Omit<
  Messages,
  | "aboutHeading"
  | "aboutSteps"
  | "exportHeading"
  | "exportDetails"
  | "privacyHeading"
  | "privacyDetails"
>
export type VideoFormat = "mp4" | "mkv"
export type SubtitleRow = {
  id: number
  start: string
  end: string
  text: string
}
