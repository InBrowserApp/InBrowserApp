import { optimizePNG, PngIcoConverter } from '@utils/image'

export interface ImageToIcoOptions {
  sizes: number[]
  padding: number
  backgroundEnabled: boolean
  backgroundColor: string
  optimize: boolean
}

const MaxIcoSize = 256
const MaxPadding = 40

export async function convertImageToIco(blob: Blob, options: ImageToIcoOptions): Promise<Blob> {
  const normalizedSizes = normalizeSizes(options.sizes)

  if (options.sizes.some((size) => size > MaxIcoSize)) {
    throw new Error('INVALID_SIZE')
  }

  if (normalizedSizes.length === 0) {
    throw new Error('NO_SIZES_SELECTED')
  }

  const image = await loadImage(blob)

  const pngs = await Promise.all(normalizedSizes.map((size) => renderPng(image, size, options)))

  const converter = new PngIcoConverter()
  return converter.convertToBlobAsync(pngs.map((png) => ({ png })))
}

function normalizeSizes(sizes: number[]) {
  const unique = new Set<number>()
  for (const size of sizes) {
    if (!Number.isFinite(size)) continue
    const rounded = Math.round(size)
    if (rounded <= 0 || rounded > MaxIcoSize) continue
    unique.add(rounded)
  }

  return Array.from(unique).sort((a, b) => b - a)
}

function clampPadding(padding: number) {
  if (!Number.isFinite(padding)) return 0
  return Math.min(Math.max(padding, 0), MaxPadding)
}

function loadImage(blob: Blob) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(blob)

    img.onload = () => {
      URL.revokeObjectURL(url)
      resolve(img)
    }

    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('INVALID_IMAGE'))
    }

    img.src = url
  })
}

async function renderPng(image: HTMLImageElement, size: number, options: ImageToIcoOptions) {
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  canvas.width = size
  canvas.height = size

  if (options.backgroundEnabled) {
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, size, size)
  }

  const width = image.naturalWidth || image.width
  const height = image.naturalHeight || image.height

  if (!width || !height) {
    throw new Error('INVALID_IMAGE')
  }

  const padding = clampPadding(options.padding)
  const marginPx = Math.round((padding / 100) * size)
  const innerSize = Math.max(size - marginPx * 2, 1)

  const scale = innerSize / Math.max(width, height)
  const drawWidth = Math.round(width * scale)
  const drawHeight = Math.round(height * scale)
  const x = Math.round((size - drawWidth) / 2)
  const y = Math.round((size - drawHeight) / 2)

  context.imageSmoothingEnabled = true
  context.imageSmoothingQuality = 'high'
  context.drawImage(image, x, y, drawWidth, drawHeight)

  const pngBlob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (!blob) {
        reject(new Error('IMAGE_CONVERSION_FAILED'))
        return
      }

      resolve(blob)
    }, 'image/png')
  })

  canvas.remove?.()

  if (options.optimize) {
    return optimizePNG(pngBlob)
  }

  return pngBlob
}
