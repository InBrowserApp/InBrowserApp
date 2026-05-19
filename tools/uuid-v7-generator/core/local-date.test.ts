import { describe, expect, test } from "vitest"

import { formatDateTimeLocalInput, parseDateTimeLocalInput } from "./local-date"

describe("uuid v7 local date helpers", () => {
  test("formats and parses datetime-local values with milliseconds", () => {
    const timestamp = new Date(2026, 3, 15, 8, 30, 45, 123).getTime()
    const input = formatDateTimeLocalInput(timestamp)

    expect(input).toBe("2026-04-15T08:30:45.123")
    expect(parseDateTimeLocalInput(input)).toBe(timestamp)
  })

  test("accepts datetime-local values without seconds or milliseconds", () => {
    expect(parseDateTimeLocalInput("1970-01-01T00:00")).toBe(
      new Date(1970, 0, 1, 0, 0, 0, 0).getTime()
    )
    expect(parseDateTimeLocalInput("1970-01-01T00:00:02")).toBe(
      new Date(1970, 0, 1, 0, 0, 2, 0).getTime()
    )
    expect(parseDateTimeLocalInput("1970-01-01T00:00:02.3")).toBe(
      new Date(1970, 0, 1, 0, 0, 2, 300).getTime()
    )
  })

  test("rejects invalid datetime-local values", () => {
    expect(parseDateTimeLocalInput("")).toBeNull()
    expect(parseDateTimeLocalInput("not-a-date")).toBeNull()
    expect(parseDateTimeLocalInput("2026-02-30T08:30:45.123")).toBeNull()
    expect(parseDateTimeLocalInput("2026-04-15T25:30:45.123")).toBeNull()
  })
})
