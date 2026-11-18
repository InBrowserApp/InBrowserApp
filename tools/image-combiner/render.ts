import type { Composition } from "./core/layout"
import type { SourceImage } from "./types"

export function drawComposition(
  canvas: HTMLCanvasElement,
  composition: Composition,
  images: readonly SourceImage[],
  background: string | null,
  scale = 1
) {
  canvas.width = Math.max(1, Math.round(composition.width * scale))
  canvas.height = Math.max(1, Math.round(composition.height * scale))
  const context = canvas.getContext("2d")
  if (!context) return false

  if (background) {
    context.fillStyle = background
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.scale(
    canvas.width / composition.width,
    canvas.height / composition.height
  )
  context.imageSmoothingQuality = "high"
  for (const [
    index,
    { x, y, width, height },
  ] of composition.placements.entries()) {
    context.drawImage(images[index]!.image, x, y, width, height)
  }
  return true
}

export async function downloadPng(
  composition: Composition,
  images: readonly SourceImage[],
  background: string | null
) {
  const canvas = document.createElement("canvas")
  try {
    if (!drawComposition(canvas, composition, images, background)) {
      throw new Error("Canvas unavailable")
    }
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/png")
    )
    if (!blob) throw new Error("PNG encoding failed")

    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "combined-image.png"
    link.click()
    window.setTimeout(() => URL.revokeObjectURL(url), 0)
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}
