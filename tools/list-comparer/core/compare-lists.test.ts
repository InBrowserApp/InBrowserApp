import { describe, expect, test } from "vitest"

import {
  compareLists,
  DELIMITER_MODES,
  formatDuplicateItemsForExport,
  formatItemsForExport,
  normalizeDelimiterMode,
  normalizeResultKey,
  RESULT_KEYS,
  splitListInput,
  type ListComparerOptions,
} from "./compare-lists"

const DEFAULT_OPTIONS: ListComparerOptions = {
  delimiterMode: "newline",
  customDelimiter: "|",
  trimItems: true,
  ignoreCase: false,
  omitEmptyItems: true,
  sortResults: false,
}

describe("splitListInput", () => {
  test("supports newline, comma, tab, and custom delimiters", () => {
    expect(DELIMITER_MODES).toEqual(["newline", "comma", "tab", "custom"])
    expect(splitListInput("a\r\nb\nc", "newline")).toEqual(["a", "b", "c"])
    expect(splitListInput("a,b,c", "comma")).toEqual(["a", "b", "c"])
    expect(splitListInput("a\tb\tc", "tab")).toEqual(["a", "b", "c"])
    expect(splitListInput("a|b|c", "custom", "|")).toEqual(["a", "b", "c"])
  })

  test("returns an empty array for empty input and preserves input when custom delimiter is blank", () => {
    expect(splitListInput("", "newline")).toEqual([])
    expect(splitListInput("keep me", "custom", "")).toEqual(["keep me"])
  })

  test("normalizes invalid delimiter and result keys", () => {
    expect(normalizeDelimiterMode("nope")).toBe("newline")
    expect(normalizeResultKey("nope")).toBe("shared")
    expect(RESULT_KEYS).toEqual([
      "shared",
      "left-only",
      "right-only",
      "all-unique",
      "left-duplicates",
      "right-duplicates",
    ])
  })
})

describe("compareLists", () => {
  test("compares lists, preserves first-seen display values, and tracks duplicates", () => {
    const result = compareLists(
      " Banana \nkiwi\nbanana\npear",
      "kiwi\nmango\nbanana\nbanana",
      {
        ...DEFAULT_OPTIONS,
        ignoreCase: true,
      }
    )

    expect(result.left).toEqual({
      totalCount: 4,
      uniqueCount: 3,
      duplicateCount: 1,
      uniqueItems: ["Banana", "kiwi", "pear"],
      duplicateItems: [{ value: "Banana", count: 2 }],
    })
    expect(result.right).toEqual({
      totalCount: 4,
      uniqueCount: 3,
      duplicateCount: 1,
      uniqueItems: ["kiwi", "mango", "banana"],
      duplicateItems: [{ value: "banana", count: 2 }],
    })
    expect(result.sharedItems).toEqual(["Banana", "kiwi"])
    expect(result.leftOnlyItems).toEqual(["pear"])
    expect(result.rightOnlyItems).toEqual(["mango"])
    expect(result.allUniqueItems).toEqual(["Banana", "kiwi", "pear", "mango"])
  })

  test("can keep empty items and sort results with locale-aware numeric ordering", () => {
    const result = compareLists("item10,,item2", ",item2,item1", {
      ...DEFAULT_OPTIONS,
      delimiterMode: "comma",
      trimItems: false,
      omitEmptyItems: false,
      sortResults: true,
    })

    expect(result.left.totalCount).toBe(3)
    expect(result.right.totalCount).toBe(3)
    expect(result.sharedItems).toEqual(["", "item2"])
    expect(result.leftOnlyItems).toEqual(["item10"])
    expect(result.rightOnlyItems).toEqual(["item1"])
    expect(result.allUniqueItems).toEqual(["", "item1", "item2", "item10"])
  })

  test("sorts duplicate groups and falls back to the runtime locale when locale is blank", () => {
    const result = compareLists(
      "beta|beta|alpha|alpha|shared",
      "shared|gamma|gamma",
      {
        ...DEFAULT_OPTIONS,
        delimiterMode: "custom",
        ignoreCase: true,
        sortResults: true,
      },
      ""
    )

    expect(result.left.duplicateItems).toEqual([
      { value: "alpha", count: 2 },
      { value: "beta", count: 2 },
    ])
    expect(result.right.duplicateItems).toEqual([{ value: "gamma", count: 2 }])
    expect(result.sharedItems).toEqual(["shared"])
    expect(result.leftOnlyItems).toEqual(["alpha", "beta"])
    expect(result.rightOnlyItems).toEqual(["gamma"])
    expect(result.allUniqueItems).toEqual(["alpha", "beta", "gamma", "shared"])
  })
})

describe("export formatting", () => {
  test("formats result sets for export", () => {
    expect(formatItemsForExport(["alpha", "beta"])).toBe("alpha\nbeta")
    expect(
      formatDuplicateItemsForExport([
        { value: "alpha", count: 2 },
        { value: "beta", count: 3 },
      ])
    ).toBe("alpha\t2\nbeta\t3")
  })
})
