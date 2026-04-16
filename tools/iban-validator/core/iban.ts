import ibanCountrySpecs from "./iban-country-specs.json"

type IBANCountrySpec = Readonly<{
  length: number
  structure: string
  example: string
}>

type IBANValidationResult = Readonly<{
  input: string
  normalized: string
  formatted: string
  countryCode: string | null
  expectedLength: number | null
  length: number
  checkDigits: string | null
  expectedCheckDigits: string | null
  bban: string | null
  isCountryValid: boolean
  isLengthValid: boolean
  isFormatValid: boolean
  isStructureValid: boolean
  isChecksumValid: boolean
  isValid: boolean
}>

const IBAN_COUNTRY_SPECS = ibanCountrySpecs satisfies Record<
  string,
  IBANCountrySpec
>

const BASIC_IBAN_REGEX = /^[A-Z]{2}[0-9]{2}[A-Z0-9]+$/
const BASIC_COUNTRY_REGEX = /^[A-Z]{2}[A-Z0-9]+$/
const STRUCTURE_REGEX_CACHE = new Map<string, RegExp>()

function getStructureRegex(structure: string) {
  const cached = STRUCTURE_REGEX_CACHE.get(structure)

  if (cached) {
    return cached
  }

  const blocks = structure.match(/.{3}/g) ?? []
  const pattern = blocks
    .map((block) => {
      const code = block.slice(0, 1)
      const repeats = Number.parseInt(block.slice(1), 10)
      let format = ""

      switch (code) {
        case "A":
          format = "0-9A-Za-z"
          break
        case "B":
          format = "0-9A-Z"
          break
        case "C":
          format = "A-Za-z"
          break
        case "F":
          format = "0-9"
          break
        case "L":
          format = "a-z"
          break
        case "U":
          format = "A-Z"
          break
        case "W":
          format = "0-9a-z"
          break
        default:
          format = "A-Za-z0-9"
      }

      return `([${format}]{${repeats}})`
    })
    .join("")

  const regex = new RegExp(`^${pattern}$`)
  STRUCTURE_REGEX_CACHE.set(structure, regex)
  return regex
}

function normalizeIBAN(input: string) {
  return input.replace(/[^A-Za-z0-9]/g, "").toUpperCase()
}

function formatIBAN(input: string) {
  const normalized = normalizeIBAN(input)

  if (!normalized) {
    return ""
  }

  return normalized.replace(/(.{4})/g, "$1 ").trim()
}

function mod97(value: string) {
  let remainder = 0

  for (const char of value) {
    const code = char.charCodeAt(0)

    if (code >= 48 && code <= 57) {
      remainder = (remainder * 10 + code - 48) % 97
      continue
    }

    if (code >= 65 && code <= 90) {
      const num = code - 55
      remainder = (remainder * 10 + Math.floor(num / 10)) % 97
      remainder = (remainder * 10 + (num % 10)) % 97
      continue
    }

    return Number.NaN
  }

  return remainder
}

function getExpectedCheckDigits(input: string) {
  const normalized = normalizeIBAN(input)

  if (normalized.length < 4) {
    return null
  }

  if (!BASIC_COUNTRY_REGEX.test(normalized)) {
    return null
  }

  const countryCode = normalized.slice(0, 2)
  const bban = normalized.slice(4)
  const prepared = `${bban}${countryCode}00`
  const remainder = mod97(prepared)

  if (Number.isNaN(remainder)) {
    return null
  }

  const checkDigits = 98 - remainder
  return checkDigits.toString().padStart(2, "0")
}

function getCountrySpec(countryCode: string | null) {
  if (!countryCode || !(countryCode in IBAN_COUNTRY_SPECS)) {
    return undefined
  }

  return IBAN_COUNTRY_SPECS[countryCode as keyof typeof IBAN_COUNTRY_SPECS]
}

function validateIBAN(input: string): IBANValidationResult {
  const normalized = normalizeIBAN(input)
  const length = normalized.length
  const countryCode = length >= 2 ? normalized.slice(0, 2) : null
  const checkDigits = length >= 4 ? normalized.slice(2, 4) : null
  const bban = length > 4 ? normalized.slice(4) : null
  const countrySpec = getCountrySpec(countryCode)
  const expectedLength = countrySpec?.length ?? null
  const isCountryValid = Boolean(countrySpec)
  const isLengthValid = isCountryValid ? length === expectedLength : false
  const isFormatValid = BASIC_IBAN_REGEX.test(normalized)
  const isStructureValid = countrySpec
    ? getStructureRegex(countrySpec.structure).test(bban ?? "")
    : true
  const isChecksumValid =
    isFormatValid && isLengthValid && isStructureValid
      ? mod97(`${normalized.slice(4)}${normalized.slice(0, 4)}`) === 1
      : false

  return {
    input,
    normalized,
    formatted: formatIBAN(normalized),
    countryCode,
    expectedLength,
    length,
    checkDigits,
    expectedCheckDigits: getExpectedCheckDigits(normalized),
    bban,
    isCountryValid,
    isLengthValid,
    isFormatValid,
    isStructureValid,
    isChecksumValid,
    isValid:
      isCountryValid &&
      isLengthValid &&
      isFormatValid &&
      isStructureValid &&
      isChecksumValid,
  }
}

export {
  IBAN_COUNTRY_SPECS,
  formatIBAN,
  getExpectedCheckDigits,
  normalizeIBAN,
  validateIBAN,
  type IBANValidationResult,
}
