import type messages from "./messages/en.json"

export type Messages = typeof messages
export type Cell = string | number | null
export type Rows = Cell[][]
type Preview = {
  label: string
  rows: Rows
  width: number
}
export type TableOptions = { name: string; header: boolean }
export type Source = { id: number; file: File }
type TableSelection = TableOptions & { id: number; index: number }
export type Request =
  | { kind: "read"; sources: Source[] }
  | { kind: "remove"; id: number }
  | { kind: "create"; tables: TableSelection[] }

export type ImportResult = { id: number } & (
  | { previews: Preview[] }
  | { error: "unreadable" | "emptyFile" }
)
export type Response =
  | { kind: "read"; result: ImportResult }
  | { kind: "created"; bytes: Uint8Array<ArrayBuffer> }
  | { kind: "createError" }
