import { describe, expect, test } from "vitest"

import {
  PAGE_RANGE_ERROR,
  createEvenPageList,
  createOddPageList,
  createPageList,
  formatPagesToRanges,
  parsePageRanges,
} from "./page-ranges"

function expectRangeError(input: string, maxPage: number, code: string) {
  expect(() => parsePageRanges(input, maxPage)).toThrowError(code)
}

describe("parsePageRanges", () => {
  test("parses comma separated pages and inclusive ranges", () => {
    expect(parsePageRanges("1-3, 5, 8 - 10", 12)).toEqual({
      pagesInOrder: [1, 2, 3, 5, 8, 9, 10],
      segments: [[1, 2, 3], [5], [8, 9, 10]],
    })
  })

  test("rejects empty or structurally invalid input", () => {
    expectRangeError("", 10, PAGE_RANGE_ERROR.Empty)
    expectRangeError(" , ", 10, PAGE_RANGE_ERROR.Empty)
    expectRangeError("1,a", 10, PAGE_RANGE_ERROR.InvalidToken)
    expectRangeError("1--3", 10, PAGE_RANGE_ERROR.InvalidToken)
  })

  test("rejects impossible page references", () => {
    expectRangeError("0", 10, PAGE_RANGE_ERROR.OutOfBounds)
    expectRangeError("11", 10, PAGE_RANGE_ERROR.OutOfBounds)
    expectRangeError("1-11", 10, PAGE_RANGE_ERROR.OutOfBounds)
    expectRangeError("1", 0, PAGE_RANGE_ERROR.OutOfBounds)
  })

  test("rejects descending ranges and duplicate pages", () => {
    expectRangeError("4-2", 10, PAGE_RANGE_ERROR.DescendingRange)
    expectRangeError("1-3,3", 10, PAGE_RANGE_ERROR.DuplicatePage)
    expectRangeError("2,1-2", 10, PAGE_RANGE_ERROR.DuplicatePage)
  })
})

describe("formatPagesToRanges", () => {
  test("formats sorted unique contiguous pages", () => {
    expect(formatPagesToRanges([5, 1, 2, 3, 3, 9, 7, 8])).toBe("1-3,5,7-9")
  })

  test("returns an empty string when no positive integer pages remain", () => {
    expect(formatPagesToRanges([])).toBe("")
    expect(formatPagesToRanges([0, -1, 1.5])).toBe("")
  })
})

describe("page list helpers", () => {
  test("creates all, odd, and even page lists", () => {
    expect(createPageList(5)).toEqual([1, 2, 3, 4, 5])
    expect(createOddPageList(5)).toEqual([1, 3, 5])
    expect(createEvenPageList(5)).toEqual([2, 4])
    expect(createPageList(-1)).toEqual([])
    expect(createPageList(2.8)).toEqual([1, 2])
  })
})
