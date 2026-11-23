import { describe, expect, test } from "vitest"

import {
  calendarDayDifference,
  MAX_CALENDAR_DAY_OFFSET,
  parseISODateInput,
  shiftCalendarDays,
  toISODate,
  toLocalISODate,
} from "./index"

function date(value: string) {
  return parseISODateInput(value)!
}

describe("calendar dates", () => {
  test.each([
    "1900-02-29",
    "2024-02-30",
    "2024-04-31",
    "2024-13-01",
    "2024-01-00",
    "2024-1-01",
    "2024-01-01T00:00:00Z",
    "0000-01-01",
    "10000-01-01",
  ])("rejects %s", (value) => {
    expect(parseISODateInput(value)).toBeNull()
  })

  test.each(["0001-01-01", "0004-02-29", "2000-02-29", "9999-12-31"])(
    "round-trips %s exactly",
    (value) => {
      expect(toISODate(date(` ${value} `))).toBe(value)
    }
  )

  test("reads the device's local date instead of UTC", () => {
    expect(toLocalISODate(new Date(2024, 1, 29, 23, 59))).toBe("2024-02-29")
  })

  test.each([
    ["2024-02-28", "2024-03-01", 2],
    ["2025-03-01", "2025-02-28", 1],
    ["2024-03-10", "2024-03-11", 1],
    ["2024-11-03", "2024-11-04", 1],
    ["2024-04-30", "2024-04-30", 0],
    ["2011-12-29", "2011-12-31", 2],
    ["0001-01-01", "9999-12-31", MAX_CALENDAR_DAY_OFFSET],
  ])("counts the elapsed days between %s and %s", (start, end, expected) => {
    expect(calendarDayDifference(date(start), date(end))).toBe(expected)
  })

  test.each([
    ["2024-01-31", 1, "2024-02-01"],
    ["2024-03-01", -1, "2024-02-29"],
    ["2025-03-01", -1, "2025-02-28"],
    ["2024-02-29", 0, "2024-02-29"],
    ["2024-12-31", 1, "2025-01-01"],
    ["2024-03-10", 1, "2024-03-11"],
    ["2011-12-29", 1, "2011-12-30"],
    ["0001-01-01", MAX_CALENDAR_DAY_OFFSET, "9999-12-31"],
    ["9999-12-31", -MAX_CALENDAR_DAY_OFFSET, "0001-01-01"],
  ])("shifts %s by %i days", (start, offset, expected) => {
    expect(toISODate(shiftCalendarDays(date(start), offset)!)).toBe(expected)
  })

  test("rejects an offset outside the supported calendar or an integer", () => {
    expect(shiftCalendarDays(date("0001-01-01"), -1)).toBeNull()
    expect(shiftCalendarDays(date("9999-12-31"), 1)).toBeNull()
    expect(shiftCalendarDays(date("2024-02-29"), 0.5)).toBeNull()
    expect(shiftCalendarDays(date("2024-02-29"), Infinity)).toBeNull()
  })
})
