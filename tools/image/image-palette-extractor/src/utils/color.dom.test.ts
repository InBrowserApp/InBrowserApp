import { describe, it, expect } from 'vitest'
import { rgbToHex, formatRgb, formatHsl, getContrastColor } from './color'

describe('color utils', () => {
  it('formats rgb values', () => {
    expect(formatRgb(1, 2, 3)).toBe('rgb(1, 2, 3)')
  })

  it('converts rgb to hex with clamping', () => {
    expect(rgbToHex(256.4, -2, 15.9)).toBe('#FF0010')
  })

  it('formats hsl for grayscale colors', () => {
    expect(formatHsl(128, 128, 128)).toEqual({ h: 0, s: 0, l: 50 })
  })

  it('formats hsl for primary colors', () => {
    expect(formatHsl(255, 0, 0)).toEqual({ h: 0, s: 100, l: 50 })
    expect(formatHsl(0, 255, 0)).toEqual({ h: 120, s: 100, l: 50 })
    expect(formatHsl(0, 0, 255)).toEqual({ h: 240, s: 100, l: 50 })
    expect(formatHsl(255, 0, 128)).toEqual({ h: 330, s: 100, l: 50 })
  })

  it('chooses contrast colors based on luminance', () => {
    expect(getContrastColor(250, 250, 250)).toBe('#111111')
    expect(getContrastColor(0, 0, 0)).toBe('#ffffff')
  })
})
