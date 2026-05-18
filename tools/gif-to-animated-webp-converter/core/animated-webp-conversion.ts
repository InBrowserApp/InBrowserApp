import { decompressFrames, parseGIF } from "gifuct-js"

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

  const sourceCanvas = document.createElement("canvas")
  const targetCanvas = document.createElement("canvas")

  sourceCanvas.width = width
  sourceCanvas.height = height
  targetCanvas.width = outputWidth
  targetCanvas.height = outputHeight

  const sourceContext = sourceCanvas.getContext("2d", {
    willReadFrequently: true,
  })
  const targetContext = targetCanvas.getContext("2d", {
    willReadFrequently: true,
  })

  if (!sourceContext || !targetContext) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

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
  const canvas = document.createElement("canvas")
  const context = canvas.getContext("2d", {
    willReadFrequently: true,
  })

  if (!context) {
    throw new Error("CANVAS_CONTEXT_UNAVAILABLE")
  }

  canvas.width = width
  canvas.height = height

  const pngFrames: PngAnimationFrame[] = []

  for (const [index, frame] of frames.entries()) {
    context.putImageData(
      new ImageData(new Uint8ClampedArray(frame), width, height),
      0,
      0
    )

    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((pngBlob) => {
        if (!pngBlob) {
          reject(new Error("CANVAS_CONTEXT_UNAVAILABLE"))
          return
        }

        resolve(pngBlob)
      }, "image/png")
    })

    pngFrames.push({
      data: new Uint8Array(await blob.arrayBuffer()),
      duration: delays[index] ?? 100,
    })
  }

  return pngFrames
}

async function convertGifFileToAnimatedWebp(
  file: File,
  options: Partial<GifToAnimatedWebpOptions>,
  outputName: string
): Promise<GifToAnimatedWebpResult> {
  const buffer = await file.arrayBuffer()
  const gifBytes = new Uint8Array(buffer)

  if (!isGifBytes(gifBytes)) {
    throw new Error("INVALID_GIF")
  }

  const normalizedOptions = normalizeGifToAnimatedWebpOptions(options)
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
  const blob = new Blob([toArrayBuffer(encoded)], { type: "image/webp" })

  return {
    blob,
    file,
    originalHeight: height,
    originalWidth: width,
    outputHeight: outputDimensions.height,
    outputName,
    outputWidth: outputDimensions.width,
  }
}
/* v8 ignore stop */

export {
  convertGifFileToAnimatedWebp,
  resolveGifDimensions,
  shouldUseLosslessGif2WebpEncoder,
  toArrayBuffer,
}
export type { GifToAnimatedWebpResult }
