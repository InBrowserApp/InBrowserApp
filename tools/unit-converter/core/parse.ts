// Locale-aware numeric input parsing.
//
// Decimal and grouping separators are never guessed. They come from
// Intl.NumberFormat for the active locale, and grouped integers must match the
// locale's primary and secondary group sizes. An explicit, ungrouped ASCII
// scientific notation remains portable across locales.

type ParseResult =
  | Readonly<{ kind: "empty" }>
  | Readonly<{ kind: "invalid" }>
  | Readonly<{ kind: "valid"; value: number }>

type LocaleNumberSyntax = Readonly<{
  decimal: string
  digits: readonly (readonly [string, string])[]
  group: string
  minusSign: string
  plusSign: string
  primaryGroupSize: number
  secondaryGroupSize: number
}>

const ASCII_DIGITS_PATTERN = /^\d+$/
const ASCII_FRACTION_PATTERN = /^\d*$/
const ASCII_SCIENTIFIC_PATTERN = /^[+-]?(?:\d+(?:\.\d*)?|\.\d+)[eE][+-]?\d+$/
const EXPONENT_PATTERN = /^[eE][+-]?\d+$/
const BIDI_CONTROL_PATTERN = /[\u061c\u200e\u200f\u202a-\u202e\u2066-\u2069]/g

const NATIVE_NUMBERING_SYSTEMS: Readonly<Partial<Record<string, string>>> = {
  ar: "arab",
  hi: "deva",
}

const syntaxCache = new Map<string, readonly LocaleNumberSyntax[]>()

function buildLocaleSyntax(locale: string): LocaleNumberSyntax {
  const digitFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    useGrouping: false,
  })
  const decimalFormatter = new Intl.NumberFormat(locale, {
    useGrouping: false,
  })
  const groupingFormatter = new Intl.NumberFormat(locale, {
    maximumFractionDigits: 0,
    useGrouping: true,
  })
  const signFormatter = new Intl.NumberFormat(locale, {
    signDisplay: "always",
    useGrouping: false,
  })

  const digits = Array.from({ length: 10 }, (_, digit) => {
    const glyph = digitFormatter
      .formatToParts(digit)
      .find((part) => part.type === "integer")!.value

    return [glyph, String(digit)] as const
  }).sort(([left], [right]) => right.length - left.length)

  const decimal = decimalFormatter
    .formatToParts(1.1)
    .find((part) => part.type === "decimal")!.value
  const groupingParts = groupingFormatter.formatToParts(1234567890123)
  const group = groupingParts.find((part) => part.type === "group")!.value
  const integerGroups = groupingParts.filter((part) => part.type === "integer")
  const primaryGroupSize = integerGroups.at(-1)!.value.length
  const secondaryGroupSize = integerGroups.at(-2)!.value.length
  const plusSign = signFormatter
    .formatToParts(1)
    .find((part) => part.type === "plusSign")!.value
  const minusSign = signFormatter
    .formatToParts(-1)
    .find((part) => part.type === "minusSign")!.value

  return {
    decimal,
    digits,
    group,
    minusSign,
    plusSign,
    primaryGroupSize,
    secondaryGroupSize,
  }
}

function localeSyntaxes(locale: string): readonly LocaleNumberSyntax[] {
  const cached = syntaxCache.get(locale)

  if (cached) {
    return cached
  }

  try {
    const localeObject = new Intl.Locale(locale)
    const localeIds = new Set([localeObject.toString()])
    const nativeNumberingSystem =
      NATIVE_NUMBERING_SYSTEMS[localeObject.language]

    if (nativeNumberingSystem) {
      localeIds.add(
        new Intl.Locale(locale, {
          numberingSystem: nativeNumberingSystem,
        }).toString()
      )
    }

    const syntaxes = [...localeIds].map(buildLocaleSyntax)
    syntaxCache.set(locale, syntaxes)

    return syntaxes
  } catch {
    return []
  }
}

function normalizeLocalizedCharacters(
  raw: string,
  syntax: LocaleNumberSyntax
): string {
  let normalized = raw.replace(BIDI_CONTROL_PATTERN, "")

  for (const [glyph, digit] of syntax.digits) {
    normalized = normalized.split(glyph).join(digit)
  }

  return normalized
    .split(syntax.plusSign)
    .join("+")
    .split(syntax.minusSign)
    .join("-")
}

function normalizeGroupedInteger(
  raw: string,
  syntax: LocaleNumberSyntax
): string | undefined {
  if (!raw.includes(syntax.group)) {
    return ASCII_DIGITS_PATTERN.test(raw) ? raw : undefined
  }

  const groups = raw.split(syntax.group)

  if (groups.some((group) => !ASCII_DIGITS_PATTERN.test(group))) {
    return undefined
  }
  if (groups.at(-1)!.length !== syntax.primaryGroupSize) {
    return undefined
  }
  if (
    groups
      .slice(1, -1)
      .some((group) => group.length !== syntax.secondaryGroupSize)
  ) {
    return undefined
  }
  if (groups[0]!.length > syntax.secondaryGroupSize) {
    return undefined
  }

  return groups.join("")
}

function finiteNumber(normalized: string): number | undefined {
  const value = Number(normalized)

  if (!Number.isFinite(value)) {
    return undefined
  }

  const coefficient = normalized.split(/[eE]/, 1)[0]!

  if (value === 0 && /[1-9]/.test(coefficient)) {
    return undefined
  }

  return value
}

function parseWithSyntax(
  raw: string,
  syntax: LocaleNumberSyntax
): number | undefined {
  let mantissa = normalizeLocalizedCharacters(raw, syntax)
  let exponent = ""
  const exponentIndex = mantissa.search(/[eE]/)

  if (exponentIndex >= 0) {
    exponent = mantissa.slice(exponentIndex)
    mantissa = mantissa.slice(0, exponentIndex)

    if (!EXPONENT_PATTERN.test(exponent)) {
      return undefined
    }
  }

  let sign = ""

  if (mantissa.startsWith("+") || mantissa.startsWith("-")) {
    sign = mantissa[0]!
    mantissa = mantissa.slice(1)
  }

  const decimalParts = mantissa.split(syntax.decimal)

  if (decimalParts.length > 2) {
    return undefined
  }

  const integerPart = decimalParts[0]!
  const fractionPart = decimalParts[1]

  if (integerPart.length === 0 && (fractionPart?.length ?? 0) === 0) {
    return undefined
  }
  if (
    fractionPart !== undefined &&
    !ASCII_FRACTION_PATTERN.test(fractionPart)
  ) {
    return undefined
  }

  let integer = "0"

  if (integerPart.length > 0) {
    const normalizedInteger = normalizeGroupedInteger(integerPart, syntax)

    if (normalizedInteger === undefined) {
      return undefined
    }

    integer = normalizedInteger
  }

  const fraction = fractionPart === undefined ? "" : `.${fractionPart}`

  return finiteNumber(`${sign}${integer}${fraction}${exponent}`)
}

function parseNumber(raw: string, locale = "en"): ParseResult {
  const trimmed = raw.trim()

  if (trimmed.length === 0) {
    return { kind: "empty" }
  }

  if (ASCII_SCIENTIFIC_PATTERN.test(trimmed)) {
    const value = finiteNumber(trimmed)

    return value === undefined ? { kind: "invalid" } : { kind: "valid", value }
  }

  for (const syntax of localeSyntaxes(locale)) {
    const value = parseWithSyntax(trimmed, syntax)

    if (value !== undefined) {
      return { kind: "valid", value }
    }
  }

  return { kind: "invalid" }
}

export { parseNumber }
