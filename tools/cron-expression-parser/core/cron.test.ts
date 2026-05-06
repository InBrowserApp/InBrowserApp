import { describe, expect, test } from "vitest"

import {
  CRON_PRESETS,
  getCronDescription,
  getNextRunTimes,
  mapLanguageToCronstrueLocale,
  normalizeCronExpression,
  parseCronFields,
  validateCronExpression,
} from "./cron"

describe("cron core", () => {
  test("normalizes repeated whitespace", () => {
    expect(normalizeCronExpression("  */5   *  * *   *  ")).toBe("*/5 * * * *")
  })

  test("validates empty, invalid, and valid expressions", () => {
    expect(validateCronExpression(" ")).toEqual({ state: "empty" })
    expect(validateCronExpression("bad cron")).toMatchObject({
      state: "invalid",
    })
    expect(validateCronExpression("*/5 * * * *")).toEqual({ state: "valid" })
  })

  test("describes cron expressions with locale fallback", () => {
    expect(getCronDescription("*/5 * * * *", "en")).toBe("Every 5 minutes")
    expect(getCronDescription("", "en")).toBe("")
    expect(getCronDescription("bad cron", "en")).toBe("")
    expect(mapLanguageToCronstrueLocale("zh-CN")).toBe("zh_CN")
    expect(mapLanguageToCronstrueLocale("no")).toBe("nb")
    expect(mapLanguageToCronstrueLocale("ms")).toBe("en")
  })

  test("returns the requested next run times", () => {
    const runTimes = getNextRunTimes("*/15 * * * *", {
      count: 3,
      referenceDate: new Date("2024-01-01T00:00:00.000Z"),
    })

    expect(runTimes.map((date) => date.toISOString())).toEqual([
      "2024-01-01T00:15:00.000Z",
      "2024-01-01T00:30:00.000Z",
      "2024-01-01T00:45:00.000Z",
    ])
  })

  test("returns no run times for empty, invalid, or non-positive requests", () => {
    expect(getNextRunTimes("")).toEqual([])
    expect(getNextRunTimes("bad cron")).toEqual([])
    expect(getNextRunTimes("* * * * *", { count: 0 })).toEqual([])
  })

  test("parses five and six field expressions", () => {
    expect(parseCronFields("*/5 * * * *")).toEqual([
      { id: "minute", range: "0-59", value: "*/5" },
      { id: "hour", range: "0-23", value: "*" },
      { id: "dayOfMonth", range: "1-31", value: "*" },
      { id: "month", range: "1-12 or JAN-DEC", value: "*" },
      { id: "dayOfWeek", range: "0-7 or SUN-SAT", value: "*" },
    ])
    expect(parseCronFields("0 */5 * * * *")[0]).toEqual({
      id: "second",
      range: "0-59",
      value: "0",
    })
    expect(parseCronFields("* * * * * * *")).toEqual([])
  })

  test("exposes stable presets for the client", () => {
    expect(CRON_PRESETS).toHaveLength(11)
    expect(CRON_PRESETS[0]).toEqual({
      id: "everyMinute",
      value: "* * * * *",
    })
  })
})
