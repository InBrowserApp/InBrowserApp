import { afterEach, describe, expect, test, vi } from "vitest"

import {
  buildTimeZoneOptions,
  formatInTimeZone,
  formatOffsetLabel,
  getSupportedTimeZones,
  getTimeZoneOffsetMs,
  isTimeZoneSupported,
  parseDateTimeInput,
  toUtcTimestamp,
} from "./time-zone"

const originalSupportedValuesOf = Intl.supportedValuesOf

afterEach(() => {
  if (originalSupportedValuesOf) {
    Intl.supportedValuesOf = originalSupportedValuesOf
  } else {
    Reflect.deleteProperty(Intl, "supportedValuesOf")
  }

  vi.restoreAllMocks()
})

describe("time-zone", () => {
  test("returns supported time zones and prepends preferred UTC aliases", () => {
    Intl.supportedValuesOf = vi.fn().mockReturnValue(["America/New_York"])

    expect(getSupportedTimeZones()).toEqual([
      "UTC",
      "Etc/UTC",
      "GMT",
      "Etc/GMT",
      "America/New_York",
    ])
  })

  test("falls back when supportedValuesOf is missing or throws", () => {
    Reflect.deleteProperty(Intl, "supportedValuesOf")
    expect(getSupportedTimeZones()).toContain("UTC")

    Intl.supportedValuesOf = vi.fn().mockImplementation(() => {
      throw new Error("boom")
    })
    expect(getSupportedTimeZones()).toContain("America/Los_Angeles")
  })

  test("validates supported time zones and reuses cached formatters", () => {
    expect(isTimeZoneSupported("UTC")).toBe(true)
    expect(isTimeZoneSupported("UTC")).toBe(true)
    expect(isTimeZoneSupported("Mars/Base")).toBe(false)
  })

  test("parses valid date-time input variants and rejects invalid values", () => {
    expect(parseDateTimeInput("   ")).toBeNull()
    expect(parseDateTimeInput("2024-01-02")).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 0,
      minute: 0,
      second: 0,
      millisecond: 0,
    })
    expect(parseDateTimeInput("2024-01-02 03:04:05.006")).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 5,
      millisecond: 6,
    })
    expect(parseDateTimeInput("2024-01-02T03:04")).toEqual({
      year: 2024,
      month: 1,
      day: 2,
      hour: 3,
      minute: 4,
      second: 0,
      millisecond: 0,
    })
    expect(parseDateTimeInput("2024-02-30 00:00:00")).toBeNull()
    expect(parseDateTimeInput("not-a-date")).toBeNull()
  })

  test("formats timestamps and offsets in a given time zone", () => {
    const timestamp = Date.UTC(2024, 0, 2, 3, 4, 5, 6)

    expect(formatInTimeZone(timestamp, "UTC")).toBe("2024-01-02 03:04:05.006")
    expect(getTimeZoneOffsetMs(timestamp, "America/New_York")).toBe(
      -5 * 60 * 60 * 1_000
    )
    expect(formatOffsetLabel(19_800_000)).toBe("UTC+05:30")
    expect(formatOffsetLabel(-14_400_000)).toBe("UTC-04:00")
  })

  test("converts local wall-clock parts back to UTC timestamps", () => {
    const winterTimestamp = toUtcTimestamp(
      {
        year: 2024,
        month: 1,
        day: 2,
        hour: 3,
        minute: 4,
        second: 5,
        millisecond: 6,
      },
      "America/New_York"
    )
    expect(winterTimestamp).toBe(Date.UTC(2024, 0, 2, 8, 4, 5, 6))

    const dstTimestamp = toUtcTimestamp(
      {
        year: 2024,
        month: 3,
        day: 10,
        hour: 3,
        minute: 30,
        second: 0,
        millisecond: 0,
      },
      "America/New_York"
    )
    expect(dstTimestamp).toBe(Date.UTC(2024, 2, 10, 7, 30, 0, 0))
  })

  test("builds time zone option labels with offsets", () => {
    Intl.supportedValuesOf = vi.fn().mockReturnValue(["America/New_York"])

    expect(buildTimeZoneOptions(Date.UTC(2024, 0, 2, 12, 0, 0, 0))).toEqual([
      { label: "UTC (UTC+00:00)", value: "UTC" },
      { label: "Etc/UTC (UTC+00:00)", value: "Etc/UTC" },
      { label: "GMT (UTC+00:00)", value: "GMT" },
      { label: "Etc/GMT (UTC+00:00)", value: "Etc/GMT" },
      {
        label: "America/New_York (UTC-05:00)",
        value: "America/New_York",
      },
    ])
  })
})
