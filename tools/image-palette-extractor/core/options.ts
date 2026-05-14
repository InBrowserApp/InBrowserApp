import type { PaletteOptions } from "./types"

const QUALITY_PRESETS = {
  fast: { maxDimension: 360, targetSamples: 20000 },
  balanced: { maxDimension: 720, targetSamples: 60000 },
  precise: { maxDimension: 1200, targetSamples: 140000 },
} as const

const DEFAULT_PALETTE_OPTIONS: PaletteOptions = {
  colorCount: 8,
  quality: "balanced",
  sortBy: "dominance",
  ignoreTransparent: true,
}

function getSampleStride(width: number, height: number, targetSamples: number) {
  const totalPixels = Math.max(0, Math.floor(width) * Math.floor(height))
  const samples = Math.max(1, Math.floor(targetSamples))

  return Math.max(1, Math.floor(totalPixels / samples))
}

export { DEFAULT_PALETTE_OPTIONS, QUALITY_PRESETS, getSampleStride }
