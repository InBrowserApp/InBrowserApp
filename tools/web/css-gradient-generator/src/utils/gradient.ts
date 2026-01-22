import type {
  BlendMode,
  ColorFormat,
  ColorSpace,
  GradientLayer,
  GradientLayerSeed,
  GradientStop,
  GradientStopSeed,
  GradientType,
  RadialShape,
  RadialSize,
} from '../types'

const GRADIENT_TYPES: GradientType[] = ['linear', 'radial', 'conic']
const RADIAL_SHAPES: RadialShape[] = ['circle', 'ellipse']
const RADIAL_SIZES: RadialSize[] = [
  'closest-side',
  'closest-corner',
  'farthest-side',
  'farthest-corner',
]
const COLOR_SPACES: ColorSpace[] = ['srgb', 'oklch']
const BLEND_MODES: BlendMode[] = [
  'normal',
  'multiply',
  'screen',
  'overlay',
  'darken',
  'lighten',
  'color-dodge',
  'color-burn',
  'hard-light',
  'soft-light',
  'difference',
  'exclusion',
  'hue',
  'saturation',
  'color',
  'luminosity',
]

const DEFAULT_STOPS: GradientStopSeed[] = [
  { color: '#0EA5E9FF', position: 0 },
  { color: '#8B5CFFFF', position: 52 },
  { color: '#F43F5EFF', position: 100 },
]

const DEFAULT_LAYER: Omit<GradientLayer, 'id' | 'stops'> = {
  type: 'linear',
  angle: 135,
  centerX: 50,
  centerY: 50,
  radialShape: 'circle',
  radialSize: 'farthest-corner',
  colorSpace: 'srgb',
  blendMode: 'normal',
}

const BLEND_MODE_MAP: Record<BlendMode, GlobalCompositeOperation> = {
  normal: 'source-over',
  multiply: 'multiply',
  screen: 'screen',
  overlay: 'overlay',
  darken: 'darken',
  lighten: 'lighten',
  'color-dodge': 'color-dodge',
  'color-burn': 'color-burn',
  'hard-light': 'hard-light',
  'soft-light': 'soft-light',
  difference: 'difference',
  exclusion: 'exclusion',
  hue: 'hue',
  saturation: 'saturation',
  color: 'color',
  luminosity: 'luminosity',
}

let idSeed = 0

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  useGrouping: false,
})

export const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max)

const isHexString = (value: string) => /^[0-9a-fA-F]+$/.test(value)

