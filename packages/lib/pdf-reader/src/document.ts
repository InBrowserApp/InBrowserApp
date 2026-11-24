import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
// oxlint-disable-next-line import/default -- Vite creates the default export for ?url assets.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

import { PdfAssets } from "./pdf-assets"

// Isolated pages need a worker response carrying COEP.
GlobalWorkerOptions.workerSrc = globalThis.crossOriginIsolated
  ? `${workerUrl}${workerUrl.includes("?") ? "&" : "?"}isolated=1`
  : workerUrl

export function openPdfDocument(data: Uint8Array) {
  return getDocument({
    data,
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
    useSystemFonts: true,
    enableXfa: false,
    verbosity: 0,
  })
}
