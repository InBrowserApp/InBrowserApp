import { describe, expect, test } from "vitest"

import { formatDateTimeLocalInput, parseDateTimeLocalInput } from "./local-date"

describe("local-date", () => {
  test("formats milliseconds for datetime-local inputs", () => {
    expect(formatDateTimeLocalInput(Date.UTC(2026, 0, 2, 3, 4, 5))).toMatch(
      /^2026-01-0[12]T/u
    )
    expect(formatDateTimeLocalInput(Number.NaN)).toBe("")
  })

  test("parses datetime-local input values", () => {
    expect(parseDateTimeLocalInput("")).toBeNull()
    expect(parseDateTimeLocalInput("not a date")).toBeNull()
    expect(parseDateTimeLocalInput("2026-01-02T03:04:05")).toEqual(
      expect.any(Number)
    )
  })
})
