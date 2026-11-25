import type englishMessages from "./messages/en.json"

export type Messages = typeof englishMessages
export type Result = { pdf: Blob; searchable: number; total: number }
export type Reply =
  | { type: "page"; page: number; total: number }
  | { type: "saving" }
  | { type: "ready"; result: Result }
  | { type: "invalid" | "failed" }
  | { type: "pageError"; page: number }
