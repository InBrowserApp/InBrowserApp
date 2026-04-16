import isoCountryCodes from "./iso-country-codes.json"

type BICValidationType = "bic-8" | "bic-11" | "unknown"

type BICValidationResult = Readonly<{
  input: string
  normalized: string
  length: number
  type: BICValidationType
  bankCode: string | null
  countryCode: string | null
  locationCode: string | null
  branchCode: string | null
  isLengthValid: boolean
  isBankCodeValid: boolean
  isCountryCodeValid: boolean
  isCountryValid: boolean
  isLocationCodeValid: boolean
  isBranchCodeValid: boolean
  isFormatValid: boolean
  isPrimaryOffice: boolean
  isTestBIC: boolean
  isPassiveParticipant: boolean
  isValid: boolean
}>

const ISO_COUNTRY_CODE_SET = new Set(isoCountryCodes)
const BASIC_BIC_REGEX = /^[A-Z]{4}[A-Z]{2}[A-Z0-9]{2}([A-Z0-9]{3})?$/

function normalizeBIC(input: string) {
  return input.replace(/[\s-]/g, "").toUpperCase()
}

function validateBIC(input: string): BICValidationResult {
  const normalized = normalizeBIC(input)
  const length = normalized.length
  const type: BICValidationType =
    length === 8 ? "bic-8" : length === 11 ? "bic-11" : "unknown"
  const bankCode = length >= 4 ? normalized.slice(0, 4) : null
  const countryCode = length >= 6 ? normalized.slice(4, 6) : null
  const locationCode = length >= 8 ? normalized.slice(6, 8) : null
  const branchCode = length === 11 ? normalized.slice(8, 11) : null
  const isLengthValid = length === 8 || length === 11
  const isBankCodeValid = bankCode ? /^[A-Z]{4}$/.test(bankCode) : false
  const isCountryCodeValid = countryCode
    ? /^[A-Z]{2}$/.test(countryCode)
    : false
  let isCountryValid = false

  if (isCountryCodeValid) {
    isCountryValid = ISO_COUNTRY_CODE_SET.has(countryCode!)
  }
  const isLocationCodeValid = locationCode
    ? /^[A-Z0-9]{2}$/.test(locationCode)
    : false
  const isBranchCodeValid = branchCode
    ? /^[A-Z0-9]{3}$/.test(branchCode)
    : length === 8
  const isFormatValid = BASIC_BIC_REGEX.test(normalized)
  const isPrimaryOffice = type === "bic-8" || branchCode === "XXX"
  const isTestBIC = locationCode ? locationCode[1] === "0" : false
  const isPassiveParticipant = locationCode ? locationCode[1] === "1" : false
  const isValid =
    isLengthValid &&
    isBankCodeValid &&
    isCountryCodeValid &&
    isCountryValid &&
    isLocationCodeValid &&
    isBranchCodeValid &&
    isFormatValid

  return {
    input,
    normalized,
    length,
    type,
    bankCode,
    countryCode,
    locationCode,
    branchCode,
    isLengthValid,
    isBankCodeValid,
    isCountryCodeValid,
    isCountryValid,
    isLocationCodeValid,
    isBranchCodeValid,
    isFormatValid,
    isPrimaryOffice,
    isTestBIC,
    isPassiveParticipant,
    isValid,
  }
}

export { normalizeBIC, validateBIC, type BICValidationResult }
