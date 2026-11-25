import {
  canvasBlob,
  loadImageSource,
} from "@workspace/raster-image/browser-canvas"
import { scoreFilename, serializeImagePage } from "./pages"

export type ScoreFormat = "pdf" | "png" | "svg"

async function exportPdf(pages: SVGSVGElement[], language: string) {
  const { createDiagramPdf } = await import("@workspace/svg-pdf")
  const serializer = new XMLSerializer()
  const convert = (page: SVGSVGElement) =>
    createDiagramPdf(serializer.serializeToString(page), "original", language, {
      keepPageSize: true,
    })
  if (pages.length === 1) return convert(pages[0]!)

  const { PDFDocument } = await import("pdf-lib")
  const result = await PDFDocument.create()
  for (const page of pages) {
    const source = await PDFDocument.load(
      await (await convert(page)).arrayBuffer()
    )
    const [copy] = await result.copyPages(source, [0])
    result.addPage(copy!)
  }
  return new Blob([new Uint8Array(await result.save())], {
    type: "application/pdf",
  })
}

async function exportImage(page: SVGSVGElement, format: "png" | "svg") {
  const artwork = new File(
    [serializeImagePage(page, format === "png" ? 2 : 1)],
    "page.svg",
    {
      type: "image/svg+xml",
    }
  )
  if (format === "svg") return artwork

  const { image, width, height, cleanup } = await loadImageSource(artwork)
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  try {
    const context = canvas.getContext("2d")
    if (!context) throw new Error("Could not create score canvas")
    // Pixel rounding can leave a fraction of a pixel outside the SVG page.
    context.fillStyle = "white"
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)
    const blob = await canvasBlob(canvas, "image/png", 1)
    if (!blob) throw new Error("Could not encode score image")
    return blob
  } finally {
    cleanup?.()
    canvas.width = canvas.height = 0
  }
}

export async function exportScore(
  pages: SVGSVGElement[],
  format: ScoreFormat,
  basename: string,
  language: string
) {
  const name = scoreFilename(basename)
  if (!pages.length) throw new Error("No score pages to export")
  if (format === "pdf") {
    return { blob: await exportPdf(pages, language), filename: `${name}.pdf` }
  }
  if (pages.length === 1) {
    return {
      blob: await exportImage(pages[0]!, format),
      filename: `${name}.${format}`,
    }
  }

  const { zip } = await import("fflate")
  const files: Record<string, Uint8Array> = {}
  for (const [index, page] of pages.entries()) {
    const number = String(index + 1).padStart(String(pages.length).length, "0")
    const blob = await exportImage(page, format)
    files[`${name}-${number}.${format}`] = new Uint8Array(
      await blob.arrayBuffer()
    )
  }
  const bytes = await new Promise<Uint8Array>((resolve, reject) => {
    zip(files, { level: format === "png" ? 0 : 6 }, (error, result) => {
      if (error) reject(error)
      else resolve(result)
    })
  })
  return {
    blob: new Blob([new Uint8Array(bytes)], { type: "application/zip" }),
    filename: `${name}-${format}.zip`,
  }
}
