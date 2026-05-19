import { clampDpi, getExtension } from "./options"

import type { ImageFormat } from "./options"

function stripPdfExtension(filename: string) {
  const normalized = filename.trim()

  if (!normalized) {
    return "document"
  }

  return normalized.replace(/\.pdf$/i, "") || "document"
}

function createPageImageName(
  pdfFilename: string,
  page: number,
  format: ImageFormat
) {
  const safePage = Math.max(1, Math.round(page))

  return `${stripPdfExtension(pdfFilename)}-p${safePage}.${getExtension(
    format
  )}`
}

function createZipName(pdfFilename: string, dpi: number, format: ImageFormat) {
  return `${stripPdfExtension(pdfFilename)}-${clampDpi(
    dpi
  )}dpi-${format}-images.zip`
}

export { createPageImageName, createZipName, stripPdfExtension }
