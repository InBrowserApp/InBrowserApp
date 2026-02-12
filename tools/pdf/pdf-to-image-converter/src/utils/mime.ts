import type { ImageFormat } from '../types'

export function getMimeType(format: ImageFormat): string {
  switch (format) {
    case 'jpeg':
      return 'image/jpeg'
    case 'webp':
      return 'image/webp'
    case 'png':
    default:
      return 'image/png'
  }
}

export function getExtension(format: ImageFormat): string {
  switch (format) {
    case 'jpeg':
      return 'jpg'
    case 'webp':
      return 'webp'
    case 'png':
    default:
      return 'png'
  }
}

export function shouldUseQuality(format: ImageFormat): boolean {
  return format === 'jpeg' || format === 'webp'
}
