import { StandardFonts } from 'pdf-lib'
import { describe, expect, it } from 'vitest'
import {
  measureStandardFontTextWidth,
  resolvePreviewFontFamily,
  resolveStandardFont,
} from './page-number-font'

describe('page-number-font', () => {
  it('maps configured font families to PDF-safe fonts and preview stacks', () => {
    expect(resolveStandardFont('serif')).toBe(StandardFonts.TimesRoman)
    expect(resolveStandardFont('sans-serif')).toBe(StandardFonts.Helvetica)
    expect(resolvePreviewFontFamily('serif')).toContain('Times New Roman')
    expect(resolvePreviewFontFamily('sans-serif')).toContain('Helvetica')
  })

  it('measures text width using cached standard fonts', async () => {
    const firstSerifWidth = await measureStandardFontTextWidth('12/18', 12, 'serif')
    const secondSerifWidth = await measureStandardFontTextWidth('12/18', 12, 'serif')
    const sansSerifWidth = await measureStandardFontTextWidth('12/18', 12, 'sans-serif')

    expect(firstSerifWidth).toBeGreaterThan(0)
    expect(secondSerifWidth).toBe(firstSerifWidth)
    expect(sansSerifWidth).toBeGreaterThan(0)
  })
})
