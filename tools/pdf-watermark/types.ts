import type copy from "./messages/en.json"

type Messages = Readonly<{ [Key in keyof typeof copy]: string }>
type PageGeometry = Readonly<{
  width: number
  height: number
  x: number
  y: number
  rotation: number
}>
type Options = Readonly<{
  kind: "text" | "image"
  text: string
  font: "sans" | "serif"
  color: string
  size: number
  rotation: number
  opacity: number
  layout: "single" | "tile"
  position: number
  spacing: number
}>
type Watermark = Readonly<{ blob: Blob; width: number; height: number }>
type Source = Readonly<{ file: File; pages: readonly PageGeometry[] }>
type Result = Readonly<{ blob: Blob; name: string }>

const DEFAULT_OPTIONS: Options = {
  kind: "text",
  text: "CONFIDENTIAL",
  font: "sans",
  color: "#64748b",
  size: 50,
  rotation: -35,
  opacity: 25,
  layout: "single",
  position: 4,
  spacing: 72,
}

export { DEFAULT_OPTIONS }
export type { Messages, Options, Watermark, Source, Result, PageGeometry }
