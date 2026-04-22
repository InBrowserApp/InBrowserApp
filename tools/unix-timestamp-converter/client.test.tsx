import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import UnixTimestampConverterClient from "./client"

const messages = {
  meta: {
    name: "Unix Timestamp Converter",
    description:
      "Convert Unix timestamps to human-readable dates and vice versa.",
  },
  timestampLabel: "Unix Timestamp",
  timestampPlaceholder: "Enter Unix timestamp...",
  invalidTimestamp: "Invalid timestamp",
  nowLabel: "Now",
  unitLabel: "Unit",
  autoLabel: "Auto",
  secondsLabel: "Seconds",
  millisecondsLabel: "Milliseconds",
  nanosecondsLabel: "Nanoseconds",
  detectedLabel: "Detected",
  digitsLabel: "digits",
  dateTimeLabel: "Date & Time",
  iso8601Label: "ISO 8601",
  utcLabel: "UTC",
  relativeLabel: "Relative",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe("UnixTimestampConverterClient", () => {
  test("renders the default timestamp and auto-detected unit", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_123)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    expect(screen.getByDisplayValue("1700000000123")).toBeTruthy()
    expect(screen.getByText("Detected: Milliseconds (13 digits)")).toBeTruthy()
  })

  test("shows an error state for invalid timestamps", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_123)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText("Unix Timestamp"), {
      target: { value: "nope" },
    })

    expect(screen.getByText("Invalid timestamp")).toBeTruthy()
    expect(screen.getByLabelText("Date & Time")).toHaveProperty(
      "disabled",
      true
    )
  })

  test("sets the current time using the effective unit", () => {
    vi.spyOn(Date, "now")
      .mockReturnValueOnce(1_700_000_000_123)
      .mockReturnValue(1_800_000_000_456)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Seconds" }))
    fireEvent.click(screen.getByRole("button", { name: "Now" }))

    expect(screen.getByDisplayValue("1800000000")).toBeTruthy()
  })

  test("converts between fixed units while preserving the instant", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_123)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText("Unix Timestamp"), {
      target: { value: "1700000000" },
    })
    fireEvent.click(screen.getByRole("radio", { name: "Seconds" }))
    fireEvent.click(screen.getByRole("radio", { name: "Milliseconds" }))

    expect(screen.getByDisplayValue("1700000000000")).toBeTruthy()
  })

  test("does not rewrite the raw value when switching from auto to a fixed unit", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_123)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    fireEvent.change(screen.getByLabelText("Unix Timestamp"), {
      target: { value: "1700000000" },
    })
    fireEvent.click(screen.getByRole("radio", { name: "Seconds" }))

    expect(screen.getByDisplayValue("1700000000")).toBeTruthy()
  })

  test("updates the timestamp when the date-time field changes", () => {
    vi.spyOn(Date, "now").mockReturnValue(1_700_000_000_123)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    fireEvent.click(screen.getByRole("radio", { name: "Seconds" }))
    fireEvent.change(screen.getByLabelText("Date & Time"), {
      target: { value: "2024-01-02T03:04:05.006" },
    })

    expect(
      screen.getByDisplayValue(
        String(Math.floor(new Date(2024, 0, 2, 3, 4, 5, 6).getTime() / 1000))
      )
    ).toBeTruthy()
  })

  test("updates the relative time as the clock ticks", () => {
    vi.useFakeTimers()
    vi.setSystemTime(1_700_000_000_000)

    render(<UnixTimestampConverterClient language="en" messages={messages} />)

    expect(screen.getByText("now")).toBeTruthy()

    act(() => {
      vi.advanceTimersByTime(61_000)
    })

    expect(screen.getByText("1 minute ago")).toBeTruthy()
  })
})
