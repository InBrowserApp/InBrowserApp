import adminRegionCodes from "./admin-region-codes.json"

type ResidentIdGender = "male" | "female" | "unknown"

type ResidentIdValidationResult = Readonly<{
  input: string
  normalized: string
  length: number
  isLengthValid: boolean
  isFormatValid: boolean
  isRegionValid: boolean
  isBirthdateValid: boolean
  isChecksumValid: boolean
  isValid: boolean
  regionCode: string | null
  provinceCode: string | null
  cityCode: string | null
  areaCode: string | null
  provinceName: string | null
  cityName: string | null
  areaName: string | null
  birthDate: Date | null
  birthDateText: string | null
  age: number | null
  gender: ResidentIdGender
  sequenceCode: string | null
  expectedCheckDigit: string | null
  actualCheckDigit: string | null
}>

type ResidentIdAnalysisResult = Readonly<
  ResidentIdValidationResult & {
    hasFormatIssue: boolean
    isPartial: boolean
  }
>

type BirthDateParseResult = Readonly<{
  date: Date | null
  text: string | null
  age: number | null
  isValid: boolean
}>

const ADMIN_REGION_CODES = adminRegionCodes as Record<string, string>
const RESIDENT_ID_FORMAT = /^\d{17}[\dX]$/
const CHECKSUM_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECKSUM_DIGITS = ["1", "0", "X", "9", "8", "7", "6", "5", "4", "3", "2"]

function normalizeResidentId(input: string) {
  return input.replace(/[\s-]/g, "").toUpperCase()
}

function getResidentIdCheckDigit(core: string): string | null {
  if (!/^\d{17}$/.test(core)) return null

  let sum = 0

  for (let index = 0; index < core.length; index += 1) {
    sum += Number(core[index]) * CHECKSUM_WEIGHTS[index]!
  }

  return CHECKSUM_DIGITS[sum % 11]!
}

function formatDateText(year: number, month: number, day: number) {
  return `${String(year).padStart(4, "0")}-${String(month).padStart(
    2,
    "0"
  )}-${String(day).padStart(2, "0")}`
}

function getAge(birthDate: Date, now: Date) {
  let age = now.getUTCFullYear() - birthDate.getUTCFullYear()

  if (
    now.getUTCMonth() < birthDate.getUTCMonth() ||
    (now.getUTCMonth() === birthDate.getUTCMonth() &&
      now.getUTCDate() < birthDate.getUTCDate())
  ) {
    age -= 1
  }

  return age
}

function parseBirthDate(value: string, now: Date): BirthDateParseResult {
  if (!/^\d{8}$/.test(value)) {
    return {
      date: null,
      text: null,
      age: null,
      isValid: false,
    }
  }

  const year = Number(value.slice(0, 4))
  const month = Number(value.slice(4, 6))
  const day = Number(value.slice(6, 8))

  if (month < 1 || month > 12) {
    return {
      date: null,
      text: null,
      age: null,
      isValid: false,
    }
  }

  const date = new Date(Date.UTC(year, month - 1, day))

  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return {
      date: null,
      text: null,
      age: null,
      isValid: false,
    }
  }

  const today = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  )
  const text = formatDateText(year, month, day)

  if (date.getTime() > today.getTime()) {
    return {
      date,
      text,
      age: null,
      isValid: false,
    }
  }

  return {
    date,
    text,
    age: getAge(date, today),
    isValid: true,
  }
}

function resolveRegion(prefixDigits: string) {
  const provinceCode =
    prefixDigits.length >= 2 ? `${prefixDigits.slice(0, 2)}0000` : null
  const cityCode =
    prefixDigits.length >= 4 ? `${prefixDigits.slice(0, 4)}00` : null
  const areaCode = prefixDigits.length >= 6 ? prefixDigits.slice(0, 6) : null

  return {
    regionCode: areaCode,
    provinceCode,
    cityCode,
    areaCode,
    provinceName: provinceCode
      ? (ADMIN_REGION_CODES[provinceCode] ?? null)
      : null,
    cityName: cityCode ? (ADMIN_REGION_CODES[cityCode] ?? null) : null,
    areaName: areaCode ? (ADMIN_REGION_CODES[areaCode] ?? null) : null,
  }
}

