import convert from "color-convert"

import {
  MAX_CHANNEL,
  NAMED_COLORS,
  parseAlpha,
  parseHue,
  parsePercentage,
  parseRgbChannel,
  parseStrictNumber,
  splitArgs,
  splitFunctionalArgs,
  toRgba,
} from "./shared"

import type { RGBA } from "./shared"

export function parseHexColor(input: string): RGBA | null {
  const trimmed = input.trim().replace(/^#/, "")
  if (![3, 4, 6, 8].includes(trimmed.length)) return null

  let expanded = trimmed
  if (trimmed.length === 3 || trimmed.length === 4) {
    expanded = trimmed
      .split("")
      .map((char) => `${char}${char}`)
      .join("")
  }
  if (expanded.length === 6) {
    expanded += "ff"
  }

  const r = Number.parseInt(expanded.slice(0, 2), 16)
  const g = Number.parseInt(expanded.slice(2, 4), 16)
  const b = Number.parseInt(expanded.slice(4, 6), 16)
  const a = Number.parseInt(expanded.slice(6, 8), 16)

  if ([r, g, b, a].some((value) => Number.isNaN(value))) return null
  return toRgba([r, g, b], a / MAX_CHANNEL)
}

export function parseRgbColor(input: string): RGBA | null {
  const match = input.match(/^rgba?\((.+)\)$/i)
  if (!match) return null

  const { parts, alpha } = splitFunctionalArgs(match[1]!)
  if (parts.length !== 3) return null

  const channels = parts.map(parseRgbChannel)
  const parsedAlpha = parseAlpha(alpha)
  if (channels.some((value) => value === null) || parsedAlpha === null) {
    return null
  }

  return toRgba(channels as number[], parsedAlpha)
}

export function parseHslColor(input: string): RGBA | null {
  const match = input.match(/^hsla?\((.+)\)$/i)
  if (!match) return null

  const { parts, alpha } = splitFunctionalArgs(match[1]!)
  if (parts.length !== 3) return null

  const hue = parseHue(parts[0]!)
  const saturation = parsePercentage(parts[1]!)
  const lightness = parsePercentage(parts[2]!)
  const parsedAlpha = parseAlpha(alpha)
  if (
    hue === null ||
    saturation === null ||
    lightness === null ||
    parsedAlpha === null
  ) {
    return null
  }

  return toRgba(convert.hsl.rgb(hue, saturation, lightness), parsedAlpha)
}

export function parseHsvColor(input: string): RGBA | null {
  const match = input.match(/^hsva?\((.+)\)$/i)
  if (!match) return null

  const { parts, alpha } = splitFunctionalArgs(match[1]!)
  if (parts.length !== 3) return null

  const hue = parseHue(parts[0]!)
  const saturation = parsePercentage(parts[1]!)
  const value = parsePercentage(parts[2]!)
  const parsedAlpha = parseAlpha(alpha)
  if (
    hue === null ||
    saturation === null ||
    value === null ||
    parsedAlpha === null
  ) {
    return null
  }

  return toRgba(convert.hsv.rgb(hue, saturation, value), parsedAlpha)
}

export function parseHwbColor(input: string): RGBA | null {
  const match = input.match(/^hwb\((.+)\)$/i)
  if (!match) return null

  const parts = splitArgs(match[1]!)
  if (parts.length !== 3) return null

  const hue = parseHue(parts[0]!)
  const whiteness = parsePercentage(parts[1]!)
  const blackness = parsePercentage(parts[2]!)
  if (hue === null || whiteness === null || blackness === null) return null

  return toRgba(convert.hwb.rgb(hue, whiteness, blackness))
}

export function parseLabColor(input: string): RGBA | null {
  const match = input.match(/^lab\((.+)\)$/i)
  if (!match) return null

  const parts = splitArgs(match[1]!)
  if (parts.length !== 3) return null

  const l = parseStrictNumber(parts[0]!)
  const a = parseStrictNumber(parts[1]!)
  const b = parseStrictNumber(parts[2]!)
  if (l === null || a === null || b === null || l < 0 || l > 100) {
    return null
  }

  return toRgba(convert.lab.rgb(l, a, b))
}

export function parseLchColor(input: string): RGBA | null {
  const match = input.match(/^lch\((.+)\)$/i)
  if (!match) return null

  const parts = splitArgs(match[1]!)
  if (parts.length !== 3) return null

  const l = parseStrictNumber(parts[0]!)
  const c = parseStrictNumber(parts[1]!)
  const h = parseStrictNumber(parts[2]!)
  if (
    l === null ||
    c === null ||
    h === null ||
    l < 0 ||
    l > 100 ||
    c < 0 ||
    h < 0 ||
    h > 360
  ) {
    return null
  }

  return toRgba(convert.lch.rgb(l, c, h))
}

export function parseCmykColor(input: string): RGBA | null {
  const match = input.match(/^cmyk\((.+)\)$/i)
  if (!match) return null

  const values = splitArgs(match[1]!).map(parsePercentage)
  if (
    values.length !== 4 ||
    values.some((value) => value === null || value < 0 || value > 100)
  ) {
    return null
  }

  return toRgba(
    convert.cmyk.rgb(...(values as [number, number, number, number]))
  )
}

export function parseKeywordColor(input: string): RGBA | null {
  const keyword = input.trim().toLowerCase()
  const rgb = NAMED_COLORS[keyword]
  return rgb ? toRgba(rgb) : null
}
