type Dms = Readonly<{
  degrees: string
  minutes: string
  seconds: string
  negative: boolean
}>

const emptyDms: Dms = { degrees: "", minutes: "", seconds: "", negative: false }

function normalizeDecimal(value: string) {
  return value
    .trim()
    .replace(/[٠-٩۰-۹]/g, (digit) => String(digit.charCodeAt(0) % 16))
    .replace(/[,٫]/g, ".")
    .replace("−", "-")
}

function decimalNumber(value: string) {
  const normalized = normalizeDecimal(value)
  return /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)$/.test(normalized)
    ? Number(normalized)
    : Number.NaN
}

function fromDecimal(value: string, limit: number): Dms | undefined {
  const decimal = decimalNumber(value)
  if (!Number.isFinite(decimal) || Math.abs(decimal) > limit) return

  // Round the aggregate seconds so a carry is applied before splitting.
  const milliseconds = Math.round(Math.abs(decimal) * 3_600_000)
  return {
    degrees: String(Math.floor(milliseconds / 3_600_000)),
    minutes: String(Math.floor((milliseconds % 3_600_000) / 60_000)),
    seconds: String((milliseconds % 60_000) / 1000),
    negative: decimal < 0 || Object.is(decimal, -0),
  }
}

function toDecimal(value: Dms, limit: number): string | undefined {
  if (value.degrees.trim() === "") return
  const degrees = decimalNumber(value.degrees)
  const minutes = value.minutes.trim() === "" ? 0 : decimalNumber(value.minutes)
  const seconds = value.seconds.trim() === "" ? 0 : decimalNumber(value.seconds)
  if (
    !Number.isInteger(degrees) ||
    degrees < 0 ||
    !Number.isInteger(minutes) ||
    minutes < 0 ||
    minutes >= 60 ||
    !Number.isFinite(seconds) ||
    seconds < 0 ||
    seconds >= 60
  )
    return

  const decimal = degrees + minutes / 60 + seconds / 3600
  if (decimal > limit) return
  return (value.negative ? "-" : "") + decimal.toFixed(8).replace(/\.?0+$/, "")
}

function formatDms(value: Dms, positive: string, negative: string) {
  return `${normalizeDecimal(value.degrees)}° ${normalizeDecimal(value.minutes) || 0}′ ${normalizeDecimal(value.seconds) || 0}″ ${value.negative ? negative : positive}`
}

export {
  decimalNumber,
  emptyDms,
  formatDms,
  fromDecimal,
  normalizeDecimal,
  toDecimal,
}
export type { Dms }
