const BYTE_UNITS = ["B", "KB", "MB", "GB"] as const

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return "0 B"
  }

  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    BYTE_UNITS.length - 1
  )
  const value = bytes / 1024 ** exponent
  const maximumFractionDigits = value >= 10 || exponent === 0 ? 0 : 1

  return `${value.toLocaleString(undefined, {
    maximumFractionDigits,
  })} ${BYTE_UNITS[exponent]}`
}

function formatPercent(value: number) {
  return `${Math.round(value * 100)}%`
}

function interpolate(
  template: string,
  replacements: Record<string, string | number>
) {
  return template.replace(/\{([^}]+)\}/g, (match, key: string) =>
    Object.hasOwn(replacements, key) ? String(replacements[key]) : match
  )
}

export { formatBytes, formatPercent, interpolate }
