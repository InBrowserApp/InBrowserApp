import { PdfAssets } from "@workspace/pdf-reader/assets"
import {
  getDocument,
  GlobalWorkerOptions,
  type PDFDocumentProxy,
} from "pdfjs-dist"
// oxlint-disable-next-line import/default -- Vite creates the default export for ?url assets.
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url"

export async function openPreview(file: File, signal: AbortSignal) {
  const data = new Uint8Array(await file.arrayBuffer())
  signal.throwIfAborted()
  GlobalWorkerOptions.workerSrc = globalThis.crossOriginIsolated
    ? `${workerUrl}${workerUrl.includes("?") ? "&" : "?"}isolated=1`
    : workerUrl
  const task = getDocument({
    data,
    BinaryDataFactory: PdfAssets,
    useWorkerFetch: false,
  })
  signal.addEventListener("abort", () => void task.destroy().catch(() => {}), {
    once: true,
  })
  return task.promise
}

export async function renderPreview(
  pdf: PDFDocumentProxy,
  number: number,
  signal: AbortSignal
) {
  const page = await pdf.getPage(number)
  signal.throwIfAborted()
  const base = page.getViewport({ scale: 1 })
  const scale = Math.min(1000 / base.width, 1200 / base.height, 2)
  const viewport = page.getViewport({ scale })
  const canvas = document.createElement("canvas")
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const task = page.render({ canvas, viewport })
  const cancel = () => task.cancel()
  signal.addEventListener("abort", cancel, { once: true })
  try {
    await task.promise
    return canvas
  } finally {
    signal.removeEventListener("abort", cancel)
    page.cleanup()
  }
}
