export type Failure =
  | "invalid"
  | "emptyFile"
  | "protected"
  | "unsupported"
  | "resourceLimit"
export interface DocDocument {
  html: string
  css: string
  template: boolean
  limited: boolean
}
export interface Preview {
  html: string
  limited: boolean
  outline: { id: string; label: string; level: number }[]
}
export type Result = { document: DocDocument } | { error: Failure }
