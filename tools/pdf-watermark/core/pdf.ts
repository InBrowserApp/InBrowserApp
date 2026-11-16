import {
  PDFDocument,
  concatTransformationMatrix,
  degrees,
  popGraphicsState,
  pushGraphicsState,
} from "pdf-lib"
import { pageMatrix, watermarkLayout } from "./layout"
import type { PDFPage } from "pdf-lib"
import type { Options } from "../types"

function geometry(page: PDFPage) {
  const crop = page.getCropBox()
  const media = page.getMediaBox()
  const x = Math.max(crop.x, media.x)
  const y = Math.max(crop.y, media.y)
  const width = Math.min(crop.x + crop.width, media.x + media.width) - x
  const height = Math.min(crop.y + crop.height, media.y + media.height) - y
  return {
    ...(width > 0 && height > 0 ? { x, y, width, height } : media),
    rotation: ((page.getRotation().angle % 360) + 360) % 360,
  }
}

async function inspectPdf(source: ArrayBuffer) {
  const doc = await PDFDocument.load(source, { updateMetadata: false })
  if (!doc.getPageCount()) throw new Error("readError")
  return doc.getPages().map(geometry)
}

async function watermarkPdf(
  source: ArrayBuffer,
  png: ArrayBuffer,
  options: Options,
  selected: readonly number[]
) {
  const doc = await PDFDocument.load(source, { updateMetadata: false })
  const pages = doc.getPages()
  if (
    !selected.length ||
    new Set(selected).size !== selected.length ||
    selected.some((n) => !Number.isInteger(n) || n < 1 || n > pages.length)
  )
    throw new Error("rangeBounds")
  const image = await doc.embedPng(png)
  for (const n of selected) {
    const page = pages[n - 1]!
    const view = geometry(page)
    const { centers, markWidth, markHeight, cos, sin } = watermarkLayout(
      view,
      image.width / image.height,
      options
    )
    page.pushOperators(
      pushGraphicsState(),
      concatTransformationMatrix(...pageMatrix(view))
    )
    for (const center of centers) {
      page.drawImage(image, {
        x: center.x - (cos * markWidth) / 2 + (sin * markHeight) / 2,
        y: center.y - (sin * markWidth) / 2 - (cos * markHeight) / 2,
        width: markWidth,
        height: markHeight,
        rotate: degrees(-options.rotation),
        opacity: options.opacity / 100,
      })
    }
    page.pushOperators(popGraphicsState())
  }
  return doc.save({ updateFieldAppearances: false })
}

export { inspectPdf, watermarkPdf }
