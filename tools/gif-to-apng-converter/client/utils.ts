function formatNumber(value: number, locale: string, fractionDigits: number) {
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits: fractionDigits,
    minimumFractionDigits: fractionDigits,
  }).format(value)
}

function formatBytes(bytes: number, locale: string) {
  if (bytes < 1024) {
    return `${formatNumber(bytes, locale, 0)} B`
  }

  if (bytes < 1024 * 1024) {
    return `${formatNumber(bytes / 1024, locale, 1)} KB`
  }

  return `${formatNumber(bytes / (1024 * 1024), locale, 1)} MB`
}

function formatInteger(value: number, locale: string) {
  return formatNumber(value, locale, 0)
}

function formatDeltaText(
  originalBytes: number,
  outputBytes: number,
  locale: string
) {
  const delta = outputBytes - originalBytes
  const sign = delta > 0 ? "+" : delta < 0 ? "-" : ""
  const absoluteDelta = Math.abs(delta)
  const percent = originalBytes > 0 ? delta / originalBytes : 0
  const percentFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: Math.abs(percent) >= 0.1 ? 0 : 1,
    signDisplay: "exceptZero",
    style: "percent",
  })

  return `${sign}${formatBytes(absoluteDelta, locale)} (${percentFormatter.format(
    percent
  )})`
}

export { formatBytes, formatDeltaText, formatInteger }
