import bidiFactory from "bidi-js"
import {
  beginText,
  endText,
  PDFHexString,
  PDFName,
  PDFString,
  setCharacterSqueeze,
  setFontAndSize,
  setTextMatrix,
  setTextRenderingMode,
  showText,
  TextRenderingMode,
} from "pdf-lib"
import type { PDFDocument, PDFPage } from "pdf-lib"
import glyphlessFont from "./djvu-text.ttf?url"

export type TextZone = {
  t: string
  x: number
  y: number
  w: number
  h: number
  spaceAfter?: boolean
}

const bidi = bidiFactory()
const fontName = PDFName.of("DjVuText")
const glyphWidth = 500

function hexWord(value: number) {
  return value.toString(16).padStart(4, "0")
}

function unicodeHex(text: string) {
  return text
    .split("")
    .map((unit) => hexWord(unit.charCodeAt(0)))
    .join("")
}

export function createTextLayer(document: PDFDocument) {
  const { context } = document
  const font = context.nextRef()
  const codes = new Map<string, string>()

  function addPage(
    page: PDFPage,
    zones: TextZone[],
    width: number,
    height: number
  ) {
    if (!zones.length) return
    const scaleX = page.getWidth() / width
    const scaleY = page.getHeight() / height
    const operators = [
      beginText(),
      setTextRenderingMode(TextRenderingMode.Invisible),
    ]
    for (const zone of zones) {
      const text = zone.t
        .replace(/\p{Bidi_Control}/gu, "")
        .replace(/\s+/gu, " ")
        .trim()
      if (!text) continue
      // PDF readers apply bidi when extracting text from visual coordinates.
      const levels = bidi.getEmbeddingLevels(text)
      // Reorder code units without mirroring the punctuation copied from PDF.
      const visual = bidi
        .getReorderedIndices(text, levels)
        .map((index) => text[index])
        .join("")
      const glyphs = Array.from(visual)
      // A ToUnicode entry can preserve the source word separator without
      // stretching the bounding box of densely packed words.
      if (zone.spaceAfter) {
        if (levels.paragraphs[0]!.level % 2 === 1) glyphs[0] = " " + glyphs[0]
        else glyphs[glyphs.length - 1] += " "
      }
      const encoded = glyphs.map((character) => {
        let code = codes.get(character)
        if (code === undefined) {
          code = hexWord(codes.size + 1)
          codes.set(character, code)
        }
        return code
      })
      const size = Math.max(1, zone.h * scaleY)
      operators.push(
        setFontAndSize(fontName, size),
        setCharacterSqueeze(
          (100_000 * Math.max(1, zone.w * scaleX)) /
            (size * glyphWidth * glyphs.length)
        ),
        setTextMatrix(
          1,
          0,
          0,
          1,
          zone.x * scaleX,
          page.getHeight() - (zone.y + zone.h) * scaleY + size * 0.2
        ),
        showText(PDFHexString.of(encoded.join("")))
      )
    }
    if (operators.length === 2) return
    page.node.setFontDictionary(fontName, font)
    operators.push(endText())
    page.node.addContentStream(
      context.register(context.contentStream(operators))
    )
    return true
  }

  async function embed() {
    if (!codes.size) return
    const bytes = new Uint8Array(
      await (await fetch(glyphlessFont)).arrayBuffer()
    )
    const file = context.register(
      context.flateStream(bytes, { Length1: bytes.length })
    )
    // Each character maps to one blank glyph, and ToUnicode retains its text
    // (including supplementary-plane characters).
    const glyphs = context.register(
      context.flateStream(new Uint8Array(2 * (codes.size + 1)))
    )
    const descriptor = context.register(
      context.obj({
        Type: "FontDescriptor",
        FontName: fontName,
        Flags: 4,
        FontBBox: [0, -200, 500, 800],
        ItalicAngle: 0,
        Ascent: 800,
        Descent: -200,
        CapHeight: 800,
        StemV: 0,
        FontFile2: file,
      })
    )
    const descendant = context.register(
      context.obj({
        Type: "Font",
        Subtype: "CIDFontType2",
        BaseFont: fontName,
        CIDSystemInfo: {
          Registry: PDFString.of("Adobe"),
          Ordering: PDFString.of("Identity"),
          Supplement: 0,
        },
        FontDescriptor: descriptor,
        DW: glyphWidth,
        CIDToGIDMap: glyphs,
      })
    )
    const entries = Array.from(
      codes,
      ([character, code]) => `<${code}> <${unicodeHex(character)}>`
    )
    const mapping = [
      "/CIDInit /ProcSet findresource begin",
      "12 dict begin",
      "begincmap",
      "/CIDSystemInfo << /Registry (Adobe) /Ordering (UCS) /Supplement 0 >> def",
      "/CMapName /DjVuText def",
      "/CMapType 2 def",
      "1 begincodespacerange",
      "<0000> <FFFF>",
      "endcodespacerange",
    ]
    for (let i = 0; i < entries.length; i += 100) {
      const batch = entries.slice(i, i + 100)
      mapping.push(`${batch.length} beginbfchar`, ...batch, "endbfchar")
    }
    mapping.push(
      "endcmap",
      "CMapName currentdict /CMap defineresource pop",
      "end",
      "end"
    )
    const toUnicode = context.register(context.flateStream(mapping.join("\n")))
    context.assign(
      font,
      context.obj({
        Type: "Font",
        Subtype: "Type0",
        BaseFont: fontName,
        Encoding: "Identity-H",
        DescendantFonts: [descendant],
        ToUnicode: toUnicode,
      })
    )
  }

  return { addPage, embed }
}
