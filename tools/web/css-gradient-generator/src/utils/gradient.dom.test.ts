import { describe, it, expect, vi } from 'vitest'
import {
  createGradientCss,
  createLayer,
  drawLayersToCanvas,
  formatColor,
  getNearestStopColor,
  normalizeHexColor,
  parseGradientConfig,
  randomizeLayer,
} from './gradient'
import type { GradientLayer } from '../types'

const createMockGradient = () => ({
  addColorStop: vi.fn(),
})

const createMockContext = () => {
  return {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    translate: vi.fn(),
    scale: vi.fn(),
    createLinearGradient: vi.fn(() => createMockGradient()),
    createRadialGradient: vi.fn(() => createMockGradient()),
    createConicGradient: vi.fn(() => createMockGradient()),
    globalCompositeOperation: 'source-over',
  } as unknown as CanvasRenderingContext2D
}

describe('gradient utils', () => {
  it('normalizes and formats hex colors', () => {
    expect(normalizeHexColor('#abc')).toBe('#AABBCCFF')
    expect(formatColor('#AABBCCFF', 'hex')).toBe('#AABBCC')
    expect(formatColor('#AABBCC80', 'hex')).toBe('#AABBCC80')
    expect(formatColor('#AABBCC80', 'rgba')).toContain('rgba(170, 187, 204')
  })

  it('creates gradient CSS strings for different types', () => {
    const linear = createLayer({
      type: 'linear',
      angle: 90,
      colorSpace: 'oklch',
      stops: [
        { color: '#000000', position: 0 },
        { color: '#FFFFFF', position: 100 },
      ],
    })
    const radial = createLayer({
      type: 'radial',
      radialShape: 'ellipse',
      radialSize: 'closest-side',
      centerX: 30,
      centerY: 70,
      stops: [
        { color: '#111111', position: 10 },
        { color: '#EEEEEE', position: 90 },
      ],
    })
    const conic = createLayer({
      type: 'conic',
      angle: 45,
      stops: [
        { color: '#FF0000', position: 0 },
        { color: '#00FF00', position: 100 },
      ],
    })

    const linearCss = createGradientCss(linear, 'hex')
    const radialCss = createGradientCss(radial, 'hex')
    const conicCss = createGradientCss(conic, 'hex')

    expect(linearCss).toContain('linear-gradient')
    expect(linearCss).toContain('in oklch')
    expect(radialCss).toContain('radial-gradient')
    expect(conicCss).toContain('conic-gradient')
  })

  it('parses gradient config and normalizes stops', () => {
    const parsed = parseGradientConfig(
      JSON.stringify({
        layers: [
          {
            type: 'linear',
            angle: 120,
            centerX: 50,
            centerY: 50,
            radialShape: 'circle',
            radialSize: 'closest-side',
            colorSpace: 'srgb',
            blendMode: 'normal',
            stops: [{ color: '#123456', position: 40 }],
          },
        ],
      }),
    )

    expect(parsed).toBeTruthy()
    expect(parsed?.length).toBe(1)
    expect(parsed?.[0]?.stops.length).toBeGreaterThanOrEqual(2)

    expect(parseGradientConfig('not-json')).toBeNull()
  })

  it('randomizes layers while keeping the id', () => {
    const layer = createLayer()
    const randomized = randomizeLayer(layer)
    expect(randomized.id).toBe(layer.id)
    expect(randomized.stops.length).toBeGreaterThanOrEqual(3)
  })

  it('draws multiple gradient types on canvas', () => {
    const ctx = createMockContext()
    const layers: GradientLayer[] = [
      createLayer({
        type: 'linear',
        angle: 0,
        stops: [
          { color: '#000000', position: 0 },
          { color: '#FFFFFF', position: 100 },
        ],
      }),
      createLayer({
        type: 'radial',
        radialShape: 'circle',
        radialSize: 'closest-corner',
        stops: [
          { color: '#FF0000', position: 0 },
          { color: '#0000FF', position: 100 },
        ],
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'farthest-corner',
        stops: [
          { color: '#00FF00', position: 0 },
          { color: '#000000', position: 100 },
        ],
      }),
      createLayer({
        type: 'conic',
        angle: 90,
        stops: [
          { color: '#FF00FF', position: 0 },
          { color: '#00FFFF', position: 100 },
        ],
      }),
    ]

    expect(drawLayersToCanvas(ctx, layers, 400, 240)).toBe(true)
  })

  it('returns false when conic gradients are unsupported', () => {
    const ctx = createMockContext()
    delete (ctx as unknown as { createConicGradient?: unknown }).createConicGradient

    const layer = createLayer({
      type: 'conic',
      angle: 0,
      stops: [
        { color: '#111111', position: 0 },
        { color: '#EEEEEE', position: 100 },
      ],
    })

    expect(drawLayersToCanvas(ctx, [layer], 300, 200)).toBe(false)
  })

  it('handles invalid hex values and shorthand color forms', () => {
    expect(normalizeHexColor('')).toBe('#000000FF')
    expect(normalizeHexColor('not-hex')).toBe('#000000FF')
    expect(normalizeHexColor('#abcd')).toBe('#AABBCCDD')
    expect(normalizeHexColor('#123456789A')).toBe('#12345678')
    expect(normalizeHexColor('#12')).toBe('#000000FF')
  })

  it('returns nearest stop colors and defaults when no stops exist', () => {
    expect(getNearestStopColor([], 50)).toBe('#FFFFFFFF')

    const layer = createLayer({
      stops: [
        { color: '#000000', position: 0 },
        { color: '#FF0000', position: 40 },
        { color: '#FFFFFF', position: 100 },
      ],
    })

    expect(getNearestStopColor(layer.stops, 10)).toBe(layer.stops[0]?.color)
    expect(getNearestStopColor(layer.stops, 35)).toBe(layer.stops[1]?.color)
    expect(getNearestStopColor(layer.stops, 99)).toBe(layer.stops[2]?.color)
  })

  it('parses array configs and normalizes invalid layer values', () => {
    const parsed = parseGradientConfig(
      JSON.stringify([
        {
          type: 'invalid-type',
          angle: 'oops',
          centerX: 'bad',
          centerY: Number.POSITIVE_INFINITY,
          radialShape: 'triangle',
          radialSize: 'gigantic',
          colorSpace: 'display-p3',
          blendMode: 'xor',
          stops: [
            { color: null, position: Number.NaN },
            { color: '#112233', position: 40 },
          ],
        },
        {
          type: 'radial',
        },
      ]),
    )

    expect(parsed).toHaveLength(2)
    const first = parsed?.[0]
    const second = parsed?.[1]

    expect(first?.type).toBe('linear')
    expect(first?.radialShape).toBe('circle')
    expect(first?.radialSize).toBe('farthest-corner')
    expect(first?.colorSpace).toBe('srgb')
    expect(first?.blendMode).toBe('normal')
    expect(first?.angle).toBe(135)
    expect(first?.centerX).toBe(50)
    expect(first?.centerY).toBe(0)
    expect(first?.stops[0]?.color).toBe('#0EA5E9FF')
    expect(first?.stops[0]?.position).toBe(0)

    expect(second?.stops.length).toBeGreaterThanOrEqual(2)
    expect(parseGradientConfig(JSON.stringify([]))).toBeNull()
    expect(parseGradientConfig(JSON.stringify({ layers: [] }))).toBeNull()
  })

  it('falls back to the previous radial size when random index is out of range', () => {
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(1)
    const layer = createLayer({ radialSize: 'closest-side' })

    const randomized = randomizeLayer(layer)

    expect(randomized.radialSize).toBe('closest-side')
    randomSpy.mockRestore()
  })

  it('covers corner radius branches and ignores unknown layer types', () => {
    const ctx = createMockContext()
    const layers: GradientLayer[] = [
      createLayer({
        type: 'linear',
        angle: 90,
        stops: [
          { color: '#000000', position: 0 },
          { color: '#FFFFFF', position: 100 },
        ],
      }),
      createLayer({
        type: 'radial',
        radialShape: 'circle',
        radialSize: 'farthest-corner',
        centerX: 5,
        centerY: 5,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'closest-corner',
        centerX: 90,
        centerY: 90,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'farthest-corner',
        centerX: 10,
        centerY: 10,
      }),
      createLayer({
        type: 'linear',
        angle: 0,
      }) as GradientLayer,
    ]

    layers[4].type = 'unknown' as GradientLayer['type']

    expect(drawLayersToCanvas(ctx, layers, 300, 200)).toBe(true)
    expect(ctx.createRadialGradient).toHaveBeenCalled()
    expect(ctx.createLinearGradient).toHaveBeenCalled()
  })

  it('draws side-sized radial layers and skips zero-radius rendering', () => {
    const ctx = createMockContext()
    const radialLayers: GradientLayer[] = [
      createLayer({
        type: 'radial',
        radialShape: 'circle',
        radialSize: 'closest-side',
        centerX: 25,
        centerY: 20,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'circle',
        radialSize: 'farthest-side',
        centerX: 75,
        centerY: 80,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'closest-side',
        centerX: 30,
        centerY: 40,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'farthest-side',
        centerX: 60,
        centerY: 50,
      }),
      createLayer({
        type: 'radial',
        radialShape: 'ellipse',
        radialSize: 'closest-corner',
        centerX: 40,
        centerY: 35,
      }),
    ]

    expect(drawLayersToCanvas(ctx, radialLayers, 400, 220)).toBe(true)
    expect(ctx.createRadialGradient).toHaveBeenCalled()

    const zeroRadiusCtx = createMockContext()
    const zeroRadiusLayer = createLayer({
      type: 'radial',
      radialShape: 'ellipse',
      radialSize: 'closest-side',
      centerX: 50,
      centerY: 50,
    })

    expect(drawLayersToCanvas(zeroRadiusCtx, [zeroRadiusLayer], 0, 0)).toBe(true)
    expect(zeroRadiusCtx.createRadialGradient).not.toHaveBeenCalled()
  })
})
