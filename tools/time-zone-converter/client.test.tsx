import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import TimeZoneConverterClient from "./client"

const messages = {
  meta: {
    name: "Time Zone Converter",
    description:
      "Convert a date and time between time zones with daylight saving support. Compare offsets and copy ISO/UTC formats.",
  },
  fromLabel: "From",
  toLabel: "To",
  timeZoneLabel: "Time zone",
  dateTimeLabel: "Date & time",
  dateTimePlaceholder: "YYYY-MM-DD HH:mm:ss.SSS",
  formatHint: "Format: YYYY-MM-DD HH:mm:ss.SSS",
  nowLabel: "Now",
  offsetLabel: "Offset",
  invalidDateTimeLabel: "Invalid date/time",
  swapLabel: "Swap",
  detailsLabel: "Details",
  iso8601Label: "ISO 8601",
  utcLabel: "UTC",
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

describe("TimeZoneConverterClient", () => {
  test("renders restored state and derived detail values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 07:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")

    await waitFor(() => {
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    expect(
      within(fromCard).getByRole("combobox", { name: "Time zone" }).textContent
    ).toContain("UTC (UTC+00:00)")
    expect(screen.getByText("2024-01-01T12:00:00.000Z")).toBeTruthy()
    expect(screen.getByText("Mon, 01 Jan 2024 12:00:00 GMT")).toBeTruthy()
    expect(screen.getByText("1704110400000")).toBeTruthy()
    expect(screen.getByText("1704110400")).toBeTruthy()
  })

  test("shows validation errors and clears derived details when input is invalid", async () => {
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 07:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")

    await waitFor(() => {
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    fireEvent.change(within(fromCard).getByLabelText("Date & time"), {
      target: { value: "invalid" },
    })

    await waitFor(() => {
      expect(screen.getByText("Invalid date/time")).toBeTruthy()
    })

    expect(screen.getAllByText("—")).toHaveLength(4)
  })

  test("sets the from time to now and updates the opposite card", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 2, 8, 4, 5, 6))
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "America/New_York")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "UTC")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 00:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 05:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")
    const toCard = screen.getByTestId("time-zone-card-to")

    await waitFor(() => {
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 00:00:00.000"
      )
    })

    fireEvent.click(within(fromCard).getByTestId("set-now-from"))

    await waitFor(() => {
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
      expect(within(toCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 08:04:05.006"
      )
    })
  })

  test("sets the to time to now and updates the opposite card", async () => {
    vi.spyOn(Date, "now").mockReturnValue(Date.UTC(2024, 0, 2, 8, 4, 5, 6))
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 05:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 00:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")
    const toCard = screen.getByTestId("time-zone-card-to")

    await waitFor(() => {
      expect(within(toCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 00:00:00.000"
      )
    })

    fireEvent.click(within(toCard).getByTestId("set-now-to"))

    await waitFor(() => {
      expect(within(toCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 03:04:05.006"
      )
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-02 08:04:05.006"
      )
    })
  })

  test("swaps time zones and local date time values", async () => {
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "UTC")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "America/New_York")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 07:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")
    const toCard = screen.getByTestId("time-zone-card-to")

    await waitFor(() => {
      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
    })

    fireEvent.click(screen.getByTestId("swap-time-zones"))

    await waitFor(() => {
      const fromTimeZone = within(fromCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement
      const toTimeZone = within(toCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement

      expect(within(fromCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 07:00:00.000"
      )
      expect(within(toCard).getByLabelText("Date & time")).toHaveProperty(
        "value",
        "2024-01-01 12:00:00.000"
      )
      expect(fromTimeZone.value).toBe("America/New_York")
      expect(toTimeZone.value).toBe("UTC")
    })
  })

  test("falls back to safe default zones when restored values are unsupported", async () => {
    window.localStorage.setItem(STORAGE_KEYS.fromTimeZone, "Bad/Zone")
    window.localStorage.setItem(STORAGE_KEYS.toTimeZone, "Also/Bad")
    window.localStorage.setItem(
      STORAGE_KEYS.fromInput,
      "2024-01-01 12:00:00.000"
    )
    window.localStorage.setItem(STORAGE_KEYS.toInput, "2024-01-01 07:00:00.000")

    render(<TimeZoneConverterClient messages={messages} />)

    const fromCard = screen.getByTestId("time-zone-card-from")
    const toCard = screen.getByTestId("time-zone-card-to")

    await waitFor(() => {
      const fromTimeZone = within(fromCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement
      const toTimeZone = within(toCard).getByRole("combobox", {
        name: "Time zone",
      }) as HTMLSelectElement

      expect(fromTimeZone.value).not.toBe("Bad/Zone")
      expect(toTimeZone.value).not.toBe("Also/Bad")
    })
  })
})

const STORAGE_KEYS = {
  fromInput: "tools:time-zone-converter:from-input",
  toInput: "tools:time-zone-converter:to-input",
  fromTimeZone: "tools:time-zone-converter:from-timezone",
  toTimeZone: "tools:time-zone-converter:to-timezone",
} as const
