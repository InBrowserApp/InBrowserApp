import { describe, expect, it } from "vitest"
import {
  decimalNumber,
  emptyDms,
  formatDms,
  fromDecimal,
  toDecimal,
} from "./coordinates"

describe("DMS coordinate conversion", () => {
  it("parses decimal punctuation and rejects incomplete and non-decimal values", () => {
    expect(decimalNumber(" −0,5 ")).toBe(-0.5)
    expect(decimalNumber("٣٥٫٦٨١٢٤")).toBe(35.68124)
    for (const invalid of ["", "-", "0x10", "0.0.3"]) {
      expect(decimalNumber(invalid)).toBeNaN()
    }
  })

  it("handles hemisphere, fractional seconds and rounding carry", () => {
    expect(fromDecimal("-0", 90)).toEqual({
      ...emptyDms,
      degrees: "0",
      minutes: "0",
      seconds: "0",
      negative: true,
    })
    expect(fromDecimal("-123.500125", 180)).toEqual({
      degrees: "123",
      minutes: "30",
      seconds: "0.45",
      negative: true,
    })
    expect(fromDecimal("12.999999999", 90)).toEqual({
      degrees: "13",
      minutes: "0",
      seconds: "0",
      negative: false,
    })
    expect(fromDecimal("90.01", 90)).toBeUndefined()
    expect(fromDecimal("no", 180)).toBeUndefined()
  })

  it("converts components and checks the axis limits", () => {
    expect(
      toDecimal(
        { ...emptyDms, degrees: "40", minutes: "30", negative: true },
        90
      )
    ).toBe("-40.5")
    expect(toDecimal({ ...emptyDms, degrees: "180" }, 180)).toBe("180")
    expect(toDecimal(emptyDms, 90)).toBeUndefined()
    for (const fields of [
      { degrees: "1.5" },
      { degrees: "-1" },
      { minutes: "a" },
      { minutes: "0.5" },
      { minutes: "-1" },
      { minutes: "60" },
      { seconds: "a" },
      { seconds: "-1" },
      { seconds: "60" },
      { degrees: "90", seconds: "1" },
    ]) {
      expect(
        toDecimal({ ...emptyDms, degrees: "5", ...fields }, 90)
      ).toBeUndefined()
    }
  })

  it("formats a copyable coordinate with conventional symbols", () => {
    expect(formatDms({ ...emptyDms, degrees: "50" }, "N", "S")).toBe(
      "50° 0′ 0″ N"
    )
    expect(
      formatDms(
        { degrees: "2", minutes: "15", seconds: "1.5", negative: true },
        "E",
        "W"
      )
    ).toBe("2° 15′ 1.5″ W")
  })
})
