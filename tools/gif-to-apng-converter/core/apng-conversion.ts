import { decompressFrames, parseGIF } from "gifuct-js"
import * as UPNG from "upng-js"

import {
  composeGifFrames,
  isGifBytes,
  readGifLoopCount,
  resolveGifBackgroundColor,
} from "./gif-frame-rendering"
import { scaleFramesIfNeeded } from "./frame-scaling"
import { setApngLoop } from "./png-chunks"

import type { GifFrame } from "./gif-frame-rendering"

type GifLoopMode = "inherit" | "infinite" | "custom"

type GifToApngOptions = Readonly<{
  loopCount?: number
  loopMode: GifLoopMode
  scale: number
  speed: number
}>

type GifToApngResult = Readonly<{
  blob: Blob
  delays: readonly number[]
  file: File
  frameCount: number
  loopCount: number
  originalHeight: number
  originalWidth: number
  outputHeight: number
  outputName: string
  outputWidth: number
}>

type GifFileLike = Readonly<{
  name: string
  type: string
}>

type GifLogicalScreen = Readonly<{
  lsd?: {
    height?: number
    width?: number
  }
}>

const DEFAULT_GIF_TO_APNG_OPTIONS = {
  loopCount: 1,
  loopMode: "inherit",
  scale: 100,
  speed: 1,
} as const satisfies GifToApngOptions

const MIN_APNG_SCALE = 10
const MAX_APNG_SCALE = 400
const MIN_APNG_SPEED = 0.25
const MAX_APNG_SPEED = 4
const MIN_APNG_LOOP_COUNT = 1
const MAX_APNG_LOOP_COUNT = 999
const GIF_MIME_TYPE = "image/gif"
const PNG_MIME_TYPE = "image/png"
const APNG_ZIP_NAME = "apng-images.zip"
const DEFAULT_APNG_OUTPUT_NAME = "image.png"

function clampRounded(
  value: number,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, Math.round(value)))
}

function clampNumber(
  value: number,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  return Math.min(maximum, Math.max(minimum, value))
}

function normalizeGifToApngOptions(
  options: Partial<GifToApngOptions> = {}
): GifToApngOptions {
  const loopMode =
    options.loopMode === "infinite" || options.loopMode === "custom"
      ? options.loopMode
      : "inherit"

  return {
    loopCount: clampRounded(
      options.loopCount ?? DEFAULT_GIF_TO_APNG_OPTIONS.loopCount,
      DEFAULT_GIF_TO_APNG_OPTIONS.loopCount,
      MIN_APNG_LOOP_COUNT,
      MAX_APNG_LOOP_COUNT
    ),
    loopMode,
    scale: clampRounded(
      options.scale ?? DEFAULT_GIF_TO_APNG_OPTIONS.scale,
      DEFAULT_GIF_TO_APNG_OPTIONS.scale,
      MIN_APNG_SCALE,
      MAX_APNG_SCALE
    ),
    speed: clampNumber(
      options.speed ?? DEFAULT_GIF_TO_APNG_OPTIONS.speed,
      DEFAULT_GIF_TO_APNG_OPTIONS.speed,
      MIN_APNG_SPEED,
      MAX_APNG_SPEED
    ),
  }
}

function isSupportedGifFile(file: GifFileLike) {
  const type = file.type.trim().toLowerCase()
  const name = file.name.trim().toLowerCase()

  return type === GIF_MIME_TYPE || name.endsWith(".gif")
}

function resolveApngOutputName(fileName: string) {
  const normalizedName = fileName.replace(/[/\\]+/g, "_").trim()

  if (!normalizedName) {
    return DEFAULT_APNG_OUTPUT_NAME
  }

  const dotIndex = normalizedName.lastIndexOf(".")
  const baseName =
    dotIndex > 0 ? normalizedName.slice(0, dotIndex) : normalizedName

  return `${baseName}.png`
}