function analyzeResidentId(
  input: string,
  now: Date = new Date()
): ResidentIdAnalysisResult {
  const normalized = normalizeResidentId(input)
  const length = normalized.length
  const digitPrefix = normalized.match(/^\d+/)?.[0] ?? ""
  const hasFormatIssue =
    /[^0-9X]/.test(normalized) ||
    (normalized.includes("X") && normalized.indexOf("X") !== 17)
  const isPartial = length < 18 && !hasFormatIssue
  const isLengthValid = length === 18
  const isFormatValid = isLengthValid && RESIDENT_ID_FORMAT.test(normalized)

  const region = resolveRegion(digitPrefix)
  const isRegionValid = isFormatValid && region.areaName !== null

  const birthValue = digitPrefix.length >= 14 ? digitPrefix.slice(6, 14) : ""
  const birthInfo = parseBirthDate(birthValue, now)
  const isBirthdateValid = isFormatValid && birthInfo.isValid

  const sequenceCode =
    digitPrefix.length >= 17 ? digitPrefix.slice(14, 17) : null
  let gender: ResidentIdGender = "unknown"

  if (sequenceCode?.length === 3) {
    gender = Number(sequenceCode[2]) % 2 === 0 ? "female" : "male"
  }

  const expectedCheckDigit =
    digitPrefix.length >= 17
      ? getResidentIdCheckDigit(digitPrefix.slice(0, 17))
      : null
  const actualCheckDigit =
    length >= 18 && /^[\dX]$/.test(normalized[17] ?? "")
      ? normalized[17]!
      : null
  const isChecksumValid =
    isFormatValid &&
    expectedCheckDigit !== null &&
    actualCheckDigit === expectedCheckDigit
  const isValid =
    isLengthValid &&
    isFormatValid &&
    isRegionValid &&
    isBirthdateValid &&
    isChecksumValid

  return {
    input,
    normalized,
    length,
    isLengthValid,
    isFormatValid,
    isRegionValid,
    isBirthdateValid,
    isChecksumValid,
    isValid,
    ...region,
    birthDate: birthInfo.date,
    birthDateText: birthInfo.text,
    age: birthInfo.age,
    gender,
    sequenceCode,
    expectedCheckDigit,
    actualCheckDigit,
    hasFormatIssue,
    isPartial,
  }
}

function validateResidentId(
  input: string,
  now: Date = new Date()
): ResidentIdValidationResult {
  const normalized = normalizeResidentId(input)
  const length = normalized.length
  const isLengthValid = length === 18
  const isFormatValid = isLengthValid && RESIDENT_ID_FORMAT.test(normalized)

  const regionCode = isFormatValid ? normalized.slice(0, 6) : null
  const provinceCode = regionCode ? `${regionCode.slice(0, 2)}0000` : null
  const cityCode = regionCode ? `${regionCode.slice(0, 4)}00` : null
  const areaCode = regionCode

  const provinceName = provinceCode
    ? (ADMIN_REGION_CODES[provinceCode] ?? null)
    : null
  const cityName = cityCode ? (ADMIN_REGION_CODES[cityCode] ?? null) : null
  const areaName = areaCode ? (ADMIN_REGION_CODES[areaCode] ?? null) : null
  const isRegionValid = isFormatValid && areaName !== null

  const birthValue = isFormatValid ? normalized.slice(6, 14) : ""
  const birthInfo = parseBirthDate(birthValue, now)
  const isBirthdateValid = isFormatValid && birthInfo.isValid

  const sequenceCode = isFormatValid ? normalized.slice(14, 17) : null
  let gender: ResidentIdGender = "unknown"

  if (sequenceCode) {
    gender = Number(sequenceCode[2]) % 2 === 0 ? "female" : "male"
  }

  const expectedCheckDigit = isFormatValid
    ? getResidentIdCheckDigit(normalized.slice(0, 17))
    : null
  const actualCheckDigit = isFormatValid ? normalized[17]! : null
  const isChecksumValid =
    expectedCheckDigit !== null && actualCheckDigit === expectedCheckDigit
  const isValid =
    isLengthValid &&
    isFormatValid &&
    isRegionValid &&
    isBirthdateValid &&
    isChecksumValid

  return {
    input,
    normalized,
    length,
    isLengthValid,
    isFormatValid,
    isRegionValid,
    isBirthdateValid,
    isChecksumValid,
    isValid,
    regionCode,
    provinceCode,
    cityCode,
    areaCode,
    provinceName,
    cityName,
    areaName,
    birthDate: birthInfo.date,
    birthDateText: birthInfo.text,
    age: birthInfo.age,
    gender,
    sequenceCode,
    expectedCheckDigit,
    actualCheckDigit,
  }
}

export {
  analyzeResidentId,
  getResidentIdCheckDigit,
  normalizeResidentId,
  validateResidentId,
  type ResidentIdAnalysisResult,
  type ResidentIdValidationResult,
}
