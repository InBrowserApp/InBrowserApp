import workerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist/types/src/pdf'
import { PdfJsStandardFontDataFactory } from './pdfjs-standard-font-data-factory'

GlobalWorkerOptions.workerSrc = workerURL

export function loadPdfDocument(url: string): PDFDocumentLoadingTask {
  return getDocument({
    url,
    StandardFontDataFactory: PdfJsStandardFontDataFactory,
    useSystemFonts: true,
  })
}
