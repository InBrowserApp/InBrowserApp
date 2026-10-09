import type messages from "./messages/en.json"
export type Messages = typeof messages
export type Failure =
  | "invalid"
  | "empty"
  | "protected"
  | "distribution"
  | "legacy"
  | "resourceLimit"
  | "engineUnavailable"
  | "browserUnsupported"
  | "pageError"
export type Page = {
  svg: string
  width: number
  height: number
  limited?: boolean
}
export type Document = {
  total: number
  page: (index: number) => Promise<Page>
  dispose: () => void
}
export type Request = { id: number } & (
  | { type: "open"; buffer: ArrayBuffer }
  | { type: "page"; index: number }
)
export type Reply = { id: number } & (
  | { total: number }
  | { page: string }
  | { error: Failure }
)
