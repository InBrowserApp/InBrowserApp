import type { DocxDocumentModel } from "@silurus/ooxml/docx"

export type Labels = Record<
  | "headers"
  | "footers"
  | "footnotes"
  | "endnotes"
  | "comments"
  | "replyTo"
  | "image"
  | "chart"
  | "equation"
  | "shape",
  string
>
export type Failure =
  | "invalid"
  | "protected"
  | "resource"
  | "engineUnavailable"
  | "noText"
export type Result =
  | { text: string; error?: never }
  | { error: Failure; text?: never }
export type Source = { file: File } | { model: DocxDocumentModel }
export type Request = { source: Source; labels: Labels }
