import type { ImageDimensions, ResizeAlgorithm } from '../types'

export const MAX_RESIZE_DIMENSION = 16384
export const MAX_OUTPUT_PIXELS = 40_000_000
export const MAX_SOURCE_PIXELS = 50_000_000
export const MAX_MANUAL_PROCESSING_PIXELS = 16_000_000

export function assertResizeWithinLimits(
  source: ImageDimensions,
  output: ImageDimensions,
  algorithm: ResizeAlgorithm,
) {
  if (
    output.width > MAX_RESIZE_DIMENSION ||
    output.height > MAX_RESIZE_DIMENSION ||
    source.width > MAX_RESIZE_DIMENSION ||
    source.height > MAX_RESIZE_DIMENSION
  ) {
    throw new Error('OUTPUT_TOO_LARGE')
  }

  const sourcePixels = source.width * source.height
  const outputPixels = output.width * output.height

  if (sourcePixels > MAX_SOURCE_PIXELS || outputPixels > MAX_OUTPUT_PIXELS) {
    throw new Error('OUTPUT_TOO_LARGE')
  }

  if (
    algorithm !== 'browser-high' &&
    (sourcePixels > MAX_MANUAL_PROCESSING_PIXELS || outputPixels > MAX_MANUAL_PROCESSING_PIXELS)
  ) {
    throw new Error('OUTPUT_TOO_LARGE_FOR_ALGORITHM')
  }
}
