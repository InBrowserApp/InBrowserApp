import { describe, expect, test } from "vitest"

import { formatDateTimeLocalInput, parseDateTimeLocalInput } from "./local-date"

describe("local-date", () => {
  test("formats a local datetime-local value with millisecond precision", () => {
    const value = new Date(2026, 3, 15, 8, 30, 45, 123).getTime()

    expect(formatDateTimeLocalInput(value)).toBe("2026-04-15T08:30:45.123")
  })

  test("parses datetime-local values with optional seconds and milliseconds", () => {
    expect(parseDateTimeLocalInput("2026-04-15T08:30")).toBe(
      new Date(2026, 3, 15, 8, 30, 0, 0).getTime()
    )
    expect(parseDateTimeLocalInput("2026-04-15T08:30:45")).toBe(
      new Date(2026, 3, 15, 8, 30, 45, 0).getTime()
    )
    expect(parseDateTimeLocalInput("2026-04-15T08:30:45.7")).toBe(
      new Date(2026, 3, 15, 8, 30, 45, 700).getTime()
    )
    expect(parseDateTimeLocalInput("2026-04-15T08:30:45.123")).toBe(
      new Date(2026, 3, 15, 8, 30, 45, 123).getTime()
    )
  })

  test("rejects invalid datetime-local values", () => {
    expect(parseDateTimeLocalInput("not-a-date")).toBeNull()
    expect(parseDateTimeLocalInput("2026-02-31T08:30:45")).toBeNull()
    expect(parseDateTimeLocalInput("2026-04-15T25:30:45")).toBeNull()
  })
})