const normalizeHex = (value: string) => {
  const raw = value.replace(/^#/, '').trim()
  if (!raw) return '000000FF'
  if (!isHexString(raw)) return '000000FF'
  if (raw.length === 3) {
    const [r, g, b] = raw
    return `${r}${r}${g}${g}${b}${b}FF`.toUpperCase()
  }
  if (raw.length === 4) {
    const [r, g, b, a] = raw
    return `${r}${r}${g}${g}${b}${b}${a}${a}`.toUpperCase()
  }
  if (raw.length === 6) return `${raw}FF`.toUpperCase()
  if (raw.length >= 8) return raw.slice(0, 8).toUpperCase()
  return '000000FF'
}

export const normalizeHexColor = (value: string) => `#${normalizeHex(value)}`

export const hexToRgba = (value: string) => {
  const hex = normalizeHex(value)
  const r = Number.parseInt(hex.slice(0, 2), 16)
  const g = Number.parseInt(hex.slice(2, 4), 16)
  const b = Number.parseInt(hex.slice(4, 6), 16)
  const a = Number.parseInt(hex.slice(6, 8), 16) / 255
  return { r, g, b, a }
}

export const formatNumber = (value: number, max = 2) =>
  numberFormatter.format(Math.round(value * 10 ** max) / 10 ** max)

export const formatPercent = (value: number) => `${formatNumber(clamp(value, 0, 100))}%`

const formatAlpha = (value: number) => {
  const rounded = Math.round(value * 1000) / 1000
  return rounded.toFixed(3).replace(/\.?0+$/, '')
}

export const formatColor = (value: string, format: ColorFormat) => {
  const hex = normalizeHex(value)
  if (format === 'hex') {
    const alpha = hex.slice(6, 8)
    return alpha === 'FF' ? `#${hex.slice(0, 6)}` : `#${hex}`
  }
  const { r, g, b, a } = hexToRgba(hex)
  return `rgba(${r}, ${g}, ${b}, ${formatAlpha(a)})`
}

export const createId = (prefix = 'id') => {
  idSeed += 1
  return `${prefix}-${idSeed}`
}

export const createStop = (color: string, position: number, id?: string): GradientStop => ({
  id: id ?? createId('stop'),
  color: normalizeHexColor(color),
  position: clamp(position, 0, 100),
})

export const sortStops = (stops: GradientStop[]) =>
  [...stops].sort((a, b) => a.position - b.position)

export const createLayer = (
  overrides: Partial<GradientLayer> & { stops?: GradientStopSeed[] } = {},
): GradientLayer => {
  const stops = (overrides.stops?.length ? overrides.stops : DEFAULT_STOPS).map((stop) =>
    createStop(stop.color, stop.position),
  )

  return {
    ...DEFAULT_LAYER,
    ...overrides,
    id: overrides.id ?? createId('layer'),
    stops: sortStops(stops),
  }
}

export const createLayerFromSeed = (seed: GradientLayerSeed): GradientLayer =>
  createLayer({ ...seed, stops: seed.stops })

export const cloneLayerWithNewIds = (layer: GradientLayer): GradientLayer => ({
  ...layer,
  id: createId('layer'),
  stops: layer.stops.map((stop) => createStop(stop.color, stop.position)),
})

export const getNearestStopColor = (stops: GradientStop[], position: number) => {
  if (stops.length === 0) return '#FFFFFFFF'
  let nearest = stops[0]
  let distance = Math.abs(position - nearest.position)
  for (const stop of stops) {
    const nextDistance = Math.abs(position - stop.position)
    if (nextDistance < distance) {
      nearest = stop
      distance = nextDistance
    }
  }
  return nearest.color
}

const toValidType = (value: unknown, fallback: GradientType): GradientType =>
  GRADIENT_TYPES.includes(value as GradientType) ? (value as GradientType) : fallback

const toValidShape = (value: unknown, fallback: RadialShape): RadialShape =>
  RADIAL_SHAPES.includes(value as RadialShape) ? (value as RadialShape) : fallback

const toValidSize = (value: unknown, fallback: RadialSize): RadialSize =>
  RADIAL_SIZES.includes(value as RadialSize) ? (value as RadialSize) : fallback

const toValidColorSpace = (value: unknown, fallback: ColorSpace): ColorSpace =>
  COLOR_SPACES.includes(value as ColorSpace) ? (value as ColorSpace) : fallback

const toValidBlendMode = (value: unknown, fallback: BlendMode): BlendMode =>
  BLEND_MODES.includes(value as BlendMode) ? (value as BlendMode) : fallback

const toNumber = (value: unknown, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const normalizeStops = (stops: GradientStopSeed[] | undefined) => {
  if (!Array.isArray(stops) || stops.length < 2) {
    return DEFAULT_STOPS.map((stop) => createStop(stop.color, stop.position))
  }
  return sortStops(
    stops.map((stop, index) => {
      const fallback = DEFAULT_STOPS[Math.min(index, DEFAULT_STOPS.length - 1)]
      const color = stop?.color ?? fallback.color
      const position = Number.isFinite(stop?.position) ? Number(stop.position) : fallback.position
      return createStop(color, position)
    }),
  )
}

export const normalizeLayer = (raw: Partial<GradientLayer> & { stops?: GradientStopSeed[] }) => {
  return {
    ...DEFAULT_LAYER,
    type: toValidType(raw.type, DEFAULT_LAYER.type),
    angle: clamp(toNumber(raw.angle, DEFAULT_LAYER.angle), 0, 360),
    centerX: clamp(toNumber(raw.centerX, DEFAULT_LAYER.centerX), 0, 100),
    centerY: clamp(toNumber(raw.centerY, DEFAULT_LAYER.centerY), 0, 100),
    radialShape: toValidShape(raw.radialShape, DEFAULT_LAYER.radialShape),
    radialSize: toValidSize(raw.radialSize, DEFAULT_LAYER.radialSize),
    colorSpace: toValidColorSpace(raw.colorSpace, DEFAULT_LAYER.colorSpace),
    blendMode: toValidBlendMode(raw.blendMode, DEFAULT_LAYER.blendMode),
    id: createId('layer'),
    stops: normalizeStops(raw.stops),
  }
}

export const createGradientCss = (layer: GradientLayer, format: ColorFormat) => {
  const stops = sortStops(layer.stops)
    .map((stop) => `${formatColor(stop.color, format)} ${formatPercent(stop.position)}`)
    .join(', ')

  const colorSpace = layer.colorSpace === 'oklch' ? 'in oklch' : ''

  if (layer.type === 'linear') {
    const parts = [`${Math.round(layer.angle)}deg`, colorSpace].filter(Boolean).join(' ')
    return `linear-gradient(${parts}, ${stops})`
  }

  if (layer.type === 'radial') {
    const position = `at ${formatPercent(layer.centerX)} ${formatPercent(layer.centerY)}`
    const parts = [`${layer.radialShape} ${layer.radialSize}`, position, colorSpace].filter(Boolean)
    return `radial-gradient(${parts.join(' ')}, ${stops})`
  }

  const position = `at ${formatPercent(layer.centerX)} ${formatPercent(layer.centerY)}`
  const parts = [`from ${Math.round(layer.angle)}deg`, position, colorSpace].filter(Boolean)
  return `conic-gradient(${parts.join(' ')}, ${stops})`
}

export const createBackgroundImage = (layers: GradientLayer[], format: ColorFormat) =>
  layers.map((layer) => createGradientCss(layer, format)).join(', ')

export const createBlendModeCss = (layers: GradientLayer[]) =>
  layers.length > 1 ? layers.map((layer) => layer.blendMode).join(', ') : ''

export const serializeGradientConfig = (layers: GradientLayer[]) =>
  JSON.stringify({ version: 1, layers }, null, 2)

export const parseGradientConfig = (value: string) => {
  try {
    const parsed = JSON.parse(value)
    const rawLayers = Array.isArray(parsed) ? parsed : parsed?.layers
    if (!Array.isArray(rawLayers) || rawLayers.length === 0) return null
    return rawLayers.map((layer) => normalizeLayer(layer))
  } catch {
    return null
  }
}

const randomBetween = (min: number, max: number) => min + Math.random() * (max - min)

const randomColor = () => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')
  return `#${hex.toUpperCase()}FF`
}

const randomStops = (count: number) => {
  const positions = [0, 100]
  for (let i = 0; i < count - 2; i += 1) {
    positions.push(randomBetween(5, 95))
  }
  positions.sort((a, b) => a - b)
  return positions.map((position) => createStop(randomColor(), position))
}

export const randomizeLayer = (layer: GradientLayer) => {
  const count = 3 + Math.floor(Math.random() * 3)
  const nextStops = randomStops(count)
  return {
    ...layer,
    angle: Math.round(randomBetween(0, 360)),
    centerX: Math.round(randomBetween(10, 90)),
    centerY: Math.round(randomBetween(10, 90)),
    colorSpace: Math.random() > 0.5 ? 'srgb' : 'oklch',
    radialShape: Math.random() > 0.5 ? 'circle' : 'ellipse',
    radialSize: RADIAL_SIZES[Math.floor(Math.random() * RADIAL_SIZES.length)] ?? layer.radialSize,
    stops: nextStops,
  }
}

const getLinearPoints = (width: number, height: number, angle: number) => {
  const rad = ((angle - 90) * Math.PI) / 180
  const vx = Math.cos(rad)
  const vy = Math.sin(rad)
  const halfWidth = width / 2
  const halfHeight = height / 2
  const tX = vx === 0 ? Number.POSITIVE_INFINITY : halfWidth / Math.abs(vx)
  const tY = vy === 0 ? Number.POSITIVE_INFINITY : halfHeight / Math.abs(vy)
  const t = Math.min(tX, tY)
  return {
    x0: halfWidth - vx * t,
    y0: halfHeight - vy * t,
    x1: halfWidth + vx * t,
    y1: halfHeight + vy * t,
  }
}

const getCornerDistances = (width: number, height: number, cx: number, cy: number) => {
  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ]

  return corners.map((corner) => {
    const dx = corner.x - cx
    const dy = corner.y - cy
    return Math.sqrt(dx * dx + dy * dy)
  })
}

