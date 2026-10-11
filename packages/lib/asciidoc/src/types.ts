export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "encoding"
  | "resourceLimit"

export type Conversion = { html: string; warnings: boolean }
export type WorkerResult = { result: Conversion } | { error: Failure }
