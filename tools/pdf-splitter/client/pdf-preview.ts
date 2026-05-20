import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
import * as workerUrlModule from "pdfjs-dist/build/pdf.worker.min.mjs?url"

import type { PDFDocumentProxy } from "pdfjs-dist"

type PdfPreview = Readonly<{
  height: number
  src: string
  width: number
}>

const workerUrl = (workerUrlModule as { default: string }).default
const PREVIEW_MAX_WIDTH = 180
const PREVIEW_MAX_HEIGHT = 240
const MAX_DEVICE_PIXEL_RATIO = 2
const PREVIEW_IMAGE_TYPE = "image/webp"
const PREVIEW_IMAGE_QUALITY = 0.82

GlobalWorkerOptions.workerSrc = workerUrl

function loadPdfPreviewDocument(data: Uint8Array) {
  return getDocument({
    data,
    useSystemFonts: true,
  })
}

async function renderPdfPagePreview(
  document: PDFDocumentProxy,
  pageNumber: number
): Promise<PdfPreview> {
  const page = await document.getPage(pageNumber)
  const baseViewport = page.getViewport({ scale: 1 })
  const scale = Math.min(
    PREVIEW_MAX_WIDTH / baseViewport.width,
    PREVIEW_MAX_HEIGHT / baseViewport.height,
    1
  )
  const viewport = page.getViewport({ scale })
  const pixelRatio = Math.min(
    window.devicePixelRatio || 1,
    MAX_DEVICE_PIXEL_RATIO
  )
  const canvas = documentCanvas(viewport.width, viewport.height, pixelRatio)
  const context = canvas.getContext("2d")

  if (!context) {
    page.cleanup()
    throw new Error("canvas-context-unavailable")
  }

  context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)

  try {
    await page.render({
      canvas: null,
      canvasContext: context,
      viewport,
    }).promise
  } finally {
    page.cleanup()
  }

  const blob = await canvasToBlob(canvas)

  return {
    height: Math.round(viewport.height),
    src: URL.createObjectURL(blob),
    width: Math.round(viewport.width),
  }
}

function documentCanvas(width: number, height: number, pixelRatio: number) {
  const canvas = document.createElement("canvas")

  canvas.width = Math.max(1, Math.ceil(width * pixelRatio))
  canvas.height = Math.max(1, Math.ceil(height * pixelRatio))

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
          return
        }

        reject(new Error("canvas-blob-unavailable"))
      },
      PREVIEW_IMAGE_TYPE,
      PREVIEW_IMAGE_QUALITY
    )
  })
}

export { loadPdfPreviewDocument, renderPdfPagePreview }
export type { PdfPreview }
