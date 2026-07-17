// Output formatting controlled by a significant-figures setting.
//
// Numeric precision options round with `value.toPrecision(n)`. The `max`
// option instead uses Number's shortest round-trippable representation so it
// never discards an already representable digit. Output stays ungrouped and
// only localizes the decimal separator, keeping copied and swapped values safe
// to parse again in the active locale.

const PRECISION_OPTIONS = ["4", "6", "10", "max"] as const

type PrecisionOption = (typeof PRECISION_OPTIONS)[number]
type RoundedPrecisionOption = Exclude<PrecisionOption, "max">

const DEFAULT_PRECISION: PrecisionOption = "6"
const decimalSeparatorCache = new Map<string, string>()

function significantDigits(option: RoundedPrecisionOption): number {
  return Number(option)
}

function decimalSeparator(locale: string): string {
  const cached = decimalSeparatorCache.get(locale)

  if (cached) {
    return cached
  }

  let separator = "."

  try {
    separator = new Intl.NumberFormat(locale, { useGrouping: false })
      .formatToParts(1.1)
      .find((part) => part.type === "decimal")!.value
  } catch {
    // Invalid locales fall back to the portable ASCII decimal separator.
  }

  decimalSeparatorCache.set(locale, separator)
  return separator
}

function localizeDecimal(value: string, locale: string): string {
  const separator = decimalSeparator(locale)

  return separator === "." ? value : value.replace(".", separator)
}

function formatNumber(
  value: number,
  option: PrecisionOption,
  locale = "en"
): string {
  if (!Number.isFinite(value)) {
    return ""
  }

  if (value === 0) {
    return "0"
  }

  if (option === "max") {
    return localizeDecimal(String(value), locale)
  }

  const rounded = Number(value.toPrecision(significantDigits(option)))
  const safeValue = Number.isFinite(rounded) ? rounded : value

  return localizeDecimal(String(safeValue), locale)
}

export { DEFAULT_PRECISION, formatNumber, PRECISION_OPTIONS, significantDigits }
export type { PrecisionOption }
