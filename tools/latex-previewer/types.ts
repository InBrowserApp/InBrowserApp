import type en from "./messages/en.json"

export type Messages = typeof en
export type Failure =
  | "unsupported"
  | "emptyFile"
  | "invalid"
  | "encoding"
  | "resourceLimit"
export type Diagnostic = {
  line: number
  message?: string
  code?: "groupSyntax" | "environmentSyntax" | "mathSyntax"
}
export type Rendered = { html: string; css: string; diagnostics: Diagnostic[] }
export type Preview = {
  html: string
  outline: { id: string; label: string; level: number }[]
  images: boolean
}
