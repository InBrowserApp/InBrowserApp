type IMEIValidationReason =
  | "empty"
  | "invalid-length"
  | "invalid-format"
  | "invalid-checksum"
  | "valid"

type IMEIValidationResult = Readonly<{
  raw: string
  normalized: string
  length: number
  tac: string | null
  serialNumber: string | null
  expectedCheckDigit: string | null
  actualCheckDigit: string | null
  isLengthValid: boolean
  isFormatValid: boolean
  isChecksumValid: boolean
  isValid: boolean
  reason: IMEIValidationReason
}>

const DIGITS_ONLY_REGEX = /^\d+$/

function normalizeIMEI(input: string) {
  return input.replace(/[\s-]/g, "")
}

function luhnSum(value: string) {
  let sum = 0
  let shouldDouble = false

  for (let index = value.length - 1; index >= 0; index -= 1) {
    let digit = Number(value[index])

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

function getIMEICheckDigit(core: string) {
  if (!/^\d{14}$/.test(core)) {
    return null
  }

  const sum = luhnSum(`${core}0`)
  return String((10 - (sum % 10)) % 10)
}

function validateIMEI(input: string): IMEIValidationResult {
  const normalized = normalizeIMEI(input)
  const length = normalized.length
  const isLengthValid = length === 15
  const isFormatValid = DIGITS_ONLY_REGEX.test(normalized)

  const tac = isFormatValid && length >= 8 ? normalized.slice(0, 8) : null
  const serialNumber =
    isFormatValid && length >= 14 ? normalized.slice(8, 14) : null
  const expectedCheckDigit =
    isFormatValid && length >= 14
      ? getIMEICheckDigit(normalized.slice(0, 14))
      : null
  const actualCheckDigit =
    isFormatValid && length >= 15 ? normalized[14]! : null

  const isChecksumValid =
    isLengthValid &&
    isFormatValid &&
    actualCheckDigit !== null &&
    actualCheckDigit === expectedCheckDigit
  const isValid = isLengthValid && isFormatValid && isChecksumValid

  let reason: IMEIValidationReason = "valid"
  if (length === 0) {
    reason = "empty"
  } else if (!isFormatValid) {
    reason = "invalid-format"
  } else if (!isLengthValid) {
    reason = "invalid-length"
  } else if (!isChecksumValid) {
    reason = "invalid-checksum"
  }

  return {
    raw: input,
    normalized,
    length,
    tac,
    serialNumber,
    expectedCheckDigit,
    actualCheckDigit,
    isLengthValid,
    isFormatValid,
    isChecksumValid,
    isValid,
    reason,
  }
}

export {
  getIMEICheckDigit,
  normalizeIMEI,
  validateIMEI,
  type IMEIValidationReason,
  type IMEIValidationResult,
}
