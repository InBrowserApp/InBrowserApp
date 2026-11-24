import { PDFContentStream, PDFDocument, PDFName } from "pdf-lib"
import { expect, it } from "vitest"

import { normalizeTextLayer } from "./normalize-layer"
import type { Block } from "tesseract.js"

async function layerWithWords(words: string[], leftToRight: boolean) {
  const document = await PDFDocument.create()
  const page = document.addPage([300, 200])
  // Install a font resource. The normalizer reuses the OCR PDF's font when
  // emitting the UTF-16 character codes for this content stream.
  page.drawText("original layer")
  const blocks = [
    {
      paragraphs: [
        {
          is_ltr: leftToRight,
          lines: [
            {
              bbox: { x0: 10, y0: 10, x1: 240, y1: 25 },
              baseline: { x0: 10, y0: 25, x1: 240, y1: 25 },
              words: words.map((text, index) => ({
                text,
                bbox: {
                  x0: 10 + index * 20,
                  x1: 25 + index * 20,
                  y0: 10,
                  y1: 25,
                },
              })),
            },
          ],
        },
      ],
    },
  ] as Block[]
  normalizeTextLayer(page, blocks, 300, 200)
  const stream = page.node.lookup(PDFName.of("Contents"), PDFContentStream)
  return stream.getContentsString().toLowerCase()
}

it("places a searchable Chinese phrase in one text run", async () => {
  const content = await layerWithWords(["可", "以", "搜索"], true)
  expect(content).toContain("<53ef4ee5641c7d22> tj")
  expect(content).toContain("3 tr")
})

it("writes RTL words in visual character order while retaining numbers", async () => {
  const content = await layerWithWords(["هذا", "42"], false)
  expect(content).toContain("<062706300647> tj")
  expect(content).toContain("<00340032> tj")
})
