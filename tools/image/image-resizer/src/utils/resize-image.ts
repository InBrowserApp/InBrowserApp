import type { ImageDimensions, ResizeAlgorithm, ResizeOptions, ResizeResult } from '../types'

interface ImageSource {
  image: CanvasImageSource
  width: number
  height: number
  revoke?: () => void
}

interface ResampleOptions {
  radius: number
  kernel: (distance: number) => number
}

export async function resizeImage(file: File, options: ResizeOptions): Promise<ResizeResult> {
  const source = await loadImageSource(file)

  try {
    const dimensions = calculateOutputDimensions(
      { width: source.width, height: source.height },
      options,
    )

    const canvas = createResizedCanvas(
      source.image,
      source.width,
      source.height,
      dimensions,
      options,
    )
    const { mimeType, outputName } = resolveOutput(file.name, file.type, options.outputFormat)
    const quality = resolveQuality(mimeType, options.quality)
    const blob = await canvasToBlob(canvas, mimeType, quality)

    return {
      blob,
      outputName,
      originalWidth: source.width,
      originalHeight: source.height,
      outputWidth: dimensions.width,
      outputHeight: dimensions.height,
      mimeType,
    }
  } finally {
    source.revoke?.()
  }
}

export function calculateOutputDimensions(
  original: ImageDimensions,
  options: Pick<ResizeOptions, 'width' | 'height' | 'keepAspectRatio' | 'allowUpscale'>,
): ImageDimensions {
  const safeOriginalWidth = Math.max(1, Math.round(original.width || 1))
  const safeOriginalHeight = Math.max(1, Math.round(original.height || 1))
  const requestedWidth = Math.max(1, Math.round(options.width || 1))
  const requestedHeight = Math.max(1, Math.round(options.height || 1))

  if (!options.keepAspectRatio) {
    return applyUpscalePolicy(
      { width: requestedWidth, height: requestedHeight },
      {
        allowUpscale: options.allowUpscale,
        originalWidth: safeOriginalWidth,
        originalHeight: safeOriginalHeight,
      },
    )
  }

  const ratio = safeOriginalWidth / safeOriginalHeight
  let nextWidth = requestedWidth
  let nextHeight = Math.round(requestedWidth / ratio)

  if (nextHeight > requestedHeight) {
    nextHeight = requestedHeight
    nextWidth = Math.round(requestedHeight * ratio)
  }

  return applyUpscalePolicy(
    {
      width: Math.max(1, nextWidth),
      height: Math.max(1, nextHeight),
    },
    {
      allowUpscale: options.allowUpscale,
      originalWidth: safeOriginalWidth,
      originalHeight: safeOriginalHeight,
    },
  )
}

function applyUpscalePolicy(
  size: ImageDimensions,
  policy: { allowUpscale: boolean; originalWidth: number; originalHeight: number },
): ImageDimensions {
  if (policy.allowUpscale) return size

  const widthScale = policy.originalWidth / size.width
  const heightScale = policy.originalHeight / size.height
  const minScale = Math.min(widthScale, heightScale)

  if (minScale >= 1) return size

  const width = Math.max(1, Math.round(size.width * minScale))
  const height = Math.max(1, Math.round(size.height * minScale))

  return { width, height }
}

function createResizedCanvas(
  sourceImage: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  outputSize: ImageDimensions,
  options: Pick<ResizeOptions, 'algorithm'>,
) {
  if (options.algorithm === 'browser-high') {
    return drawWithCanvasSmoothing(sourceImage, outputSize.width, outputSize.height, 'high')
  }

  if (options.algorithm === 'nearest') {
    return drawWithCanvasSmoothing(sourceImage, outputSize.width, outputSize.height, 'low', false)
  }

  if (options.algorithm === 'bilinear') {
    return drawWithResampling(sourceImage, sourceWidth, sourceHeight, outputSize, {
      radius: 1,
      kernel: bilinearKernel,
    })
  }

  if (options.algorithm === 'bicubic') {
    return drawWithResampling(sourceImage, sourceWidth, sourceHeight, outputSize, {
      radius: 2,
      kernel: bicubicKernel,
    })
  }

  return drawWithResampling(sourceImage, sourceWidth, sourceHeight, outputSize, {
    radius: 3,
    kernel: lanczos3Kernel,
  })
}

