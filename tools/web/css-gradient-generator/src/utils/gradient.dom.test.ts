import { describe, it, expect, vi } from 'vitest'
import {
  createGradientCss,
  createLayer,
  drawLayersToCanvas,
  formatColor,
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
})
