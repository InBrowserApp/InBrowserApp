import { encode } from '@jsquash/webp'
import type { WebpConversionOptions, WebpConversionResult } from '../types'

interface ImageSource {
  image: CanvasImageSource
  width: number
  height: number
  revoke?: () => void
}

export async function convertImageToWebp(
  file: File,
  options: WebpConversionOptions,
  outputName: string,
): Promise<WebpConversionResult> {
  const { image, width, height, revoke } = await loadImageSource(file)

  try {
    const scale = normalizeScale(options.scale)
    const outputWidth = Math.max(1, Math.round(width * scale))
    const outputHeight = Math.max(1, Math.round(height * scale))

    const imageData = drawImageToData(image, outputWidth, outputHeight)
    const encoded = await encode(imageData)
    const blob = new Blob([encoded], { type: 'image/webp' })

    return {
      file,
      blob,
      outputName,
      originalWidth: width,
      originalHeight: height,
      outputWidth,
      outputHeight,
    }
  } finally {
    revoke?.()
  }
}

function normalizeScale(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1
  return value / 100
}

function drawImageToData(image: CanvasImageSource, width: number, height: number) {
  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))

  const ctx = canvas.getContext('2d', { willReadFrequently: true })
  if (!ctx) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

  return ctx.getImageData(0, 0, canvas.width, canvas.height)
}

async function loadImageSource(file: File): Promise<ImageSource> {
  if ('createImageBitmap' in globalThis) {
    try {
      const bitmap = await createImageBitmap(file)
      return {
        image: bitmap,
        width: Math.max(1, bitmap.width),
        height: Math.max(1, bitmap.height),
        revoke: () => bitmap.close?.(),
      }
    } catch {
      // Fallback to HTMLImageElement loading.
    }
  }

  return loadImageElement(file)
}

async function loadImageElement(file: File): Promise<ImageSource> {
  const url = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(img)
      img.onerror = () => reject(new Error('INVALID_IMAGE'))
      img.src = url
    })

    const width = Math.max(1, image.naturalWidth || image.width || 1)
    const height = Math.max(1, image.naturalHeight || image.height || 1)

    return {
      image,
      width,
      height,
      revoke: () => URL.revokeObjectURL(url),
    }
  } catch {
    URL.revokeObjectURL(url)
    throw new Error('INVALID_IMAGE')
  }
}
