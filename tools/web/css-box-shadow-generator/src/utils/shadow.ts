export type ShadowLayer = {
  id: string
  offsetX: number
  offsetY: number
  blur: number
  spread: number
  color: string
  inset: boolean
}

type RgbaColor = {
  r: number
  g: number
  b: number
  a: number
}

const MAX_CHANNEL = 255
const DEFAULT_COLOR = '#00000033'
const FALLBACK_RGBA = 'rgba(0, 0, 0, 0.2)'

export function createShadowLayer(overrides: Partial<Omit<ShadowLayer, 'id'>> = {}): ShadowLayer {
  return {
    id: createId(),
    offsetX: 0,
    offsetY: 8,
    blur: 24,
    spread: 0,
    color: DEFAULT_COLOR,
    inset: false,
    ...overrides,
  }
}

export function buildBoxShadow(layers: ShadowLayer[]): string {
  if (!layers.length) return 'none'
  return layers.map(formatShadowLayer).join(', ')
}

export function hexToRgba(value: string): string {
  const parsed = parseHexColor(value)
  if (!parsed) return FALLBACK_RGBA
  return formatRgba(parsed)
}

function createId(): string {
  return `shadow-${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36)}`
}

function formatShadowLayer(layer: ShadowLayer): string {
  const color = normalizeColor(layer.color)
  const parts = [
    `${layer.offsetX}px`,
    `${layer.offsetY}px`,
    `${layer.blur}px`,
    `${layer.spread}px`,
    color,
  ]

  if (layer.inset) parts.unshift('inset')

  return parts.join(' ')
}

function normalizeColor(color: string): string {
  const trimmed = color.trim()
  if (!trimmed) return FALLBACK_RGBA
  if (trimmed.startsWith('#')) return hexToRgba(trimmed)
  return FALLBACK_RGBA
}

function parseHexColor(value: string): RgbaColor | null {
  const hex = value.trim().replace(/^#/, '').toLowerCase()
  if (![3, 4, 6, 8].includes(hex.length)) return null

  let expanded = hex
  if (hex.length === 3 || hex.length === 4) {
    expanded = hex
      .split('')
      .map((char) => `${char}${char}`)
      .join('')
  }
  if (expanded.length === 6) expanded += 'ff'

  const r = parseInt(expanded.slice(0, 2), 16)
  const g = parseInt(expanded.slice(2, 4), 16)
  const b = parseInt(expanded.slice(4, 6), 16)
  const a = parseInt(expanded.slice(6, 8), 16)

  if ([r, g, b, a].some((channel) => Number.isNaN(channel))) return null

  return {
    r: clampChannel(r),
    g: clampChannel(g),
    b: clampChannel(b),
    a: clampAlpha(a / MAX_CHANNEL),
  }
}

function clampChannel(value: number): number {
  return Math.min(MAX_CHANNEL, Math.max(0, Math.round(value)))
}

function clampAlpha(value: number): number {
  return Math.min(1, Math.max(0, value))
}

function formatRgba(color: RgbaColor): string {
  const alpha = Number(clampAlpha(color.a).toFixed(3)).toString()
  return `rgba(${clampChannel(color.r)}, ${clampChannel(color.g)}, ${clampChannel(
    color.b,
  )}, ${alpha})`
}
