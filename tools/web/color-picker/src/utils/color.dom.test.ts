import { describe, it, expect } from 'vitest'
import {
  clampAlpha,
  clampChannel,
  formatAlphaPercent,
  formatCmyk,
  formatHsl,
  formatHsv,
  formatRgb,
  parseHexToRgba,
  rgbaToHex,
  toCssRgba,
} from './color'

const baseColor = { r: 17, g: 34, b: 51, a: 0.5 }

describe('color utils', () => {
  it('clamps channels and alpha', () => {
    expect(clampChannel(-10)).toBe(0)
    expect(clampChannel(300)).toBe(255)
    expect(clampAlpha(-1)).toBe(0)
    expect(clampAlpha(2)).toBe(1)
  })

  it('parses hex strings', () => {
    expect(parseHexToRgba('#abc')).toEqual({ r: 170, g: 187, b: 204, a: 1 })
    expect(parseHexToRgba('#abcd')).toEqual({
      r: 170,
      g: 187,
      b: 204,
      a: 0xdd / 255,
    })
    expect(parseHexToRgba('112233')).toEqual({ r: 17, g: 34, b: 51, a: 1 })
    expect(parseHexToRgba('#11223380')).toEqual({
      r: 17,
      g: 34,
      b: 51,
      a: 0x80 / 255,
    })
    expect(parseHexToRgba('#12')).toBeNull()
    expect(parseHexToRgba('#gggggg')).toBeNull()
  })

  it('formats color strings with and without alpha', () => {
    expect(rgbaToHex(baseColor, false)).toBe('#112233')
    expect(rgbaToHex(baseColor, true)).toBe('#11223380')
    expect(formatRgb(baseColor, false)).toBe('rgb(17, 34, 51)')
    expect(formatRgb(baseColor, true)).toBe('rgba(17, 34, 51, 0.5)')
    expect(formatHsl(baseColor, false)).toMatch(/^hsl\(/)
    expect(formatHsl(baseColor, true)).toMatch(/^hsla\(/)
    expect(formatHsv(baseColor, false)).toMatch(/^hsv\(/)
    expect(formatHsv(baseColor, true)).toMatch(/^hsva\(/)
    expect(formatCmyk(baseColor)).toMatch(/^cmyk\(/)
  })

  it('formats alpha percent and css rgba', () => {
    expect(formatAlphaPercent(0.25)).toBe('25%')
    expect(toCssRgba(baseColor)).toBe('rgba(17, 34, 51, 0.5)')
  })
})
