import {
  CURRENCY_SIMPLIFIED,
  CURRENCY_TRADITIONAL,
  DIGITS_SIMPLIFIED,
  DIGITS_TRADITIONAL,
  GROUP_UNITS_SIMPLIFIED,
  GROUP_UNITS_TRADITIONAL,
  MAX_INTEGER,
  MAX_INTEGER_LENGTH,
  MAX_INTEGER_VALUE,
  NEGATIVE_SIMPLIFIED,
  NEGATIVE_TRADITIONAL,
} from './conversion-constants'
import {
  convertIntegerPart,
  formatFractionPart,
  formatNumberString,
  normalizeUppercaseInput,
  parseChineseIntegerPart,
  parseFractionPart,
} from './conversion-helpers'

export type UppercaseVariant = 'simplified' | 'traditional'

export type NumberParseError = 'invalidFormat' | 'tooManyDecimals' | 'outOfRange'

export type UppercaseParseError = 'invalidCharacters' | 'invalidFormat' | 'outOfRange'

export type NumberParseResult = {
  isEmpty: boolean
  isValid: boolean
  normalized: string
  integer: string
  fraction: string
  fractionRaw: string
  isNegative: boolean
  error: NumberParseError | null
}

export type UppercaseParseResult = {
  isEmpty: boolean
  isValid: boolean
  normalized: string
  value: string
  isNegative: boolean
  error: UppercaseParseError | null
}

export type ConversionResult = {
  isEmpty: boolean
  isValid: boolean
  normalized: string
  value: string
  error: NumberParseError | UppercaseParseError | null
}

