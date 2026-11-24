import {
  concatTransformationMatrix,
  PDFDocument,
  popGraphicsState,
  pushGraphicsState,
} from "pdf-lib"
import { normalizeTextLayer } from "./normalize-layer"
import type { PDFPage } from "pdf-lib"
import type { Block } from "tesseract.js"
import type { PageViewport } from "pdfjs-dist"

export async function addTextLayer(
  document: PDFDocument,
  page: PDFPage,
  textPdf: Uint8Array,
  viewport: PageViewport,
  width: number,
  height: number,
  blocks?: Block[] | null
) {
  const textDocument = await PDFDocument.load(textPdf, {
    updateMetadata: false,
  })
  const textPage = textDocument.getPage(0)
  if (blocks?.length) normalizeTextLayer(textPage, blocks, width, height)
  const layer = await document.embedPage(textPage)
  // Map the raster's bottom-left origin back to the original page, including
  // crop-box offsets, user units, and the rotation used to render the scan.
  const [x, y] = viewport.convertToPdfPoint(0, height)
  const [rightX, rightY] = viewport.convertToPdfPoint(width, height)
  const [topX, topY] = viewport.convertToPdfPoint(0, 0)
  page.pushOperators(
    pushGraphicsState(),
    concatTransformationMatrix(
      (rightX - x) / width,
      (rightY - y) / width,
      (topX - x) / height,
      (topY - y) / height,
      x,
      y
    )
  )
  page.drawPage(layer, { x: 0, y: 0, width, height })
  page.pushOperators(popGraphicsState())
}
