export const normalizeTextLines = (value: string): string[] => {
  const normalized = value.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
  const lines = normalized.split('\n').map((line) => line.trim())

  return lines.some((line) => line.length > 0) ? lines : []
}

export const isSupportedWatermarkImageFile = (file: File): boolean => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return type.startsWith('image/') || /\.(avif|bmp|gif|ico|jpe?g|png|svg|tiff?|webp)$/i.test(name)
}

type WatermarkImageSource = ImageBitmap | HTMLImageElement

const isPdfLibCompatibleWatermarkImage = (file: File): boolean => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  return (
    type === 'image/png' ||
    type === 'image/jpeg' ||
    type === 'image/jpg' ||
    name.endsWith('.png') ||
    name.endsWith('.jpg') ||
    name.endsWith('.jpeg')
  )
}

const loadWatermarkImageElement = async (file: File): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file)
    const image = new Image()

    image.onload = () => {
      URL.revokeObjectURL(objectUrl)
      resolve(image)
    }

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl)
      reject(new Error('watermark-image-load-failed'))
    }

    image.src = objectUrl
  })

const loadWatermarkImageSource = async (file: File): Promise<WatermarkImageSource> => {
  if (typeof createImageBitmap === 'function') {
    try {
      return await createImageBitmap(file)
    } catch {
      return loadWatermarkImageElement(file)
    }
  }

  return loadWatermarkImageElement(file)
}

const releaseWatermarkImageSource = (image: WatermarkImageSource): void => {
  if ('close' in image && typeof image.close === 'function') {
    image.close()
  }
}

const convertCanvasToBlob = async (canvas: HTMLCanvasElement): Promise<Blob> => {
  const blob = await new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, 'image/png')
  })

  if (!blob) {
    throw new Error('watermark-image-convert-failed')
  }

  return blob
}

const replaceWithPngExtension = (name: string): string => {
  const trimmed = name.trim()
  const baseName = trimmed ? trimmed.replace(/\.[^.]+$/u, '') : 'watermark'

  return `${baseName || 'watermark'}.png`
}

export const normalizeWatermarkImageFile = async (file: File): Promise<File> => {
  if (isPdfLibCompatibleWatermarkImage(file)) {
    return file
  }

  const image = await loadWatermarkImageSource(file)

  try {
    const width = 'naturalWidth' in image ? image.naturalWidth : image.width
    const height = 'naturalHeight' in image ? image.naturalHeight : image.height

    if (width < 1 || height < 1) {
      throw new Error('watermark-image-invalid-dimensions')
    }

    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(width))
    canvas.height = Math.max(1, Math.round(height))

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('watermark-image-context-unavailable')
    }

    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(image, 0, 0, canvas.width, canvas.height)

    const blob = await convertCanvasToBlob(canvas)

    return new File([blob], replaceWithPngExtension(file.name), {
      type: 'image/png',
      lastModified: Date.now(),
    })
  } finally {
    releaseWatermarkImageSource(image)
  }
}
