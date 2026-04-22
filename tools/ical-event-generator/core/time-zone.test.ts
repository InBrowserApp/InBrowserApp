import { afterEach, describe, expect, test, vi } from "vitest"

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

afterEach(() => {
  vi.restoreAllMocks()
})

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

  test("rejects blank, malformed, and invalid date and time inputs", () => {
    expect(parseDateInput("")).toBeNull()
    expect(parseDateInput("2026/04/21")).toBeNull()
    expect(parseDateInput("2026-02-30")).toBeNull()
    expect(parseTimeInput("")).toBeNull()
    expect(parseTimeInput("9:00")).toBeNull()
    expect(parseTimeInput("24:00")).toBeNull()
    expect(combineDateAndTime("2026-02-30", "09:00")).toBeNull()
    expect(combineDateAndTime("2026-04-21", "bad")).toBeNull()
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

  test("formats input values in an explicit time zone", () => {
    const timestampMs = Date.UTC(2026, 3, 22, 1, 30, 0)

    expect(toDateInputValue(timestampMs, "UTC")).toBe("2026-04-22")
    expect(toTimeInputValue(timestampMs, "UTC")).toBe("01:30")
    expect(toDateInputValue(timestampMs, "America/Los_Angeles")).toBe(
      "2026-04-21"
    )
    expect(toTimeInputValue(timestampMs, "America/Los_Angeles")).toBe("18:30")
  })

  test("prioritizes preferred time zones from Intl.supportedValuesOf", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockReturnValue([
      "UTC",
      "Europe/Paris",
    ] as never)

    const zones = getSupportedTimeZones()

    expect(zones[0]).toBe("UTC")
    expect(zones).toContain("Europe/Paris")
  })

  test("falls back to the baked-in time zone list when enumeration throws", () => {
    vi.spyOn(Intl, "supportedValuesOf").mockImplementation(() => {
      throw new RangeError("boom")
    })

    expect(getSupportedTimeZones()).toContain("America/Los_Angeles")
    expect(getSupportedTimeZones()[0]).toBe("UTC")
  })

  test("falls back when Intl.supportedValuesOf is unavailable", () => {
    const descriptor = Object.getOwnPropertyDescriptor(
      Intl,
      "supportedValuesOf"
    )

    delete (Intl as { supportedValuesOf?: unknown }).supportedValuesOf

    try {
      expect(getSupportedTimeZones()).toContain("Europe/Paris")
      expect(getSupportedTimeZones()[0]).toBe("UTC")
    } finally {
      if (descriptor) {
        Object.defineProperty(Intl, "supportedValuesOf", descriptor)
      }
    }
  })

  test("skips preferred time zones that are not actually supported", async () => {
    const originalDateTimeFormat = Intl.DateTimeFormat

    vi.resetModules()
    vi.spyOn(Intl, "supportedValuesOf").mockReturnValue(["UTC"] as never)
    vi.spyOn(Intl, "DateTimeFormat").mockImplementation(((locales, options) => {
      if (options?.timeZone === "UTC") {
        return new originalDateTimeFormat(locales, options)
      }

      throw new RangeError("unsupported")
    }) as typeof Intl.DateTimeFormat)

    const { getSupportedTimeZones: getFreshSupportedTimeZones } =
      await import("./time-zone")

    expect(getFreshSupportedTimeZones()).toEqual(["UTC"])
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
    expect(isTimeZoneSupported("Mars/Olympus")).toBe(false)
    expect(formatOffsetLabel(19_800_000)).toBe("UTC+05:30")
    expect(getTimeZoneOffsetMs(Date.UTC(2026, 3, 21, 16, 0, 0), "UTC")).toBe(0)
    expect(toUtcTimestamp(parts, "America/Los_Angeles")).toBe(
      Date.UTC(2026, 3, 21, 16, 0, 0)
    )
  })

  test("adjusts offsets across daylight-saving transitions", () => {
    expect(
      toUtcTimestamp(
        {
          year: 2026,
          month: 3,
          day: 8,
          hour: 2,
          minute: 30,
          second: 0,
          millisecond: 0,
        },
        "America/Los_Angeles"
      )
    ).toBe(Date.UTC(2026, 2, 8, 9, 30, 0))
  })
})
