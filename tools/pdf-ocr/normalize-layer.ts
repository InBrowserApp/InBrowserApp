import bidiFactory from "bidi-js"
import {
  beginText,
  endText,
  PDFDict,
  PDFHexString,
  PDFName,
  setCharacterSqueeze,
  setFontAndSize,
  setTextMatrix,
  setTextRenderingMode,
  showText,
  TextRenderingMode,
} from "pdf-lib"

import type { PDFPage } from "pdf-lib"
import type { Bbox, Block, Word } from "tesseract.js"

const bidi = bidiFactory()
const eastAsian =
  /[\p{Script_Extensions=Han}\p{Script_Extensions=Hiragana}\p{Script_Extensions=Katakana}]/u

function groupWords(words: Word[]) {
  const runs: { text: string; box: Bbox }[] = []
  for (const word of words) {
    const text = word.text.replace(/\p{Bidi_Control}/gu, "").trim()
    if (!text) continue
    const previous = runs.at(-1)
    // Tesseract exports a space after OCR segments in Chinese and Japanese.
    // Group neighboring segments so PDF readers can match a continuous phrase.
    if (
      previous &&
      eastAsian.test(previous.text.slice(-1)) &&
      eastAsian.test(text[0]!)
    ) {
      previous.text += text
      previous.box.x0 = Math.min(previous.box.x0, word.bbox.x0)
      previous.box.x1 = Math.max(previous.box.x1, word.bbox.x1)
    } else {
      runs.push({ text, box: { ...word.bbox } })
    }
  }
  return runs
}

function glyphCodes(text: string) {
  // GlyphLessFont uses identity Unicode mapping of UTF-16 code units.
  return PDFHexString.of(
    text
      .split("")
      .map((character) => character.charCodeAt(0).toString(16).padStart(4, "0"))
      .join("")
  )
}

export function normalizeTextLayer(
  page: PDFPage,
  blocks: Block[],
  width: number,
  height: number
) {
  const fonts = page.node.Resources()?.lookupMaybe(PDFName.of("Font"), PDFDict)
  const font = fonts?.keys()[0]
  if (!font) return

  const scaleX = page.getWidth() / width
  const scaleY = page.getHeight() / height
  const operators = [
    beginText(),
    setTextRenderingMode(TextRenderingMode.Invisible),
  ]
  for (const block of blocks) {
    for (const paragraph of block.paragraphs) {
      for (const line of paragraph.lines) {
        const { bbox, baseline } = line
        const fontSize = Math.max(1, (bbox.y1 - bbox.y0) * scaleY)
        const slope =
          ((baseline.y0 - baseline.y1) * scaleY) /
          Math.max(1, Math.abs(baseline.x1 - baseline.x0) * scaleX)
        const y = page.getHeight() - bbox.y1 * scaleY
        operators.push(setFontAndSize(font, fontSize))
        for (const { box, text } of groupWords(line.words)) {
          // PDF extractors reorder text from visual order. Maintain the OCR
          // word order while positioning each word over its scan coordinates.
          const levels = bidi.getEmbeddingLevels(
            text,
            paragraph.is_ltr ? "ltr" : "rtl"
          )
          const visual = bidi.getReorderedString(text, levels)
          const wordWidth = Math.max(1, (box.x1 - box.x0) * scaleX)
          const glyphWidth = visual.length * fontSize * 0.5
          operators.push(
            setCharacterSqueeze((100 * wordWidth) / glyphWidth),
            setTextMatrix(1, slope, 0, 1, box.x0 * scaleX, y),
            showText(glyphCodes(visual))
          )
        }
      }
    }
  }

  if (operators.length > 2) {
    operators.push(endText())
    const { context } = page.doc
    const stream = context.contentStream(operators)
    page.node.set(PDFName.of("Contents"), context.register(stream))
  }
}
