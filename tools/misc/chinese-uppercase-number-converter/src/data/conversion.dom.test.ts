import { describe, it, expect } from 'vitest'
import {
  parseNumberInput,
  convertNumberToUppercase,
  parseUppercaseInput,
  convertUppercaseToNumber,
} from './conversion'

describe('parseNumberInput', () => {
  it('returns empty for blank input', () => {
    const result = parseNumberInput('  ')
    expect(result.isEmpty).toBe(true)
    expect(result.isValid).toBe(false)
  })

  it('parses valid numbers with separators', () => {
    const result = parseNumberInput('001,234.50')
    expect(result.isValid).toBe(true)
    expect(result.normalized).toBe('1234.50')
    expect(result.integer).toBe('1234')
    expect(result.fraction).toBe('50')
  })

  it('accepts shorthand decimals', () => {
    const result = parseNumberInput('.5')
    expect(result.isValid).toBe(true)
    expect(result.normalized).toBe('0.5')
    expect(result.integer).toBe('0')
    expect(result.fraction).toBe('50')
  })

  it('tracks negative values', () => {
    const result = parseNumberInput('-12')
    expect(result.isValid).toBe(true)
    expect(result.isNegative).toBe(true)
    expect(result.normalized).toBe('12')
  })

  it('rejects invalid formats', () => {
    const result = parseNumberInput('12.3.4')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects too many decimals', () => {
    const result = parseNumberInput('1.234')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('tooManyDecimals')
  })

  it('rejects out of range numbers', () => {
    const result = parseNumberInput('1000000000000000')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('outOfRange')
  })
  it('rejects sign-only input', () => {
    const result = parseNumberInput('+')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })
})

describe('convertNumberToUppercase', () => {
  it('converts zero amounts', () => {
    const result = convertNumberToUppercase('0', 'simplified')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('零元整')
  })

  it('converts integer amounts', () => {
    const result = convertNumberToUppercase('12', 'simplified')
    expect(result.value).toBe('壹拾贰元整')
  })

  it('handles fractional values', () => {
    const result = convertNumberToUppercase('12.03', 'simplified')
    expect(result.value).toBe('壹拾贰元零叁分')
  })

  it('handles jiao only fractions', () => {
    const result = convertNumberToUppercase('12.30', 'simplified')
    expect(result.value).toBe('壹拾贰元叁角')
  })

  it('handles group separators', () => {
    const result = convertNumberToUppercase('100010001', 'simplified')
    expect(result.value).toBe('壹亿零壹万零壹元整')
  })

  it('handles negative values', () => {
    const result = convertNumberToUppercase('-1200.5', 'simplified')
    expect(result.value).toBe('负壹仟贰佰元伍角')
  })

  it('supports traditional output', () => {
    const result = convertNumberToUppercase('12', 'traditional')
    expect(result.value).toBe('壹拾貳圓整')
  })
  it('returns empty results for blank input', () => {
    const result = convertNumberToUppercase('  ', 'simplified')
    expect(result.isEmpty).toBe(true)
    expect(result.isValid).toBe(false)
  })

  it('returns invalid results for invalid input', () => {
    const result = convertNumberToUppercase('12.3.4', 'simplified')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('inserts zero between group units', () => {
    const result = convertNumberToUppercase('100000001', 'simplified')
    expect(result.value).toBe('壹亿零壹元整')
  })

  it('inserts zeros within groups', () => {
    const result = convertNumberToUppercase('1010', 'simplified')
    expect(result.value).toBe('壹仟零壹拾元整')
  })
})

describe('parseUppercaseInput', () => {
  it('parses simplified uppercase amounts', () => {
    const result = parseUppercaseInput('壹仟零壹元整')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('1001')
  })

  it('parses traditional uppercase amounts', () => {
    const result = parseUppercaseInput('壹拾貳圓伍角')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('12.5')
  })

  it('parses fractional-only inputs', () => {
    const result = parseUppercaseInput('伍分')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('0.05')
  })

  it('parses jiao and fen values', () => {
    const result = parseUppercaseInput('壹元叁角伍分')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('1.35')
  })

  it('accepts leading RMB symbols', () => {
    const result = parseUppercaseInput('人民币壹元整')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('1')
  })

  it('parses negative values', () => {
    const result = parseUppercaseInput('负壹元整')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('-1')
  })

  it('rejects invalid characters', () => {
    const result = parseUppercaseInput('ABC')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidCharacters')
  })

  it('rejects invalid formats', () => {
    const result = parseUppercaseInput('壹拾拾元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects invalid fractions', () => {
    const result = parseUppercaseInput('壹元角伍分')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects out of range values', () => {
    const result = parseUppercaseInput('壹仟兆元整')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('outOfRange')
  })
  it('accepts integer-only inputs', () => {
    const result = parseUppercaseInput('壹拾')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('10')
  })

  it('accepts missing fractional part', () => {
    const result = parseUppercaseInput('壹元')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('1')
  })

  it('rejects sign-only negatives', () => {
    const result = parseUppercaseInput('负')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects repeated yuan units', () => {
    const result = parseUppercaseInput('壹元元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects units before yuan', () => {
    const result = parseUppercaseInput('壹角元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects consecutive digits', () => {
    const result = parseUppercaseInput('壹贰元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects zero before small units', () => {
    const result = parseUppercaseInput('零拾元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects invalid big unit order', () => {
    const result = parseUppercaseInput('壹亿兆元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects missing integer before big units', () => {
    const result = parseUppercaseInput('万元')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })

  it('rejects mixed complete markers', () => {
    const result = parseUppercaseInput('壹元整伍分')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })
})

describe('convertUppercaseToNumber', () => {
  it('converts uppercase to numbers', () => {
    const result = convertUppercaseToNumber('零伍分')
    expect(result.isValid).toBe(true)
    expect(result.value).toBe('0.05')
  })

  it('returns empty for blank input', () => {
    const result = convertUppercaseToNumber('')
    expect(result.isEmpty).toBe(true)
    expect(result.isValid).toBe(false)
  })
  it('returns invalid results for malformed uppercase', () => {
    const result = convertUppercaseToNumber('壹元角')
    expect(result.isValid).toBe(false)
    expect(result.error).toBe('invalidFormat')
  })
})
