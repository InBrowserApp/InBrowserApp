import type { Rotation } from '../types'

type LoadedImageSource = {
  width: number
  height: number
  source: CanvasImageSource
  close: () => void
}

export function getFileSignature(file: File) {
  return `${file.name}-${file.size}-${file.lastModified}`
}

export async function readImageDimensions(file: File) {
  const loadedImage = await loadImageSource(file)

  try {
    return {
      width: loadedImage.width,
      height: loadedImage.height,
    }
  } finally {
    loadedImage.close()
  }
}

export async function renderImageToJpeg(
  file: File,
  {
    rotation,
    quality,
  }: {
    rotation: Rotation
    quality: number
  },
) {
  const normalizedRotation = normalizeRotation(rotation)
  const loadedImage = await loadImageSource(file)

  try {
    const isQuarterTurn = normalizedRotation === 90 || normalizedRotation === 270
    const outputWidth = isQuarterTurn ? loadedImage.height : loadedImage.width
    const outputHeight = isQuarterTurn ? loadedImage.width : loadedImage.height
    const canvas = createCanvas(outputWidth, outputHeight)
    const context = canvas.getContext('2d')

    if (!context) {
      throw new Error('CANVAS_UNAVAILABLE')
    }

    context.fillStyle = '#ffffff'
    context.fillRect(0, 0, outputWidth, outputHeight)
    context.translate(outputWidth / 2, outputHeight / 2)
    context.rotate((normalizedRotation * Math.PI) / 180)
    context.drawImage(
      loadedImage.source,
      -loadedImage.width / 2,
      -loadedImage.height / 2,
      loadedImage.width,
      loadedImage.height,
    )

    const jpegBlob = await canvasToBlob(canvas, quality)

    return {
      bytes: await jpegBlob.arrayBuffer(),
      width: outputWidth,
      height: outputHeight,
    }
  } finally {
    loadedImage.close()
  }
}

function normalizeRotation(rotation: number): Rotation {
  const normalizedRotation = ((rotation % 360) + 360) % 360

  if (normalizedRotation === 90 || normalizedRotation === 180 || normalizedRotation === 270) {
    return normalizedRotation
  }

  return 0
}

async function loadImageSource(file: File): Promise<LoadedImageSource> {
  const bitmap = await createImageBitmapWithOrientation(file)

  if (bitmap) {
    return {
      width: Math.max(1, bitmap.width),
      height: Math.max(1, bitmap.height),
      source: bitmap,
      close: () => bitmap.close?.(),
    }
  }

  const image = await loadHtmlImage(file)

  return {
    width: Math.max(1, image.element.naturalWidth || image.element.width || 1),
    height: Math.max(1, image.element.naturalHeight || image.element.height || 1),
    source: image.element,
    close: () => URL.revokeObjectURL(image.objectUrl),
  }
}

async function createImageBitmapWithOrientation(file: File) {
  if (typeof globalThis.createImageBitmap !== 'function') {
    return null
  }

  try {
    return await globalThis.createImageBitmap(file, { imageOrientation: 'from-image' })
  } catch {
    try {
      return await globalThis.createImageBitmap(file)
    } catch {
      return null
    }
  }
}

async function loadHtmlImage(file: File) {
  const objectUrl = URL.createObjectURL(file)

  try {
    const element = await new Promise<HTMLImageElement>((resolve, reject) => {
      const image = new Image()
      image.decoding = 'async'
      image.onload = () => resolve(image)
      image.onerror = () => reject(new Error('INVALID_IMAGE'))
      image.src = objectUrl
    })

    return {
      element,
      objectUrl,
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

function createCanvas(width: number, height: number) {
  if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
    throw new Error('CANVAS_UNAVAILABLE')
  }

  const canvas = document.createElement('canvas')
  canvas.width = Math.max(1, Math.round(width))
  canvas.height = Math.max(1, Math.round(height))

  return canvas
}

function canvasToBlob(canvas: HTMLCanvasElement, quality: number) {
  if (typeof canvas.toBlob !== 'function') {
    throw new Error('CANVAS_EXPORT_FAILED')
  }

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('CANVAS_EXPORT_FAILED'))
          return
        }

        resolve(blob)
      },
      'image/jpeg',
      quality,
    )
  })
}
