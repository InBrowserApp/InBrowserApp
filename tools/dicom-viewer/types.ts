import type english from "./messages/en.json"

export type Messages = typeof english
export type WindowLevel = { width: number; level: number }
export type WindowFunction = "LINEAR" | "LINEAR_EXACT" | "SIGMOID"
export type Position = [number, number, number]
export type Orientation = [...Position, ...Position]

export type Frame = {
  width: number
  height: number
  aspectRatio: number
  pixels: Float32Array
  inverted: boolean
  window: WindowLevel
  windowFunction: WindowFunction
}

export type Tag = { id: string; name: string; value: string }
export type Image = {
  fileName: string
  seriesId?: string
  description?: string
  modality?: string
  instance?: number
  position?: Position
  orientation?: Orientation
  frameCount: number
  frame: (index: number) => Promise<Frame>
  tags: () => Tag[]
}

export type Series = {
  description?: string
  modality?: string
  images: Image[]
  frameCount: number
}
