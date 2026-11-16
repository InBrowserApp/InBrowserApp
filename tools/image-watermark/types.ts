import type { ToolMeta } from "@workspace/tool-sdk"
import type copy from "./messages/en.json"

export type Messages = typeof copy & { meta: ToolMeta }
export type PresetPosition =
  | "topLeft"
  | "topCenter"
  | "topRight"
  | "middleLeft"
  | "center"
  | "middleRight"
  | "bottomLeft"
  | "bottomCenter"
  | "bottomRight"
export type Position = PresetPosition | "custom"
export type Options = {
  kind: "text" | "image"
  text: string
  font: "sans-serif" | "serif" | "monospace"
  color: string
  tiled: boolean
  position: Position
  x: number
  y: number
  size: number
  opacity: number
  rotation: number
  spacing: number
  margin: number
  format: "image/png" | "image/jpeg" | "image/webp"
  quality: number
}
export type ImageSource = {
  image: CanvasImageSource
  width: number
  height: number
  close: () => void
}
export const POSITIONS: PresetPosition[] = [
  "topLeft",
  "topCenter",
  "topRight",
  "middleLeft",
  "center",
  "middleRight",
  "bottomLeft",
  "bottomCenter",
  "bottomRight",
]
export function defaultOptions(text: string): Options {
  return {
    kind: "text",
    text,
    font: "sans-serif",
    color: "#ffffff",
    tiled: false,
    position: "bottomRight",
    x: 50,
    y: 50,
    size: 35,
    opacity: 55,
    rotation: 0,
    spacing: 12,
    margin: 4,
    format: "image/png",
    quality: 92,
  }
}
