import {
  canvasBlob,
  loadImageSource,
} from "@workspace/raster-image/browser-canvas"
import { scoreFilename, serializeImagePage } from "./pages"

export type ScoreImageFormat = "png" | "svg"
export type ScoreFormat = "pdf" | ScoreImageFormat
export type ScoreImage = { page: SVGSVGElement; name: string }

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

async function exportImage(page: SVGSVGElement, format: ScoreImageFormat) {
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

function imageNumber(index: number, count: number) {
  return String(index + 1).padStart(String(count).length, "0")
}

async function exportImages(
  images: readonly ScoreImage[],
  format: ScoreImageFormat,
  name: string
) {
  if (!images.length) throw new Error("No score images to export")
  if (images.length === 1) {
    const image = images[0]!
    return {
      blob: await exportImage(image.page, format),
      filename: `${image.name}.${format}`,
    }
  }

  const { zip } = await import("fflate")
  const files: Record<string, Uint8Array> = {}
  for (const { page, name } of images) {
    const blob = await exportImage(page, format)
    files[`${name}.${format}`] = new Uint8Array(await blob.arrayBuffer())
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

function tuneFilename(value: string) {
  const name = scoreFilename(value)
  // Leave room for the tune number and extension in a 255-byte filename.
  const { read } = new TextEncoder().encodeInto(name, new Uint8Array(240))
  return read === name.length ? name : scoreFilename(name.slice(0, read))
}

export function exportScoreImages(
  images: readonly ScoreImage[],
  format: ScoreImageFormat,
  basename: string
) {
  const name = tuneFilename(basename)
  const named = images.map((image, index) => {
    const title = tuneFilename(image.name.trim() || name)
    return {
      page: image.page,
      name:
        images.length === 1
          ? title
          : `${imageNumber(index, images.length)}-${title}`,
    }
  })
  return exportImages(named, format, name)
}

export async function exportScore(
  pages: SVGSVGElement[],
  format: ScoreFormat,
  basename: string,
  language: string
) {
  const name = scoreFilename(basename)
  if (format === "pdf") {
    if (!pages.length) throw new Error("No score pages to export")
    return { blob: await exportPdf(pages, language), filename: `${name}.pdf` }
  }
  const images = pages.map((page, index) => ({
    page,
    name:
      pages.length === 1 ? name : `${name}-${imageNumber(index, pages.length)}`,
  }))
  return exportImages(images, format, name)
}
