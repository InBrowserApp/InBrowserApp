function formatBytes(bytes: number) {
  const absoluteBytes = Math.abs(bytes)
  const sign = bytes < 0 ? "-" : ""

  if (absoluteBytes < 1024) {
    return `${sign}${absoluteBytes} B`
  }

  if (absoluteBytes < 1024 * 1024) {
    return `${sign}${(absoluteBytes / 1024).toFixed(1)} KB`
  }

  return `${sign}${(absoluteBytes / (1024 * 1024)).toFixed(1)} MB`
}

function formatPercent(value: number) {
  const absoluteValue = Math.abs(value)
  const sign = value < 0 ? "-" : ""

  if (!Number.isFinite(value) || absoluteValue === 0) {
    return "0%"
  }

  if (absoluteValue >= 10) {
    return `${sign}${Math.round(absoluteValue)}%`
  }

  return `${sign}${absoluteValue.toFixed(1)}%`
}

function formatDelta(bytes: number, percent: number) {
  return `${formatBytes(bytes)} (${formatPercent(percent)})`
}

export { formatBytes, formatDelta, formatPercent }
