import type { CropRect, CropResult, ExportOptions, ImageSource } from '../types'
import { loadImageElement } from './load-image'
import { normalizedRectToPixels } from './crop-math'

const MAX_OUTPUT_DIMENSION = 16384
const MAX_OUTPUT_PIXELS = 67_108_864

function resolveOutputMimeType(source: ImageSource, format: ExportOptions['format']) {
  if (format === 'png') return 'image/png'
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'webp') return 'image/webp'

  if (
    source.mimeType === 'image/png' ||
    source.mimeType === 'image/jpeg' ||
    source.mimeType === 'image/webp'
  ) {
    return source.mimeType
  }

  return 'image/png'
}

function resolveOutputExtension(mimeType: string) {
  if (mimeType === 'image/jpeg') return 'jpg'
  if (mimeType === 'image/webp') return 'webp'
  return 'png'
}

export function isLossyOutputFormat(sourceMimeType: string, format: ExportOptions['format']) {
  const mimeType =
    format === 'original'
      ? sourceMimeType
      : format === 'jpeg'
        ? 'image/jpeg'
        : format === 'webp'
          ? 'image/webp'
          : 'image/png'

  return mimeType === 'image/jpeg' || mimeType === 'image/webp'
}

export async function cropImage(
  source: ImageSource,
  cropRect: CropRect,
  exportOptions: ExportOptions,
): Promise<CropResult> {
  const cropPixels = normalizedRectToPixels(cropRect, source)
  const outputWidth = exportOptions.targetWidth ?? cropPixels.width
  const outputHeight = exportOptions.targetHeight ?? cropPixels.height

  if (
    outputWidth > MAX_OUTPUT_DIMENSION ||
    outputHeight > MAX_OUTPUT_DIMENSION ||
    outputWidth * outputHeight > MAX_OUTPUT_PIXELS
  ) {
    throw new Error('OUTPUT_TOO_LARGE')
  }

  const canvas = document.createElement('canvas')
  canvas.width = outputWidth
  canvas.height = outputHeight
  const context = canvas.getContext('2d')

  if (!context) {
    throw new Error('CANVAS_UNAVAILABLE')
  }

  const image = await loadImageElement(source.file)
  const outputMimeType = resolveOutputMimeType(source, exportOptions.format)

  if (outputMimeType === 'image/jpeg') {
    context.fillStyle = exportOptions.background
    context.fillRect(0, 0, outputWidth, outputHeight)
  } else {
    context.clearRect(0, 0, outputWidth, outputHeight)
  }

  context.drawImage(
    image,
    cropPixels.x,
    cropPixels.y,
    cropPixels.width,
    cropPixels.height,
    0,
    0,
    outputWidth,
    outputHeight,
  )

  const quality = isLossyOutputFormat(source.mimeType, exportOptions.format)
    ? exportOptions.quality / 100
    : undefined

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (value) => {
        if (value) {
          resolve(value)
        } else {
          reject(new Error('EXPORT_FAILED'))
        }
      },
      outputMimeType,
      quality,
    )
  })

  const baseName = source.file.name.replace(/\.[^.]+$/, '') || 'image'

  return {
    blob,
    outputName: `${baseName}.cropped.${resolveOutputExtension(outputMimeType)}`,
    outputWidth,
    outputHeight,
    outputMimeType,
    cropWidth: cropPixels.width,
    cropHeight: cropPixels.height,
  }
}
