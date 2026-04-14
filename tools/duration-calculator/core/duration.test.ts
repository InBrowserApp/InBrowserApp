import { describe, expect, test } from "vitest"

import {
  durationPartsToMilliseconds,
  formatIsoDuration,
  millisecondsToDurationParts,
  normalizeDurationParts,
  parseIsoDuration,
} from "./duration"

describe("duration", () => {
  test("converts duration parts to milliseconds with integer coercion", () => {
    expect(
      durationPartsToMilliseconds({
        days: 1.9,
        hours: Number.POSITIVE_INFINITY,
        minutes: 2.4,
        seconds: 3.8,
        milliseconds: 4.2,
      })
    ).toBe(86_523_004)
  })

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

  test("normalizes overflowing and negative duration parts", () => {
    expect(
      normalizeDurationParts({
        days: -1,
        hours: 27,
        minutes: 61,
        seconds: 61,
        milliseconds: 1_500,
      })
    ).toEqual({
      days: 0,
      hours: 4,
      minutes: 2,
      seconds: 2,
      milliseconds: 500,
    })
  })

  test("parses valid ISO durations including signed and fractional values", () => {
    expect(parseIsoDuration("P1DT2H3M4.005S")).toEqual({
      sign: 1,
      parts: {
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 5,
      },
    })
    expect(parseIsoDuration("-PT90S")).toEqual({
      sign: -1,
      parts: {
        days: 0,
        hours: 0,
        minutes: 1,
        seconds: 30,
        milliseconds: 0,
      },
    })
  })

  test("rejects empty or malformed ISO durations", () => {
    expect(parseIsoDuration("")).toBeNull()
    expect(parseIsoDuration("P")).toBeNull()
    expect(parseIsoDuration("1 day")).toBeNull()
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
  })
})
