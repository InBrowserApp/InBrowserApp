import convert from "color-convert"

import {
  CSS_KEYWORDS,
  MAX_CHANNEL,
  clampAlpha,
  clampChannel,
  formatAlpha,
  formatDecimal,
} from "./shared"

import type { RGBA } from "./shared"

export type { RGBA } from "./shared"
export { CSS_KEYWORDS } from "./shared"
export {
  parseCmykColor,
  parseHexColor,
  parseHslColor,
  parseHsvColor,
  parseHwbColor,
  parseKeywordColor,
  parseLabColor,
  parseLchColor,
  parseRgbColor,
} from "./parse"

export function formatHex(rgba: RGBA, includeAlpha = false) {
  const rgb = convert.rgb.hex(
    clampChannel(rgba.r),
    clampChannel(rgba.g),
    clampChannel(rgba.b)
  )

  if (!includeAlpha) {
    return `#${rgb}`
  }

  const alpha = Math.round(clampAlpha(rgba.a) * MAX_CHANNEL)
    .toString(16)
    .padStart(2, "0")
    .toUpperCase()

  return `#${rgb}${alpha}`
}

export function formatRgb(rgba: RGBA, includeAlpha = false) {
  const base = `rgb(${clampChannel(rgba.r)}, ${clampChannel(rgba.g)}, ${clampChannel(rgba.b)})`
  if (!includeAlpha) return base
  return base.replace("rgb", "rgba").replace(")", `, ${formatAlpha(rgba.a)})`)
}

export function formatHsl(rgba: RGBA, includeAlpha = false) {
  const [h, s, l] = convert.rgb.hsl(rgba.r, rgba.g, rgba.b)
  const base = `hsl(${h}, ${s}%, ${l}%)`
  if (!includeAlpha) return base
  return base.replace("hsl", "hsla").replace(")", `, ${formatAlpha(rgba.a)})`)
}

export function formatHsv(rgba: RGBA, includeAlpha = false) {
  const [h, s, v] = convert.rgb.hsv(rgba.r, rgba.g, rgba.b)
  const base = `hsv(${h}, ${s}%, ${v}%)`
  if (!includeAlpha) return base
  return base.replace("hsv", "hsva").replace(")", `, ${formatAlpha(rgba.a)})`)
}

export function formatHwb(rgba: RGBA) {
  const [h, w, b] = convert.rgb.hwb(rgba.r, rgba.g, rgba.b)
  return `hwb(${h}, ${w}%, ${b}%)`
}

export function formatLab(rgba: RGBA) {
  const [l, a, b] = convert.rgb.lab.raw(rgba.r, rgba.g, rgba.b)
  return `lab(${formatDecimal(l)}, ${formatDecimal(a)}, ${formatDecimal(b)})`
}

export function formatLch(rgba: RGBA) {
  const [l, c, h] = convert.rgb.lch.raw(rgba.r, rgba.g, rgba.b)
  return `lch(${formatDecimal(l)}, ${formatDecimal(c)}, ${formatDecimal(h)})`
}

export function formatCmyk(rgba: RGBA) {
  const [c, m, y, k] = convert.rgb.cmyk(rgba.r, rgba.g, rgba.b)
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
}

export function formatKeyword(rgba: RGBA) {
  return convert.rgb.keyword(rgba.r, rgba.g, rgba.b) as string
}
