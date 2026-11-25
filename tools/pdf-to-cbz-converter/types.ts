import type { CbzFile } from "@workspace/comic/cbz"
import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
export type Result = CbzFile & { reused: number }
export type Progress = { page: number; total: number } | "saving"

export class ConversionError extends Error {
  constructor(
    readonly code: "invalid" | "encrypted" | "pageError",
    readonly page?: number
  ) {
    super(code)
  }
}
