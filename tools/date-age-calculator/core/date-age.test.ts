import { parseISODateInput } from "@workspace/calendar-date"
import { describe, expect, test } from "vitest"

import { ageInFullYears, parseDayCount } from "./date-age"

describe("age in completed years", () => {
  test.each([
    ["2000-06-15", "2025-06-14", 24],
    ["2000-06-15", "2025-06-15", 25],
    ["2000-01-31", "2025-01-30", 24],
    ["2000-01-31", "2025-01-31", 25],
    ["2000-02-29", "2024-02-28", 23],
    ["2000-02-29", "2024-02-29", 24],
    ["2000-02-29", "2025-02-27", 24],
    ["2000-02-29", "2025-02-28", 25],
    ["2025-06-15", "2025-06-15", 0],
    ["2025-06-16", "2025-06-15", null],
  ])("evaluates a birthday of %s as of %s", (birthDate, today, expected) => {
    expect(
      ageInFullYears(parseISODateInput(birthDate)!, parseISODateInput(today)!)
    ).toBe(expected)
  })
})

describe("day count input", () => {
  test.each([
    ["0", 0],
    ["007", 7],
    ["3652058", 3_652_058],
    ["3652059", null],
    ["", null],
    ["-1", null],
    ["1.5", null],
    ["1e3", null],
  ])("parses %j", (input, expected) => {
    expect(parseDayCount(input)).toBe(expected)
  })
})
