function formatBytes(bytes: number) {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatPercent(value: number) {
  if (!Number.isFinite(value) || value <= 0) {
    return "0"
  }

  if (value >= 10) {
    return `${Math.round(value)}`
  }

  return value.toFixed(1)
}

function formatSavedText(originalBytes: number, outputBytes: number) {
  const delta = originalBytes - outputBytes
  const sign = delta < 0 ? "-" : ""
  const absoluteDelta = Math.abs(delta)
  const percent = originalBytes > 0 ? (absoluteDelta / originalBytes) * 100 : 0

  return `${sign}${formatBytes(absoluteDelta)} (${sign}${formatPercent(percent)}%)`
}

export { formatBytes, formatSavedText }
