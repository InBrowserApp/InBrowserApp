import type { ResizeOutputFormat } from '../types'

export type EffectiveResizeOutputFormat = 'png' | 'jpeg' | 'webp'

export const AUTO_OUTPUT_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function resolveEffectiveOutputMimeType(
  fileType: string,
  format: ResizeOutputFormat,
): `image/${EffectiveResizeOutputFormat}` {
  if (format === 'png') return 'image/png'
  if (format === 'jpeg') return 'image/jpeg'
  if (format === 'webp') return 'image/webp'

  return normalizeAutoOutputMimeType(fileType)
}

export function resolveOutputDescriptor(
  fileName: string,
  fileType: string,
  format: ResizeOutputFormat,
) {
  const mimeType = resolveEffectiveOutputMimeType(fileType, format)

  return {
    mimeType,
    outputName: replaceExt(fileName, extFromMime(mimeType)),
  }
}

export function isLossyQualityEnabled(fileType: string, format: ResizeOutputFormat) {
  return resolveEffectiveOutputMimeType(fileType, format) !== 'image/png'
}

function normalizeAutoOutputMimeType(fileType: string): `image/${EffectiveResizeOutputFormat}` {
  if (AUTO_OUTPUT_MIME_TYPES.has(fileType)) {
    return fileType as `image/${EffectiveResizeOutputFormat}`
  }

  return 'image/png'
}

function extFromMime(mimeType: `image/${EffectiveResizeOutputFormat}`) {
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
