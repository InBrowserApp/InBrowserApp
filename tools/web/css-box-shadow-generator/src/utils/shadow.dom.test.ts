import { describe, it, expect } from 'vitest'
import { buildBoxShadow, createShadowLayer, hexToRgba } from './shadow'

describe('shadow utils', () => {
  it('converts hex colors to rgba strings', () => {
    expect(hexToRgba('#fff')).toBe('rgba(255, 255, 255, 1)')
    expect(hexToRgba('#00000080')).toBe('rgba(0, 0, 0, 0.502)')
    expect(hexToRgba('#abcd')).toBe('rgba(170, 187, 204, 0.867)')
  })

  it('falls back for invalid hex values', () => {
    expect(hexToRgba('#12')).toBe('rgba(0, 0, 0, 0.2)')
    expect(hexToRgba('#ggg')).toBe('rgba(0, 0, 0, 0.2)')
  })

  it('builds a box-shadow string from layers', () => {
    const layer = createShadowLayer({
      offsetX: 4,
      offsetY: 12,
      blur: 18,
      spread: 2,
      color: '#112233',
    })

    expect(buildBoxShadow([layer])).toBe('4px 12px 18px 2px rgba(17, 34, 51, 1)')
  })

  it('supports inset shadows and invalid colors', () => {
    const layer = createShadowLayer({
      inset: true,
      color: 'not-a-color',
    })

    expect(buildBoxShadow([layer])).toContain('inset')
    expect(buildBoxShadow([layer])).toContain('rgba(0, 0, 0, 0.2)')
  })

  it('falls back when the color is empty', () => {
    const layer = createShadowLayer({
      color: '   ',
    })

    expect(buildBoxShadow([layer])).toContain('rgba(0, 0, 0, 0.2)')
  })

  it('returns none when no layers are present', () => {
    expect(buildBoxShadow([])).toBe('none')
  })
})
