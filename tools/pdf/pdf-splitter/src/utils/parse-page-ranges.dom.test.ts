import { describe, expect, it } from 'vitest'
import { PAGE_RANGE_ERROR, formatPagesToRanges, parsePageRanges } from './parse-page-ranges'

describe('parse-page-ranges', () => {
  it('parses ranges into ordered pages and segments', () => {
    const result = parsePageRanges('1-3,5,8-10', 12)

    expect(result.pagesInOrder).toEqual([1, 2, 3, 5, 8, 9, 10])
    expect(result.segments).toEqual([[1, 2, 3], [5], [8, 9, 10]])
  })

  it('throws on empty input', () => {
    expect(() => parsePageRanges('  ', 10)).toThrow(PAGE_RANGE_ERROR.Empty)
  })

  it('throws on invalid token', () => {
    expect(() => parsePageRanges('1-3,abc', 10)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
  })

  it('throws on out-of-bounds pages', () => {
    expect(() => parsePageRanges('1-12', 10)).toThrow(PAGE_RANGE_ERROR.OutOfBounds)
  })

  it('throws on descending ranges', () => {
    expect(() => parsePageRanges('6-3', 10)).toThrow(PAGE_RANGE_ERROR.DescendingRange)
  })

  it('throws when duplicate pages exist', () => {
    expect(() => parsePageRanges('1-3,3-5', 10)).toThrow(PAGE_RANGE_ERROR.DuplicatePage)
  })

  it('formats sorted pages into compact range string', () => {
    expect(formatPagesToRanges([1, 2, 3, 5, 8, 9, 10])).toBe('1-3,5,8-10')
  })
})
