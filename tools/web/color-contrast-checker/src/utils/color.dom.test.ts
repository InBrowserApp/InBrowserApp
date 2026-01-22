import { describe, it, expect } from 'vitest'
import {
  blendOver,
  contrastRatio,
  parseColor,
  parseHexColor,
  parseHslColor,
  parseRgbColor,
  relativeLuminance,
  resolveContrastColors,
  rgbaToHex,
  toCssRgba,
} from './color'

describe('parseHexColor', () => {
  it('parses hex formats with alpha', () => {
    expect(parseHexColor('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    expect(parseHexColor('#abcd')).toEqual({ r: 170, g: 187, b: 204, a: 0.8666666666666667 })
    expect(parseHexColor('#112233')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseHexColor('#11223380')).toEqual({ r: 17, g: 34, b: 51, a: 0.5019607843137255 })
  })

  it('returns null for invalid hex', () => {
    expect(parseHexColor('#12')).toBeNull()
    expect(parseHexColor('#gggggg')).toBeNull()
  })
})

describe('parseRgbColor', () => {
  it('parses rgb and rgba values', () => {
    expect(parseRgbColor('rgb(255, 0, 0)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseRgbColor('rgba(100%, 0%, 0%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 0.5 })
    expect(parseRgbColor('rgb(0 0 0 / 50%)')).toEqual({ r: 0, g: 0, b: 0, a: 0.5 })
    expect(parseRgbColor('rgba(0 128 255 0.25)')).toEqual({ r: 0, g: 128, b: 255, a: 0.25 })
    expect(parseRgbColor('rgb(10 20 30 / )')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
  })

  it('returns null for invalid rgb input', () => {
    expect(parseRgbColor('rgb(10, 20)')).toBeNull()
    expect(parseRgbColor('rgb(aa, 20, 30)')).toBeNull()
    expect(parseRgbColor('rgb(% 0 0)')).toBeNull()
    expect(parseRgbColor('rgb(10 20 30 / %)')).toBeNull()
    expect(parseRgbColor('rgb(10 20 30 / nope)')).toBeNull()
  })
})

describe('parseHslColor', () => {
  it('parses hsl and hsla values', () => {
    expect(parseHslColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseHslColor('hsla(120deg, 100%, 25%, 0.5)')).toEqual({ r: 0, g: 128, b: 0, a: 0.5 })
    const turn = parseHslColor('hsl(0.5turn 50% 50% / 25%)')
    expect(turn).not.toBeNull()
    expect(turn?.a).toBe(0.25)
    expect(parseHslColor('hsl(3.1415926rad 100% 50%)')).not.toBeNull()
    const grad = parseHslColor('hsl(100grad 100% 50%)')
    const deg = parseHslColor('hsl(90 100% 50%)')
    expect(grad).toEqual(deg)
    const noPercent = parseHslColor('hsl(120 50 50)')
    expect(noPercent).not.toBeNull()
    expect(noPercent?.a).toBe(1)
  })

  it('returns null for invalid hsl input', () => {
    expect(parseHslColor('hsl(0, 50%)')).toBeNull()
    expect(parseHslColor('hsl(bad 50% 50%)')).toBeNull()
    expect(parseHslColor('hsl(0 foo 50%)')).toBeNull()
    expect(parseHslColor('hsl(0 50% foo)')).toBeNull()
    expect(parseHslColor('hsla(0 100% 50% / %)')).toBeNull()
    expect(parseHslColor('hsl(,,)')).toBeNull()
  })
})

describe('parseColor', () => {
  it('parses named colors and transparent', () => {
    expect(parseColor('red')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
    expect(parseColor('transparent')).toEqual({ r: 0, g: 0, b: 0, a: 0 })
  })

  it('parses hex, rgb, and hsl inputs', () => {
    expect(parseColor('#112233')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseColor('rgb(10, 20, 30)')).toEqual({ r: 10, g: 20, b: 30, a: 1 })
    expect(parseColor('hsl(0, 100%, 50%)')).toEqual({ r: 255, g: 0, b: 0, a: 1 })
  })

  it('returns null for empty and unknown values', () => {
    expect(parseColor('')).toBeNull()
    expect(parseColor('not-a-color')).toBeNull()
  })
})

describe('formatters', () => {
  it('formats hex with and without alpha', () => {
    expect(rgbaToHex({ r: 17, g: 34, b: 51, a: 0.5 }, false)).toBe('#112233')
    expect(rgbaToHex({ r: 17, g: 34, b: 51, a: 0.5 }, true)).toBe('#11223380')
  })

  it('formats css rgba output', () => {
    expect(toCssRgba({ r: 1, g: 2, b: 3, a: 0.33333 })).toBe('rgba(1, 2, 3, 0.333)')
  })
})

describe('contrast calculations', () => {
  it('blends transparent colors', () => {
    expect(blendOver({ r: 0, g: 0, b: 0, a: 0 }, { r: 0, g: 0, b: 0, a: 0 })).toEqual({
      r: 0,
      g: 0,
      b: 0,
      a: 0,
    })
  })

  it('resolves contrast colors to opaque values', () => {
    const resolved = resolveContrastColors(
      { r: 255, g: 0, b: 0, a: 0.5 },
      { r: 0, g: 0, b: 0, a: 0.5 },
    )

    expect(resolved.foreground.a).toBe(1)
    expect(resolved.background.a).toBe(1)
  })

  it('computes relative luminance and ratios', () => {
    expect(relativeLuminance({ r: 0, g: 0, b: 0, a: 1 })).toBeCloseTo(0, 6)
    expect(relativeLuminance({ r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(1, 6)
    expect(contrastRatio({ r: 0, g: 0, b: 0, a: 1 }, { r: 255, g: 255, b: 255, a: 1 })).toBeCloseTo(
      21,
      4,
    )
  })
})
