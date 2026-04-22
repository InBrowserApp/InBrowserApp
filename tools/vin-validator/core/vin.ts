const TRANSLITERATION: Record<string, number> = {
  A: 1,
  B: 2,
  C: 3,
  D: 4,
  E: 5,
  F: 6,
  G: 7,
  H: 8,
  J: 1,
  K: 2,
  L: 3,
  M: 4,
  N: 5,
  P: 7,
  R: 9,
  S: 2,
  T: 3,
  U: 4,
  V: 5,
  W: 6,
  X: 7,
  Y: 8,
  Z: 9,
}

const WEIGHTS = [8, 7, 6, 5, 4, 3, 2, 10, 0, 9, 8, 7, 6, 5, 4, 3, 2]

const VIN_PATTERN = /^[A-HJ-NPR-Z0-9]+$/

export interface VINValidationResult {
  raw: string
  normalized: string
  isLengthValid: boolean
  isCharacterValid: boolean
  isCheckDigitValid: boolean
  expectedCheckDigit: string | null
  actualCheckDigit: string | null
  isValid: boolean
}

export function normalizeVIN(input: string): string {
  return input.toUpperCase().replace(/[\s-]/g, "")
}

function computeCheckDigit(vin: string): string {
  let sum = 0

  for (let i = 0; i < vin.length; i += 1) {
    const char = vin.charAt(i)
    const weight = WEIGHTS[i]!
    const numericValue = Number(char)
    const value = Number.isNaN(numericValue)
      ? (TRANSLITERATION[char] as number)
      : numericValue

    sum += value * weight
  }

  const remainder = sum % 11
  return remainder === 10 ? "X" : String(remainder)
}

export function validateVIN(input: string): VINValidationResult {
  const normalized = normalizeVIN(input)
  const isLengthValid = normalized.length === 17
  const isCharacterValid =
    normalized.length === 0 ? true : VIN_PATTERN.test(normalized)

  const expectedCheckDigit =
    isLengthValid && isCharacterValid ? computeCheckDigit(normalized) : null
  const actualCheckDigit = isLengthValid ? normalized.charAt(8) : null
  const isCheckDigitValid =
    expectedCheckDigit !== null && actualCheckDigit === expectedCheckDigit
  const isValid = isLengthValid && isCharacterValid && isCheckDigitValid

  return {
    raw: input,
    normalized,
    isLengthValid,
    isCharacterValid,
    isCheckDigitValid,
    expectedCheckDigit,
    actualCheckDigit,
    isValid,
  }
}
