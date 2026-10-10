import type { Failure } from "./errors"

export type Progress = {
  page: number
  total: number
  name: string
  saving: boolean
}
export type PdfResult = { pdf: Blob; names: string[] }
export type Response =
  | { type: "progress"; progress: Progress }
  | { type: "result"; result: PdfResult }
  | { type: "error"; error: Failure }
