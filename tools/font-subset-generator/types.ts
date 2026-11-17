import type messages from "./messages/en.json"

export type Messages = typeof messages
export type OutputFormat = "woff2" | "sfnt"
export type FontDetails = {
  glyphCount: number
  weight: string
  style: "normal" | "italic" | "oblique"
  extension: "ttf" | "otf"
}
export type SubsetRequest = {
  input: ArrayBuffer
  text: string
  format: OutputFormat
}
export type SubsetOutput = FontDetails & {
  output: ArrayBuffer
  originalGlyphCount: number
  missing: number[]
  unicodes: number[]
}
export type SubsetResult = SubsetOutput & {
  originalSize: number
  text: string
  filename: string
  mime: string
  css: string
  family: string
}
