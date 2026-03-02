export type IMEIValidationReason =
  | 'empty'
  | 'invalid-length'
  | 'invalid-format'
  | 'invalid-checksum'
  | 'valid'

export interface IMEIValidationResult {
  input: string
  normalized: string
  length: number
  tac: string | null
  serialNumber: string | null
  checkDigit: string | null
  expectedCheckDigit: string | null
  isLengthValid: boolean
  isFormatValid: boolean
  isChecksumValid: boolean
  isValid: boolean
  reason: IMEIValidationReason
}

const DIGITS_ONLY_REGEX = /^\d+$/

export function normalizeIMEI(input: string): string {
  return input.replace(/[\s-]/g, '')
}

function luhnSum(value: string): number {
  let sum = 0
  let shouldDouble = false

  for (let i = value.length - 1; i >= 0; i -= 1) {
    let digit = Number(value[i])

    if (shouldDouble) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    shouldDouble = !shouldDouble
  }

  return sum
}

export function getIMEICheckDigit(core: string): string | null {
  if (!/^\d{14}$/.test(core)) {
    return null
  }

  const sum = luhnSum(`${core}0`)
  const checkDigit = (10 - (sum % 10)) % 10
  return String(checkDigit)
}

export function validateIMEI(input: string): IMEIValidationResult {
  const normalized = normalizeIMEI(input)
  const length = normalized.length
  const isLengthValid = length === 15
  const isFormatValid = DIGITS_ONLY_REGEX.test(normalized)

  const tac = isFormatValid && length >= 8 ? normalized.slice(0, 8) : null
  const serialNumber = isFormatValid && length >= 14 ? normalized.slice(8, 14) : null
  const checkDigit = isFormatValid && length >= 15 ? normalized[14]! : null
  const expectedCheckDigit =
    isFormatValid && length >= 14 ? getIMEICheckDigit(normalized.slice(0, 14)) : null

  const isChecksumValid =
    isLengthValid && isFormatValid && checkDigit !== null && checkDigit === expectedCheckDigit

  const isValid = isLengthValid && isFormatValid && isChecksumValid

  let reason: IMEIValidationReason = 'valid'
  if (length === 0) {
    reason = 'empty'
  } else if (!isLengthValid) {
    reason = 'invalid-length'
  } else if (!isFormatValid) {
    reason = 'invalid-format'
  } else if (!isChecksumValid) {
    reason = 'invalid-checksum'
  }

  return {
    input,
    normalized,
    length,
    tac,
    serialNumber,
    checkDigit,
    expectedCheckDigit,
    isLengthValid,
    isFormatValid,
    isChecksumValid,
    isValid,
    reason,
  }
}
