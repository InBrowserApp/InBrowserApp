import type { PDFPageProxy } from "pdfjs-dist"

export function renderPage(
  page: PDFPageProxy,
  canvas: HTMLCanvasElement,
  pixelsPerPoint: number
) {
  const viewport = page.getViewport({ scale: 1 })
  const { width, height } = viewport
  // Bound memory and stay within the canvas limits of mobile browsers.
  const scale = Math.min(
    pixelsPerPoint,
    4096 / Math.max(width, height),
    Math.sqrt(12_000_000 / width / height)
  )
  canvas.width = Math.max(1, Math.floor(width * scale))
  canvas.height = Math.max(1, Math.floor(height * scale))
  const task = page.render({
    canvas,
    viewport,
    background: "#fff",
    transform: [canvas.width / width, 0, 0, canvas.height / height, 0, 0],
  })
  return { task, width, height }
}
