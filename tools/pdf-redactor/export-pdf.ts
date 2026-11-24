import { PDFDocument } from "pdf-lib"

import { renderPage } from "./render-page"
import type { PDFDocumentProxy } from "pdfjs-dist"
import type { Redactions, Region } from "./types"

function paintRegions(canvas: HTMLCanvasElement, regions: readonly Region[]) {
  const context = canvas.getContext("2d")!
  const { width, height } = canvas
  context.fillStyle = "#000"
  for (const region of regions) {
    const left = Math.floor(region.left * width)
    const top = Math.floor(region.top * height)
    const right = Math.ceil(region.right * width)
    const bottom = Math.ceil(region.bottom * height)
    context.fillRect(left, top, right - left, bottom - top)
  }
}

function pageImage(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) reject(new Error("Could not encode PDF page"))
      else resolve(blob)
    }, "image/png")
  })
}

export async function exportPdf(
  source: PDFDocumentProxy,
  redactions: Redactions,
  onProgress: (page: number) => void
) {
  // Start from an empty document so the export never references a source PDF
  // object, including objects shared by multiple pages.
  const result = await PDFDocument.create()
  const canvas = document.createElement("canvas")
  try {
    for (let number = 1; number <= source.numPages; number += 1) {
      onProgress(number)
      const sourcePage = await source.getPage(number)
      try {
        const { task, width, height } = renderPage(sourcePage, canvas, 3)
        await task.promise
        const regions = redactions[number]
        if (regions?.length) paintRegions(canvas, regions)
        const blob = await pageImage(canvas)
        const image = await result.embedPng(await blob.arrayBuffer())
        result.addPage([width, height]).drawImage(image, { width, height })
        await image.embed()
      } finally {
        sourcePage.cleanup()
      }
    }
    return await result.save()
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}
