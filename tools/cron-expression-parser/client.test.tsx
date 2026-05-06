import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import CronExpressionParserClient from "./client"

const messages = {
  meta: {
    name: "Cron Expression Parser",
    description: "Parse, validate, and explain cron expressions.",
  },
  input: {
    title: "Cron expression",
    description: "Enter a five-field or six-field cron expression.",
    label: "Expression",
    placeholder: "*/5 * * * *",
    valid: "Valid expression",
    empty: "Enter a cron expression to start.",
    invalid: "Invalid expression",
    timezoneNote: "Next run times use {timeZone} from this browser.",
    copy: "Copy expression",
    copied: "Copied",
    reset: "Reset",
  },
  presets: {
    title: "Quick presets",
    description: "Start with a common schedule and edit it.",
    items: {
      everyMinute: "Every minute",
      everyFiveMinutes: "Every 5 minutes",
      everyFifteenMinutes: "Every 15 minutes",
      everyThirtyMinutes: "Every 30 minutes",
      hourly: "Hourly",
      dailyMidnight: "Daily at midnight",
      dailyNoon: "Daily at noon",
      weeklySunday: "Every Sunday",
      weeklyMondayMorning: "Every Monday at 9 AM",
      monthlyFirstDay: "First day of month",
      weekdaysMorning: "Weekdays at 9 AM",
    },
  },
  breakdown: {
    title: "Field breakdown",
    description: "Read each field from left to right.",
    field: "Field",
    value: "Value",
    allowedRange: "Allowed range",
    fields: {
      second: "Second",
      minute: "Minute",
      hour: "Hour",
      dayOfMonth: "Day of month",
      month: "Month",
      dayOfWeek: "Day of week",
    },
  },
  schedule: {
    title: "Next executions",
    description: "Preview the next 10 run times.",
    summaryLabel: "Summary",
    dateTimeLabel: "Date and time",
    relativeLabel: "Relative",
    emptyTitle: "No expression yet",
    emptyDescription: "Enter a cron expression to see the schedule.",
  },
  relative: {
    now: "now",
    inSeconds: "in {count} seconds",
    inMinutes: "in {count} minutes",
    inHours: "in {count} hours",
    inDays: "in {count} days",
  },
} as const

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("CronExpressionParserClient", () => {
  test("renders the default expression with explanation and next runs", () => {
    vi.spyOn(Date, "now").mockReturnValue(
      new Date("2024-01-01T00:00:00.000Z").getTime()
    )

    render(<CronExpressionParserClient language="en" messages={messages} />)

    expect(screen.getByDisplayValue("*/5 * * * *")).toBeTruthy()
    expect(screen.getAllByText("Every 5 minutes")).toHaveLength(2)
    expect(screen.getByText("Minute")).toBeTruthy()
    expect(screen.getAllByText("0-59").length).toBeGreaterThan(0)
    expect(screen.getAllByText("Valid expression")).toHaveLength(2)
  })

  test("applies a preset and resets to the default", () => {
    render(<CronExpressionParserClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: /Hourly/ }))

    expect(screen.getByDisplayValue("0 * * * *")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.getByDisplayValue("*/5 * * * *")).toBeTruthy()
  })

  test("shows empty and invalid states", () => {
    render(<CronExpressionParserClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText("Expression"), {
      target: { value: "" },
    })

    expect(screen.getByText("No expression yet")).toBeTruthy()

    fireEvent.change(screen.getByLabelText("Expression"), {
      target: { value: "bad cron" },
    })

    expect(screen.getByText("Invalid expression")).toBeTruthy()
    expect(screen.getByRole("alert").textContent).toContain("Validation error")
  })

  test("restores the expression from localStorage", () => {
    window.localStorage.setItem(
      "tools:cron-expression-parser:expression",
      "0 9 * * 1-5"
    )

    render(<CronExpressionParserClient language="en" messages={messages} />)

    expect(screen.getByDisplayValue("0 9 * * 1-5")).toBeTruthy()
  })
})
