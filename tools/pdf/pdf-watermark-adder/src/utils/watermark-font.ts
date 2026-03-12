import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib'
import type { WatermarkFontFamily } from '../types'

const previewFontFamilies: Record<WatermarkFontFamily, string> = {
  monospace: '"SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace',
  serif: '"Times New Roman", Times, serif',
  'sans-serif': 'Helvetica, Arial, sans-serif',
}

const fontPromises = new Map<WatermarkFontFamily, Promise<PDFFont>>()

export const resolveStandardFont = (fontFamily: WatermarkFontFamily): StandardFonts => {
  if (fontFamily === 'monospace') {
    return StandardFonts.Courier
  }

  if (fontFamily === 'serif') {
    return StandardFonts.TimesRoman
  }

  return StandardFonts.Helvetica
}

export const resolvePreviewFontFamily = (fontFamily: WatermarkFontFamily): string => {
  return previewFontFamilies[fontFamily]
}

const loadStandardFont = async (fontFamily: WatermarkFontFamily): Promise<PDFFont> => {
  const document = await PDFDocument.create()
  return document.embedFont(resolveStandardFont(fontFamily))
}

export const measureStandardFontTextWidth = async (
  text: string,
  fontSize: number,
  fontFamily: WatermarkFontFamily,
): Promise<number> => {
  const existingFont = fontPromises.get(fontFamily)
  if (existingFont) {
    const font = await existingFont
    return font.widthOfTextAtSize(text, fontSize)
  }

  const fontPromise = loadStandardFont(fontFamily)
  fontPromises.set(fontFamily, fontPromise)

  const font = await fontPromise
  return font.widthOfTextAtSize(text, fontSize)
}
