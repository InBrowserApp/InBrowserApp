import { countPixels, createHistogram, type Histogram } from "./core/histogram"

const tileSize = 1024

export type Analysis = {
  width: number
  height: number
  histogram: Histogram
  preview: Blob
}

export type Reply = Analysis | null

async function analyze(source: Blob): Promise<Analysis> {
  const bitmap = await createImageBitmap(source)
  try {
    const { width, height } = bitmap
    const canvas = new OffscreenCanvas(
      Math.min(width, tileSize),
      Math.min(height, tileSize)
    )
    const context = canvas.getContext("2d", { willReadFrequently: true })
    if (!context) throw new Error("Canvas 2D unavailable")

    const histogram = createHistogram()
    // Read at native resolution with a bounded canvas, even for large images.
    for (let y = 0; y < height; y += tileSize) {
      for (let x = 0; x < width; x += tileSize) {
        const w = Math.min(width - x, tileSize)
        const h = Math.min(height - y, tileSize)
        context.clearRect(0, 0, w, h)
        context.drawImage(bitmap, x, y, w, h, 0, 0, w, h)
        countPixels(histogram, context.getImageData(0, 0, w, h).data)
      }
    }

    // Use the same decoded still for the preview and the histogram.
    const scale = Math.min(1, tileSize / Math.max(width, height))
    canvas.width = Math.max(1, Math.round(width * scale))
    canvas.height = Math.max(1, Math.round(height * scale))
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    const preview = await canvas.convertToBlob({ type: "image/webp" })
    return { width, height, histogram, preview }
  } finally {
    bitmap.close()
  }
}

self.onmessage = async ({ data }: MessageEvent<File | "sample">) => {
  try {
    // NPS / Alessandra Puig-Santana, public domain.
    // https://commons.wikimedia.org/wiki/File:Sunsets_in_Joshua_Tree_(49867901701).jpg
    const source =
      data === "sample"
        ? await fetch(new URL("./assets/sample.jpg", import.meta.url)).then(
            (response) => response.blob()
          )
        : data
    self.postMessage(await analyze(source))
  } catch {
    self.postMessage(null)
  }
}
