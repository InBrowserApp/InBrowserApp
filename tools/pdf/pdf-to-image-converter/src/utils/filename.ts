import type { ImageFormat } from '../types'
import { getExtension } from './mime'

export function stripPdfExtension(filename: string): string {
  const normalized = filename.trim()
  if (!normalized) return 'document'
  return normalized.replace(/\.pdf$/i, '') || 'document'
}

export function createPageImageName(
  pdfFilename: string,
  page: number,
  format: ImageFormat,
): string {
  const baseName = stripPdfExtension(pdfFilename)
  const extension = getExtension(format)
  return `${baseName}-p${page}.${extension}`
}

export function createZipName(pdfFilename: string, dpi: number, format: ImageFormat): string {
  const baseName = stripPdfExtension(pdfFilename)
  return `${baseName}-${dpi}dpi-${format}-images.zip`
}
