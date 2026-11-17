import type en from "./messages/en.json"

export type Messages = typeof en
export type Cell = string | number | bigint | null | Uint8Array
export type QueryResult = {
  columns: string[]
  rows: Cell[][]
  truncated: boolean
  elapsed: number
}
export type DatabaseObject = {
  name: string
  type: "table" | "view"
  sql: string
}
export type Metadata = { objects: DatabaseObject[]; version: string }
export type Structure = {
  name: string
  columns: QueryResult
  indexes: QueryResult
  foreignKeys: QueryResult
}
export type Failure =
  | "invalid"
  | "tooLarge"
  | "readOnlyError"
  | "singleStatement"
  | "emptyQuery"
  | "queryTooLarge"
  | "schemaLimit"
  | "workerError"
export type Command =
  | { kind: "open"; file: File }
  | { kind: "query"; sql: string; limit: number }
  | { kind: "structure"; name: string }
export type Request = Command & { id: number }
export type ResponsePayload =
  | { kind: "open"; metadata: Metadata }
  | { kind: "query"; result: QueryResult }
  | { kind: "structure"; structure: Structure }
  | { kind: "error"; error: Failure; detail?: string }
export type Response = { id: number } & ResponsePayload
