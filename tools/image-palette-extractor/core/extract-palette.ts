import {
  HISTOMASK,
  SIGBITS,
  getColorIndex,
  quantizeHistogram,
} from "./median-cut"

import type { PaletteColor } from "./types"

type ExtractPaletteOptions = Readonly<{
  colorCount: number
  sampleStride?: number
  ignoreTransparent?: boolean
  alphaThreshold?: number
}>

type ExtractPaletteResult = Readonly<{
  colors: PaletteColor[]
  totalPixels: number
}>

const RSHIFT = 8 - SIGBITS
const HISTOSIZE = 1 << (3 * SIGBITS)

function extractPalette(
  imageData: ImageData,
  options: ExtractPaletteOptions
): ExtractPaletteResult {
  const colorCount = Math.max(1, Math.min(256, Math.floor(options.colorCount)))
  const sampleStride = Math.max(1, Math.floor(options.sampleStride ?? 1))
  const ignoreTransparent = options.ignoreTransparent ?? true
  const alphaThreshold = Math.max(
    0,
    Math.min(255, Math.floor(options.alphaThreshold ?? 8))
  )
  const histo = new Uint32Array(HISTOSIZE)
  const { data } = imageData
  let totalPixels = 0

  for (let index = 0; index < data.length; index += 4 * sampleStride) {
    const alpha = data[index + 3] ?? 255
    if (ignoreTransparent && alpha <= alphaThreshold) continue

    const r = ((data[index] ?? 0) >> RSHIFT) & HISTOMASK
    const g = ((data[index + 1] ?? 0) >> RSHIFT) & HISTOMASK
    const b = ((data[index + 2] ?? 0) >> RSHIFT) & HISTOMASK
    const colorIndex = getColorIndex(r, g, b)

    histo[colorIndex] = histo[colorIndex]! + 1
    totalPixels += 1
  }

  if (totalPixels === 0) {
    return { colors: [], totalPixels: 0 }
  }

  return {
    colors: quantizeHistogram(histo, colorCount),
    totalPixels,
  }
}

export { extractPalette }
