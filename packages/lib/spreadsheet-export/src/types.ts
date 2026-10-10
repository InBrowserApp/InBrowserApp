export type Format = "csv" | "tsv" | "json" | "markdown"
export type ValueMode = "formatted" | "raw"
export type Options = {
  sheet: number
  range: string
  format: Format
  values: ValueMode
  firstRowHeader: boolean
}
export type Sheet = { name: string; hidden: boolean; range: string }
export type Source = { file: File; names?: string[] }
export type Output = {
  text: string
  filename: string
  mime: string
  rows: number
  columns: number
  missingCached: number
  empty: boolean
}
export type Session = {
  sheets: Sheet[]
  export: (options: Options, signal: AbortSignal) => Promise<Output>
}
export type Failure =
  | "invalid"
  | "protected"
  | "resource"
  | "engineUnavailable"
  | "invalidRange"
export type Request =
  | { type: "open"; source: Source }
  | { type: "export"; id: number; options: Options }
  | { type: "cancel"; id: number }
export type Response =
  | { type: "open"; sheets: Sheet[] }
  | { type: "export"; id: number; output: Output }
  | { type: "error"; id?: number; error: Failure }
