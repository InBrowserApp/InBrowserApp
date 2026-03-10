import { PDFDocument, StandardFonts, type PDFFont } from 'pdf-lib'
import type { PageNumberFontFamily } from '../types'

const previewFontFamilies: Record<PageNumberFontFamily, string> = {
  serif: '"Times New Roman", Times, serif',
  'sans-serif': 'Helvetica, Arial, sans-serif',
}

const fontPromises = new Map<PageNumberFontFamily, Promise<PDFFont>>()

export const resolveStandardFont = (fontFamily: PageNumberFontFamily): StandardFonts => {
  if (fontFamily === 'serif') {
    return StandardFonts.TimesRoman
  }

  return StandardFonts.Helvetica
}

export const resolvePreviewFontFamily = (fontFamily: PageNumberFontFamily): string => {
  return previewFontFamilies[fontFamily]
}

const loadStandardFont = async (fontFamily: PageNumberFontFamily): Promise<PDFFont> => {
  const document = await PDFDocument.create()
  return document.embedFont(resolveStandardFont(fontFamily))
}

export const measureStandardFontTextWidth = async (
  text: string,
  fontSize: number,
  fontFamily: PageNumberFontFamily,
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
