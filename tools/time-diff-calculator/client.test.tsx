import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import TimeDiffCalculatorClient from "./client"
import { STORAGE_KEYS } from "./client/storage"

const messages = {
  meta: {
    name: "Time Difference Calculator",
    description:
      "Calculate the exact elapsed time between two timestamps in different time zones.",
  },
  startLabel: "Start",
  endLabel: "End",
  timeZoneLabel: "Time zone",
  dateTimeLabel: "Date & time",
  dateTimePlaceholder: "YYYY-MM-DD HH:mm:ss.SSS",
  formatHint: "Format: YYYY-MM-DD HH:mm:ss.SSS",
  nowLabel: "Now",
  offsetLabel: "Offset",
  invalidDateTimeLabel: "Invalid date/time",
  swapLabel: "Swap",
  resultsLabel: "Results",
  signedDurationLabel: "Signed duration",
  absoluteDurationLabel: "Absolute duration",
  iso8601DurationLabel: "ISO 8601 duration",
  totalMillisecondsLabel: "Total milliseconds",
  totalSecondsLabel: "Total seconds",
  totalMinutesLabel: "Total minutes",
  totalHoursLabel: "Total hours",
  totalDaysLabel: "Total days",
  copyLabel: "Copy",
  copiedLabel: "Copied",
} as const

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  window.localStorage.clear()
})

describe("TimeDiffCalculatorClient", () => {
  test("renders restored state and derived difference values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.startInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.endInput,
      "2024-01-01 07:30:00.000"
    )

    render(<TimeDiffCalculatorClient messages={messages} />)

    const startCard = screen.getByTestId("time-diff-card-start")

    await waitFor(() => {
      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    expect(screen.getAllByText("0d 00:30:00.000")).toHaveLength(2)
    expect(screen.getByText("PT30M")).toBeTruthy()
    expect(screen.getByText("1800000")).toBeTruthy()
    expect(screen.getByText("1800")).toBeTruthy()
    expect(screen.getByText("30")).toBeTruthy()
    expect(screen.getByText("0.5")).toBeTruthy()
    expect(screen.getByText("0.020833")).toBeTruthy()
  })

  test("shows validation errors and clears results when input is invalid", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.startInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.endInput,
      "2024-01-01 07:30:00.000"
    )

    render(<TimeDiffCalculatorClient messages={messages} />)

    const startCard = screen.getByTestId("time-diff-card-start")

    await waitFor(() => {
      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    fireEvent.change(within(startCard).getByLabelText("Date & time"), {
      target: { value: "invalid" },
    })

    await waitFor(() => {
      expect(screen.getByText("Invalid date/time")).toBeTruthy()
    })

    expect(screen.getAllByText("—")).toHaveLength(8)
  })

  test("sets the start time to now", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 2, 8, 4, 5, 6))
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, "America/New_York")
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.startInput,
      "2024-01-01 00:00:00.000"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.endInput,
      "2024-01-01 05:00:00.000"
    )

    render(<TimeDiffCalculatorClient messages={messages} />)

    const startCard = screen.getByTestId("time-diff-card-start")

    await waitFor(() => {
      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 00:00:00.000"
      )
    })

    fireEvent.click(within(startCard).getByTestId("set-now-start"))

    await waitFor(() => {
      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })
  })

  test("sets the end time to now", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 2, 8, 4, 5, 6))
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.startInput,
      "2024-01-01 05:00:00.000"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.endInput,
      "2024-01-01 00:00:00.000"
    )

    render(<TimeDiffCalculatorClient messages={messages} />)

    const endCard = screen.getByTestId("time-diff-card-end")

    await waitFor(() => {
      expect(within(endCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 00:00:00.000"
      )
    })

    fireEvent.click(within(endCard).getByTestId("set-now-end"))

    await waitFor(() => {
      expect(within(endCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
    })
  })

  test("swaps time zones and local date time values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.startTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.endTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.startInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(
      STORAGE_KEYS.endInput,
      "2024-01-01 07:30:00.000"
    )

    render(<TimeDiffCalculatorClient messages={messages} />)

    const startCard = screen.getByTestId("time-diff-card-start")
    const endCard = screen.getByTestId("time-diff-card-end")

    await waitFor(() => {
      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    fireEvent.click(screen.getByTestId("swap-time-diff-values"))

    await waitFor(() => {
      const startTimeZone = within(startCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement
      const endTimeZone = within(endCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement

      expect(within(startCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 07:30:00.000"
      )
      expect(within(endCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
      expect(startTimeZone.value).toBe("America/New_York")
      expect(endTimeZone.value).toBe("UTC")
    })
  })
})
