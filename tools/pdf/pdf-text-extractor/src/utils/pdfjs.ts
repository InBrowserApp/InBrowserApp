import workerURL from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist'
import type { PDFDocumentLoadingTask } from 'pdfjs-dist/types/src/pdf'

GlobalWorkerOptions.workerSrc = workerURL

export function loadPdfDocument(data: Uint8Array): PDFDocumentLoadingTask {
  return getDocument({
    data,
    useSystemFonts: true,
  })
}
