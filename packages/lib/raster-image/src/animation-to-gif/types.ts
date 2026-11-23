import type { AnimationResult } from "../animation-worker"
import type { Orientation } from "./orientation"

export type AnimationFormat = "apng" | "webp"

export type Frame = {
  x: number
  y: number
  width: number
  height: number
  delay: number
  blend: boolean
  dispose: "keep" | "background" | "previous"
  image: () => Blob
}

export type Animation = {
  width: number
  height: number
  plays: number
  frames: Frame[]
  orientation: Orientation
}

export type GifResult = AnimationResult & {
  width: number
  height: number
}

export type ConversionReply =
  | { result: GifResult }
  | { error: "invalid" | "limit" | "failed" }
