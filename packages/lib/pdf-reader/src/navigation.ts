import type { PDFDocumentProxy } from "pdfjs-dist"
import { AnnotationMode } from "pdfjs-dist"
import type { OutlineItem } from "./types"

type Outline = NonNullable<Awaited<ReturnType<PDFDocumentProxy["getOutline"]>>>

export async function readOutline(document: PDFDocumentProxy) {
  const convert = (items: Outline): OutlineItem[] =>
    items.map((item) => ({
      title: item.title,
      destination: item.dest,
      children: convert(item.items),
    }))
  return convert((await document.getOutline()) ?? [])
}

export async function renderThumbnail(
  document: PDFDocumentProxy,
  pageNumber: number,
  canvas: HTMLCanvasElement,
  signal: AbortSignal
) {
  signal.throwIfAborted()
  const page = await document.getPage(pageNumber)
  signal.throwIfAborted()
  const size = page.getViewport({ scale: 1 })
  const scale = Math.min(160 / size.width, 200 / size.height)
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
  } finally {
    signal.removeEventListener("abort", cancel)
  }
}
