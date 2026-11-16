import { expect, test } from "vitest"
import { parsePages } from "./page-range"

test("accepts all pages and explicit ordered selections", () => {
  expect(parsePages("  ", 3)).toEqual([1, 2, 3])
  expect(parsePages(" 4, 1 - 2 ", 4)).toEqual([4, 1, 2])
})

test.each([
  ["1,", "rangeInvalid"],
  ["a", "rangeInvalid"],
  ["1.5", "rangeInvalid"],
  ["3-2", "rangeInvalid"],
  ["0", "rangeBounds"],
  ["5", "rangeBounds"],
  ["1-5", "rangeBounds"],
  ["999999999999999999", "rangeBounds"],
  ["1,1", "rangeDuplicate"],
  ["1-3,2", "rangeDuplicate"],
])("rejects invalid selection %s", (input, message) => {
  expect(() => parsePages(input, 4)).toThrow(message)
})
