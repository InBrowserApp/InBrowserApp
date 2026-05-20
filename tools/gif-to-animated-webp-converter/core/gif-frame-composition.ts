import {
  clearFrameRect,
  fillCanvas,
  normalizeFrameDelay,
} from "./gif-frame-rendering"

import type {
  ComposedGifFrames,
  DecodedGifFrame,
  GifFrameRect,
  RgbaColor,
} from "./gif-frame-rendering"

function drawFramePatch(
  canvas: Uint8ClampedArray,
  canvasWidth: number,
  canvasHeight: number,
  patch: Uint8ClampedArray,
  dims: GifFrameRect
) {
  const top = Math.max(0, dims.top)
  const left = Math.max(0, dims.left)
  const right = Math.min(canvasWidth, dims.left + dims.width)
  const bottom = Math.min(canvasHeight, dims.top + dims.height)

  for (let y = top; y < bottom; y += 1) {
    for (let x = left; x < right; x += 1) {
      const patchX = x - dims.left
      const patchY = y - dims.top
      const patchIndex = (patchY * dims.width + patchX) * 4
      const alpha = patch[patchIndex + 3] ?? 0

      if (alpha === 0) {
        continue
      }

      const canvasIndex = (y * canvasWidth + x) * 4

      canvas[canvasIndex] = patch[patchIndex]!
      canvas[canvasIndex + 1] = patch[patchIndex + 1]!
      canvas[canvasIndex + 2] = patch[patchIndex + 2]!
      canvas[canvasIndex + 3] = alpha
    }
  }
}

function composeGifFrames(
  frames: readonly DecodedGifFrame[],
  width: number,
  height: number,
  speed: number,
  backgroundColor: RgbaColor
): ComposedGifFrames {
  if (
    !Number.isFinite(width) ||
    !Number.isFinite(height) ||
    width < 1 ||
    height < 1
  ) {
    throw new Error("INVALID_GIF")
  }

  const canvas = new Uint8ClampedArray(width * height * 4)
  const frameData: Uint8ClampedArray[] = []
  const delays: number[] = []

  fillCanvas(canvas, backgroundColor)

  let previousDisposal = 0
  let previousDims: GifFrameRect | null = null
  let previousRestore: Uint8ClampedArray | null = null

  for (const frame of frames) {
    if (!frame.patch || !frame.dims) {
      throw new Error("INVALID_FRAME")
    }

    if (previousDisposal === 2 && previousDims) {
      clearFrameRect(canvas, width, height, previousDims, backgroundColor)
    } else if (previousDisposal === 3 && previousRestore) {
      canvas.set(previousRestore)
    }

    const disposal =
      typeof frame.disposalType === "number" ? frame.disposalType : 0
    const restoreSnapshot = disposal === 3 ? canvas.slice() : null

    drawFramePatch(canvas, width, height, frame.patch, frame.dims)
    frameData.push(canvas.slice())
    delays.push(normalizeFrameDelay(frame.delay, speed))

    previousDisposal = disposal
    previousDims = frame.dims
    previousRestore = restoreSnapshot
  }

  return { delays, frames: frameData }
}

export { composeGifFrames, drawFramePatch }
