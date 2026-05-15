import type { ImageQueueItem } from "./types"

function formatBytes(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0 B"
  }

  const units = ["B", "KB", "MB", "GB"] as const
  let unitIndex = 0
  let size = value

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  const rounded =
    size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)

  return `${rounded} ${units[unitIndex]}`
}

function formatDimensions(width: number, height: number) {
  return `${Math.round(width)} x ${Math.round(height)} px`
}

function getTotalImageSize(items: readonly ImageQueueItem[]) {
  return items.reduce((total, item) => total + item.size, 0)
}

function formatProgressLabel(
  template: string,
  completed: number,
  total: number
) {
  return template
    .replace("{completed}", String(completed))
    .replace("{total}", String(total))
}

export { formatBytes, formatDimensions, formatProgressLabel, getTotalImageSize }
