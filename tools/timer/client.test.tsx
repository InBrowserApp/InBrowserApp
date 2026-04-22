import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import TimerClient from "./client"

import type { TimerMessages } from "./types"

const messages: TimerMessages = {
  meta: {
    name: "Timer",
    description:
      "Set a countdown timer with optional sound, vibration, and browser notifications.",
  },
  startLabel: "Start",
  resumeLabel: "Resume",
  pauseLabel: "Pause",
  resetLabel: "Reset",
  fullscreenEnterLabel: "Fullscreen",
  fullscreenExitLabel: "Exit fullscreen",
  durationLabel: "Duration",
  durationHintLabel: "Set the countdown duration before starting.",
  hoursLabel: "Hours",
  minutesLabel: "Minutes",
  secondsLabel: "Seconds",
  quickPresetsLabel: "Quick Presets",
  presetMinutesLabel: "{minutes} min",
  alertsLabel: "Alerts",
  soundLabel: "Sound",
  vibrationLabel: "Vibration",
  notificationsLabel: "Notifications",
  notificationUnsupportedLabel:
    "Notifications are not supported in this browser.",
  notificationDeniedLabel: "Notifications are blocked in browser settings.",
  notificationDefaultLabel: "Allow notifications to receive alerts.",
  notificationGrantedLabel: "Notifications are enabled.",
  notificationRequestLabel: "Enable",
  notificationTitle: "Timer finished",
  notificationBody: "Time's up.",
  errorNoDurationLabel: "Set a duration greater than zero.",
}

class MockAudioContext {
  static instances: MockAudioContext[] = []

  currentTime = 0
  destination = {}
  state: "running" | "suspended" = "running"

  createOscillator() {
    return {
      type: "sine",
      frequency: { value: 0 },
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }
  }

  createGain() {
    return {
      connect: vi.fn(),
      gain: {
        setValueAtTime: vi.fn(),
        linearRampToValueAtTime: vi.fn(),
      },
    }
  }

  resume = vi.fn(async () => {
    this.state = "running"
  })

  constructor() {
    MockAudioContext.instances.push(this)
  }
}

class MockNotification {
  static permission: NotificationPermission = "granted"
  static requestPermission = vi.fn(async () => MockNotification.permission)
  static created: Array<{ title: string; body?: string }> = []

  constructor(title: string, options?: NotificationOptions) {
    MockNotification.created.push({
      title,
      body: options?.body,
    })
  }
}

beforeEach(() => {
  MockAudioContext.instances = []
  MockNotification.permission = "granted"
  MockNotification.created = []
  MockNotification.requestPermission = vi.fn(
    async () => MockNotification.permission
  )
  vi.stubGlobal("AudioContext", MockAudioContext)
  vi.stubGlobal("Notification", MockNotification)
  Object.defineProperty(globalThis.navigator, "vibrate", {
    configurable: true,
    value: vi.fn(),
  })
})

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.unstubAllGlobals()
  window.localStorage.clear()
})