const getCircleRadius = (
  layer: GradientLayer,
  width: number,
  height: number,
  cx: number,
  cy: number,
) => {
  const left = cx
  const right = width - cx
  const top = cy
  const bottom = height - cy

  if (layer.radialSize === 'closest-side') return Math.min(left, right, top, bottom)
  if (layer.radialSize === 'farthest-side') return Math.max(left, right, top, bottom)

  const distances = getCornerDistances(width, height, cx, cy)
  return layer.radialSize === 'closest-corner' ? Math.min(...distances) : Math.max(...distances)
}

const getEllipseRadii = (
  layer: GradientLayer,
  width: number,
  height: number,
  cx: number,
  cy: number,
) => {
  const left = cx
  const right = width - cx
  const top = cy
  const bottom = height - cy
  const ratio = height === 0 ? 1 : width / height

  if (layer.radialSize === 'closest-side') {
    return { rx: Math.min(left, right), ry: Math.min(top, bottom) }
  }

  if (layer.radialSize === 'farthest-side') {
    return { rx: Math.max(left, right), ry: Math.max(top, bottom) }
  }

  const corners = [
    { x: 0, y: 0 },
    { x: width, y: 0 },
    { x: 0, y: height },
    { x: width, y: height },
  ]

  const radii = corners.map((corner) => {
    const dx = Math.abs(corner.x - cx)
    const dy = Math.abs(corner.y - cy)
    const ry = Math.sqrt((dx * dx) / (ratio * ratio) + dy * dy)
    return { rx: ratio * ry, ry }
  })

  if (layer.radialSize === 'closest-corner') {
    return radii.reduce((min, current) => (current.rx < min.rx ? current : min))
  }

  return radii.reduce((max, current) => (current.rx > max.rx ? current : max))
}

