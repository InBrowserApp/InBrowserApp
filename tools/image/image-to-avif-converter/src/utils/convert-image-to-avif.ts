import { encodeAvifWithWorker } from './encode-avif-with-worker'
import {
  AVIF_MIME_TYPE,
  type AvifConversionOptions,
  type AvifConversionResult,
  type AvifEncodeOptions,
} from '../types'

interface ImageSource {
  image: CanvasImageSource
  width: number
  height: number
  revoke?: () => void
}

export async function convertImageToAvif(
  file: File,
  options: AvifConversionOptions,
  outputName: string,
): Promise<AvifConversionResult> {
  const { image, width, height, revoke } = await loadImageSource(file)

  try {
    const scale = normalizeScale(options.scale)
    const outputWidth = Math.max(1, Math.round(width * scale))
    const outputHeight = Math.max(1, Math.round(height * scale))

    const imageData = drawImageToData(image, outputWidth, outputHeight)
    const encoded = await encodeAvifWithWorker({
      pixels: imageData.data.buffer.slice(0),
      width: imageData.width,
      height: imageData.height,
      options: buildEncodeOptions(options),
    })

    return {
      file,
      blob: new Blob([encoded], { type: AVIF_MIME_TYPE }),
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

function buildEncodeOptions(options: AvifConversionOptions): AvifEncodeOptions {
  const encodeOptions: AvifEncodeOptions = {
    quality: normalizeQuality(options.quality),
    speed: normalizeSpeed(options.speed),
    lossless: options.lossless,
    bitDepth: 8,
  }

  addNumberOption(encodeOptions, 'qualityAlpha', options.alphaQuality, normalizeQuality)
  addNumberOption(encodeOptions, 'denoiseLevel', options.denoiseLevel, normalizeInteger)
  addNumberOption(encodeOptions, 'sharpness', options.sharpness, normalizeInteger)

  if (options.subsample) {
    encodeOptions.subsample = resolveSubsample(options.subsample)
  }

  if (options.tune) {
    encodeOptions.tune = resolveTune(options.tune)
  }

  if (options.enableSharpYuv) {
    encodeOptions.enableSharpYUV = true
  }

  return encodeOptions
}

function addNumberOption<K extends 'qualityAlpha' | 'denoiseLevel' | 'sharpness'>(
  options: AvifEncodeOptions,
  key: K,
  value: number | undefined,
  normalize: (value: number) => number,
) {
  if (typeof value !== 'number' || !Number.isFinite(value)) return
  options[key] = normalize(value) as AvifEncodeOptions[K]
}

function normalizeScale(value: number) {
  if (!Number.isFinite(value) || value <= 0) return 1
  return value / 100
}

function normalizeQuality(value: number) {
  if (!Number.isFinite(value)) return 75
  return Math.min(100, Math.max(0, Math.round(value)))
}

function normalizeSpeed(value: number) {
  if (!Number.isFinite(value)) return 6
  return Math.min(10, Math.max(0, Math.round(value)))
}

function normalizeInteger(value: number) {
  return Math.round(value)
}

function resolveSubsample(value: AvifConversionOptions['subsample']) {
  if (value === '422') return 1
  if (value === '444') return 2
  return 0
}

function resolveTune(value: AvifConversionOptions['tune']) {
  if (value === 'psnr') return 1
  if (value === 'ssim') return 2
  return 0
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
      // Fall back to HTMLImageElement loading for browsers or formats that fail here.
    }
  }

  return loadImageElement(file)
}

async function loadImageElement(file: File): Promise<ImageSource> {
  const url = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()
      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = () => reject(new Error('INVALID_IMAGE'))
      nextImage.src = url
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
