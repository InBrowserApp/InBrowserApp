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

const DIGITS_SIMPLIFIED = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
const DIGITS_TRADITIONAL = ['零', '壹', '貳', '參', '肆', '伍', '陸', '柒', '捌', '玖']
const SMALL_UNITS = ['', '拾', '佰', '仟']
const GROUP_UNITS_SIMPLIFIED = ['', '万', '亿', '兆']
const GROUP_UNITS_TRADITIONAL = ['', '萬', '億', '兆']
const CURRENCY_SIMPLIFIED = '元'
const CURRENCY_TRADITIONAL = '圓'
const NEGATIVE_SIMPLIFIED = '负'
const NEGATIVE_TRADITIONAL = '負'
const COMPLETE_TEXT = '整'
const ZERO_TEXT = '零'
const JIAO_UNIT = '角'
const FEN_UNIT = '分'

const MAX_INTEGER_LENGTH = 15
const MAX_INTEGER = '999999999999999'
const MAX_INTEGER_VALUE = 999999999999999n

const DIGIT_VALUES: Record<string, number> = {
  零: 0,
  〇: 0,
  壹: 1,
  贰: 2,
  貳: 2,
  叁: 3,
  參: 3,
  肆: 4,
  伍: 5,
  陆: 6,
  陸: 6,
  柒: 7,
  捌: 8,
  玖: 9,
  两: 2,
  兩: 2,
}

const SMALL_UNIT_VALUES: Record<string, bigint> = {
  拾: 10n,
  佰: 100n,
  仟: 1000n,
}

const BIG_UNIT_VALUES: Record<string, bigint> = {
  万: 10000n,
  萬: 10000n,
  亿: 100000000n,
  億: 100000000n,
  兆: 1000000000000n,
}