function drawWithCanvasSmoothing(
  sourceImage: CanvasImageSource,
  width: number,
  height: number,
  quality: ImageSmoothingQuality,
  imageSmoothingEnabled = true,
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  if (!context) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  context.imageSmoothingEnabled = imageSmoothingEnabled
  context.imageSmoothingQuality = quality
  context.drawImage(sourceImage, 0, 0, width, height)

  return canvas
}

function drawWithResampling(
  sourceImage: CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  outputSize: ImageDimensions,
  sampler: ResampleOptions,
) {
  const sourceCanvas = document.createElement('canvas')
  sourceCanvas.width = sourceWidth
  sourceCanvas.height = sourceHeight

  const sourceContext = sourceCanvas.getContext('2d', { willReadFrequently: true })
  if (!sourceContext) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  sourceContext.drawImage(sourceImage, 0, 0, sourceWidth, sourceHeight)
  const sourcePixels = sourceContext.getImageData(0, 0, sourceWidth, sourceHeight)

  const targetCanvas = document.createElement('canvas')
  targetCanvas.width = outputSize.width
  targetCanvas.height = outputSize.height

  const targetContext = targetCanvas.getContext('2d', { willReadFrequently: true })
  if (!targetContext) {
    throw new Error('CANVAS_CONTEXT_UNAVAILABLE')
  }

  const targetPixels = targetContext.createImageData(outputSize.width, outputSize.height)

  const xRatio = sourceWidth / outputSize.width
  const yRatio = sourceHeight / outputSize.height

  for (let targetY = 0; targetY < outputSize.height; targetY += 1) {
    const sourceY = (targetY + 0.5) * yRatio - 0.5
    const yStart = Math.floor(sourceY - sampler.radius)
    const yEnd = Math.ceil(sourceY + sampler.radius)

    for (let targetX = 0; targetX < outputSize.width; targetX += 1) {
      const sourceX = (targetX + 0.5) * xRatio - 0.5
      const xStart = Math.floor(sourceX - sampler.radius)
      const xEnd = Math.ceil(sourceX + sampler.radius)

      let sumWeight = 0
      let sumRed = 0
      let sumGreen = 0
      let sumBlue = 0
      let sumAlpha = 0

      for (let sampleY = yStart; sampleY <= yEnd; sampleY += 1) {
        const yWeight = sampler.kernel(sourceY - sampleY)
        if (yWeight === 0) continue

        const clampedY = clamp(sampleY, 0, sourceHeight - 1)

        for (let sampleX = xStart; sampleX <= xEnd; sampleX += 1) {
          const xWeight = sampler.kernel(sourceX - sampleX)
          if (xWeight === 0) continue

          const weight = xWeight * yWeight
          const clampedX = clamp(sampleX, 0, sourceWidth - 1)
          const sourceIndex = pixelIndex(sourceWidth, clampedX, clampedY)

          sumWeight += weight
          sumRed += (sourcePixels.data[sourceIndex] ?? 0) * weight
          sumGreen += (sourcePixels.data[sourceIndex + 1] ?? 0) * weight
          sumBlue += (sourcePixels.data[sourceIndex + 2] ?? 0) * weight
          sumAlpha += (sourcePixels.data[sourceIndex + 3] ?? 0) * weight
        }
      }

      const targetIndex = pixelIndex(outputSize.width, targetX, targetY)

      if (Math.abs(sumWeight) < 1e-8) {
        const nearestX = clamp(Math.round(sourceX), 0, sourceWidth - 1)
        const nearestY = clamp(Math.round(sourceY), 0, sourceHeight - 1)
        const sourceIndex = pixelIndex(sourceWidth, nearestX, nearestY)

        targetPixels.data[targetIndex] = sourcePixels.data[sourceIndex] ?? 0
        targetPixels.data[targetIndex + 1] = sourcePixels.data[sourceIndex + 1] ?? 0
        targetPixels.data[targetIndex + 2] = sourcePixels.data[sourceIndex + 2] ?? 0
        targetPixels.data[targetIndex + 3] = sourcePixels.data[sourceIndex + 3] ?? 0
      } else {
        targetPixels.data[targetIndex] = clampByte(sumRed / sumWeight)
        targetPixels.data[targetIndex + 1] = clampByte(sumGreen / sumWeight)
        targetPixels.data[targetIndex + 2] = clampByte(sumBlue / sumWeight)
        targetPixels.data[targetIndex + 3] = clampByte(sumAlpha / sumWeight)
      }
    }
  }

  targetContext.putImageData(targetPixels, 0, 0)

  return targetCanvas
}

