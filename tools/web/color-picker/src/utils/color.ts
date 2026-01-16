import convert from 'color-convert'
import type { RGBA } from '../types'

const MAX_CHANNEL = 255

export function clampChannel(value: number): number {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

export function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function parseHexToRgba(hex: string): RGBA | null {
  const trimmed = hex.trim().replace(/^#/, '')
  if (![3, 4, 6, 8].includes(trimmed.length)) return null

  let expanded = trimmed
  if (trimmed.length === 3 || trimmed.length === 4) {
    expanded = trimmed
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }
  if (expanded.length === 6) expanded += 'ff'

  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  const a = parseInt(expanded.slice(6, 8), 16)

  if ([r, g, b, a].some((value) => Number.isNaN(value))) return null

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(a / MAX_CHANNEL),
  }
}

export function rgbaToHex(rgba: RGBA, includeAlpha: boolean): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  const hex = convert.rgb.hex(r, g, b).toUpperCase()

  if (!includeAlpha) return `#${hex}`

  const alpha = Math.round(clampAlpha(rgba.a) * MAX_CHANNEL)
  const alphaHex = alpha.toString(16).padStart(2, '0').toUpperCase()
  return `#${hex}${alphaHex}`
}

function formatAlpha(value: number): string {
  return Number(clampAlpha(value).toFixed(3)).toString()
}

export function formatRgb(rgba: RGBA, includeAlpha: boolean): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  if (includeAlpha) {
    return `rgba(${r}, ${g}, ${b}, ${formatAlpha(rgba.a)})`
  }
  return `rgb(${r}, ${g}, ${b})`
}

export function formatHsl(rgba: RGBA, includeAlpha: boolean): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  const [h, s, l] = convert.rgb.hsl(r, g, b)
  if (includeAlpha) {
    return `hsla(${h}, ${s}%, ${l}%, ${formatAlpha(rgba.a)})`
  }
  return `hsl(${h}, ${s}%, ${l}%)`
}

export function formatHsv(rgba: RGBA, includeAlpha: boolean): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  const [h, s, v] = convert.rgb.hsv(r, g, b)
  if (includeAlpha) {
    return `hsva(${h}, ${s}%, ${v}%, ${formatAlpha(rgba.a)})`
  }
  return `hsv(${h}, ${s}%, ${v}%)`
}

export function formatCmyk(rgba: RGBA): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  const [c, m, y, k] = convert.rgb.cmyk(r, g, b)
  return `cmyk(${c}%, ${m}%, ${y}%, ${k}%)`
}

export function formatAlphaPercent(alpha: number): string {
  const value = Math.round(clampAlpha(alpha) * 100)
  return `${value}%`
}

export function toCssRgba(rgba: RGBA): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(rgba.a)})`
}
