import foxitDingbats from 'pdfjs-dist/standard_fonts/FoxitDingbats.pfb?url'
import foxitFixed from 'pdfjs-dist/standard_fonts/FoxitFixed.pfb?url'
import foxitFixedBold from 'pdfjs-dist/standard_fonts/FoxitFixedBold.pfb?url'
import foxitFixedBoldItalic from 'pdfjs-dist/standard_fonts/FoxitFixedBoldItalic.pfb?url'
import foxitFixedItalic from 'pdfjs-dist/standard_fonts/FoxitFixedItalic.pfb?url'
import foxitSerif from 'pdfjs-dist/standard_fonts/FoxitSerif.pfb?url'
import foxitSerifBold from 'pdfjs-dist/standard_fonts/FoxitSerifBold.pfb?url'
import foxitSerifBoldItalic from 'pdfjs-dist/standard_fonts/FoxitSerifBoldItalic.pfb?url'
import foxitSerifItalic from 'pdfjs-dist/standard_fonts/FoxitSerifItalic.pfb?url'
import foxitSymbol from 'pdfjs-dist/standard_fonts/FoxitSymbol.pfb?url'
import liberationSansBold from 'pdfjs-dist/standard_fonts/LiberationSans-Bold.ttf?url'
import liberationSansBoldItalic from 'pdfjs-dist/standard_fonts/LiberationSans-BoldItalic.ttf?url'
import liberationSansItalic from 'pdfjs-dist/standard_fonts/LiberationSans-Italic.ttf?url'
import liberationSansRegular from 'pdfjs-dist/standard_fonts/LiberationSans-Regular.ttf?url'

const standardFontURLMap: Record<string, string> = {
  'FoxitDingbats.pfb': foxitDingbats,
  'FoxitFixed.pfb': foxitFixed,
  'FoxitFixedBold.pfb': foxitFixedBold,
  'FoxitFixedBoldItalic.pfb': foxitFixedBoldItalic,
  'FoxitFixedItalic.pfb': foxitFixedItalic,
  'FoxitSerif.pfb': foxitSerif,
  'FoxitSerifBold.pfb': foxitSerifBold,
  'FoxitSerifBoldItalic.pfb': foxitSerifBoldItalic,
  'FoxitSerifItalic.pfb': foxitSerifItalic,
  'FoxitSymbol.pfb': foxitSymbol,
  'LiberationSans-Bold.ttf': liberationSansBold,
  'LiberationSans-BoldItalic.ttf': liberationSansBoldItalic,
  'LiberationSans-Italic.ttf': liberationSansItalic,
  'LiberationSans-Regular.ttf': liberationSansRegular,
}

export class PdfJsStandardFontDataFactory {
  async fetch(req: { filename: string }): Promise<Uint8Array> {
    const fontURL = standardFontURLMap[req.filename]

    if (!fontURL) {
      throw new Error(`Unsupported standard font: ${req.filename}`)
    }

    const response = await fetch(fontURL)
    if (!response.ok) {
      throw new Error(`Failed to load standard font: ${req.filename}`)
    }

    return new Uint8Array(await response.arrayBuffer())
  }
}
