import { describe, expect, test } from "vitest"

import { PAGE_RANGE_ERROR, getAllPages, parsePageSelection } from "./page-range"

describe("page range parsing", () => {
  test("returns all pages for an empty range", () => {
    expect(getAllPages(4)).toEqual([1, 2, 3, 4])
    expect(getAllPages(-1)).toEqual([])
    expect(parsePageSelection("   ", 3)).toEqual([1, 2, 3])
  })

  test("parses single pages and ascending ranges", () => {
    expect(parsePageSelection("1-3, 5, 7 - 8", 10)).toEqual([1, 2, 3, 5, 7, 8])
  })

  test("rejects malformed, out-of-bounds, descending, and duplicate ranges", () => {
    expect(() => parsePageSelection("1,,2", 4)).toThrow(
      PAGE_RANGE_ERROR.InvalidToken
    )
    expect(() => parsePageSelection("x", 4)).toThrow(
      PAGE_RANGE_ERROR.InvalidToken
    )
    expect(() => parsePageSelection("0", 4)).toThrow(
      PAGE_RANGE_ERROR.OutOfBounds
    )
    expect(() => parsePageSelection("5", 4)).toThrow(
      PAGE_RANGE_ERROR.OutOfBounds
    )
    expect(() => parsePageSelection("3-2", 4)).toThrow(
      PAGE_RANGE_ERROR.DescendingRange
    )
    expect(() => parsePageSelection("1-2,2", 4)).toThrow(
      PAGE_RANGE_ERROR.DuplicatePage
    )
  })
})
