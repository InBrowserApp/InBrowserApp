import { describe, expect, it } from 'vitest'
import { PAGE_RANGE_ERROR, getAllPages, parsePageSelection } from './page-range'

describe('page-range', () => {
  it('returns all pages for empty input', () => {
    expect(getAllPages(4)).toEqual([1, 2, 3, 4])
    expect(parsePageSelection('', 3)).toEqual([1, 2, 3])
    expect(parsePageSelection('   ', 2)).toEqual([1, 2])
  })

  it('parses individual pages and ranges in order', () => {
    expect(parsePageSelection('1, 3-4, 6', 6)).toEqual([1, 3, 4, 6])
    expect(parsePageSelection('1 - 2,4', 6)).toEqual([1, 2, 4])
  })

  it('rejects invalid range tokens', () => {
    expect(() => parsePageSelection('1-', 6)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
    expect(() => parsePageSelection('1,,3', 6)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
    expect(() => parsePageSelection('a', 6)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
  })

  it('rejects out-of-bounds pages and descending ranges', () => {
    expect(() => parsePageSelection('0', 6)).toThrow(PAGE_RANGE_ERROR.OutOfBounds)
    expect(() => parsePageSelection('7', 6)).toThrow(PAGE_RANGE_ERROR.OutOfBounds)
    expect(() => parsePageSelection('5-2', 6)).toThrow(PAGE_RANGE_ERROR.DescendingRange)
  })

  it('rejects duplicate pages', () => {
    expect(() => parsePageSelection('1,1', 6)).toThrow(PAGE_RANGE_ERROR.DuplicatePage)
    expect(() => parsePageSelection('2-4,3', 6)).toThrow(PAGE_RANGE_ERROR.DuplicatePage)
  })
})
