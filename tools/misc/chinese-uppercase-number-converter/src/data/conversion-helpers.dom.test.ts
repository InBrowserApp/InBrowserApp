import { describe, expect, it } from 'vitest'
import { DIGITS_SIMPLIFIED } from './conversion-constants'
import {
  convertIntegerPart,
  formatFractionPart,
  formatNumberString,
  normalizeUppercaseInput,
  parseChineseIntegerPart,
  parseFractionPart,
} from './conversion-helpers'

const digits = DIGITS_SIMPLIFIED

describe('conversion helpers', () => {
  it('normalizes known symbols and keeps unknown characters', () => {
    expect(normalizeUppercaseInput(' RMB 兩X圆 ')).toBe('两X元')
  })

  it('handles integer conversion fallbacks for empty values and missing units', () => {
    expect(convertIntegerPart('', digits, [])).toBe('零')
    expect(convertIntegerPart('0000', digits, [''])).toBe('零')
    expect(convertIntegerPart('1', digits, [])).toBe('壹')
    expect(convertIntegerPart('', [], [])).toBe('')
  })

  it('formats fractional values with and without the zero separator', () => {
    expect(formatFractionPart('05', digits, '壹')).toBe('零伍分')
    expect(formatFractionPart('05', digits, '零')).toBe('伍分')
  })

  it('parses integer branches and rejects malformed unit sequences', () => {
    expect(parseChineseIntegerPart('')).toBe(0n)
    expect(parseChineseIntegerPart('拾')).toBe(10n)
    expect(parseChineseIntegerPart('壹拾佰')).toBeNull()
    expect(parseChineseIntegerPart('零拾')).toBeNull()
    expect(parseChineseIntegerPart('壹亿兆')).toBeNull()
    expect(parseChineseIntegerPart('万')).toBeNull()
    expect(parseChineseIntegerPart('A')).toBeNull()
  })

  it('parses fraction text and trims leading zeros for fen-only input', () => {
    expect(parseFractionPart('零伍分')).toEqual({ jiao: 0, fen: 5 })
    expect(parseFractionPart('整伍分')).toBeNull()
  })

  it('formats number strings and trims trailing decimal zeros', () => {
    expect(formatNumberString(12n, 1, 0)).toBe('12.1')
    expect(formatNumberString(12n, 0, 0)).toBe('12')
  })
})
