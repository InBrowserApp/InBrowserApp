import {
  outputName,
  pixelCrop,
  transformedDimensions,
  type Crop,
  type PixelCrop,
  type Transform,
} from "../core/crop"
import type { CropResult, ImageSource, OutputFormat } from "./types"

export async function loadImage(file: File): Promise<ImageSource> {
  if (!/^image\/(png|jpeg|webp|avif|gif|bmp)$/.test(file.type)) {
    throw new Error("UNSUPPORTED_IMAGE")
  }
  if (typeof createImageBitmap === "function") {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        image: bitmap,
        width: bitmap.width,
        height: bitmap.height,
        dispose: () => bitmap.close(),
      }
    } catch {
      // Some browser decoders only support a format through <img>.
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const image = new Image()
    image.src = url
    await image.decode()
    return {
      image,
      width: image.naturalWidth,
      height: image.naturalHeight,
      dispose: () => URL.revokeObjectURL(url),
    }
  } catch (error) {
    URL.revokeObjectURL(url)
    throw error
  }
}

export function drawImage(
  canvas: HTMLCanvasElement,
  source: ImageSource,
  transform: Transform,
  area: PixelCrop,
  scale = 1,
  whiteBackground = false
) {
  canvas.width = Math.max(1, Math.round(area.width * scale))
  canvas.height = Math.max(1, Math.round(area.height * scale))
  const context = canvas.getContext("2d")
  if (!context) throw new Error("CANVAS_UNAVAILABLE")
  if (whiteBackground) {
    context.fillStyle = "#ffffff"
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  const size = transformedDimensions(source, transform.rotation)
  context.imageSmoothingQuality = "high"
  context.scale(canvas.width / area.width, canvas.height / area.height)
  context.translate(-area.x, -area.y)
  context.translate(size.width / 2, size.height / 2)
  // Flips follow the displayed axes, including after a quarter turn.
  context.scale(
    transform.flipHorizontal ? -1 : 1,
    transform.flipVertical ? -1 : 1
  )
  context.rotate((transform.rotation * Math.PI) / 180)
  context.drawImage(source.image, -source.width / 2, -source.height / 2)
}

export async function exportImage(
  source: ImageSource,
  name: string,
  crop: Crop,
  transform: Transform,
  format: OutputFormat,
  quality: number
): Promise<CropResult> {
  const area = pixelCrop(
    crop,
    transformedDimensions(source, transform.rotation)
  )
  const canvas = document.createElement("canvas")
  try {
    drawImage(canvas, source, transform, area, 1, format === "image/jpeg")
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, format, quality / 100)
    })
    if (!blob) throw new Error("ENCODING_FAILED")
    return {
      blob,
      name: outputName(name, blob.type),
      width: area.width,
      height: area.height,
    }
  } finally {
    canvas.width = 0
    canvas.height = 0
  }
}
