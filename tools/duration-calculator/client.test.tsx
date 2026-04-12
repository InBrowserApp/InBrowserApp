import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import DurationCalculatorClient from "./client"

const messages = {
  meta: {
    name: "Duration Add/Subtract Calculator",
    description: "Add or subtract ISO 8601 durations from a base time.",
  },
  baseTimeLabel: "Base time",
  timeZoneLabel: "Time zone",
  timeZonePlaceholder: "Select a time zone",
  dateTimeLabel: "Date & time",
  dateTimePlaceholder: "YYYY-MM-DD HH:mm:ss.SSS",
  formatHint: "Format: YYYY-MM-DD HH:mm:ss.SSS",
  nowLabel: "Now",
  offsetLabel: "Offset",
  invalidDateTimeLabel: "Invalid date/time",
  durationLabel: "Duration",
  durationIsoLabel: "ISO 8601 duration",
  durationPlaceholder: "P1DT2H3M4.005S",
  durationHint: "Supports PnDTnHnMnS with optional milliseconds.",
  daysLabel: "Days",
  hoursLabel: "Hours",
  minutesLabel: "Minutes",
  secondsLabel: "Seconds",
  millisecondsLabel: "Milliseconds",
  invalidDurationLabel: "Invalid duration",
  resultsLabel: "Results",
  addLabel: "Add",
  subtractLabel: "Subtract",
  iso8601Label: "ISO 8601",
  unixMillisecondsLabel: "Unix timestamp (ms)",
  unixSecondsLabel: "Unix timestamp (s)",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe("DurationCalculatorClient", () => {
  test("renders calculated add and subtract results from restored storage", async () => {
    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.baseInput,
      "2024-01-02 03:04:05.006"
    )
    window.localStorage.setItem(STORAGE_KEYS.durationIso, "P1DT2H3M4.005S")
    window.localStorage.setItem(
      STORAGE_KEYS.durationParts,
      JSON.stringify({
        days: 1,
        hours: 2,
        minutes: 3,
        seconds: 4,
        milliseconds: 5,
      })
    )

    render(<DurationCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })

    expect(
      screen.getByRole("combobox", { name: "Time zone" }).textContent
    ).toContain("UTC (UTC+00:00)")
    expect(screen.getByText("2024-01-03 05:07:09.011")).toBeTruthy()
    expect(screen.getByText("2024-01-01 01:01:01.001")).toBeTruthy()
    expect(screen.getByText("2024-01-03T05:07:09.011Z")).toBeTruthy()
    expect(screen.getByText("1704258429011")).toBeTruthy()
    expect(screen.getByText("1704258429")).toBeTruthy()
  })

  test("syncs valid ISO duration input into the duration part fields", async () => {
    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.baseInput,
      "2024-01-02 03:04:05.006"
    )

    render(<DurationCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })

    const isoInput = screen.getByLabelText("ISO 8601 duration")
    fireEvent.change(isoInput, { target: { value: "PT90S" } })

    await waitFor(() => {
      expect(screen.getByLabelText("Minutes")).toHaveProperty("value", "1")
      expect(screen.getByLabelText("Seconds")).toHaveProperty("value", "30")
    })
  })

  test("normalizes restored duration parts back into ISO text", async () => {
    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.baseInput,
      "2024-01-02 03:04:05.006"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.durationParts,
      JSON.stringify({
        days: 1,
        hours: 26,
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
      })
    )

    render(<DurationCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })

    await waitFor(() => {
      expect(screen.getByLabelText("ISO 8601 duration")).toHaveProperty(
        "value",
        "P2DT2H"
      )
    })
  })

  test("shows validation errors when the base time or duration is invalid", async () => {
    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.baseInput,
      "2024-01-02 03:04:05.006"
    )

    render(<DurationCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })

    fireEvent.change(screen.getByLabelText("Date & time"), {
      target: { value: "invalid" },
    })
    fireEvent.change(screen.getByLabelText("ISO 8601 duration"), {
      target: { value: "-PT1H" },
    })

    await waitFor(() => {
      expect(screen.getByText("Invalid date/time")).toBeTruthy()
      expect(screen.getByText("Invalid duration")).toBeTruthy()
    })

    expect(screen.getAllByText("—")).toHaveLength(8)
  })

  test("sets the base time to now in the selected time zone", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 2, 8, 4, 5, 6))
    window.localStorage.setItem(STORAGE_KEYS.baseTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.baseInput,
      "2024-01-01 00:00:00.000"
    )

    render(<DurationCalculatorClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 00:00:00.000"
      )
    })

    fireEvent.click(screen.getByRole("button", { name: "Now" }))

    await waitFor(() => {
      expect(screen.getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })
  })
})

const STORAGE_KEYS = {
  baseInput: "tools:duration-calculator:base-input",
  baseTimeZone: "tools:duration-calculator:base-timezone",
  durationIso: "tools:duration-calculator:duration-iso",
  durationParts: "tools:duration-calculator:duration-parts",
} as const
