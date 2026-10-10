export type Labels = Record<
  | "slide"
  | "hidden"
  | "notes"
  | "image"
  | "chart"
  | "equation"
  | "media"
  | "object"
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
export type Source = { file: File }
export type Request = { source: Source; labels: Labels }
