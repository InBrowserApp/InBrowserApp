import type { CbzFile } from "@workspace/comic/cbz"
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
export type Result = CbzFile & { metadata: boolean }
export type Progress = { page: number; total: number } | "saving"