function resolveUniqueApngOutputName(
  fileName: string,
  nameCounts: Map<string, number>
) {
  const outputName = resolveApngOutputName(fileName)
  const extensionIndex = outputName.lastIndexOf(".")
  const baseName = outputName.slice(0, extensionIndex)
  const extension = outputName.slice(extensionIndex)
  const currentCount = nameCounts.get(outputName) ?? 0

  nameCounts.set(outputName, currentCount + 1)

  if (currentCount === 0) {
    return outputName
  }

  return `${baseName}-${currentCount + 1}${extension}`
}

function calculateScaledDimensions(
  width: number,
  height: number,
  scale: number
) {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error("INVALID_GIF")
  }

  const ratio = normalizeGifToApngOptions({ scale }).scale / 100

  return {
    height: Math.max(1, Math.round(height * ratio)),
    width: Math.max(1, Math.round(width * ratio)),
  }
}

function resolveLoopCount(bytes: Uint8Array, options: GifToApngOptions) {
  if (options.loopMode === "infinite") {
    return 0
  }

  if (options.loopMode === "custom") {
    return options.loopCount ?? DEFAULT_GIF_TO_APNG_OPTIONS.loopCount
  }

  return readGifLoopCount(bytes) ?? 1
}

function resolveLogicalScreenSize(
  gif: GifLogicalScreen,
  frames: readonly GifFrame[]
) {
  const firstFrame = frames[0]

  if (!firstFrame?.dims) {
    throw new Error("INVALID_FRAME")
  }

  return {
    height: Math.max(1, gif.lsd?.height ?? firstFrame.dims.height),
    width: Math.max(1, gif.lsd?.width ?? firstFrame.dims.width),
  }
}

async function convertGifToApng(
  file: File,
  options: Partial<GifToApngOptions>,
  outputName = resolveApngOutputName(file.name)
): Promise<GifToApngResult> {
  const normalizedOptions = normalizeGifToApngOptions(options)
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  if (!isGifBytes(bytes)) {
    throw new Error("INVALID_GIF")
  }

  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, true) as GifFrame[]

  if (frames.length === 0) {
    throw new Error("EMPTY_GIF")
  }

  const { height, width } = resolveLogicalScreenSize(gif, frames)
  const dimensions = calculateScaledDimensions(
    width,
    height,
    normalizedOptions.scale
  )
  const { delays, frameData } = composeGifFrames(
    frames,
    width,
    height,
    normalizedOptions.speed,
    resolveGifBackgroundColor(bytes)
  )
  const apngFrames = scaleFramesIfNeeded(
    frameData,
    width,
    height,
    dimensions.width,
    dimensions.height
  )
  const loopCount = resolveLoopCount(bytes, normalizedOptions)
  const encoded = setApngLoop(
    UPNG.encode(apngFrames, dimensions.width, dimensions.height, 0, delays),
    loopCount
  )

  return {
    blob: new Blob([encoded], { type: PNG_MIME_TYPE }),
    delays,
    file,
    frameCount: frames.length,
    loopCount,
    originalHeight: height,
    originalWidth: width,
    outputHeight: dimensions.height,
    outputName,
    outputWidth: dimensions.width,
  }
}

export {
  APNG_ZIP_NAME,
  DEFAULT_APNG_OUTPUT_NAME,
  DEFAULT_GIF_TO_APNG_OPTIONS,
  GIF_MIME_TYPE,
  MAX_APNG_LOOP_COUNT,
  MAX_APNG_SCALE,
  MAX_APNG_SPEED,
  MIN_APNG_LOOP_COUNT,
  MIN_APNG_SCALE,
  MIN_APNG_SPEED,
  calculateScaledDimensions,
  convertGifToApng,
  isSupportedGifFile,
  normalizeGifToApngOptions,
  resolveApngOutputName,
  resolveLoopCount,
  resolveUniqueApngOutputName,
}
export type { GifLoopMode, GifToApngOptions, GifToApngResult }