export function parseNumberInput(input: string): NumberParseResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return {
      isEmpty: true,
      isValid: false,
      normalized: '',
      integer: '',
      fraction: '',
      fractionRaw: '',
      isNegative: false,
      error: null,
    }
  }

  let cleaned = trimmed.replace(/[,_\s，]/g, '')
  let isNegative = false

  if (cleaned.startsWith('-')) {
    isNegative = true
    cleaned = cleaned.slice(1)
  } else if (cleaned.startsWith('+')) {
    cleaned = cleaned.slice(1)
  }

  if (cleaned.startsWith('.')) {
    cleaned = `0${cleaned}`
  }

  if (!cleaned || cleaned === '.') {
    return {
      isEmpty: false,
      isValid: false,
      normalized: '',
      integer: '',
      fraction: '',
      fractionRaw: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  if (!/^\d+(\.\d+)?$/.test(cleaned)) {
    return {
      isEmpty: false,
      isValid: false,
      normalized: '',
      integer: '',
      fraction: '',
      fractionRaw: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  const [rawInteger = '', rawFraction = ''] = cleaned.split('.')

  if (rawFraction.length > 2) {
    return {
      isEmpty: false,
      isValid: false,
      normalized: '',
      integer: '',
      fraction: '',
      fractionRaw: '',
      isNegative,
      error: 'tooManyDecimals',
    }
  }

  const integer = rawInteger.replace(/^0+(?=\d)/, '')

  if (
    integer.length > MAX_INTEGER_LENGTH ||
    (integer.length === MAX_INTEGER_LENGTH && integer > MAX_INTEGER)
  ) {
    return {
      isEmpty: false,
      isValid: false,
      normalized: '',
      integer: '',
      fraction: '',
      fractionRaw: '',
      isNegative,
      error: 'outOfRange',
    }
  }

  const fraction = rawFraction.padEnd(2, '0')
  const normalized = rawFraction ? `${integer}.${rawFraction}` : integer

  return {
    isEmpty: false,
    isValid: true,
    normalized,
    integer,
    fraction,
    fractionRaw: rawFraction,
    isNegative,
    error: null,
  }
}

export function convertNumberToUppercase(
  input: string,
  variant: UppercaseVariant,
): ConversionResult {
  const parsed = parseNumberInput(input)

  if (parsed.isEmpty) {
    return {
      isEmpty: true,
      isValid: false,
      normalized: '',
      value: '',
      error: null,
    }
  }

  if (!parsed.isValid) {
    return {
      isEmpty: false,
      isValid: false,
      normalized: parsed.normalized,
      value: '',
      error: parsed.error,
    }
  }

  const digits = variant === 'traditional' ? DIGITS_TRADITIONAL : DIGITS_SIMPLIFIED
  const groupUnits = variant === 'traditional' ? GROUP_UNITS_TRADITIONAL : GROUP_UNITS_SIMPLIFIED
  const currencyUnit = variant === 'traditional' ? CURRENCY_TRADITIONAL : CURRENCY_SIMPLIFIED
  const negativeText = variant === 'traditional' ? NEGATIVE_TRADITIONAL : NEGATIVE_SIMPLIFIED

  const integerText = convertIntegerPart(parsed.integer, digits, groupUnits)
  const fractionText = formatFractionPart(parsed.fraction, digits, integerText)

  const isZeroValue = parsed.integer === '0' && parsed.fraction === '00'
  const signText = parsed.isNegative && !isZeroValue ? negativeText : ''

  const uppercase = `${signText}${integerText}${currencyUnit}${fractionText}`

  return {
    isEmpty: false,
    isValid: true,
    normalized: parsed.normalized,
    value: uppercase,
    error: null,
  }
}

export function parseUppercaseInput(input: string): UppercaseParseResult {
  const normalized = normalizeUppercaseInput(input)

  if (!normalized) {
    return {
      isEmpty: true,
      isValid: false,
      normalized: '',
      value: '',
      isNegative: false,
      error: null,
    }
  }

  if (!/^[零壹贰叁肆伍陆柒捌玖两拾佰仟万亿兆元角分整负]+$/.test(normalized)) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative: false,
      error: 'invalidCharacters',
    }
  }

  let working = normalized
  let isNegative = false

  if (working.startsWith('负')) {
    isNegative = true
    working = working.slice(1)
  }

  if (!working) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  const yuanIndex = working.indexOf('元')
  if (yuanIndex !== -1 && working.lastIndexOf('元') !== yuanIndex) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  let integerPart = ''
  let fractionPart = ''

  if (yuanIndex !== -1) {
    integerPart = working.slice(0, yuanIndex)
    fractionPart = working.slice(yuanIndex + 1)
  } else if (/[角分]/.test(working)) {
    integerPart = ''
    fractionPart = working
  } else {
    integerPart = working
  }

  if (integerPart && /[角分整]/.test(integerPart)) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  const integerValue = parseChineseIntegerPart(integerPart)
  if (integerValue === null) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  const fractionValue = parseFractionPart(fractionPart)
  if (!fractionValue) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'invalidFormat',
    }
  }

  if (integerValue > MAX_INTEGER_VALUE) {
    return {
      isEmpty: false,
      isValid: false,
      normalized,
      value: '',
      isNegative,
      error: 'outOfRange',
    }
  }

  const numberText = formatNumberString(integerValue, fractionValue.jiao, fractionValue.fen)
  const signedNumber = isNegative && numberText !== '0' ? `-${numberText}` : numberText

  return {
    isEmpty: false,
    isValid: true,
    normalized,
    value: signedNumber,
    isNegative,
    error: null,
  }
}

export function convertUppercaseToNumber(input: string): ConversionResult {
  const parsed = parseUppercaseInput(input)

  if (parsed.isEmpty) {
    return {
      isEmpty: true,
      isValid: false,
      normalized: '',
      value: '',
      error: null,
    }
  }

  if (!parsed.isValid) {
    return {
      isEmpty: false,
      isValid: false,
      normalized: parsed.normalized,
      value: '',
      error: parsed.error,
    }
  }

  return {
    isEmpty: false,
    isValid: true,
    normalized: parsed.normalized,
    value: parsed.value,
    error: null,
  }
}
