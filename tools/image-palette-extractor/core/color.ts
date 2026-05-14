import type { PaletteColor, PaletteSort, PaletteSwatch } from "./types"

const MAX_CHANNEL = 255

function clampChannel(value: number): number {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

function rgbToHex(r: number, g: number, b: number): string {
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`
}

function formatRgb(r: number, g: number, b: number): string {
  return `rgb(${clampChannel(r)}, ${clampChannel(g)}, ${clampChannel(b)})`
}

function rgbToHsl(r: number, g: number, b: number) {
  const rNorm = clampChannel(r) / MAX_CHANNEL
  const gNorm = clampChannel(g) / MAX_CHANNEL
  const bNorm = clampChannel(b) / MAX_CHANNEL
  const max = Math.max(rNorm, gNorm, bNorm)
  const min = Math.min(rNorm, gNorm, bNorm)
  const delta = max - min
  const lightness = (max + min) / 2
  let hue = 0
  let saturation = 0

  if (delta !== 0) {
    saturation = lightness > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    if (max === rNorm) {
      hue = (gNorm - bNorm) / delta + (gNorm < bNorm ? 6 : 0)
    } else if (max === gNorm) {
      hue = (bNorm - rNorm) / delta + 2
    } else {
      hue = (rNorm - gNorm) / delta + 4
    }

    hue /= 6
  }

  return {
    h: Math.round(hue * 360),
    s: Math.round(saturation * 100),
    l: Math.round(lightness * 100),
  }
}

function formatHsl(r: number, g: number, b: number): string {
  const { h, s, l } = rgbToHsl(r, g, b)
  return `hsl(${h}, ${s}%, ${l}%)`
}

function getContrastColor(r: number, g: number, b: number): string {
  const yiq =
    (clampChannel(r) * 299 + clampChannel(g) * 587 + clampChannel(b) * 114) /
    1000

  return yiq >= 140 ? "#111111" : "#ffffff"
}

function createSwatches(
  colors: readonly PaletteColor[],
  totalPixels: number
): PaletteSwatch[] {
  if (totalPixels <= 0) return []

  return colors.map((color) => {
    const hslValues = rgbToHsl(color.r, color.g, color.b)

    return {
      hex: rgbToHex(color.r, color.g, color.b),
      rgb: formatRgb(color.r, color.g, color.b),
      hsl: `hsl(${hslValues.h}, ${hslValues.s}%, ${hslValues.l}%)`,
      count: color.count,
      ratio: color.count / totalPixels,
      hue: hslValues.h,
      lightness: hslValues.l,
      textColor: getContrastColor(color.r, color.g, color.b),
    }
  })
}

function sortSwatches(
  swatches: readonly PaletteSwatch[],
  sortBy: PaletteSort
): PaletteSwatch[] {
  const sorted = [...swatches]

  if (sortBy === "hue") {
    return sorted.sort((a, b) => a.hue - b.hue || b.count - a.count)
  }

  if (sortBy === "lightness") {
    return sorted.sort(
      (a, b) => a.lightness - b.lightness || a.hue - b.hue || b.count - a.count
    )
  }

  return sorted.sort((a, b) => b.count - a.count)
}

function formatPercent(value: number): string {
  if (value > 0 && value < 0.01) {
    return "<1%"
  }

  return `${Math.round(value * 100)}%`
}

function toHex(value: number): string {
  return clampChannel(value).toString(16).padStart(2, "0").toUpperCase()
}

export {
  clampChannel,
  createSwatches,
  formatHsl,
  formatPercent,
  formatRgb,
  getContrastColor,
  rgbToHex,
  rgbToHsl,
  sortSwatches,
}
