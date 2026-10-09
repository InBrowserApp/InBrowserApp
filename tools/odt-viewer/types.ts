import type messages from "./messages/en.json"

export type Messages = typeof messages
export type Failure =
  | "invalid"
  | "emptyFile"
  | "protected"
  | "unsupported"
  | "resourceLimit"
export type PagePart =
  | "header"
  | "footer"
  | "firstPageHeader"
  | "firstPageFooter"
export interface OdtDocument {
  html: string
  parts: Partial<Record<PagePart, string>>
  title: string
  template: boolean
  limited: boolean
  breaks: string[]
}
export interface Preview {
  html: string
  limited: boolean
  empty: boolean
  outline: { id: string; label: string; level: number }[]
}
export type Result = { document: OdtDocument } | { error: Failure }
