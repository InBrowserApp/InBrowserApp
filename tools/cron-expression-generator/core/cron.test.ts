import { describe, expect, test } from "vitest"

import {
  CRON_FIELD_CONFIGS,
  CRON_FIELD_NAMES,
  DEFAULT_CRON_EXPRESSION,
  PRESET_EXPRESSIONS,
  buildCronExpression,
  createDefaultCronFormState,
  generateNextRunTimes,
  getCronFieldConfig,
  getCronFieldValues,
  normalizeCronFieldState,
  parseCronExpression,
  type CronFieldState,
} from "./cron"

const everyState: CronFieldState = {
  mode: "every",
  interval: 5,
  specificValues: [],
  rangeStart: 0,
  rangeEnd: 59,
}

function datesToLocalMinutes(dates: readonly Date[]) {
  return dates.map((date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    const hour = String(date.getHours()).padStart(2, "0")
    const minute = String(date.getMinutes()).padStart(2, "0")

    return `${year}-${month}-${day}T${hour}:${minute}`
  })
}

describe("cron expression state", () => {
  test("exports field metadata and preset expressions", () => {
    expect(CRON_FIELD_NAMES).toEqual([
      "minute",
      "hour",
      "dayOfMonth",
      "month",
      "dayOfWeek",
    ])
    expect(CRON_FIELD_CONFIGS.minute.unit).toBe("minute")
    expect(getCronFieldConfig("month").min).toBe(1)
    expect(DEFAULT_CRON_EXPRESSION).toBe("* * * * *")
    expect(PRESET_EXPRESSIONS.weekdayMorning).toBe("0 9 * * 1-5")
  })

  test("creates the default every-minute expression", () => {
    expect(buildCronExpression(createDefaultCronFormState())).toBe("* * * * *")
  })

  test("parses interval, range, specific, wildcard, and invalid fields", () => {
    const parsed = parseCronExpression("*/15 8-17 1,15 * nope")

    expect(buildCronExpression(parsed)).toBe("*/15 8-17 1,15 * *")
    expect(parsed.minute.mode).toBe("interval")
    expect(parsed.hour.mode).toBe("range")
    expect(parsed.dayOfMonth.mode).toBe("specific")
    expect(parsed.month.mode).toBe("every")
    expect(parsed.dayOfWeek.mode).toBe("every")
  })

  test("falls back to every field when expression length is not five", () => {
    expect(buildCronExpression(parseCronExpression("0 0 *"))).toBe("* * * * *")
  })

  test("normalizes intervals, ranges, duplicates, and non-finite numbers", () => {
    const normalized = normalizeCronFieldState("minute", {
      mode: "specific",
      interval: Number.POSITIVE_INFINITY,
      specificValues: [5, 5, 90, -1, 3.7],
      rangeStart: 50,
      rangeEnd: 10,
    })

    expect(normalized.interval).toBe(1)
    expect(normalized.specificValues).toEqual([0, 3, 5, 59])
    expect(normalized.rangeStart).toBe(10)
    expect(normalized.rangeEnd).toBe(50)
  })

  test("formats empty specific selections as wildcard", () => {
    const state = parseCronExpression("0 0 * * *")
    const nextState = {
      ...state,
      minute: {
        ...state.minute,
        mode: "specific" as const,
        specificValues: [],
      },
    }

    expect(buildCronExpression(nextState)).toBe("* 0 * * *")
    expect(getCronFieldValues("minute", nextState.minute)).toHaveLength(60)
  })

  test("expands every, interval, specific, and range values", () => {
    expect(getCronFieldValues("hour", everyState)).toHaveLength(24)
    expect(
      getCronFieldValues("hour", {
        ...everyState,
        mode: "interval",
        interval: 6,
      })
    ).toEqual([0, 6, 12, 18])
    expect(
      getCronFieldValues("hour", {
        ...everyState,
        mode: "specific",
        specificValues: [3, 9],
      })
    ).toEqual([3, 9])
    expect(
      getCronFieldValues("hour", {
        ...everyState,
        mode: "range",
        rangeStart: 8,
        rangeEnd: 10,
      })
    ).toEqual([8, 9, 10])
  })
})

describe("generateNextRunTimes", () => {
  test("generates the next five every-minute runs", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("* * * * *"),
      new Date(2024, 0, 1, 0, 0, 30)
    )

    expect(datesToLocalMinutes(runs)).toEqual([
      "2024-01-01T00:01",
      "2024-01-01T00:02",
      "2024-01-01T00:03",
      "2024-01-01T00:04",
      "2024-01-01T00:05",
    ])
  })

  test("respects hour and weekday ranges", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("0 9 * * 1-5"),
      new Date(2024, 0, 6),
      2
    )

    expect(datesToLocalMinutes(runs)).toEqual([
      "2024-01-08T09:00",
      "2024-01-09T09:00",
    ])
  })

  test("uses day-of-month matching when weekday is wildcard", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("30 6 15 * *"),
      new Date(2024, 0, 1),
      1
    )

    expect(datesToLocalMinutes(runs)).toEqual(["2024-01-15T06:30"])
  })

  test("uses weekday matching when day-of-month is wildcard", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("0 12 * * 0"),
      new Date(2024, 0, 1),
      1
    )

    expect(datesToLocalMinutes(runs)).toEqual(["2024-01-07T12:00"])
  })

  test("uses common cron OR behavior when both day fields are restricted", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("0 0 15 * 1"),
      new Date(2024, 0, 13),
      3
    )

    expect(datesToLocalMinutes(runs)).toEqual([
      "2024-01-15T00:00",
      "2024-01-22T00:00",
      "2024-01-29T00:00",
    ])
  })

  test("returns empty when no date matches within the lookahead window", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("0 0 31 2 *"),
      new Date(2024, 0, 1)
    )

    expect(runs).toEqual([])
  })

  test("clamps requested run count to a safe range", () => {
    expect(
      generateNextRunTimes(
        parseCronExpression("0 0 * * *"),
        new Date(2024, 0, 1),
        0
      )
    ).toHaveLength(1)
    expect(
      generateNextRunTimes(
        parseCronExpression("* * * * *"),
        new Date(2024, 0, 1),
        50
      )
    ).toHaveLength(20)
  })

  test("skips earlier times on the current day", () => {
    const runs = generateNextRunTimes(
      parseCronExpression("0 8-10 * * *"),
      new Date(2024, 0, 1, 9, 30),
      2
    )

    expect(datesToLocalMinutes(runs)).toEqual([
      "2024-01-01T10:00",
      "2024-01-02T08:00",
    ])
  })
})
