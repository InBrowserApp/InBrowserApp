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
    const quality = normalizeQuality(options.quality)
    const method = normalizeMethod(options.method)
    const lossless = options.lossless ? 1 : 0

    const imageData = drawImageToData(image, outputWidth, outputHeight)
    const encodeOptions = buildEncodeOptions(options, { quality, method, lossless })
    const encoded = await encode(imageData, encodeOptions)
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

function normalizeQuality(value: number) {
  if (!Number.isFinite(value)) return 80
  return Math.min(100, Math.max(0, Math.round(value)))
}

function normalizeMethod(value: number) {
  if (!Number.isFinite(value)) return 4
  return Math.min(6, Math.max(0, Math.round(value)))
}

function buildEncodeOptions(
  options: WebpConversionOptions,
  base: { quality: number; method: number; lossless: number },
) {
  const encodeOptions: Record<string, number> = {
    quality: base.quality,
    method: base.method,
    lossless: base.lossless,
  }

  addNumberOption(encodeOptions, 'target_size', options.targetSize, (value) =>
    Math.max(0, Math.round(value)),
  )
  addNumberOption(encodeOptions, 'target_PSNR', options.targetPsnr)
  addNumberOption(encodeOptions, 'alpha_quality', options.alphaQuality)
  addNumberOption(encodeOptions, 'near_lossless', options.nearLossless)
  addNumberOption(encodeOptions, 'sns_strength', options.snsStrength)
  addNumberOption(encodeOptions, 'filter_strength', options.filterStrength)
  addNumberOption(encodeOptions, 'filter_sharpness', options.filterSharpness)
  addNumberOption(encodeOptions, 'filter_type', options.filterType)
  addNumberOption(encodeOptions, 'partitions', options.partitions)
  addNumberOption(encodeOptions, 'segments', options.segments)
  addNumberOption(encodeOptions, 'pass', options.pass)
  addBooleanOption(encodeOptions, 'exact', options.exact)
  addBooleanOption(encodeOptions, 'use_sharp_yuv', options.useSharpYuv)

  return encodeOptions
}

function addNumberOption(
  options: Record<string, number>,
  key: string,
  value: number | undefined,
  transform?: (value: number) => number,
) {
  if (!Number.isFinite(value)) return
  const nextValue = transform ? transform(value) : value
  options[key] = nextValue
}

function addBooleanOption(
  options: Record<string, number>,
  key: string,
  value: boolean | undefined,
) {
  if (value === undefined) return
  options[key] = value ? 1 : 0
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
