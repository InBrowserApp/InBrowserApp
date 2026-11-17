import type messages from "./messages/en.json"

export type Messages = typeof messages
export type Value =
  | null
  | boolean
  | number
  | string
  | Value[]
  | { [key: string]: Value }
export type Row = Record<string, Value>
export type Format = "csv" | "json"
export type Field = {
  name: string
  path: string
  depth: number
  physical: string
  logical: string
  repetition: "REQUIRED" | "OPTIONAL" | "REPEATED" | undefined
}
export type Info = {
  rows: number
  columns: string[]
  fields: Field[]
  groups: number
  codecs: string[]
  createdBy: string
}
export type Command =
  | { type: "open"; file: File }
  | { type: "page"; start: number; end: number }
  | { type: "export"; start: number; end: number; format: Format }
export type Request = Command & { id: number }
export type Output = { blob: Blob; rows: number }
export type Response = { id: number } & (
  | { result: Info | Row[] | Output }
  | { error: true }
  | { progress: number }
)
