import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
export type ErrorCode = "empty" | "encrypted" | "damaged" | "resourceLimit"
export class RepackError extends Error {
  constructor(
    readonly code: ErrorCode,
    readonly path?: string
  ) {
    super(code)
  }
}
export type Result = {
  cbz: Blob
  total: number
  first: string
  last: string
  metadata: boolean
  cover: Blob | null
}
export type Progress = { page: number; total: number } | "saving"
