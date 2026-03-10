import { PDFDocument } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

export type PdfInspectionResult = {
  pageCount: number
  pageRotations: number[]
}

const normalizeRotation = (value: number): number => {
  const normalized = value % 360
  return normalized < 0 ? normalized + 360 : normalized
}

export const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

export const inspectPdf = async (file: File): Promise<PdfInspectionResult> => {
  try {
    const source = await file.arrayBuffer()
    const document = await PDFDocument.load(source)
    const pages = document.getPages()

    return {
      pageCount: pages.length,
      pageRotations: pages.map((page) => normalizeRotation(page.getRotation().angle)),
    }
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      throw new Error(PDF_ERROR.Encrypted)
    }

    throw new Error(PDF_ERROR.Invalid)
  }
}
