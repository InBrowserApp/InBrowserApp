import { parseGIF, decompressFrames } from 'gifuct-js'
import * as UPNG from 'upng-js'
import { optimizePNG } from '@utils/image'
import type { GifToApngOptions, GifToApngResult } from '../types'

interface GifFrame {
  patch: Uint8ClampedArray
  dims: {
    top: number
    left: number
    width: number
    height: number
  }
  delay: number
  disposalType?: number
}

const GIF_HEADER_BYTES = new Uint8Array([0x47, 0x49, 0x46])
const DEFAULT_FRAME_DELAY = 100
const MIN_FRAME_DELAY = 10

export async function convertGifToApng(
  file: File,
  options: GifToApngOptions,
  outputName: string,
): Promise<GifToApngResult> {
  const buffer = await file.arrayBuffer()
  const gifBytes = new Uint8Array(buffer)

  if (!isGifFile(gifBytes)) {
    throw new Error('INVALID_GIF')
  }

  const gif = parseGIF(buffer)
  const frames = decompressFrames(gif, true) as GifFrame[]

  if (!frames.length) {
    throw new Error('EMPTY_GIF')
  }

  const originalWidth = Math.max(1, gif.lsd?.width ?? frames[0]?.dims?.width ?? 1)
  const originalHeight = Math.max(1, gif.lsd?.height ?? frames[0]?.dims?.height ?? 1)
  const scale = normalizeScale(options.scale)
  const outputWidth = Math.max(1, Math.round(originalWidth * scale))
  const outputHeight = Math.max(1, Math.round(originalHeight * scale))
  const speed = normalizeSpeed(options.speed)

  const { frameData, delays } = composeGifFrames(frames, originalWidth, originalHeight, speed)
  const apngFrames = scaleFramesIfNeeded(
    frameData,
    originalWidth,
    originalHeight,
    outputWidth,
    outputHeight,
  )

  let encoded = UPNG.encode(apngFrames, outputWidth, outputHeight, 0, delays)
  const loopCount = resolveLoopCount(gifBytes, options)
  if (loopCount !== null) {
    encoded = setApngLoop(encoded, loopCount)
  }

  let blob = new Blob([encoded], { type: 'image/png' })

  if (options.optimize) {
    blob = await optimizePNG(blob, {
      level: normalizeOptimizeLevel(options.optimizeLevel),
      interlace: false,
      optimiseAlpha: true,
    })
  }

  return {
    file,
    blob,
    outputName,
    originalWidth,
    originalHeight,
    outputWidth,
    outputHeight,
  }
}

function normalizeScale(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1
  return value / 100
}

function normalizeSpeed(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1
  return value
}

function normalizeOptimizeLevel(value: number) {
  if (!Number.isFinite(value)) return 2
  return Math.min(6, Math.max(0, Math.round(value)))
}

function isGifFile(bytes: Uint8Array) {
  if (bytes.length < 3) return false
  return (
    bytes[0] === GIF_HEADER_BYTES[0] &&
    bytes[1] === GIF_HEADER_BYTES[1] &&
    bytes[2] === GIF_HEADER_BYTES[2]
  )
}

function composeGifFrames(frames: GifFrame[], width: number, height: number, speed: number) {
  const canvas = new Uint8ClampedArray(width * height * 4)
  const frameData: Uint8ClampedArray[] = []
  const delays: number[] = []

  let previousDisposal = 0
  let previousDims: GifFrame['dims'] | null = null
  let previousRestore: Uint8ClampedArray | null = null

  for (const frame of frames) {
    if (!frame.patch || !frame.dims) {
      throw new Error('INVALID_FRAME')
    }

    if (previousDisposal === 2 && previousDims) {
      clearRect(canvas, width, previousDims)
    } else if (previousDisposal === 3 && previousRestore) {
      canvas.set(previousRestore)
    }

    const disposal = typeof frame.disposalType === 'number' ? frame.disposalType : 0
    const restoreSnapshot = disposal === 3 ? canvas.slice() : null

    drawPatch(canvas, width, frame.patch, frame.dims)
    frameData.push(canvas.slice())
    delays.push(normalizeDelay(frame.delay, speed))

    previousDisposal = disposal
    previousDims = frame.dims
    previousRestore = restoreSnapshot
  }

  return { frameData, delays }
}

function clearRect(canvas: Uint8ClampedArray, canvasWidth: number, dims: GifFrame['dims']) {
  const { top, left, width, height } = dims
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const index = ((y + top) * canvasWidth + (x + left)) * 4
      canvas[index] = 0
      canvas[index + 1] = 0
      canvas[index + 2] = 0
      canvas[index + 3] = 0
    }
  }
}

