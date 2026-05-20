type PageNumberFormat = "number" | "number-total"
type PageNumberFontFamily = "sans-serif" | "serif"
type PageNumberPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right"

type PageNumberOptions = Readonly<{
  fontFamily: PageNumberFontFamily
  fontSize: number
  format: PageNumberFormat
  marginX: number
  marginY: number
  pages: readonly number[]
  position: PageNumberPosition
  startNumber: number
}>

type PdfInspection = Readonly<{
  pageCount: number
}>

export type {
  PageNumberFontFamily,
  PageNumberFormat,
  PageNumberOptions,
  PageNumberPosition,
  PdfInspection,
}
