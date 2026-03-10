import { describe, expect, it } from 'vitest'
import { PAGE_RANGE_ERROR, getAllPages, parsePageSelection } from './page-range'

describe('page-range', () => {
  it('returns all pages when input is empty', () => {
    expect(getAllPages(3)).toEqual([1, 2, 3])
    expect(parsePageSelection('', 3)).toEqual([1, 2, 3])
    expect(parsePageSelection('  ', 2)).toEqual([1, 2])
  })

  it('parses mixed ranges and single pages in order', () => {
    expect(parsePageSelection('1-3, 5, 8-9', 10)).toEqual([1, 2, 3, 5, 8, 9])
  })

  it('throws invalid token error', () => {
    expect(() => parsePageSelection('1-', 10)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
    expect(() => parsePageSelection('1,,3', 10)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
    expect(() => parsePageSelection(',', 10)).toThrow(PAGE_RANGE_ERROR.InvalidToken)
  })

  it('throws out-of-bounds error', () => {
    expect(() => parsePageSelection('1,100', 10)).toThrow(PAGE_RANGE_ERROR.OutOfBounds)
  })

  it('throws descending range error', () => {
    expect(() => parsePageSelection('5-2', 10)).toThrow(PAGE_RANGE_ERROR.DescendingRange)
  })

  it('throws duplicate page error', () => {
    expect(() => parsePageSelection('1-3,3', 10)).toThrow(PAGE_RANGE_ERROR.DuplicatePage)
  })
})
