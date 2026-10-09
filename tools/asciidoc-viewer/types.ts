import type en from "./messages/en.json"

export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "encoding"
  | "resourceLimit"

export type Conversion = { html: string; warnings: boolean }
export type WorkerResult = { result: Conversion } | { error: Failure }
export type Preview = import("@workspace/web-document").WebDocument & {
  includes: boolean
  warnings: boolean
}
