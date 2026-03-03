import { PDFDocument } from 'pdf-lib'
import { PDF_ERROR, isEncryptedPdfError } from './pdf-errors'

export type PdfInspectionResult = {
  pageCount: number
}

export const isPdfFile = (file: File): boolean =>
  file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')

export const inspectPdf = async (file: File): Promise<PdfInspectionResult> => {
  try {
    const source = await file.arrayBuffer()
    const document = await PDFDocument.load(source)
    return { pageCount: document.getPageCount() }
  } catch (error) {
    if (isEncryptedPdfError(error)) {
      throw new Error(PDF_ERROR.Encrypted)
    }

    throw new Error(PDF_ERROR.Invalid)
  }
}
