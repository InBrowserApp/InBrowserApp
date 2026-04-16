const MIN_ARABIC_NUMBER = 1
const MAX_ARABIC_NUMBER = 3999

const ROMAN_VALUES = [
  { value: 1000, symbol: "M" },
  { value: 900, symbol: "CM" },
  { value: 500, symbol: "D" },
  { value: 400, symbol: "CD" },
  { value: 100, symbol: "C" },
  { value: 90, symbol: "XC" },
  { value: 50, symbol: "L" },
  { value: 40, symbol: "XL" },
  { value: 10, symbol: "X" },
  { value: 9, symbol: "IX" },
  { value: 5, symbol: "V" },
  { value: 4, symbol: "IV" },
  { value: 1, symbol: "I" },
] as const

const ROMAN_SYMBOL_VALUES: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
}

type ArabicInputState =
  | { kind: "empty" }
  | { kind: "invalid" }
  | { kind: "out-of-range"; value: number }
  | { kind: "valid"; value: number }

function normalizeRomanNumeral(input: string) {
  return input.trim().toUpperCase()
}

function parseArabicInput(input: string): ArabicInputState {
  const normalized = input.trim()

  if (normalized.length === 0) {
    return { kind: "empty" }
  }

  if (!/^\d+$/u.test(normalized)) {
    return { kind: "invalid" }
  }

  const value = Number(normalized)

  if (
    !Number.isSafeInteger(value) ||
    value < MIN_ARABIC_NUMBER ||
    value > MAX_ARABIC_NUMBER
  ) {
    return { kind: "out-of-range", value }
  }

  return { kind: "valid", value }
}

function arabicToRoman(value: number) {
  if (
    !Number.isSafeInteger(value) ||
    value < MIN_ARABIC_NUMBER ||
    value > MAX_ARABIC_NUMBER
  ) {
    throw new Error("Number out of range")
  }

  let remaining = value
  let result = ""

  for (const { value: numeralValue, symbol } of ROMAN_VALUES) {
    while (remaining >= numeralValue) {
      result += symbol
      remaining -= numeralValue
    }
  }

  return result
}

function romanToArabic(input: string) {
  const normalized = normalizeRomanNumeral(input)

  if (!normalized) {
    throw new Error("Roman numeral is empty")
  }

  if (!/^[IVXLCDM]+$/u.test(normalized)) {
    throw new Error("Invalid Roman numeral")
  }

  let total = 0
  let previous = 0

  for (let index = normalized.length - 1; index >= 0; index -= 1) {
    const symbol = normalized[index]!
    const value = ROMAN_SYMBOL_VALUES[symbol]!

    if (value < previous) {
      total -= value
    } else {
      total += value
      previous = value
    }
  }

  if (
    total < MIN_ARABIC_NUMBER ||
    total > MAX_ARABIC_NUMBER ||
    arabicToRoman(total) !== normalized
  ) {
    throw new Error("Invalid Roman numeral")
  }

  return total
}

function isValidRomanNumeral(input: string) {
  try {
    romanToArabic(input)
    return true
  } catch {
    return false
  }
}

export {
  MAX_ARABIC_NUMBER,
  MIN_ARABIC_NUMBER,
  arabicToRoman,
  isValidRomanNumeral,
  normalizeRomanNumeral,
  parseArabicInput,
  romanToArabic,
}
