import { describe, expect, test } from "vitest"

import {
  convertTimestampUnit,
  countTimestampDigits,
  detectTimestampUnit,
  fromMilliseconds,
  parseTimestampInput,
  resolveTimestampUnit,
  toMilliseconds,
} from "./timestamp"

describe("timestamp", () => {
  test("parses valid timestamp input and rejects blank or invalid values", () => {
    expect(parseTimestampInput(" 1700000000000 ")).toBe(1_700_000_000_000)
    expect(parseTimestampInput("")).toBeNull()
    expect(parseTimestampInput("Infinity")).toBeNull()
    expect(parseTimestampInput("not-a-number")).toBeNull()
  })

  test("counts digits using the floored absolute value", () => {
    expect(countTimestampDigits(0)).toBe(1)
    expect(countTimestampDigits(-1234.9)).toBe(4)
  })

  test("detects timestamp units by digit length", () => {
    expect(detectTimestampUnit(1_700_000_000)).toBe("seconds")
    expect(detectTimestampUnit(1_700_000_000_000)).toBe("milliseconds")
    expect(detectTimestampUnit(1_700_000_000_000_000_000)).toBe("nanoseconds")
  })

  test("resolves auto and fixed units", () => {
    expect(resolveTimestampUnit("auto", 1_700_000_000)).toBe("seconds")
    expect(resolveTimestampUnit("milliseconds", 1_700_000_000)).toBe(
      "milliseconds"
    )
  })

  test("converts to milliseconds from each supported unit", () => {
    expect(toMilliseconds(1_700_000_000, "seconds")).toBe(1_700_000_000_000)
    expect(toMilliseconds(1_700_000_000_000, "milliseconds")).toBe(
      1_700_000_000_000
    )
    expect(toMilliseconds(1_700_000_000_000_000_000, "nanoseconds")).toBe(
      1_700_000_000_000
    )
  })

  test("converts from milliseconds into each supported unit", () => {
    expect(fromMilliseconds(1_700_000_000_123, "seconds")).toBe(1_700_000_000)
    expect(fromMilliseconds(1_700_000_000_123, "milliseconds")).toBe(
      1_700_000_000_123
    )
    expect(fromMilliseconds(1_700_000_000_123, "nanoseconds")).toBe(
      1_700_000_000_123_000_000
    )
  })

  test("converts a timestamp between fixed units", () => {
    expect(convertTimestampUnit(1_700_000_000, "seconds", "milliseconds")).toBe(
      1_700_000_000_000
    )
    expect(
      convertTimestampUnit(1_700_000_000_000_000_000, "nanoseconds", "seconds")
    ).toBe(1_700_000_000)
  })
})
