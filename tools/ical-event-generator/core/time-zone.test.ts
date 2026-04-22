import { describe, expect, test } from "vitest"

import {
  addDays,
  combineDateAndTime,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateInput,
  parseTimeInput,
  toDateInputValue,
  toTimeInputValue,
  toUtcTimestamp,
} from "./time-zone"

describe("time zone helpers", () => {
  test("parses valid date and time inputs", () => {
    expect(parseDateInput("2026-04-21")).toEqual({
      year: 2026,
      month: 4,
      day: 21,
    })
    expect(parseTimeInput("09:45")).toEqual({ hour: 9, minute: 45 })
    expect(combineDateAndTime("2026-04-21", "09:45")).toEqual({
      year: 2026,
      month: 4,
      day: 21,
      hour: 9,
      minute: 45,
      second: 0,
      millisecond: 0,
    })
  })

  test("rejects invalid date and time inputs", () => {
    expect(parseDateInput("2026-02-30")).toBeNull()
    expect(parseTimeInput("24:00")).toBeNull()
    expect(combineDateAndTime("2026-02-30", "09:00")).toBeNull()
  })

  test("formats local input values and adds calendar days", () => {
    const timestampMs = new Date(2026, 3, 21, 9, 30, 0).getTime()

    expect(toDateInputValue(timestampMs)).toBe("2026-04-21")
    expect(toTimeInputValue(timestampMs)).toBe("09:30")
    expect(addDays({ year: 2026, month: 4, day: 21 }, 3)).toEqual({
      year: 2026,
      month: 4,
      day: 24,
    })
  })

  test("reports time zone offsets and converts local parts to UTC", () => {
    const parts = {
      year: 2026,
      month: 4,
      day: 21,
      hour: 9,
      minute: 0,
      second: 0,
      millisecond: 0,
    } as const

    expect(isTimeZoneSupported("UTC")).toBe(true)
    expect(getSupportedTimeZones()).toContain("UTC")
    expect(formatOffsetLabel(19_800_000)).toBe("UTC+05:30")
    expect(getTimeZoneOffsetMs(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC")).toBe(0)
    expect(toUtcTimestamp(parts, "America/Los_Angeles")).toBe(
      Date.UTC(2026, 3, 21, 16, 0, 0)
    )
  })
})
