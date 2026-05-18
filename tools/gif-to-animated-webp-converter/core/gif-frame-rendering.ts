import {
  DEFAULT_FRAME_DELAY,
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
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
} from "./gif-types"

import type {
  GifFrameRect,
  GifLoopMode,
  GifToAnimatedWebpOptions,
  RgbaColor,
} from "./gif-types"

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

function clampDecimal(
  value: number,
  fallback: number,
  minimum: number,
  maximum: number
) {
  if (!Number.isFinite(value)) {
    return fallback
  }

  const rounded = Math.round(value * 100) / 100

  return Math.min(maximum, Math.max(minimum, rounded))
}

function normalizeGifToAnimatedWebpOptions(
  options: Partial<GifToAnimatedWebpOptions>
): GifToAnimatedWebpOptions {
  const loopMode: GifLoopMode =
    options.loopMode === "custom" ||
    options.loopMode === "infinite" ||
    options.loopMode === "inherit"
      ? options.loopMode
      : DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.loopMode

  return {
    loopCount: clampRounded(
      options.loopCount ?? DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.loopCount,
      DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.loopCount,
      MIN_LOOP_COUNT,
      MAX_LOOP_COUNT
    ),
    loopMode,
    scale: clampRounded(
      options.scale ?? DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.scale,
      DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.scale,
      MIN_SCALE,
      MAX_SCALE
    ),
    speed: clampDecimal(
      options.speed ?? DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.speed,
      DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.speed,
      MIN_SPEED,
      MAX_SPEED
    ),
  }
}

function isSupportedGifFile(file: Readonly<{ name: string; type: string }>) {
  if (file.type.toLowerCase() === "image/gif") {
    return true
  }

  return file.name.trim().toLowerCase().endsWith(".gif")
}

function isGifBytes(bytes: Uint8Array) {
  return (
    bytes.length >= GIF_HEADER_BYTES.length &&
    GIF_HEADER_BYTES.every((byte, index) => bytes[index] === byte)
  )
}

function resolveAnimatedWebpOutputName(fileName: string) {
  const safeName = fileName.replace(/[/\\]+/g, "_").trim()

  if (!safeName) {
    return DEFAULT_OUTPUT_NAME
  }

  const dotIndex = safeName.lastIndexOf(".")
  const baseName = dotIndex > 0 ? safeName.slice(0, dotIndex) : safeName

  return `${baseName}.webp`
}

function resolveUniqueAnimatedWebpOutputName(
  fileName: string,
  nameCounts: Map<string, number>
) {
  const outputName = resolveAnimatedWebpOutputName(fileName)
  const extensionIndex = outputName.lastIndexOf(".")
  const baseName = outputName.slice(0, extensionIndex)
  const extension = outputName.slice(extensionIndex)
  const currentCount = nameCounts.get(outputName) ?? 0

  nameCounts.set(outputName, currentCount + 1)

  return currentCount === 0
    ? outputName
    : `${baseName}-${currentCount + 1}${extension}`
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

  const normalized = normalizeGifToAnimatedWebpOptions({ scale })
  const ratio = normalized.scale / 100

  return {
    height: Math.max(1, Math.round(height * ratio)),
    width: Math.max(1, Math.round(width * ratio)),
  }
}

function readGifBackgroundColor(bytes: Uint8Array): RgbaColor | null {
  if (bytes.length < 13) {
    return null
  }

  const packed = bytes[10]!
  const hasGlobalColorTable = (packed & 0x80) !== 0

  if (!hasGlobalColorTable) {
    return null
  }

  const globalColorTableSize = 1 << ((packed & 0x07) + 1)
  const backgroundIndex = bytes[11]!

  if (backgroundIndex >= globalColorTableSize) {
    return null
  }

  const tableStart = 13
  const tableSize = globalColorTableSize * 3

  if (tableStart + tableSize > bytes.length) {
    return null
  }

  const colorOffset = tableStart + backgroundIndex * 3

  return {
    a: 255,
    b: bytes[colorOffset + 2]!,
    g: bytes[colorOffset + 1]!,
    r: bytes[colorOffset]!,
  }
}

function resolveGifBackgroundColor(bytes: Uint8Array) {
  return readGifBackgroundColor(bytes) ?? { a: 0, b: 0, g: 0, r: 0 }
}

function normalizeFrameDelay(delay: number, speed: number) {
  const baseDelay =
    Number.isFinite(delay) && delay > 0 ? delay : DEFAULT_FRAME_DELAY
  const normalizedSpeed = normalizeGifToAnimatedWebpOptions({ speed }).speed

  return Math.max(MIN_FRAME_DELAY, Math.round(baseDelay / normalizedSpeed))
}

function fillCanvas(canvas: Uint8ClampedArray, color: RgbaColor) {
  if (color.a === 0 && color.b === 0 && color.g === 0 && color.r === 0) {
    return
  }

  for (let index = 0; index < canvas.length; index += 4) {
    canvas[index] = color.r
    canvas[index + 1] = color.g
    canvas[index + 2] = color.b
    canvas[index + 3] = color.a
  }
}

function paintPixel(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  x: number,
  y: number,
  color: RgbaColor
) {
  const index = (y * canvasWidth + x) * 4

  canvas[index] = color.r
  canvas[index + 1] = color.g
  canvas[index + 2] = color.b
  canvas[index + 3] = color.a
}

function clearFrameRect(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  canvasHeight: number,
  dims: GifFrameRect,
  color: RgbaColor
) {
  const top = Math.max(0, dims.top)
  const left = Math.max(0, dims.left)
  const right = Math.min(canvasWidth, dims.left + dims.width)
  const bottom = Math.min(canvasHeight, dims.top + dims.height)

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      paintPixel(canvas, canvasWidth, x, y, color)
    }
  }
}

export {
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
  DEFAULT_OUTPUT_NAME,
  MAX_LOOP_COUNT,
  MAX_SCALE,
  MAX_SPEED,
  MIN_LOOP_COUNT,
  MIN_SCALE,
  MIN_SPEED,
  SUPPORTED_GIF_ACCEPT,
  calculateScaledDimensions,
  clearFrameRect,
  fillCanvas,
  isGifBytes,
  isSupportedGifFile,
  normalizeFrameDelay,
  normalizeGifToAnimatedWebpOptions,
  readGifBackgroundColor,
  resolveAnimatedWebpOutputName,
  resolveGifBackgroundColor,
  resolveUniqueAnimatedWebpOutputName,
}
export type {
  ComposedGifFrames,
  DecodedGifFrame,
  GifFrameRect,
  GifLoopMode,
  GifToAnimatedWebpOptions,
  RgbaColor,
} from "./gif-types"
