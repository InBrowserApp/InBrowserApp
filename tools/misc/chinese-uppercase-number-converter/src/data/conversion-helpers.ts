import {
  BIG_UNIT_VALUES,
  COMPLETE_TEXT,
  DIGIT_VALUES,
  FEN_UNIT,
  JIAO_UNIT,
  NORMALIZE_MAP,
  SMALL_UNITS,
  SMALL_UNIT_VALUES,
  ZERO_TEXT,
} from './conversion-constants'

export function normalizeUppercaseInput(input: string): string {
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

export function convertIntegerPart(
  integer: string,
  digits: string[],
  groupUnits: string[],
): string {
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

export function formatFractionPart(
  fraction: string,
  digits: string[],
  integerText: string,
): string {
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

export function parseChineseIntegerPart(input: string): bigint | null {
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

    /* c8 ignore next */
    return null
  }

  if (number !== null) {
    section += number
  }

  total += section

  return total
}

export function parseFractionPart(input: string): { jiao: number; fen: number } | null {
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

export function formatNumberString(integerValue: bigint, jiao: number, fen: number): string {
  const integerText = integerValue.toString()

  if (jiao === 0 && fen === 0) {
    return integerText
  }

  const decimal = `${jiao}${fen}`.replace(/0+$/, '')
  return decimal ? `${integerText}.${decimal}` : integerText
}
