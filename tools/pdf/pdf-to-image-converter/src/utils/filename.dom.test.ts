import { describe, expect, it } from 'vitest'
import { createPageImageName, createZipName, stripPdfExtension } from './filename'

describe('filename utilities', () => {
  it('strips pdf extension and preserves base name', () => {
    expect(stripPdfExtension('report.pdf')).toBe('report')
    expect(stripPdfExtension('report.PDF')).toBe('report')
    expect(stripPdfExtension('  report.pdf  ')).toBe('report')
    expect(stripPdfExtension('')).toBe('document')
  })

  it('creates image names for pages', () => {
    expect(createPageImageName('report.pdf', 1, 'png')).toBe('report-p1.png')
    expect(createPageImageName('report.pdf', 2, 'jpeg')).toBe('report-p2.jpg')
    expect(createPageImageName('report.pdf', 3, 'webp')).toBe('report-p3.webp')
  })

  it('creates zip name with dpi and format', () => {
    expect(createZipName('report.pdf', 144, 'png')).toBe('report-144dpi-png-images.zip')
  })
})
