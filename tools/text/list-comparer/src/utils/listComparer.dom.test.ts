import { describe, expect, it } from 'vitest'
import {
  DEFAULT_CUSTOM_DELIMITER,
  DEFAULT_DELIMITER_MODE,
  DEFAULT_LIST_COMPARER_TAB,
  compareLists,
  formatDuplicateItemsForExport,
  formatItemsForExport,
  normalizeDelimiterMode,
  normalizeListComparerTab,
  parseListInput,
  splitListInput,
  type ListComparerOptions,
} from './listComparer'

const baseOptions: ListComparerOptions = {
  delimiterMode: 'newline',
  customDelimiter: DEFAULT_CUSTOM_DELIMITER,
  trimItems: true,
  ignoreCase: false,
  omitEmptyItems: true,
  sortResults: false,
}

describe('splitListInput', () => {
  it('splits newline input across unix and windows endings', () => {
    expect(splitListInput('a\r\nb\nc', 'newline')).toEqual(['a', 'b', 'c'])
  })

  it('splits tab-delimited input', () => {
    expect(splitListInput('a\tb\tc', 'tab')).toEqual(['a', 'b', 'c'])
  })

  it('returns the full input when custom delimiter is blank', () => {
    expect(splitListInput('a|b|c', 'custom', '')).toEqual(['a|b|c'])
  })

  it('falls back to newline splitting when the delimiter mode is invalid', () => {
    expect(splitListInput('a\nb', 'invalid')).toEqual(['a', 'b'])
  })
})

describe('state normalization', () => {
  it('falls back to the default delimiter mode when the stored value is invalid', () => {
    expect(normalizeDelimiterMode('comma')).toBe('comma')
    expect(normalizeDelimiterMode('invalid')).toBe(DEFAULT_DELIMITER_MODE)
  })

  it('falls back to the default results tab when the stored value is invalid', () => {
    expect(normalizeListComparerTab('right-only')).toBe('right-only')
    expect(normalizeListComparerTab('invalid')).toBe(DEFAULT_LIST_COMPARER_TAB)
  })
})

describe('parseListInput', () => {
  it('trims values, removes empty items, and tracks duplicates', () => {
    const result = parseListInput(' apple \n\nbanana\nbanana\n ', baseOptions)

    expect(result.totalCount).toBe(3)
    expect(result.uniqueCount).toBe(2)
    expect(result.duplicateCount).toBe(1)
    expect(result.uniqueItems).toEqual(['apple', 'banana'])
    expect(result.duplicateItems).toEqual([{ value: 'banana', count: 2 }])
  })

  it('keeps blank values when omitEmptyItems is disabled', () => {
    const result = parseListInput('\nvalue\n', {
      ...baseOptions,
      trimItems: false,
      omitEmptyItems: false,
    })

    expect(result.totalCount).toBe(3)
    expect(result.uniqueItems).toEqual(['', 'value'])
    expect(result.duplicateItems).toEqual([{ value: '', count: 2 }])
  })

  it('sorts duplicate items when requested', () => {
    const result = parseListInput('beta\talpha\tbeta\talpha', {
      ...baseOptions,
      delimiterMode: 'tab',
      sortResults: true,
    })

    expect(result.uniqueItems).toEqual(['alpha', 'beta'])
    expect(result.duplicateItems).toEqual([
      { value: 'alpha', count: 2 },
      { value: 'beta', count: 2 },
    ])
  })
})

describe('compareLists', () => {
  it('builds common, left-only, right-only, and union outputs in source order', () => {
    const result = compareLists('alpha\nbeta\nbeta\ngamma', 'beta\ngamma\ndelta', baseOptions)

    expect(result.left.totalCount).toBe(4)
    expect(result.right.totalCount).toBe(3)
    expect(result.commonItems).toEqual(['beta', 'gamma'])
    expect(result.leftOnlyItems).toEqual(['alpha'])
    expect(result.rightOnlyItems).toEqual(['delta'])
    expect(result.unionItems).toEqual(['alpha', 'beta', 'gamma', 'delta'])
  })

  it('supports case-insensitive comparison and preserves left-side display values', () => {
    const result = compareLists('Banana\nKiwi', 'banana\nkiwi\npear', {
      ...baseOptions,
      ignoreCase: true,
    })

    expect(result.commonItems).toEqual(['Banana', 'Kiwi'])
    expect(result.rightOnlyItems).toEqual(['pear'])
  })

  it('supports comma-delimited input and sorted result output', () => {
    const result = compareLists('zeta,alpha,beta', 'beta,gamma', {
      ...baseOptions,
      delimiterMode: 'comma',
      sortResults: true,
    })

    expect(result.leftOnlyItems).toEqual(['alpha', 'zeta'])
    expect(result.unionItems).toEqual(['alpha', 'beta', 'gamma', 'zeta'])
  })
})

describe('export formatters', () => {
  it('formats plain items as newline-separated text', () => {
    expect(formatItemsForExport(['a', 'b'])).toBe('a\nb')
  })

  it('formats duplicate items as tab-separated rows', () => {
    expect(formatDuplicateItemsForExport([{ value: 'banana', count: 3 }])).toBe('banana\t3')
  })
})
