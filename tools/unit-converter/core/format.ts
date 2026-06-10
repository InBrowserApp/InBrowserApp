// Output formatting controlled by a significant-figures setting.
//
// `value.toPrecision(n)` rounds to n significant figures and removes most
// floating-point noise; wrapping it in `Number(...)` collapses trailing
// zeros, and `String(...)` picks a readable plain/exponential form. This is
// deterministic and easy to test, which the 100% core coverage bar needs.

const PRECISION_OPTIONS = ["4", "6", "10", "max"] as const

type PrecisionOption = (typeof PRECISION_OPTIONS)[number]

const DEFAULT_PRECISION: PrecisionOption = "6"

function significantDigits(option: PrecisionOption): number {
  return option === "max" ? 15 : Number(option)
}

function formatNumber(value: number, option: PrecisionOption): string {
  if (!Number.isFinite(value)) {
    return ""
  }

  if (value === 0) {
    return "0"
  }

  const rounded = Number(value.toPrecision(significantDigits(option)))

  return String(rounded)
}

export { DEFAULT_PRECISION, formatNumber, PRECISION_OPTIONS, significantDigits }
export type { PrecisionOption }
