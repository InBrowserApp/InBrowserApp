import { PdfAssets } from "@workspace/pdf-reader/assets"
import { getDocument, GlobalWorkerOptions } from "pdfjs-dist"
// oxlint-disable-next-line import/default -- Vite creates the default export for ?url assets.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

export function openPdf(data: Uint8Array) {
  GlobalWorkerOptions.workerSrc = workerUrl
  return getDocument({
    data,
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
    useSystemFonts: true,
    stopAtErrors: true,
  })
}
