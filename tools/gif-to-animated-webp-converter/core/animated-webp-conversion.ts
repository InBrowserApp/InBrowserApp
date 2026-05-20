import { decompressFrames, parseGIF } from "gifuct-js"

import { canvasToPngBytes, createBitmapCanvas } from "./bitmap-canvas"
import { composeGifFrames } from "./gif-frame-composition"
import { encodeGifBytesWithGif2Webp } from "./gif2webp-encoder"
import {
  DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS,
  calculateScaledDimensions,
  isGifBytes,
  normalizeGifToAnimatedWebpOptions,
  resolveGifBackgroundColor,
} from "./gif-frame-rendering"
import { resolveLoopCount } from "./gif-loop"
import { encodePngFramesWithImg2Webp } from "./img2webp-encoder"

import type {
  DecodedGifFrame,
  GifToAnimatedWebpOptions,
} from "./gif-frame-rendering"
import type { PngAnimationFrame } from "./img2webp-encoder"

type GifToAnimatedWebpResult = Readonly<{
  blob: Blob
  file: File
  originalHeight: number
  originalWidth: number
  outputHeight: number
  outputName: string
  outputWidth: number
}>

type GifToAnimatedWebpEncodedResult = Omit<
  GifToAnimatedWebpResult,
  "blob" | "file"
> &
  Readonly<{
    bytes: Uint8Array
  }>

type ParsedGifLike = Readonly<{
  lsd?: {
    height?: number
    width?: number
  }
}>

function resolveGifDimensions(
  gif: ParsedGifLike,
  frames: readonly DecodedGifFrame[]
) {
  const firstFrame = frames[0]
  const width = Math.max(1, gif.lsd?.width ?? firstFrame?.dims.width ?? 1)
  const height = Math.max(1, gif.lsd?.height ?? firstFrame?.dims.height ?? 1)

  return { height, width }
}

function toArrayBuffer(bytes: Uint8Array) {
  const buffer = new ArrayBuffer(bytes.byteLength)

  new Uint8Array(buffer).set(bytes)

  return buffer
}

function shouldUseLosslessGif2WebpEncoder(options: GifToAnimatedWebpOptions) {
  return (
    options.loopMode === DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.loopMode &&
    options.scale === DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.scale &&
    options.speed === DEFAULT_GIF_TO_ANIMATED_WEBP_OPTIONS.speed
  )
}

/* v8 ignore start -- WASM runtime initialization is browser/bundler only. */
async function encodeTransformedAnimatedWebp(
  frames: readonly Uint8ClampedArray[],
  width: number,
  height: number,
  outputWidth: number,
  outputHeight: number,
  delays: readonly number[],
  loopCount: number
) {
  const scaledFrames = scaleFramesIfNeeded(
    frames,
    width,
    height,
    outputWidth,
    outputHeight
  )
  const pngFrames = await encodeFramesAsPngs(
    scaledFrames,
    outputWidth,
    outputHeight,
    delays
  )

  return encodePngFramesWithImg2Webp(pngFrames, loopCount)
}

function scaleFramesIfNeeded(
  frames: readonly Uint8ClampedArray[],
  width: number,
  height: number,
  outputWidth: number,
  outputHeight: number
) {
  if (width === outputWidth && height === outputHeight) {
    return frames
  }

  const { canvas: sourceCanvas, context: sourceContext } = createBitmapCanvas(
    width,
    height
  )
  const { context: targetContext } = createBitmapCanvas(
    outputWidth,
    outputHeight
  )

  targetContext.imageSmoothingEnabled = true
  targetContext.imageSmoothingQuality = "high"

  return frames.map((frame) => {
    sourceContext.putImageData(
      new ImageData(new Uint8ClampedArray(frame), width, height),
      0,
      0
    )
    targetContext.clearRect(0, 0, outputWidth, outputHeight)
    targetContext.drawImage(sourceCanvas, 0, 0, outputWidth, outputHeight)

    return targetContext.getImageData(0, 0, outputWidth, outputHeight).data
  })
}

async function encodeFramesAsPngs(
  frames: readonly Uint8ClampedArray[],
  width: number,
  height: number,
  delays: readonly number[]
): Promise<PngAnimationFrame[]> {
  const { canvas, context } = createBitmapCanvas(width, height)

  const pngFrames: PngAnimationFrame[] = []

  for (const [index, frame] of frames.entries()) {
    context.putImageData(
      new ImageData(new Uint8ClampedArray(frame), width, height),
      0,
      0
    )

    pngFrames.push({
      data: await canvasToPngBytes(canvas),
      duration: delays[index] ?? 100,
    })
  }

  return pngFrames
}

async function convertGifBytesToAnimatedWebp(
  gifBytes: Uint8Array,
  options: Partial<GifToAnimatedWebpOptions>,
  outputName: string
): Promise<GifToAnimatedWebpEncodedResult> {
  if (!isGifBytes(gifBytes)) {
    throw new Error("INVALID_GIF")
  }

  const normalizedOptions = normalizeGifToAnimatedWebpOptions(options)
  const buffer = toArrayBuffer(gifBytes)
  const gif = parseGIF(buffer)
  const shouldUseLosslessEncoder =
    shouldUseLosslessGif2WebpEncoder(normalizedOptions)
  const frames = shouldUseLosslessEncoder
    ? []
    : (decompressFrames(gif, true) as DecodedGifFrame[])

  if (!shouldUseLosslessEncoder && frames.length === 0) {
    throw new Error("EMPTY_GIF")
  }

  const { height, width } = resolveGifDimensions(gif, frames)
  const outputDimensions = calculateScaledDimensions(
    width,
    height,
    normalizedOptions.scale
  )
  const encoded = shouldUseLosslessEncoder
    ? await encodeGifBytesWithGif2Webp(gifBytes)
    : await (async () => {
        const backgroundColor = resolveGifBackgroundColor(gifBytes)
        const composedFrames = composeGifFrames(
          frames,
          width,
          height,
          normalizedOptions.speed,
          backgroundColor
        )

        return encodeTransformedAnimatedWebp(
          composedFrames.frames,
          width,
          height,
          outputDimensions.width,
          outputDimensions.height,
          composedFrames.delays,
          resolveLoopCount(gifBytes, normalizedOptions)
        )
      })()

  return {
    bytes: encoded,
    originalHeight: height,
    originalWidth: width,
    outputHeight: outputDimensions.height,
    outputName,
    outputWidth: outputDimensions.width,
  }
}

/* v8 ignore stop */

export {
  convertGifBytesToAnimatedWebp,
  resolveGifDimensions,
  shouldUseLosslessGif2WebpEncoder,
  toArrayBuffer,
}
export type { GifToAnimatedWebpEncodedResult, GifToAnimatedWebpResult }