export const drawLayersToCanvas = (
  ctx: CanvasRenderingContext2D,
  layers: GradientLayer[],
  width: number,
  height: number,
) => {
  ctx.clearRect(0, 0, width, height)

  for (const [index, layer] of layers.entries()) {
    ctx.globalCompositeOperation = index === 0 ? 'source-over' : BLEND_MODE_MAP[layer.blendMode]

    if (layer.type === 'linear') {
      const { x0, y0, x1, y1 } = getLinearPoints(width, height, layer.angle)
      const gradient = ctx.createLinearGradient(x0, y0, x1, y1)
      for (const stop of sortStops(layer.stops)) {
        gradient.addColorStop(clamp(stop.position / 100, 0, 1), formatColor(stop.color, 'rgba'))
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      continue
    }

    const cx = (layer.centerX / 100) * width
    const cy = (layer.centerY / 100) * height

    if (layer.type === 'conic') {
      if (typeof ctx.createConicGradient !== 'function') return false
      const startAngle = ((layer.angle - 90) * Math.PI) / 180
      const gradient = ctx.createConicGradient(startAngle, cx, cy)
      for (const stop of sortStops(layer.stops)) {
        gradient.addColorStop(clamp(stop.position / 100, 0, 1), formatColor(stop.color, 'rgba'))
      }
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)
      continue
    }

    if (layer.type === 'radial') {
      const radii =
        layer.radialShape === 'circle'
          ? { rx: getCircleRadius(layer, width, height, cx, cy), ry: 0 }
          : getEllipseRadii(layer, width, height, cx, cy)
      const rx = radii.rx
      const ry = layer.radialShape === 'circle' ? radii.rx : radii.ry

      if (!rx || !ry) continue

      ctx.save()
      ctx.translate(cx, cy)
      ctx.scale(rx, ry)
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, 1)
      for (const stop of sortStops(layer.stops)) {
        gradient.addColorStop(clamp(stop.position / 100, 0, 1), formatColor(stop.color, 'rgba'))
      }
      ctx.fillStyle = gradient
      ctx.fillRect(-cx / rx, -cy / ry, width / rx, height / ry)
      ctx.restore()
    }
  }

  return true
}
