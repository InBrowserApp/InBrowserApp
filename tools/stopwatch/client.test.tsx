import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import StopwatchClient from "./client"

const messages = {
  meta: {
    name: "Stopwatch",
    description:
      "Track elapsed time with start, pause, lap, and reset controls.",
  },
  startLabel: "Start",
  resumeLabel: "Resume",
  pauseLabel: "Pause",
  lapLabel: "Lap",
  resetLabel: "Reset",
  lapsLabel: "Laps",
  clearLabel: "Clear",
  exportLabel: "Export",
  noLapsLabel: "No laps yet",
  lapsDescription:
    "Review lap splits and cumulative totals. Export the list as CSV or clear it to start over.",
  statusRunningLabel: "Running",
  statusPausedLabel: "Paused",
  lapTimeLabel: "Lap",
  totalTimeLabel: "Total",
  lapMillisecondsLabel: "Lap (ms)",
  totalMillisecondsLabel: "Total (ms)",
} as const

const storageKeys = [
  "tools:stopwatch:running",
  "tools:stopwatch:start-time",
  "tools:stopwatch:accumulated",
  "tools:stopwatch:laps",
] as const

const originalCreateObjectURL = URL.createObjectURL
const originalRevokeObjectURL = URL.revokeObjectURL

function getElapsedText() {
  return screen.getByTestId("elapsed-time").textContent ?? ""
}

describe("StopwatchClient", () => {
  beforeEach(() => {
    storageKeys.forEach((key) => window.localStorage.removeItem(key))
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))
    URL.createObjectURL = vi.fn(() => "blob:mock")
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    cleanup()
    storageKeys.forEach((key) => window.localStorage.removeItem(key))
    vi.useRealTimers()
    vi.restoreAllMocks()
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  test("starts, laps, pauses, and resets", () => {
    render(<StopwatchClient messages={messages} />)

    expect(getElapsedText()).toBe("00:00:00.00")

    fireEvent.click(screen.getByRole("button", { name: "Start" }))

    act(() => {
      vi.advanceTimersByTime(1234)
    })

    expect(getElapsedText()).toBe("00:00:01.20")

    fireEvent.click(screen.getByRole("button", { name: "Lap" }))

    expect(screen.getAllByTestId("lap-row")).toHaveLength(1)
    expect(screen.getAllByText("00:00:01.23")).toHaveLength(3)

    fireEvent.click(screen.getByRole("button", { name: "Pause" }))

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    expect(getElapsedText()).toBe("00:00:01.23")

    fireEvent.click(screen.getByRole("button", { name: "Reset" }))

    expect(getElapsedText()).toBe("00:00:00.00")
    expect(screen.queryAllByTestId("lap-row")).toHaveLength(0)
    expect(screen.getByTestId("no-laps")).toBeTruthy()
  })

  test("resumes from a paused time", () => {
    render(<StopwatchClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Start" }))

    act(() => {
      vi.advanceTimersByTime(1500)
    })

    fireEvent.click(screen.getByRole("button", { name: "Pause" }))

    act(() => {
      vi.advanceTimersByTime(1000)
    })

    fireEvent.click(screen.getByRole("button", { name: "Resume" }))

    act(() => {
      vi.advanceTimersByTime(500)
    })

    expect(getElapsedText()).toBe("00:00:02.00")
  })

  test("restores running state and laps after remount", () => {
    const { unmount } = render(<StopwatchClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Start" }))

    act(() => {
      vi.advanceTimersByTime(1234)
    })

    fireEvent.click(screen.getByRole("button", { name: "Lap" }))

    unmount()

    act(() => {
      vi.advanceTimersByTime(2000)
    })

    render(<StopwatchClient messages={messages} />)

    expect(getElapsedText()).toBe("00:00:03.23")
    expect(screen.getAllByTestId("lap-row")).toHaveLength(1)
  })

  test("recovers from an invalid persisted running state", () => {
    window.localStorage.setItem("tools:stopwatch:running", "true")
    window.localStorage.setItem("tools:stopwatch:start-time", "0")

    render(<StopwatchClient messages={messages} />)

    expect(screen.getByText("Paused")).toBeTruthy()
    expect(window.localStorage.getItem("tools:stopwatch:running")).toBe("false")
  })

  test("exposes a csv export link and clears laps", () => {
    render(<StopwatchClient messages={messages} />)

    fireEvent.click(screen.getByRole("button", { name: "Start" }))

    act(() => {
      vi.advanceTimersByTime(1200)
    })

    fireEvent.click(screen.getByRole("button", { name: "Lap" }))

    const exportCsv = screen.getByTestId("export-csv")

    expect(exportCsv.getAttribute("download")).toBe("stopwatch-laps.csv")
    expect(exportCsv.getAttribute("href")).toBe("blob:mock")

    fireEvent.click(screen.getByTestId("clear-laps"))

    expect(screen.queryAllByTestId("lap-row")).toHaveLength(0)
    expect(screen.getByTestId("no-laps")).toBeTruthy()
  })
})
