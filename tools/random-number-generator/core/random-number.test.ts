import { describe, expect, test } from "vitest"

import {
  MAX_HISTORY_ITEMS,
  addHistoryEntry,
  applyPreset,
  formatRandomNumber,
  formatRandomNumbers,
  generateRandomNumbers,
  getInputPrecision,
  getInputStep,
  hasCountError,
  hasRangeError,
  normalizeDecimalPlaces,
  normalizeRandomCount,
  resolveRangeInfo,
} from "./random-number"

describe("normalizeRandomCount", () => {
  test("defaults to 1 for invalid values and clamps valid values", () => {
    expect(normalizeRandomCount(undefined)).toBe(1)
    expect(normalizeRandomCount(Number.NaN)).toBe(1)
    expect(normalizeRandomCount(0)).toBe(1)
    expect(normalizeRandomCount(120)).toBe(100)
    expect(normalizeRandomCount(4.8)).toBe(4)
  })
})

describe("normalizeDecimalPlaces", () => {
  test("defaults to 0 for invalid values and clamps valid values", () => {
    expect(normalizeDecimalPlaces(undefined)).toBe(0)
    expect(normalizeDecimalPlaces(Number.NaN)).toBe(0)
    expect(normalizeDecimalPlaces(-2)).toBe(0)
    expect(normalizeDecimalPlaces(9)).toBe(6)
    expect(normalizeDecimalPlaces(2.9)).toBe(2)
  })
})

describe("getInputPrecision and getInputStep", () => {
  test("uses decimal precision only in decimal mode", () => {
    expect(getInputPrecision("integer", 4)).toBe(0)
    expect(getInputPrecision("decimal", 4)).toBe(4)
    expect(getInputStep("integer", 4)).toBe(1)
    expect(getInputStep("decimal", 3)).toBe(0.001)
  })
})

describe("resolveRangeInfo", () => {
  test("returns null when either bound is invalid", () => {
    expect(resolveRangeInfo(null, 10, "integer", 0)).toBeNull()
    expect(resolveRangeInfo(1, Number.NaN, "integer", 0)).toBeNull()
  })

  test("calculates integer and decimal ranges", () => {
    expect(resolveRangeInfo(1.2, 3.9, "integer", 0)).toEqual({
      factor: 1,
      scaledMin: 2,
      scaledMax: 3,
      range: 2,
    })

    expect(resolveRangeInfo(1.24, 1.28, "decimal", 2)).toEqual({
      factor: 100,
      scaledMin: 124,
      scaledMax: 128,
      range: 5,
    })
  })
})

describe("hasRangeError and hasCountError", () => {
  test("reports range and count errors", () => {
    const validRange = resolveRangeInfo(1, 3, "integer", 0)
    const invalidRange = resolveRangeInfo(4, 2, "integer", 0)

    expect(hasRangeError(validRange)).toBe(false)
    expect(hasRangeError(invalidRange)).toBe(true)
    expect(hasRangeError(null)).toBe(true)
    expect(hasCountError(validRange, true, 10)).toBe(false)
    expect(hasCountError(validRange, false, 4)).toBe(true)
    expect(hasCountError(null, false, 4)).toBe(false)
  })
})

describe("formatRandomNumber and formatRandomNumbers", () => {
  test("formats integers, decimals, and negative zero", () => {
    expect(formatRandomNumber(12, "integer", 0)).toBe("12")
    expect(formatRandomNumber(-0, "decimal", 2)).toBe("0.00")
    expect(formatRandomNumbers([1.2, 1.234], "decimal", 2)).toEqual([
      "1.20",
      "1.23",
    ])
  })
})

describe("generateRandomNumbers", () => {
  test("generates repeated integer values inside the requested range", () => {
    const values = generateRandomNumbers(
      {
        minValue: 1,
        maxValue: 6,
        count: 4,
        allowRepeat: true,
        numberType: "integer",
        decimalPlaces: 0,
      },
      (() => {
        const sequence = [0, 0.24, 0.5, 0.99]
        let index = 0

        return () => sequence[index++]!
      })()
    )

    expect(values).toEqual([1, 2, 4, 6])
  })

  test("generates unique decimal values when duplicates are disallowed", () => {
    const values = generateRandomNumbers(
      {
        minValue: 1.1,
        maxValue: 1.3,
        count: 3,
        allowRepeat: false,
        numberType: "decimal",
        decimalPlaces: 1,
      },
      (() => {
        const sequence = [0, 0.2, 0.9, 0.1, 0.5]
        let index = 0

        return () => sequence[index++]!
      })()
    )

    expect(values).toHaveLength(3)
    expect(new Set(values)).toEqual(new Set([1.1, 1.2, 1.3]))
  })

  test("returns an empty list for invalid ranges or impossible counts", () => {
    expect(
      generateRandomNumbers({
        minValue: 5,
        maxValue: 4,
        count: 1,
        allowRepeat: true,
        numberType: "integer",
        decimalPlaces: 0,
      })
    ).toEqual([])

    expect(
      generateRandomNumbers({
        minValue: 1,
        maxValue: 3,
        count: 5,
        allowRepeat: false,
        numberType: "integer",
        decimalPlaces: 0,
      })
    ).toEqual([])
  })
})

describe("addHistoryEntry", () => {
  test("ignores empty results, deduplicates snapshots, and caps history", () => {
    const createId = (() => {
      let index = 0

      return () => `entry-${index++}`
    })()

    const initial = addHistoryEntry([], [], { createId })
    expect(initial).toEqual([])

    const once = addHistoryEntry(initial, ["1"], { createId })
    expect(once).toEqual([{ id: "entry-0", values: ["1"] }])

    expect(addHistoryEntry(once, ["1"], { createId })).toEqual(once)

    const many = Array.from({ length: MAX_HISTORY_ITEMS + 2 }).reduce<
      ReturnType<typeof addHistoryEntry>
    >(
      (historyEntries, _, index) =>
        addHistoryEntry(historyEntries, [`${index}`], { createId }),
      once
    )

    expect(many).toHaveLength(MAX_HISTORY_ITEMS)
    expect(many[0]?.values).toEqual(["21"])
    expect(many.at(-1)?.values).toEqual(["2"])
  })
})

describe("applyPreset", () => {
  test("returns the expected settings for each preset", () => {
    expect(applyPreset("dice")).toEqual({
      minValue: 1,
      maxValue: 6,
      count: 1,
      allowRepeat: true,
      numberType: "integer",
    })
    expect(applyPreset("ten")).toEqual({
      minValue: 1,
      maxValue: 10,
      count: 1,
      allowRepeat: true,
      numberType: "integer",
    })
    expect(applyPreset("hundred")).toEqual({
      minValue: 1,
      maxValue: 100,
      count: 1,
      allowRepeat: true,
      numberType: "integer",
    })
    expect(applyPreset("lotto")).toEqual({
      minValue: 1,
      maxValue: 49,
      count: 6,
      allowRepeat: false,
      numberType: "integer",
    })
  })
})
