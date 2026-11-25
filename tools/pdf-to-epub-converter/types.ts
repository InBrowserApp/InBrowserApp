import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
export type Progress =
  | { stage: "opening" | "loading" | "saving" }
  | {
      stage: "reading" | "recognizing"
      page: number
      total: number
      fraction: number
    }

export const pdfExtension = /\.pdf$/i
