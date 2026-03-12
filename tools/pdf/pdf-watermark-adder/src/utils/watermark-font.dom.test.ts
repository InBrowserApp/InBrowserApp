import { StandardFonts } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import {
  measureStandardFontTextWidth,
  resolvePreviewFontFamily,
  resolveStandardFont,
} from './watermark-font'

describe('watermark-font', () => {
  it('maps preview and embedded fonts for all supported font families', () => {
    expect(resolveStandardFont('sans-serif')).toBe(StandardFonts.Helvetica)
    expect(resolveStandardFont('serif')).toBe(StandardFonts.TimesRoman)
    expect(resolveStandardFont('monospace')).toBe(StandardFonts.Courier)

    expect(resolvePreviewFontFamily('sans-serif')).toContain('Helvetica')
    expect(resolvePreviewFontFamily('serif')).toContain('Times')
    expect(resolvePreviewFontFamily('monospace')).toContain('monospace')
  })

  it('measures text widths and reuses cached standard fonts', async () => {
    const sansWidth = await measureStandardFontTextWidth('CONFIDENTIAL', 48, 'sans-serif')
    const serifWidth = await measureStandardFontTextWidth('CONFIDENTIAL', 48, 'serif')
    const monospaceWidth = await measureStandardFontTextWidth('CONFIDENTIAL', 48, 'monospace')
    const sansWidthAgain = await measureStandardFontTextWidth('CONFIDENTIAL', 48, 'sans-serif')

    expect(sansWidth).toBeGreaterThan(0)
    expect(serifWidth).toBeGreaterThan(0)
    expect(monospaceWidth).toBeGreaterThan(0)
    expect(sansWidthAgain).toBe(sansWidth)
  })
})
