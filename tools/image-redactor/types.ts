import type en from "./messages/en.json"

export type Messages = Readonly<{ [Key in keyof typeof en]: string }>
export type Point = Readonly<{ x: number; y: number }>
export type Effect = "solid" | "blur" | "pixelate"
export type Shape = "rectangle" | "ellipse" | "brush"
export type Tool = Shape | "select"
export type Style = Readonly<{
  effect: Effect
  color: string
  strength: number
  brushSize: number
}>
export type Region = Style &
  Readonly<{
    id: string
    shape: Shape
    x: number
    y: number
    width: number
    height: number
    rotation: number
    points: readonly Point[]
  }>
export type Source = Readonly<{
  image: HTMLCanvasElement
  name: string
  width: number
  height: number
}>
