import type { ConversionError } from "../core/errors"

export type Progress = "engineLoading" | "converting" | "saving"

export type Reply =
  | { type: "progress"; stage: Progress }
  | { type: "error"; code: ConversionError["code"] }
  | {
      type: "result"
      bytes: ArrayBuffer
      pages: number
      dimensions: ({ width: number; height: number } | null)[]
    }
