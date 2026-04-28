import { describe, expect, test } from "vitest"

import {
  addDays,
  countBusinessDays,
  isBusinessDay,
  normalizeWeekdayList,
  parseHolidayList,
  parseISODateInput,
  shiftBusinessDays,
  startOfLocalDay,
  toISODate,
} from "./business-days"

describe("business-days core", () => {
  test("normalizes weekday lists by sorting, deduplicating, and dropping invalid values", () => {
    expect(normalizeWeekdayList([6, 1, 1, 0, -1, 7, 2.5])).toEqual([0, 1, 6])
  })

  test("normalizes dates and adds day offsets", () => {
    const source = new Date(2026, 3, 21, 18, 45, 10)

    expect(toISODate(startOfLocalDay(source))).toBe("2026-04-21")
    expect(toISODate(addDays(source, 3))).toBe("2026-04-24")
  })

  test("parses ISO date input and rejects invalid calendar dates", () => {
    expect(toISODate(parseISODateInput("2026-04-21") as Date)).toBe(
      "2026-04-21"
    )
    expect(parseISODateInput("2026-00-10")).toBeNull()
    expect(parseISODateInput("2026-02-30")).toBeNull()
    expect(parseISODateInput("not-a-date")).toBeNull()
  })

  test("parses holiday lists while tracking invalid rows", () => {
    const result = parseHolidayList(
      "2026-01-01\n2026-01-01\ninvalid\n2026-02-30\n\n2026-12-25"
    )

    expect(Array.from(result.dates)).toEqual(["2026-01-01", "2026-12-25"])
    expect(result.invalid).toEqual(["invalid", "2026-02-30"])
  })

  test("detects business days from weekend and holiday rules", () => {
    expect(
      isBusinessDay(
        new Date(2026, 3, 21),
        new Set([0, 6]),
        new Set(["2026-04-22"])
      )
    ).toBe(true)
    expect(
      isBusinessDay(
        new Date(2026, 3, 25),
        new Set([0, 6]),
        new Set(["2026-04-22"])
      )
    ).toBe(false)
    expect(
      isBusinessDay(
        new Date(2026, 3, 22),
        new Set([0, 6]),
        new Set(["2026-04-22"])
      )
    ).toBe(false)
  })

  test("counts business days with holidays, endpoints, and reversed ranges", () => {
    const forward = countBusinessDays(
      new Date(2026, 3, 20),
      new Date(2026, 3, 26),
      {
        weekendDays: new Set([0, 6]),
        holidays: new Set(["2026-04-22"]),
      }
    )
    const reversed = countBusinessDays(
      new Date(2026, 3, 26),
      new Date(2026, 3, 20),
      {
        weekendDays: new Set([0, 6]),
        holidays: new Set(["2026-04-22"]),
        includeEndpoints: false,
      }
    )

    expect(forward).toEqual({
      businessDays: 4,
      totalDays: 7,
      weekendDays: 2,
      holidayDays: 1,
      isReversed: false,
    })
    expect(reversed).toEqual({
      businessDays: 3,
      totalDays: 5,
      weekendDays: 1,
      holidayDays: 1,
      isReversed: true,
    })
  })

  test("returns zero totals when a single-day range excludes endpoints", () => {
    expect(
      countBusinessDays(new Date(2026, 3, 20), new Date(2026, 3, 20), {
        weekendDays: new Set([0, 6]),
        holidays: new Set<string>(),
        includeEndpoints: false,
      })
    ).toEqual({
      businessDays: 0,
      totalDays: 0,
      weekendDays: 0,
      holidayDays: 0,
      isReversed: false,
    })
  })

  test("shifts business days forward, backward, and from the start date", () => {
    expect(
      toISODate(
        shiftBusinessDays(new Date(2026, 3, 20), 3, {
          weekendDays: new Set([0, 6]),
          holidays: new Set(["2026-04-22"]),
        }) as Date
      )
    ).toBe("2026-04-24")
    expect(
      toISODate(
        shiftBusinessDays(new Date(2026, 3, 27), -3, {
          weekendDays: new Set([0, 6]),
          holidays: new Set(["2026-04-22"]),
        }) as Date
      )
    ).toBe("2026-04-21")
    expect(
      toISODate(
        shiftBusinessDays(new Date(2026, 3, 20), 1, {
          weekendDays: new Set([0, 6]),
          holidays: new Set<string>(),
          includeStart: true,
        }) as Date
      )
    ).toBe("2026-04-20")
    expect(
      toISODate(
        shiftBusinessDays(new Date(2026, 3, 20), 2, {
          weekendDays: new Set([0, 6]),
          holidays: new Set<string>(),
          includeStart: true,
        }) as Date
      )
    ).toBe("2026-04-21")
  })

  test("returns the base date for zero offsets and rejects impossible shifts", () => {
    expect(
      toISODate(
        shiftBusinessDays(new Date(2026, 3, 20), 0, {
          weekendDays: new Set([0, 6]),
          holidays: new Set<string>(),
        }) as Date
      )
    ).toBe("2026-04-20")
    expect(
      shiftBusinessDays(new Date(2026, 3, 20), Number.POSITIVE_INFINITY, {
        weekendDays: new Set([0, 6]),
        holidays: new Set<string>(),
      })
    ).toBeNull()
    expect(
      shiftBusinessDays(new Date(2026, 3, 20), 2, {
        weekendDays: new Set([0, 1, 2, 3, 4, 5, 6]),
        holidays: new Set<string>(),
      })
    ).toBeNull()
  })
})
