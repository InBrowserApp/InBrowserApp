import convert from 'color-convert'
import colorNames from 'color-name'

export type RGBA = {
  r: number
  g: number
  b: number
  a: number
}

const MAX_CHANNEL = 255
const WHITE: RGBA = { r: 255, g: 255, b: 255, a: 1 }

export function clampChannel(value: number): number {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

export function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value))
}

export function parseColor(input: string): RGBA | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  const hex = parseHexColor(trimmed)
  if (hex) return hex

  const rgb = parseRgbColor(trimmed)
  if (rgb) return rgb

  const hsl = parseHslColor(trimmed)
  if (hsl) return hsl

  const named = parseNamedColor(trimmed)
  if (named) return named

  return null
}

export function parseHexColor(hex: string): RGBA | null {
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

export function parseRgbColor(input: string): RGBA | null {
  const match = input.match(/^rgba?\((.+)\)$/i)
  if (!match) return null

  const { parts, alpha } = splitFunctionalArgs(match[1])
  if (parts.length !== 3) return null

  const channels = parts.map(parseRgbChannel)
  if (channels.some((value) => value === null)) return null

  const [r, g, b] = channels as number[]
  const alphaValue = parseAlpha(alpha)
  if (alphaValue === null) return null

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(alphaValue),
  }
}

export function parseHslColor(input: string): RGBA | null {
  const match = input.match(/^hsla?\((.+)\)$/i)
  if (!match) return null

  const { parts, alpha } = splitFunctionalArgs(match[1])
  if (parts.length !== 3) return null

  const hue = parseHue(parts[0])
  const saturation = parsePercentage(parts[1])
  const lightness = parsePercentage(parts[2])

  if (hue === null || saturation === null || lightness === null) return null

  const alphaValue = parseAlpha(alpha)
  if (alphaValue === null) return null

  const [r, g, b] = convert.hsl.rgb(hue, saturation, lightness)

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(alphaValue),
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

export function toCssRgba(rgba: RGBA): string {
  const r = clampChannel(rgba.r)
  const g = clampChannel(rgba.g)
  const b = clampChannel(rgba.b)
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(rgba.a)})`
}

export function blendOver(foreground: RGBA, background: RGBA): RGBA {
  const fgAlpha = clampAlpha(foreground.a)
  const bgAlpha = clampAlpha(background.a)
  const outAlpha = fgAlpha + bgAlpha * (1 - fgAlpha)

  if (outAlpha === 0) {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  const r =
    (clampChannel(foreground.r) * fgAlpha + clampChannel(background.r) * bgAlpha * (1 - fgAlpha)) /
    outAlpha
  const g =
    (clampChannel(foreground.g) * fgAlpha + clampChannel(background.g) * bgAlpha * (1 - fgAlpha)) /
    outAlpha
  const b =
    (clampChannel(foreground.b) * fgAlpha + clampChannel(background.b) * bgAlpha * (1 - fgAlpha)) /
    outAlpha

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(outAlpha),
  }
}

export function resolveContrastColors(
  foreground: RGBA,
  background: RGBA,
  canvas: RGBA = WHITE,
): { foreground: RGBA; background: RGBA } {
  const flatBackground = blendOver(background, canvas)
  const flatForeground = blendOver(foreground, flatBackground)

  return {
    foreground: { ...flatForeground, a: 1 },
    background: { ...flatBackground, a: 1 },
  }
}

export function relativeLuminance(rgba: RGBA): number {
  const r = linearizeChannel(clampChannel(rgba.r) / MAX_CHANNEL)
  const g = linearizeChannel(clampChannel(rgba.g) / MAX_CHANNEL)
  const b = linearizeChannel(clampChannel(rgba.b) / MAX_CHANNEL)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

export function contrastRatio(foreground: RGBA, background: RGBA, canvas: RGBA = WHITE): number {
  const resolved = resolveContrastColors(foreground, background, canvas)
  const fgLuminance = relativeLuminance(resolved.foreground)
  const bgLuminance = relativeLuminance(resolved.background)
  const lighter = Math.max(fgLuminance, bgLuminance)
  const darker = Math.min(fgLuminance, bgLuminance)
  return (lighter + 0.05) / (darker + 0.05)
}

function splitFunctionalArgs(body: string): { parts: string[]; alpha: string | null } {
  const slashIndex = body.indexOf('/')
  let main = body
  let alpha: string | null = null

  if (slashIndex >= 0) {
    main = body.slice(0, slashIndex)
    alpha = body.slice(slashIndex + 1).trim()
  }

  const parts = main.split(/[\s,]+/).filter(Boolean)

  if (!alpha && parts.length > 3) {
    alpha = parts.pop() as string
  }

  return { parts, alpha }
}

function parseRgbChannel(value: string): number | null {
  const trimmed = value.trim().toLowerCase()

  if (trimmed.endsWith('%')) {
    const percent = parseFloat(trimmed.slice(0, -1))
    if (Number.isNaN(percent)) return null
    return (percent / 100) * MAX_CHANNEL
  }

  const number = parseFloat(trimmed)
  if (Number.isNaN(number)) return null
  return number
}

function parseAlpha(value: string | null): number | null {
  if (!value) return 1
  const trimmed = value.trim().toLowerCase()

  if (trimmed.endsWith('%')) {
    const percent = parseFloat(trimmed.slice(0, -1))
    if (Number.isNaN(percent)) return null
    return percent / 100
  }

  const number = parseFloat(trimmed)
  if (Number.isNaN(number)) return null
  return number
}

function parseHue(value: string): number | null {
  const trimmed = value.trim().toLowerCase()

  let number: number
  if (trimmed.endsWith('deg')) {
    number = parseFloat(trimmed.slice(0, -3))
  } else if (trimmed.endsWith('turn')) {
    number = parseFloat(trimmed.slice(0, -4)) * 360
  } else if (trimmed.endsWith('grad')) {
    number = parseFloat(trimmed.slice(0, -4)) * 0.9
  } else if (trimmed.endsWith('rad')) {
    number = parseFloat(trimmed.slice(0, -3)) * (180 / Math.PI)
  } else {
    number = parseFloat(trimmed)
  }

  if (Number.isNaN(number)) return null

  const normalized = ((number % 360) + 360) % 360
  return normalized
}

function parsePercentage(value: string): number | null {
  const trimmed = value.trim()

  const numeric = trimmed.endsWith('%') ? parseFloat(trimmed.slice(0, -1)) : parseFloat(trimmed)
  if (Number.isNaN(numeric)) return null
  return Math.min(100, Math.max(0, numeric))
}

function parseNamedColor(input: string): RGBA | null {
  const lower = input.trim().toLowerCase()
  if (lower === 'transparent') {
    return { r: 0, g: 0, b: 0, a: 0 }
  }

  const named = colorNames[lower]
  if (!named) return null

  return {
    r: clampChannel(named[0]),
    g: clampChannel(named[1]),
    b: clampChannel(named[2]),
    a: 1,
  }
}

function linearizeChannel(channel: number): number {
  if (channel <= 0.03928) return channel / 12.92
  return ((channel + 0.055) / 1.055) ** 2.4
}

function formatAlpha(value: number): string {
  return Number(clampAlpha(value).toFixed(3)).toString()
}
