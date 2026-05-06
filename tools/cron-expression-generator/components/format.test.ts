import { describe, expect, test } from "vitest"

import { parseCronExpression } from "../core/cron"
import messages from "../messages/en.json"
import {
  formatCronFieldSummary,
  formatFieldValue,
  formatMessage,
  getFieldLabel,
  getFieldOptions,
  summarizeCronForm,
} from "./format"

describe("cron UI formatting helpers", () => {
  test("replaces known placeholders and leaves unknown placeholders", () => {
    expect(
      formatMessage("Every {count} {unit} {missing}", {
        count: 5,
        unit: "minutes",
      })
    ).toBe("Every 5 minutes {missing}")
  })

  test("formats month, weekday, and numeric field values", () => {
    expect(formatFieldValue(messages, "month", 1)).toBe("Jan")
    expect(formatFieldValue(messages, "month", 99)).toBe("99")
    expect(formatFieldValue(messages, "dayOfWeek", 0)).toBe("Sun")
    expect(formatFieldValue(messages, "dayOfWeek", 99)).toBe("99")
    expect(formatFieldValue(messages, "minute", 7)).toBe("7")
  })

  test("builds localized field labels and options", () => {
    expect(getFieldLabel(messages, "dayOfMonth")).toBe("Day of month")
    expect(getFieldOptions(messages, "dayOfWeek")).toEqual([
      { value: 0, label: "Sun" },
      { value: 1, label: "Mon" },
      { value: 2, label: "Tue" },
      { value: 3, label: "Wed" },
      { value: 4, label: "Thu" },
      { value: 5, label: "Fri" },
      { value: 6, label: "Sat" },
    ])
  })

  test("summarizes every, interval, specific, and range fields", () => {
    const state = parseCronExpression("*/15 8-17 1,15 * *")

    expect(formatCronFieldSummary(messages, "minute", state.minute)).toBe(
      "Every 15 minute(s)"
    )
    expect(formatCronFieldSummary(messages, "hour", state.hour)).toBe(
      "Hour: 8 through 17"
    )
    expect(
      formatCronFieldSummary(messages, "dayOfMonth", state.dayOfMonth)
    ).toBe("Day of month: 1, 15")
    expect(formatCronFieldSummary(messages, "month", state.month)).toBe(
      "Every Month"
    )
  })

  test("summarizes empty specific selections as every value", () => {
    const state = parseCronExpression("0 0 * * *")
    const summary = formatCronFieldSummary(messages, "minute", {
      ...state.minute,
      mode: "specific",
      specificValues: [],
    })

    expect(summary).toBe("Every Minute")
  })

  test("summarizes a full form in field order", () => {
    expect(
      summarizeCronForm(messages, parseCronExpression("0 9 * * 1-5")).map(
        (entry) => entry.expression
      )
    ).toEqual(["0", "9", "*", "*", "1-5"])
  })
})
