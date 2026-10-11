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
  source?: string
  attachments: Record<string, Bundle>
  count: number | null
  outputs: Output[]
}
export type Notebook = { cells: Cell[]; language?: string }
export type WorkerResult = { result: Notebook } | { error: Failure }
export type Preview = import("@workspace/web-document").WebDocument & {
  limited: boolean
}

export type Messages = Record<
  | "attachment"
  | "cell"
  | "code"
  | "emptyCell"
  | "execution"
  | "interactive"
  | "markdown"
  | "missingAttachment"
  | "noContent"
  | "noOutput"
  | "notExecuted"
  | "raw"
  | "result"
  | "savedError"
  | "savedOutput"
  | "stderr"
  | "stdout"
  | "unknownCell"
  | "unsupportedCell"
  | "unsupportedOutput",
  string
>