function drawPatch(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  patch: Uint8ClampedArray,
  dims: GifFrame['dims'],
) {
  const { top, left, width, height } = dims
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const patchIndex = (y * width + x) * 4
      const alpha = patch[patchIndex + 3] ?? 0
      if (alpha === 0) continue
      const canvasIndex = ((y + top) * canvasWidth + (x + left)) * 4
      canvas[canvasIndex] = patch[patchIndex] ?? 0
      canvas[canvasIndex + 1] = patch[patchIndex + 1] ?? 0
      canvas[canvasIndex + 2] = patch[patchIndex + 2] ?? 0
      canvas[canvasIndex + 3] = alpha
    }
  }
}

function normalizeDelay(delay: number, speed: number) {
  const baseDelay = Number.isFinite(delay) && delay > 0 ? delay : DEFAULT_FRAME_DELAY
  const adjusted = baseDelay / speed
  return Math.max(MIN_FRAME_DELAY, Math.round(adjusted))
}

function scaleFramesIfNeeded(
  frames: Uint8ClampedArray[],
  width: number,
  height: number,
  outputWidth: number,
  outputHeight: number,
) {
  if (width === outputWidth && height === outputHeight) {
    return frames.map((frame) => new Uint8ClampedArray(frame).buffer)
  }

  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = width
  sourceCanvas.height = height
  const sourceCtx = sourceCanvas.getContext('2d', { willReadFrequently: true })
  if (!sourceCtx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  const targetCanvas = document.createElement('canvas')
  targetCanvas.width = outputWidth
  targetCanvas.height = outputHeight
  const targetCtx = targetCanvas.getContext('2d', { willReadFrequently: true })
  if (!targetCtx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  targetCtx.imageSmoothingEnabled = true
  targetCtx.imageSmoothingQuality = 'high'

  return frames.map((frame) => {
    const imageData = new ImageData(new Uint8ClampedArray(frame), width, height)
    sourceCtx.putImageData(imageData, 0, 0)
    targetCtx.clearRect(0, 0, outputWidth, outputHeight)
    targetCtx.drawImage(sourceCanvas, 0, 0, outputWidth, outputHeight)
    const scaledData = targetCtx.getImageData(0, 0, outputWidth, outputHeight)
    return scaledData.data.buffer
  })
}

function resolveLoopCount(bytes: Uint8Array, options: GifToApngOptions) {
  if (options.loopMode === 'infinite') return 0
  if (options.loopMode === 'custom') {
    const count = Number.isFinite(options.loopCount) ? Math.round(options.loopCount ?? 1) : 1
    return Math.max(1, count)
  }

  const gifLoop = readGifLoopCount(bytes)
  if (gifLoop === null) return 1
  return gifLoop
}

function readGifLoopCount(bytes: Uint8Array): number | null {
  const readByte = (index: number) => bytes[index] ?? 0

  for (let i = 0; i + 19 <= bytes.length; i += 1) {
    if (readByte(i) !== 0x21 || readByte(i + 1) !== 0xff || readByte(i + 2) !== 0x0b) continue
    const identifier = String.fromCharCode(
      readByte(i + 3),
      readByte(i + 4),
      readByte(i + 5),
      readByte(i + 6),
      readByte(i + 7),
      readByte(i + 8),
      readByte(i + 9),
      readByte(i + 10),
      readByte(i + 11),
      readByte(i + 12),
      readByte(i + 13),
    )

    if (identifier !== 'NETSCAPE2.0' && identifier !== 'ANIMEXTS1.0') continue
    const subBlockSize = readByte(i + 14)
    if (subBlockSize < 3) continue
    if (readByte(i + 15) !== 0x01) continue
    const loopCount = readByte(i + 16) | (readByte(i + 17) << 8)
    return loopCount
  }

  return null
}

function setApngLoop(buffer: ArrayBuffer, loopCount: number) {
  const view = new DataView(buffer)

  let offset = 8
  while (offset + 12 <= view.byteLength) {
    const length = view.getUint32(offset)
    const type = readChunkType(view, offset + 4)
    const dataOffset = offset + 8

    if (type === 'acTL' && length >= 8 && dataOffset + length <= view.byteLength) {
      view.setUint32(dataOffset + 4, loopCount)
      return buffer
    }

    offset = dataOffset + length + 4
    if (offset < 0) break
  }

  return buffer
}

function readChunkType(view: DataView, offset: number) {
  return String.fromCharCode(
    view.getUint8(offset),
    view.getUint8(offset + 1),
    view.getUint8(offset + 2),
    view.getUint8(offset + 3),
  )
}
