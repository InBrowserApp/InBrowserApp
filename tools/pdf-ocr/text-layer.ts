import {
  concatTransformationMatrix,
  popGraphicsState,
  pushGraphicsState,
} from "pdf-lib"
import type { PDFDocument, PDFPage } from "pdf-lib"
import type { PageViewport } from "pdfjs-dist"

export async function addTextLayer(
  document: PDFDocument,
  page: PDFPage,
  textPdf: Uint8Array,
  viewport: PageViewport,
  width: number,
  height: number
) {
  const [layer] = await document.embedPdf(textPdf)
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
  page.drawPage(layer!, { x: 0, y: 0, width, height })
  page.pushOperators(popGraphicsState())
}
