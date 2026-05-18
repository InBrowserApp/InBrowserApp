type GifLoopMode = "custom" | "infinite" | "inherit"

type GifToAnimatedWebpOptions = Readonly<{
  loopCount: number
  loopMode: GifLoopMode
  scale: number
  speed: number
}>

type RgbaColor = Readonly<{
  a: number
  b: number
  g: number
  r: number
}>

type GifFrameRect = Readonly<{
  height: number
  left: number
  top: number
  width: number
}>

type DecodedGifFrame = Readonly<{
  delay: number
  dims: GifFrameRect
  disposalType?: number
  patch: Uint8ClampedArray
}>

type ComposedGifFrames = Readonly<{
  delays: number[]
  frames: Uint8ClampedArray[]
}>

const DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS = {
  loopCount: 1,
  loopMode: "inherit",
  scale: 100,
  speed: 1,
} as const satisfies GifToAnimatedWebpOptions

const DEFAULT_FRAME_DELAY = 100
const DEFAULT_LOOP_COUNT = 1
const DEFAULT_OUTPUT_NAME = "animation.webp"
const GIF_HEADER_BYTES = [0x47, 0x49, 0x46] as const
const MAX_LOOP_COUNT = 1000
const MAX_SCALE = 400
const MAX_SPEED = 4
const MIN_FRAME_DELAY = 10
const MIN_LOOP_COUNT = 1
const MIN_SCALE = 10
const MIN_SPEED = 0.25
const SUPPORTED_GIF_ACCEPT = "image/gif,.gif"

export {
  DEFAULT_FRAME_DELAY,
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
  DEFAULT_LOOP_COUNT,
  DEFAULT_OUTPUT_NAME,
  GIF_HEADER_BYTES,
  MAX_LOOP_COUNT,
  MAX_SCALE,
  MAX_SPEED,
  MIN_FRAME_DELAY,
  MIN_LOOP_COUNT,
  MIN_SCALE,
  MIN_SPEED,
  SUPPORTED_GIF_ACCEPT,
}
export type {
  ComposedGifFrames,
  DecodedGifFrame,
  GifFrameRect,
  GifLoopMode,
  GifToAnimatedWebpOptions,
  RgbaColor,
}
