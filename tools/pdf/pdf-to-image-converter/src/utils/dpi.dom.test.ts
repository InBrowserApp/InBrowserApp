import { describe, expect, it } from 'vitest'
import { clampDpi, DEFAULT_DPI, dpiToScale, MAX_DPI, MIN_DPI } from './dpi'

describe('dpi utilities', () => {
  it('clamps invalid and out-of-range values', () => {
    expect(clampDpi(Number.NaN)).toBe(DEFAULT_DPI)
    expect(clampDpi(MIN_DPI - 20)).toBe(MIN_DPI)
    expect(clampDpi(MAX_DPI + 20)).toBe(MAX_DPI)
    expect(clampDpi(199.7)).toBe(200)
  })

  it('converts dpi to pdf.js scale', () => {
    expect(dpiToScale(72)).toBe(1)
    expect(dpiToScale(144)).toBe(2)
    expect(dpiToScale(300)).toBe(300 / 72)
  })
})
