import { describe, expect, test } from "vitest"

import {
  buildDurationMs,
  buildDurationPartsFromPreset,
  clampTimePart,
  formatPresetLabel,
  getCanReset,
  getDisplayRemainingMs,
  getRunMode,
  normalizeDurationParts,
} from "./timer"

describe("timer helpers", () => {
  test("clamps time parts to non-negative integers", () => {
    expect(clampTimePart(3.8)).toBe(3)
    expect(clampTimePart(-4)).toBe(0)
    expect(clampTimePart(Number.NaN)).toBe(0)
    expect(clampTimePart(75, 59)).toBe(59)
  })

  test("normalizes duration parts", () => {
    expect(
      normalizeDurationParts({ hours: -1, minutes: 61, seconds: 12.9 })
    ).toEqual({
      hours: 0,
      minutes: 59,
      seconds: 12,
    })
  })

  test("builds milliseconds from duration parts", () => {
    expect(buildDurationMs({ hours: 1, minutes: 2, seconds: 3 })).toBe(
      3_723_000
    )
  })

  test("builds duration parts from preset minutes", () => {
    expect(buildDurationPartsFromPreset(90)).toEqual({
      hours: 1,
      minutes: 30,
      seconds: 0,
    })
  })

  test("derives the display remaining time", () => {
    expect(
      getDisplayRemainingMs({
        running: false,
        remainingMs: 12_345,
        endTime: 0,
        nowMs: 0,
      })
    ).toBe(12_345)
    expect(
      getDisplayRemainingMs({
        running: true,
        remainingMs: 12_345,
        endTime: 5_000,
        nowMs: 5_200,
      })
    ).toBe(0)
  })

  test("derives the run mode and reset state", () => {
    expect(
      getRunMode({
        running: true,
        displayRemainingMs: 10_000,
        durationMs: 20_000,
      })
    ).toBe("pause")
    expect(
      getRunMode({
        running: false,
        displayRemainingMs: 20_000,
        durationMs: 20_000,
      })
    ).toBe("start")
    expect(
      getRunMode({
        running: false,
        displayRemainingMs: 9_000,
        durationMs: 20_000,
      })
    ).toBe("resume")

    expect(
      getCanReset({
        running: false,
        displayRemainingMs: 9_000,
        durationMs: 20_000,
      })
    ).toBe(true)
    expect(
      getCanReset({
        running: true,
        displayRemainingMs: 9_000,
        durationMs: 20_000,
      })
    ).toBe(false)
  })

  test("formats preset labels", () => {
    expect(formatPresetLabel("{minutes} min", 25)).toBe("25 min")
  })
})
