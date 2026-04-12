import { cleanup, render, screen, waitFor } from "@testing-library/react"
import { afterEach, describe, expect, test, vi } from "vitest"

import CurrentNetworkTimeClient from "./client"

const messages = {
  meta: {
    name: "Current Network Time",
    description: "Compare network time with your local clock.",
  },
  lastSyncedAt: "Last synced at",
  errorTitle: "Failed to sync time",
  offset: "Offset",
  syncing: "Syncing",
} as const

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("CurrentNetworkTimeClient", () => {
  test("shows the syncing state and then renders network timing details", async () => {
    let performanceMs = 1_000
    let epochMs = 1_700_000_000_000
    let resolveTraceText: ((value: string) => void) | undefined
    const fetchMock = vi.fn().mockResolvedValue({
      text: vi.fn().mockImplementation(
        () =>
          new Promise<string>((resolve) => {
            resolveTraceText = resolve
          })
      ),
    })

    vi.spyOn(performance, "now").mockImplementation(() => performanceMs)
    vi.spyOn(Date, "now").mockImplementation(() => epochMs)
    vi.stubGlobal("fetch", fetchMock)

    render(<CurrentNetworkTimeClient language="en" messages={messages} />)

    expect(screen.getByText("Syncing")).toBeTruthy()
    expect(screen.getAllByText("—")).toHaveLength(2)

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1)
      expect(resolveTraceText).toBeTypeOf("function")
    })

    performanceMs = 1_200
    epochMs = 1_700_000_000_200
    resolveTraceText?.("ts=1700000000.323")

    await waitFor(() => {
      expect(screen.getByText("123 ms (±200 ms)")).toBeTruthy()
    })

    expect(screen.getByText("Last synced at")).toBeTruthy()
    expect(screen.queryByText("Syncing")).toBeNull()
    expect(screen.queryByText("Failed to sync time")).toBeNull()
  })

  test("shows an error alert when syncing fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("request failed"))
    )

    render(<CurrentNetworkTimeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Failed to sync time")).toBeTruthy()
    })

    expect(screen.getByText("request failed")).toBeTruthy()
  })

  test("skips overlapping sync requests while the current request is pending", async () => {
    let performanceMs = 1_000
    let epochMs = 1_700_000_000_000
    const intervalCallbacks: Array<() => void> = []
    let resolveFetch:
      | ((value: { text: () => Promise<string> }) => void)
      | undefined
    const fetchMock = vi.fn().mockImplementation(
      () =>
        new Promise<{ text: () => Promise<string> }>((resolve) => {
          resolveFetch = resolve
        })
    )

    vi.spyOn(performance, "now").mockImplementation(() => performanceMs)
    vi.spyOn(Date, "now").mockImplementation(() => epochMs)
    vi.spyOn(window, "setInterval").mockImplementation(((
      callback: TimerHandler,
      _delay?: number
    ) => {
      intervalCallbacks.push(callback as () => void)
      return intervalCallbacks.length as unknown as ReturnType<
        typeof window.setInterval
      >
    }) as unknown as typeof window.setInterval)
    vi.spyOn(window, "clearInterval").mockImplementation(() => undefined)
    vi.stubGlobal("fetch", fetchMock)

    render(<CurrentNetworkTimeClient language="en" messages={messages} />)

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(resolveFetch).toBeTypeOf("function")
    expect(intervalCallbacks).toHaveLength(2)

    intervalCallbacks[0]?.()
    intervalCallbacks[1]?.()
    expect(fetchMock).toHaveBeenCalledTimes(1)

    performanceMs = 1_200
    epochMs = 1_700_000_000_200
    resolveFetch?.({
      text: async () => "ts=1700000000.323",
    })

    await waitFor(() => {
      expect(screen.getByText("123 ms (±200 ms)")).toBeTruthy()
    })
  })

  test("keeps the syncing indicator hidden during background re-syncs", async () => {
    let performanceMs = 1_000
    let epochMs = 1_700_000_000_000
    const intervalCallbacks: Array<() => void> = []
    let resolveInitialFetch:
      | ((value: { text: () => Promise<string> }) => void)
      | undefined
    let resolveBackgroundFetch:
      | ((value: { text: () => Promise<string> }) => void)
      | undefined
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise<{ text: () => Promise<string> }>((resolve) => {
            resolveInitialFetch = resolve
          })
      )
      .mockImplementationOnce(
        () =>
          new Promise<{ text: () => Promise<string> }>((resolve) => {
            resolveBackgroundFetch = resolve
          })
      )

    vi.spyOn(performance, "now").mockImplementation(() => performanceMs)
    vi.spyOn(Date, "now").mockImplementation(() => epochMs)
    vi.spyOn(window, "setInterval").mockImplementation(((
      callback: TimerHandler,
      _delay?: number
    ) => {
      intervalCallbacks.push(callback as () => void)
      return intervalCallbacks.length as unknown as ReturnType<
        typeof window.setInterval
      >
    }) as unknown as typeof window.setInterval)
    vi.spyOn(window, "clearInterval").mockImplementation(() => undefined)
    vi.stubGlobal("fetch", fetchMock)

    render(<CurrentNetworkTimeClient language="en" messages={messages} />)

    expect(screen.getByText("Syncing")).toBeTruthy()

    performanceMs = 1_200
    epochMs = 1_700_000_000_200
    resolveInitialFetch?.({
      text: async () => "ts=1700000000.323",
    })

    await waitFor(() => {
      expect(screen.getByText("123 ms (±200 ms)")).toBeTruthy()
    })

    expect(screen.queryByText("Syncing")).toBeNull()
    intervalCallbacks[1]?.()

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(2)
      expect(resolveBackgroundFetch).toBeTypeOf("function")
    })

    expect(screen.queryByText("Syncing")).toBeNull()
  })

  test("falls back to String for non-Error sync failures", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("request failed"))

    render(<CurrentNetworkTimeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("request failed")).toBeTruthy()
    })
  })
})
