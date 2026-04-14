import { describe, expect, test } from "vitest"

import { formatStopwatch } from "./format"

describe("formatStopwatch", () => {
  test("formats zero and negative values", () => {
    expect(formatStopwatch(0)).toBe("00:00:00.00")
    expect(formatStopwatch(-5)).toBe("00:00:00.00")
  })

  test("formats seconds with hundredths", () => {
    expect(formatStopwatch(1234)).toBe("00:00:01.23")
    expect(formatStopwatch(62_345)).toBe("00:01:02.34")
  })

  test("formats hours and preserves long hour values", () => {
    expect(formatStopwatch(3_726_789)).toBe("01:02:06.78")
    expect(formatStopwatch(100 * 3_600_000)).toBe("100:00:00.00")
  })
})