const NORMALIZE_MAP: Record<string, string> = {
  貳: '贰',
  參: '叁',
  陸: '陆',
  萬: '万',
  億: '亿',
  圆: '元',
  圓: '元',
  正: '整',
  負: '负',
  兩: '两',
  〇: '零',
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

function normalizeUppercaseInput(input: string): string {
  const trimmed = input.trim()
  if (!trimmed) return ''

  let normalized = trimmed.replace(/\s+/g, '')
  normalized = normalized.replace(/^人民币/, '')
  normalized = normalized.replace(/^RMB/i, '')
  normalized = normalized.replace(/[￥¥]/g, '')

  return normalized
    .split('')
    .map((char) => NORMALIZE_MAP[char] ?? char)
    .join('')
}

function convertIntegerPart(integer: string, digits: string[], groupUnits: string[]): string {
  if (integer === '0') {
    return digits[0] as string
  }

  const paddedLength = Math.ceil(integer.length / 4) * 4
  const padded = integer.padStart(paddedLength, '0')
  const groups = padded.match(/.{4}/g) ?? []

  let result = ''
  let zeroBetweenGroups = false

  groups.forEach((group, index) => {
    const groupValue = Number(group)
    const unitIndex = groups.length - 1 - index

    if (groupValue === 0) {
      if (result) {
        zeroBetweenGroups = true
      }
      return
    }

    const groupText = convertGroup(group, digits)
    const needsZero = result && (zeroBetweenGroups || groupValue < 1000)

    if (needsZero) {
      result += digits[0]
    }

    result += groupText + (groupUnits[unitIndex] ?? '')
    zeroBetweenGroups = false
  })

  return result || (digits[0] ?? '')
}

function convertGroup(group: string, digits: string[]): string {
  let result = ''
  let zeroPending = false

  for (let index = 0; index < group.length; index += 1) {
    const digit = Number(group[index])
    const unitIndex = group.length - 1 - index

    if (digit === 0) {
      zeroPending = true
      continue
    }

    if (zeroPending && result) {
      result += digits[0]
    }

    result += digits[digit] + (SMALL_UNITS[unitIndex] ?? '')
    zeroPending = false
  }

  return result
}

function formatFractionPart(fraction: string, digits: string[], integerText: string): string {
  const jiao = Number(fraction[0])
  const fen = Number(fraction[1])

  if (jiao === 0 && fen === 0) {
    return COMPLETE_TEXT
  }

  let result = ''

  if (jiao > 0) {
    result += digits[jiao] + JIAO_UNIT
  } else if (fen > 0 && integerText !== ZERO_TEXT) {
    result += ZERO_TEXT
  }

  if (fen > 0) {
    result += digits[fen] + FEN_UNIT
  }

  return result
}

function parseChineseIntegerPart(input: string): bigint | null {
  if (!input) {
    return 0n
  }

  let total = 0n
  let section = 0n
  let number: bigint | null = null
  let lastUnit = 10000n
  let lastBigUnit = 10000000000000n
  let lastWasZero = false

  for (const char of input) {
    if (char === ZERO_TEXT) {
      number = null
      lastWasZero = true
      continue
    }

    const digitValue = DIGIT_VALUES[char]
    if (digitValue !== undefined) {
      if (number !== null) {
        return null
      }
      number = BigInt(digitValue)
      lastWasZero = false
      continue
    }

    const smallUnit = SMALL_UNIT_VALUES[char]
    if (smallUnit !== undefined) {
      if (smallUnit >= lastUnit) {
        return null
      }

      if (number === null) {
        if (lastWasZero) {
          return null
        }
        number = 1n
      }

      if (number === 0n) {
        return null
      }

      section += number * smallUnit
      number = null
      lastUnit = smallUnit
      lastWasZero = false
      continue
    }

    const bigUnit = BIG_UNIT_VALUES[char]
    if (bigUnit !== undefined) {
      if (bigUnit >= lastBigUnit) {
        return null
      }

      if (section === 0n && number === null) {
        return null
      }

      section += number ?? 0n
      total += section * bigUnit
      section = 0n
      number = null
      lastUnit = 10000n
      lastBigUnit = bigUnit
      lastWasZero = false
      continue
    }

    return null
  }

  if (number !== null) {
    section += number
  }

  total += section

  return total
}

function parseFractionPart(input: string): { jiao: number; fen: number } | null {
  if (!input) {
    return { jiao: 0, fen: 0 }
  }

  if (input === COMPLETE_TEXT) {
    return { jiao: 0, fen: 0 }
  }

  if (input.includes(COMPLETE_TEXT)) {
    return null
  }

  let normalized = input

  if (!normalized.includes(JIAO_UNIT) && normalized.includes(FEN_UNIT)) {
    normalized = normalized.replace(/^零+/, '')
  }

  const digitPattern = '[零壹贰叁肆伍陆柒捌玖两]'
  const twoUnit = new RegExp(`^${digitPattern}角${digitPattern}分$`)
  const jiaoOnly = new RegExp(`^${digitPattern}角$`)
  const fenOnly = new RegExp(`^${digitPattern}分$`)

  if (twoUnit.test(normalized)) {
    const jiao = DIGIT_VALUES[normalized[0] as string] ?? 0
    const fen = DIGIT_VALUES[normalized[2] as string] ?? 0
    return { jiao, fen }
  }

  if (jiaoOnly.test(normalized)) {
    const jiao = DIGIT_VALUES[normalized[0] as string] ?? 0
    return { jiao, fen: 0 }
  }

  if (fenOnly.test(normalized)) {
    const fen = DIGIT_VALUES[normalized[0] as string] ?? 0
    return { jiao: 0, fen }
  }

  return null
}

function formatNumberString(integerValue: bigint, jiao: number, fen: number): string {
  const integerText = integerValue.toString()

  if (jiao === 0 && fen === 0) {
    return integerText
  }

  const decimal = `${jiao}${fen}`.replace(/0+$/, '')
  return decimal ? `${integerText}.${decimal}` : integerText
}
