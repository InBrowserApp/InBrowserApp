import "../pdfjs-assets"

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist"
import * as workerUrlModule from "pdfjs-dist/build/pdf.worker.min.mjs?url&tool=pdf-to-image-converter"

GlobalWorkerOptions.workerSrc = workerUrlModule.default

function loadPdfDocument(url: string) {
  return getDocument({
    url,
    useSystemFonts: true,
  })
}

export { loadPdfDocument }
