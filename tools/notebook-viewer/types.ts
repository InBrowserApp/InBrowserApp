import type en from "./messages/en.json"
export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "encoding"
  | "resourceLimit"
  | "version"
export type Bundle = Record<string, unknown>
export type Output = {
  label: "stdout" | "stderr" | "savedError" | "result"
  html: string
  svg?: string
  fallback?: string
  interactive: boolean
  unsupported: boolean
}
export type Cell = {
  kind: "markdown" | "code" | "raw" | "unknownCell"
  html: string
  attachments: Record<string, Bundle>
  count: number | null
  outputs: Output[]
}
export type Notebook = { cells: Cell[] }
export type WorkerResult = { result: Notebook } | { error: Failure }
export type Preview = import("@workspace/web-document").WebDocument & {
  limited: boolean
}
