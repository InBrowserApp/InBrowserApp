import { describe, expect, test } from "vitest"

import {
  formatDurationLabel,
  formatFraction,
  formatIsoDuration,
  millisecondsToDurationParts,
} from "./duration"

describe("duration", () => {
  test("converts milliseconds into normalized duration parts", () => {
    expect(millisecondsToDurationParts(90_061_005)).toEqual({
      days: 1,
      hours: 1,
      minutes: 1,
      seconds: 1,
      milliseconds: 5,
    })
    expect(millisecondsToDurationParts(-10)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      milliseconds: 0,
    })
  })

  test("formats normalized ISO durations", () => {
    expect(
      formatIsoDuration({
        days: 1,
        hours: 25,
        minutes: 0,
        seconds: 2,
        milliseconds: 30,
      })
    ).toBe("P2DT1H2.030S")
    expect(
      formatIsoDuration(
        {
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          milliseconds: 0,
        },
        -1
      )
    ).toBe("-PT0S")
    expect(
      formatIsoDuration({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 45,
        milliseconds: 0,
      })
    ).toBe("PT45S")
  })

  test("formats human-readable duration labels", () => {
    expect(
      formatDurationLabel({
        days: 0,
        hours: 1,
        minutes: 2,
        seconds: 3,
        milliseconds: 4,
      })
    ).toBe("0d 01:02:03.004")
    expect(
      formatDurationLabel({
        days: 1.9,
        hours: Number.POSITIVE_INFINITY,
        minutes: 2.4,
        seconds: 3.8,
        milliseconds: 4.2,
      })
    ).toBe("1d 00:02:03.004")
  })

  test("formats fractional totals and trims trailing zeros", () => {
    expect(formatFraction(1.5, 6)).toBe("1.5")
    expect(formatFraction(-0.25, 6)).toBe("-0.25")
    expect(formatFraction(Number.NaN, 6)).toBe("")
  })
})