function bilinearKernel(distance: number) {
  const value = Math.abs(distance)
  if (value >= 1) return 0
  return 1 - value
}

function bicubicKernel(distance: number) {
  const value = Math.abs(distance)
  const tension = -0.5

  if (value <= 1) {
    return (tension + 2) * value * value * value - (tension + 3) * value * value + 1
  }

  if (value < 2) {
    return (
      tension * value * value * value -
      5 * tension * value * value +
      8 * tension * value -
      4 * tension
    )
  }

  return 0
}

function lanczos3Kernel(distance: number) {
  const value = Math.abs(distance)
  if (value === 0) return 1
  if (value >= 3) return 0
  return sinc(value) * sinc(value / 3)
}

function sinc(value: number) {
  if (value === 0) return 1

  const scaled = Math.PI * value
  return Math.sin(scaled) / scaled
}

function pixelIndex(width: number, x: number, y: number) {
  return (y * width + x) * 4
}

function clampByte(value: number) {
  return clamp(Math.round(value), 0, 255)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function resolveOutput(fileName: string, fileType: string, format: ResizeOptions['outputFormat']) {
  if (format === 'png') {
    return {
      mimeType: 'image/png',
      outputName: replaceExt(fileName, 'png'),
    }
  }

  if (format === 'jpeg') {
    return {
      mimeType: 'image/jpeg',
      outputName: replaceExt(fileName, 'jpg'),
    }
  }

  if (format === 'webp') {
    return {
      mimeType: 'image/webp',
      outputName: replaceExt(fileName, 'webp'),
    }
  }

  const safeType = normalizeOriginalType(fileType)
  return {
    mimeType: safeType,
    outputName: replaceExt(fileName, extFromMime(safeType)),
  }
}

function normalizeOriginalType(type: string) {
  if (type === 'image/jpeg' || type === 'image/png' || type === 'image/webp') {
    return type
  }
  return 'image/png'
}

function extFromMime(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/webp') return 'webp'
  return 'png'
}

function replaceExt(fileName: string, ext: string) {
  const trimmed = (fileName || 'image').trim()
  const safeName = trimmed || 'image'
  const dot = safeName.lastIndexOf('.')
  const base = dot > 0 ? safeName.slice(0, dot) : safeName
  return `${base}.${ext}`
}

function resolveQuality(mimeType: string, quality: number) {
  if (mimeType === 'image/png') return undefined
  const clamped = Number.isFinite(quality) ? clamp(Math.round(quality), 1, 100) : 92
  return clamped / 100
}

async function canvasToBlob(canvas: HTMLCanvasElement, mimeType: string, quality?: number) {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob((result) => resolve(result), mimeType, quality)
  })

  if (!blob) {
    throw new Error('IMAGE_ENCODE_FAILED')
  }

  return blob
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
      // fallback to HTMLImageElement
    }
  }

  return loadImageElement(file)
}

async function loadImageElement(file: File): Promise<ImageSource> {
  const url = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('INVALID_IMAGE'))
      element.src = url
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

export const imageResizeAlgorithms: Array<{ value: ResizeAlgorithm; labelKey: string }> = [
  { value: 'browser-high', labelKey: 'algorithmBrowserHigh' },
  { value: 'bicubic', labelKey: 'algorithmBicubic' },
  { value: 'bilinear', labelKey: 'algorithmBilinear' },
  { value: 'lanczos3', labelKey: 'algorithmLanczos3' },
  { value: 'nearest', labelKey: 'algorithmNearest' },
]