describe("TimerClient", () => {
  test("restores persisted timer state", async () => {
    window.localStorage.setItem("tools:timer:hours", "0")
    window.localStorage.setItem("tools:timer:minutes", "10")
    window.localStorage.setItem("tools:timer:seconds", "5")
    window.localStorage.setItem("tools:timer:remaining-ms", "605000")
    window.localStorage.setItem("tools:timer:sound-enabled", "false")
    window.localStorage.setItem("tools:timer:vibration-enabled", "false")
    window.localStorage.setItem("tools:timer:notification-enabled", "true")

    render(<TimerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByTestId("timer-display").textContent).toBe(
        "00:10:05.00"
      )
    })

    expect(
      (screen.getByTestId("minutes-input") as HTMLInputElement).value
    ).toBe("10")
    expect(
      (screen.getByTestId("seconds-input") as HTMLInputElement).value
    ).toBe("5")
    expect(screen.getByTestId("sound-switch").getAttribute("data-state")).toBe(
      "unchecked"
    )
    expect(
      screen.getByTestId("notification-switch").getAttribute("data-state")
    ).toBe("checked")
  })

  test("starts pauses resumes and resets the countdown", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-15T12:00:00.000Z"))

    render(<TimerClient messages={messages} />)

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByTestId("timer-display").textContent).toBe("00:05:00.00")

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Start" }))
      await Promise.resolve()
    })

    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(screen.getByTestId("timer-display").textContent).toBe("00:04:58.00")

    fireEvent.click(screen.getByRole("button", { name: "Pause" }))

    const pausedValue = screen.getByTestId("timer-display").textContent

    await act(async () => {
      await vi.advanceTimersByTimeAsync(2_000)
    })

    expect(screen.getByTestId("timer-display").textContent).toBe(pausedValue)

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Resume" }))
      await vi.advanceTimersByTimeAsync(1_000)
    })

    expect(screen.getByTestId("timer-display").textContent).toBe("00:04:57.00")

    fireEvent.click(screen.getByRole("button", { name: "Pause" }))
    fireEvent.click(screen.getByRole("button", { name: "Reset" }))

    expect(screen.getByTestId("timer-display").textContent).toBe("00:05:00.00")
  })

  test("shows an error when starting with a zero duration", async () => {
    render(<TimerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByTestId("timer-display").textContent).toBe(
        "00:05:00.00"
      )
    })

    fireEvent.change(screen.getByTestId("minutes-input"), {
      target: { value: "0" },
    })

    fireEvent.click(screen.getByRole("button", { name: "Start" }))

    await waitFor(() => {
      expect(screen.getByText("Set a duration greater than zero.")).toBeTruthy()
    })
  })

  test("applies preset buttons when the timer is not running", async () => {
    render(<TimerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByTestId("timer-display").textContent).toBe(
        "00:05:00.00"
      )
    })

    fireEvent.click(screen.getByTestId("preset-25"))

    await waitFor(() => {
      expect(screen.getByTestId("timer-display").textContent).toBe(
        "00:25:00.00"
      )
    })
  })

  test("requests notification permission when notifications are enabled", async () => {
    MockNotification.permission = "default"

    render(<TimerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByTestId("notification-switch")).toBeTruthy()
    })

    fireEvent.click(screen.getByTestId("notification-switch"))

    await waitFor(() => {
      expect(MockNotification.requestPermission).toHaveBeenCalledTimes(1)
      expect(screen.getByTestId("notification-hint")).toBeTruthy()
    })
  })

  test("falls back to a pseudo fullscreen overlay when fullscreen is unavailable", async () => {
    render(<TimerClient messages={messages} />)

    await waitFor(() => {
      expect(screen.getByRole("button", { name: "Fullscreen" })).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Fullscreen" }))

    await waitFor(() => {
      expect(screen.getByTestId("fullscreen-overlay")).toBeTruthy()
    })

    fireEvent.click(screen.getByRole("button", { name: "Exit fullscreen" }))

    await waitFor(() => {
      expect(screen.queryByTestId("fullscreen-overlay")).toBeNull()
    })
  })

  test("plays enabled alerts when the timer completes", async () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2026-04-15T12:00:00.000Z"))

    render(<TimerClient messages={messages} />)

    await act(async () => {
      await Promise.resolve()
    })

    expect(screen.getByTestId("timer-display").textContent).toBe("00:05:00.00")

    fireEvent.change(screen.getByTestId("minutes-input"), {
      target: { value: "0" },
    })
    fireEvent.change(screen.getByTestId("seconds-input"), {
      target: { value: "1" },
    })
    fireEvent.click(screen.getByTestId("notification-switch"))

    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: "Start" }))
      await Promise.resolve()
    })

    expect(screen.getByRole("button", { name: "Pause" })).toBeTruthy()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1_200)
    })

    expect(screen.getByTestId("timer-display").textContent).toBe("00:00:00.00")

    expect(MockAudioContext.instances).toHaveLength(1)
    expect(globalThis.navigator.vibrate).toHaveBeenCalled()
    expect(MockNotification.created).toEqual([
      {
        title: "Timer finished",
        body: "Time's up.",
      },
    ])
  })
})
