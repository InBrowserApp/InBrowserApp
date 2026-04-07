import type { ResizeOptions } from "../core/resize-image"

export const DEFAULT_OPTIONS = {
  algorithm: "high-quality",
  allowUpscale: false,
  height: 1080,
  keepAspectRatio: true,
  outputFormat: "auto",
  quality: 92,
  width: 1920,
} as const satisfies ResizeOptions

export const OPTION_STORAGE_KEY = "tools:image-resizer:options"

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
