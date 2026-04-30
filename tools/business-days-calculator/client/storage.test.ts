import { afterEach, describe, expect, test } from "vitest"

import {
  STORAGE_KEYS,
  readStoredBoolean,
  readStoredString,
  readStoredWeekdayMode,
  readStoredWeekendDays,
} from "./storage"

afterEach(() => {
  window.localStorage.clear()
})

describe("business-days storage helpers", () => {
  test("reads stored strings and booleans with fallbacks", () => {
    window.localStorage.setItem(STORAGE_KEYS.startDate, "2026-04-20")
    window.localStorage.setItem(STORAGE_KEYS.includeEndpoints, "false")

    expect(readStoredString(STORAGE_KEYS.startDate, "2026-01-01")).toBe(
      "2026-04-20"
    )
    expect(readStoredString(STORAGE_KEYS.endDate, "2026-01-01")).toBe(
      "2026-01-01"
    )
    expect(readStoredBoolean(STORAGE_KEYS.includeEndpoints, true)).toBe(false)
    expect(readStoredBoolean(STORAGE_KEYS.includeStart, true)).toBe(true)
  })

  test("reads the weekday mode and weekend lists safely", () => {
    window.localStorage.setItem(STORAGE_KEYS.weekdayMode, "working")
    window.localStorage.setItem(
      STORAGE_KEYS.weekendDays,
      JSON.stringify([6, 0, 0])
    )

    expect(readStoredWeekdayMode("weekend")).toBe("working")
    expect(readStoredWeekendDays([1, 2])).toEqual([0, 6])
  })

  test("falls back when stored weekend data is malformed", () => {
    window.localStorage.setItem(STORAGE_KEYS.weekdayMode, "unexpected")
    window.localStorage.setItem(STORAGE_KEYS.weekendDays, "{invalid")

    expect(readStoredWeekdayMode("weekend")).toBe("weekend")
    expect(readStoredWeekendDays([5, 6])).toEqual([5, 6])
  })

  test("falls back when stored weekend data is not an array", () => {
    window.localStorage.setItem(
      STORAGE_KEYS.weekendDays,
      JSON.stringify({ weekend: [0, 6] })
    )

    expect(readStoredWeekendDays([0, 6])).toEqual([0, 6])
  })
})
