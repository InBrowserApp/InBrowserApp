import type { ImageSource } from '../types'

const alphaMimeTypes = new Set([
  'image/apng',
  'image/avif',
  'image/gif',
  'image/png',
  'image/svg+xml',
  'image/webp',
])

export async function loadImageSource(file: File): Promise<ImageSource> {
  const image = await loadImageElement(file)

  return {
    file,
    width: Math.max(1, image.naturalWidth || image.width || 1),
    height: Math.max(1, image.naturalHeight || image.height || 1),
    mimeType: file.type || 'image/png',
    extension: getFileExtension(file.name),
    hasAlpha: alphaMimeTypes.has(file.type),
  }
}

export function getFileExtension(fileName: string) {
  const match = /\.([a-z0-9]+)$/i.exec(fileName)
  return match?.[1]?.toLowerCase() ?? 'png'
}

export async function loadImageElement(file: File): Promise<HTMLImageElement> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error('INVALID_IMAGE'))
      element.src = objectUrl
    })

    return image
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}
