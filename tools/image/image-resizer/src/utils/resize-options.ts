import type { ResizeAlgorithm, ResizeOutputFormat } from '../types'

export function normalizeDimension(value: number | null | undefined, fallback: number) {
  if (!Number.isFinite(value)) return fallback
  return Math.max(1, Math.round(value ?? fallback))
}

export function isResizeAlgorithm(value: string): value is ResizeAlgorithm {
  return (
    value === 'browser-high' ||
    value === 'bicubic' ||
    value === 'bilinear' ||
    value === 'lanczos3' ||
    value === 'nearest'
  )
}

export function isResizeOutputFormat(value: string): value is ResizeOutputFormat {
  return value === 'original' || value === 'png' || value === 'jpeg' || value === 'webp'
}
