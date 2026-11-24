import type en from "./messages/en.json"

export type Messages = typeof en
export type Source = File | "sample"
export type Request = { source: Source; schemaOnly: boolean }
export type Dump = { blob: Blob; preview: string; shortened: boolean }
export type Response =
  | { dump: Dump }
  | { error: "invalid" | "failed" | "unsupportedSchema" }
