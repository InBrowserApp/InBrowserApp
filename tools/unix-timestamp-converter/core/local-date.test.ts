import { describe, expect, test } from "vitest"

import {
  formatDateTimeLocalInput,
  formatLocalDateTimeDisplay,
  formatRelativeTime,
  parseDateTimeLocalInput,
} from "./local-date"

describe("local-date", () => {
  test("formats a local date-time value for datetime-local inputs", () => {
    const valueMs = new Date(2024, 0, 2, 3, 4, 5, 6).getTime()

    expect(formatDateTimeLocalInput(valueMs)).toBe("2024-01-02T03:04:05.006")
  })

  test("parses datetime-local values with and without seconds", () => {
    expect(parseDateTimeLocalInput("2024-01-02T03:04")).toBe(
      new Date(2024, 0, 2, 3, 4, 0, 0).getTime()
    )
    expect(parseDateTimeLocalInput("2024-01-02T03:04:05.006")).toBe(
      new Date(2024, 0, 2, 3, 4, 5, 6).getTime()
    )
  })

  test("rejects invalid datetime-local values", () => {
    expect(parseDateTimeLocalInput("2024-01-02")).toBeNull()
    expect(parseDateTimeLocalInput("2024-02-31T03:04")).toBeNull()
  })

  test("formats a localized local date-time display string", () => {
    const display = formatLocalDateTimeDisplay(
      new Date(2024, 0, 2, 3, 4, 5).getTime(),
      "en"
    )

    expect(display.length).toBeGreaterThan(0)
  })

  test("formats relative time across small and large ranges", () => {
    expect(formatRelativeTime(61_000, 0, "en")).toBe("in 1 minute")
    expect(formatRelativeTime(0, 8 * 24 * 60 * 60 * 1000, "en")).toBe(
      "last week"
    )
  })
})
