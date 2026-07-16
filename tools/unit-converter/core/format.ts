// Output formatting controlled by a significant-figures setting.
//
// Numeric precision options round with `value.toPrecision(n)`. The `max`
// option instead uses Number's shortest round-trippable representation so it
// never discards an already representable digit.

const PRECISION_OPTIONS = ["4", "6", "10", "max"] as const

type PrecisionOption = (typeof PRECISION_OPTIONS)[number]
type RoundedPrecisionOption = Exclude<PrecisionOption, "max">

const DEFAULT_PRECISION: PrecisionOption = "6"

function significantDigits(option: RoundedPrecisionOption): number {
  return Number(option)
}

function formatNumber(value: number, option: PrecisionOption): string {
  if (!Number.isFinite(value)) {
    return ""
  }

  if (value === 0) {
    return "0"
  }

  if (option === "max") {
    return String(value)
  }

  const rounded = Number(value.toPrecision(significantDigits(option)))

  return String(rounded)
}

export { DEFAULT_PRECISION, formatNumber, PRECISION_OPTIONS, significantDigits }
export type { PrecisionOption }
