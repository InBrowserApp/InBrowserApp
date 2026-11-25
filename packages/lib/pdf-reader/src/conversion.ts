import { AnnotationMode } from "pdfjs-dist"
import type {
  PDFDocumentLoadingTask,
  PDFDocumentProxy,
  PDFPageProxy,
} from "pdfjs-dist"

type WaitForRead = <T>(request: Promise<T>) => Promise<T>

export async function withLoadedPdf<T>(
  task: PDFDocumentLoadingTask,
  signal: AbortSignal,
  run: (pdf: PDFDocumentProxy, waitForRead: WaitForRead) => Promise<T>
) {
  let rejectRead!: (reason: unknown) => void
  const cancelled = new Promise<never>((_, reject) => {
    rejectRead = reject
  })
  // PDF.js can leave document and text requests pending after worker shutdown.
  const waitForRead: WaitForRead = (request) =>
    Promise.race([request, cancelled])
  let stopping: Promise<void> | undefined
  const stop = () => {
    rejectRead(signal.reason)
    stopping = task.destroy().catch(() => {})
  }
  signal.addEventListener("abort", stop, { once: true })
  try {
    return await run(await waitForRead(task.promise), waitForRead)
  } finally {
    signal.removeEventListener("abort", stop)
    await (stopping ?? task.destroy())
  }
}

export async function renderPdfScan(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  signal: AbortSignal
) {
  signal.throwIfAborted()
  const base = page.getViewport({ scale: 1 })
  // Aim for about 250 DPI and keep the raster within browser canvas limits.
  const scale = Math.min(
    250 / 72,
    4096 / Math.max(base.width, base.height),
    Math.sqrt(12_000_000 / (base.width * base.height))
  )
  const viewport = page.getViewport({ scale })
  canvas.width = Math.ceil(viewport.width)
  canvas.height = Math.ceil(viewport.height)
  const render = page.render({
    canvas,
    viewport,
    annotationMode: AnnotationMode.DISABLE,
  })
  const cancel = () => render.cancel()
  signal.addEventListener("abort", cancel, { once: true })
  try {
    await render.promise
    signal.throwIfAborted()
    return viewport
  } finally {
    signal.removeEventListener("abort", cancel)
  }
}
