import { ADMIN_REGION_CODES } from './adminRegionCodes'

export type ResidentIdGender = 'male' | 'female' | 'unknown'

export interface ResidentIdValidationResult {
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
}

const RESIDENT_ID_FORMAT = /^\d{17}[\dX]$/
const CHECKSUM_WEIGHTS = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]
const CHECKSUM_DIGITS = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2']

export function normalizeResidentId(input: string): string {
  return input.replace(/[\s-]/g, '').toUpperCase()
}

export function getResidentIdCheckDigit(core: string): string | null {
  if (!/^\d{17}$/.test(core)) return null

  let sum = 0
  for (let i = 0; i < core.length; i += 1) {
    sum += Number(core[i]) * CHECKSUM_WEIGHTS[i]
  }

  const remainder = sum % 11
  return CHECKSUM_DIGITS[remainder] ?? null
}

function getAge(birthDate: Date, now: Date): number {
  const nowYear = now.getUTCFullYear()
  const nowMonth = now.getUTCMonth()
  const nowDay = now.getUTCDate()
  const birthYear = birthDate.getUTCFullYear()
  const birthMonth = birthDate.getUTCMonth()
  const birthDay = birthDate.getUTCDate()

  let age = nowYear - birthYear
  if (nowMonth < birthMonth || (nowMonth === birthMonth && nowDay < birthDay)) {
    age -= 1
  }

  return age
}

function parseBirthDate(value: string): {
  date: Date | null
  text: string | null
  age: number | null
  isValid: boolean
} {
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

  const now = new Date()
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()))
  if (date.getTime() > today.getTime()) {
    return {
      date,
      text: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(
        day,
      ).padStart(2, '0')}`,
      age: null,
      isValid: false,
    }
  }

  return {
    date,
    text: `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(
      2,
      '0',
    )}`,
    age: getAge(date, today),
    isValid: true,
  }
}

export function validateResidentId(input: string): ResidentIdValidationResult {
  const normalized = normalizeResidentId(input)
  const length = normalized.length
  const isLengthValid = length === 18
  const isFormatValid = isLengthValid && RESIDENT_ID_FORMAT.test(normalized)

  const regionCode = isFormatValid ? normalized.slice(0, 6) : null
  const provinceCode = regionCode ? `${regionCode.slice(0, 2)}0000` : null
  const cityCode = regionCode ? `${regionCode.slice(0, 4)}00` : null
  const areaCode = regionCode

  const provinceName = provinceCode ? ADMIN_REGION_CODES[provinceCode] ?? null : null
  const cityName = cityCode ? ADMIN_REGION_CODES[cityCode] ?? null : null
  const areaName = areaCode ? ADMIN_REGION_CODES[areaCode] ?? null : null
  const isRegionValid = isFormatValid && Boolean(areaName)

  const birthValue = isFormatValid ? normalized.slice(6, 14) : ''
  const birthInfo = parseBirthDate(birthValue)
  const isBirthdateValid = isFormatValid && birthInfo.isValid

  const sequenceCode = isFormatValid ? normalized.slice(14, 17) : null
  let gender: ResidentIdGender = 'unknown'
  if (sequenceCode && /^\d{3}$/.test(sequenceCode)) {
    const lastDigit = Number(sequenceCode[2])
    gender = lastDigit % 2 === 0 ? 'female' : 'male'
  }

  const expectedCheckDigit = isFormatValid
    ? getResidentIdCheckDigit(normalized.slice(0, 17))
    : null
  const actualCheckDigit = isFormatValid ? normalized[17] ?? null : null
  const isChecksumValid = Boolean(expectedCheckDigit && actualCheckDigit === expectedCheckDigit)

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
