type RGBA = Readonly<{
  r: number
  g: number
  b: number
  a: number
}>

type ShadowConfig = Readonly<{
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}>

const MAX_CHANNEL = 255
const DEFAULT_SHADOW_CONFIG: ShadowConfig = {
  offsetX: 0,
  offsetY: 8,
  blur: 24,
  spread: 0,
  color: "#00000033",
  inset: false,
}
const FALLBACK_RGBA = "rgba(0, 0, 0, 0.2)"

function clampChannel(value: number) {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

function clampAlpha(value: number) {
  return Math.min(1, Math.max(0, value))
}

function clampPercentage(value: number) {
  return Math.min(100, Math.max(0, Math.round(value)))
}

function parseHexColor(value: string): RGBA | null {
  const normalized = value.trim().replace(/^#/, "")

  if (![3, 4, 6, 8].includes(normalized.length)) {
    return null
  }

  let expanded = normalized.toLowerCase()

  if (expanded.length === 3 || expanded.length === 4) {
    expanded = expanded
      .split("")
      .map((character) => `${character}${character}`)
      .join("")
  }

  if (expanded.length === 6) {
    expanded += "ff"
  }

  const r = Number.parseInt(expanded.slice(0, 2), 16)
  const g = Number.parseInt(expanded.slice(2, 4), 16)
  const b = Number.parseInt(expanded.slice(4, 6), 16)
  const a = Number.parseInt(expanded.slice(6, 8), 16)

  if ([r, g, b, a].some((channel) => Number.isNaN(channel))) {
    return null
  }

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(a / MAX_CHANNEL),
  }
}

function rgbaToHex(color: RGBA, includeAlpha = true) {
  const alphaChannel = clampChannel(color.a * MAX_CHANNEL)

  const channels = [
    clampChannel(color.r),
    clampChannel(color.g),
    clampChannel(color.b),
  ].map((channel) => channel.toString(16).padStart(2, "0").toUpperCase())

  if (includeAlpha) {
    channels.push(alphaChannel.toString(16).padStart(2, "0").toUpperCase())
  }

  return `#${channels.join("")}`
}

function formatRgba(color: RGBA) {
  const alpha = Number(clampAlpha(color.a).toFixed(3))
  return `rgba(${clampChannel(color.r)}, ${clampChannel(color.g)}, ${clampChannel(
    color.b
  )}, ${alpha})`
}

function formatShadowLayer(layer: ShadowConfig) {
  const parsedColor = parseHexColor(layer.color)
  const color = parsedColor ? formatRgba(parsedColor) : FALLBACK_RGBA
  const parts = [
    `${Math.round(layer.offsetX)}px`,
    `${Math.round(layer.offsetY)}px`,
    `${Math.max(0, Math.round(layer.blur))}px`,
    `${Math.round(layer.spread)}px`,
    color,
  ]

  if (layer.inset) {
    parts.unshift("inset")
  }

  return parts.join(" ")
}

function buildBoxShadow(layers: readonly ShadowConfig[]) {
  if (layers.length === 0) {
    return "none"
  }

  return layers.map(formatShadowLayer).join(", ")
}

function getOpaqueHexColor(value: string) {
  const parsed = parseHexColor(value)

  if (!parsed) {
    return rgbaToHex(parseHexColor(DEFAULT_SHADOW_CONFIG.color)!, false)
  }

  return rgbaToHex(parsed, false)
}

function getAlphaPercentage(value: string) {
  const parsed = parseHexColor(value)

  if (!parsed) {
    return clampPercentage(parseHexColor(DEFAULT_SHADOW_CONFIG.color)!.a * 100)
  }

  return clampPercentage(parsed.a * 100)
}

function updateHexColorRgb(currentColor: string, nextHex: string) {
  const reference =
    parseHexColor(currentColor) ?? parseHexColor(DEFAULT_SHADOW_CONFIG.color)!
  const nextColor = parseHexColor(nextHex)

  if (!nextColor) {
    return currentColor
  }

  return rgbaToHex(
    {
      ...nextColor,
      a: reference.a,
    },
    true
  )
}

function updateHexAlpha(currentColor: string, nextAlphaPercentage: number) {
  const reference =
    parseHexColor(currentColor) ?? parseHexColor(DEFAULT_SHADOW_CONFIG.color)!

  return rgbaToHex(
    {
      ...reference,
      a: clampPercentage(nextAlphaPercentage) / 100,
    },
    true
  )
}

function normalizeShadowConfig(
  config: Partial<ShadowConfig> = {}
): ShadowConfig {
  const color = parseHexColor(config.color ?? "")
    ? (config.color as string)
    : DEFAULT_SHADOW_CONFIG.color

  return {
    offsetX: Number.isFinite(config.offsetX)
      ? Math.round(config.offsetX as number)
      : DEFAULT_SHADOW_CONFIG.offsetX,
    offsetY: Number.isFinite(config.offsetY)
      ? Math.round(config.offsetY as number)
      : DEFAULT_SHADOW_CONFIG.offsetY,
    blur: Number.isFinite(config.blur)
      ? Math.max(0, Math.round(config.blur as number))
      : DEFAULT_SHADOW_CONFIG.blur,
    spread: Number.isFinite(config.spread)
      ? Math.round(config.spread as number)
      : DEFAULT_SHADOW_CONFIG.spread,
    color,
    inset:
      typeof config.inset === "boolean"
        ? config.inset
        : DEFAULT_SHADOW_CONFIG.inset,
  }
}

export {
  DEFAULT_SHADOW_CONFIG,
  buildBoxShadow,
  formatShadowLayer,
  getAlphaPercentage,
  getOpaqueHexColor,
  normalizeShadowConfig,
  parseHexColor,
  rgbaToHex,
  updateHexAlpha,
  updateHexColorRgb,
}
export type { ShadowConfig }
