import type messages from "./messages/en.json"

export type Messages = typeof messages
export type Failure = "invalid" | "protected" | "unsupported" | "resource"
export type SheetInfo = {
  name: string
  range: string | null
  start: { r: number; c: number }
  end: { r: number; c: number }
  hidden: number
}
export type Cell = {
  address: string
  text: string
  raw: string
  formula?: string
  format?: string
  missingCache: boolean
}
export type Preview = {
  sheet: number
  row: number
  column: number
  range: string
  columns: string[]
  rows: { number: number; cells: Cell[] }[]
}
export type Loaded = { sheets: SheetInfo[]; missingCaches: number }
export type Request =
  | { type: "open"; file: File }
  | { type: "preview"; id: number; sheet: number; row: number; column: number }
export type Response =
  | { type: "ready"; info: Loaded; bytes: ArrayBuffer }
  | { type: "preview"; id: number; preview: Preview }
  | { type: "error"; error: Failure }
