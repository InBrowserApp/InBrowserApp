import "../pdfjs-assets"

import { GlobalWorkerOptions, getDocument } from "pdfjs-dist"
// oxlint-disable-next-line import/default -- Vite creates the default export for ?url assets.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url&tool=pdf-to-image-converter"

GlobalWorkerOptions.workerSrc = workerUrl

function loadPdfDocument(url: string) {
  return getDocument({
    url,
    useSystemFonts: true,
  })
}

export { loadPdfDocument }
