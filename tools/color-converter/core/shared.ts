import colorNames from "color-name"

export type RGBA = Readonly<{
  r: number
  g: number
  b: number
  a: number
}>

export const MAX_CHANNEL = 255
export const NAMED_COLORS = colorNames as Record<
  string,
  readonly [number, number, number] | undefined
>
export const CSS_KEYWORDS = Object.keys(NAMED_COLORS).sort()

export function clampChannel(value: number) {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

export function clampAlpha(value: number) {
  return Math.min(1, Math.max(0, value))
}

export function toRgba(rgb: readonly number[], alpha = 1): RGBA {
  return {
    r: clampChannel(rgb[0] ?? 0),
    g: clampChannel(rgb[1] ?? 0),
    b: clampChannel(rgb[2] ?? 0),
    a: clampAlpha(alpha),
  }
}

export function formatAlpha(value: number) {
  return Number.parseFloat(clampAlpha(value).toFixed(3)).toString()
}

export function formatDecimal(value: number) {
  return Number.parseFloat(value.toFixed(1)).toString()
}

export function parseStrictNumber(value: string) {
  const trimmed = value.trim()
  if (!trimmed) return null
  if (!/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(trimmed)) return null
  return Number.parseFloat(trimmed)
}

export function splitFunctionalArgs(body: string) {
  const slashIndex = body.indexOf("/")
  let main = body
  let alpha: string | null = null

  if (slashIndex >= 0) {
    main = body.slice(0, slashIndex)
    alpha = body.slice(slashIndex + 1).trim()
  }

  const parts = main.split(/[\s,]+/).filter(Boolean)
  if (slashIndex < 0 && parts.length > 3) {
    alpha = parts.pop()!
  }

  return { parts, alpha }
}

export function splitArgs(body: string) {
  return body.split(/[\s,]+/).filter(Boolean)
}

export function parseAlpha(value: string | null) {
  if (value === null) return 1
  const trimmed = value.trim()
  if (!trimmed) return null
  if (trimmed.endsWith("%")) {
    const percent = parseStrictNumber(trimmed.slice(0, -1))
    return percent === null ? null : clampAlpha(percent / 100)
  }
  const parsed = parseStrictNumber(trimmed)
  return parsed === null ? null : clampAlpha(parsed)
}

export function parseHue(value: string) {
  const trimmed = value.trim().toLowerCase()
  const match = trimmed.match(
    /^([-+]?(?:\d+\.?\d*|\.\d+))(deg|grad|rad|turn)?$/
  )
  if (!match || !match[1]) return null

  const parsed = Number.parseFloat(match[1])

  switch (match[2]) {
    case "grad":
      return (parsed * 360) / 400
    case "rad":
      return (parsed * 180) / Math.PI
    case "turn":
      return parsed * 360
    default:
      return parsed
  }
}

export function parsePercentage(value: string) {
  const trimmed = value.trim()
  const numeric = trimmed.endsWith("%") ? trimmed.slice(0, -1) : trimmed
  return parseStrictNumber(numeric)
}

export function parseRgbChannel(value: string) {
  const trimmed = value.trim()
  if (trimmed.endsWith("%")) {
    const percent = parseStrictNumber(trimmed.slice(0, -1))
    return percent === null ? null : (percent / 100) * MAX_CHANNEL
  }
  return parseStrictNumber(trimmed)
}
