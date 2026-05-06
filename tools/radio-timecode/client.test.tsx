import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RadioTimecodeClient from "./client"

import type { RadioTimecodeMessages } from "./types"

const messages: RadioTimecodeMessages = {
  meta: {
    name: "Radio Timecode Sync",
    description: "Generate radio timecode audio.",
  },
  stationLabel: "Station",
  stationHint: "Choose the matching time signal.",
  stationDescriptions: {
    "jjy-40": "Fukushima station.",
    "jjy-60": "Kyushu station.",
    bpc: "Chinese standard time signal.",
    dcf77: "German long-wave time signal.",
    msf: "UK civil time signal.",
    wwvb: "US time signal.",
  },
  signalTitle: "Signal",
  outputTitle: "Audio output",
  previewTitle: "Live preview",
  startLabel: "Start signal",
  stopLabel: "Stop signal",
  startingLabel: "Starting...",
  unsupportedAudioTitle: "Audio output is unavailable",
  unsupportedAudioDescription: "This browser cannot play a timecode signal.",
  startFailedTitle: "Audio output failed",
  startFailedDescription: "The browser blocked or failed audio.",
  playbackStatusLabel: "Playback",
  playbackStatusPlaying: "Signal is playing",
  playbackStatusIdle: "Signal is stopped",
  volumeLabel: "Volume",
  volumeHint: "Use a low volume first.",
  offsetLabel: "Time offset",
  offsetHint: "Apply a manual clock correction.",
  carrierLabel: "Carrier",
  outputToneLabel: "Output tone",
  attenuationLabel: "Low pulse level",
  stationTimeLabel: "Station time",
  timeZoneLabel: "Time zone",
  currentSymbolLabel: "Current symbol",
  upcomingSymbolsLabel: "Next symbols",
  previewDescription: "Watch the station-local time and symbol.",
  notesTitle: "Operating notes",
  notes: [
    "Keep volume low.",
    "Uses local system time.",
    "Uses a lower-frequency harmonic approximation.",
    "JJY call-sign minutes are not simulated.",
  ],
  hzUnit: "Hz",
  millisecondsUnit: "ms",
  percentUnit: "%",
}

class FakeAudioParam {
  setValueAtTime = vi.fn()
  value = 0
}

class FakeGainNode {
  gain = new FakeAudioParam()
  connect = vi.fn()
  disconnect = vi.fn()
}

class FakeOscillatorNode {
  frequency = { value: 0 }
  type = "square"
  connect = vi.fn()
  disconnect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeAudioContext {
  static instances: FakeAudioContext[] = []

  currentTime = 0
  destination = {}
  gainNode = new FakeGainNode()
  oscillator = new FakeOscillatorNode()
  state: AudioContextState = "running"

  constructor() {
    FakeAudioContext.instances.push(this)
  }

  createGain() {
    return this.gainNode as unknown as GainNode
  }

  createOscillator() {
    return this.oscillator as unknown as OscillatorNode
  }

  resume = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)
}

beforeEach(() => {
  window.localStorage.clear()
  FakeAudioContext.instances = []
  vi.useFakeTimers({ shouldAdvanceTime: true })
  vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))
})

afterEach(() => {
  cleanup()
  window.localStorage.clear()
  vi.useRealTimers()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("RadioTimecodeClient", () => {
  test("renders the live station preview and starts/stops audio", async () => {
    vi.stubGlobal("AudioContext", FakeAudioContext)

    render(<RadioTimecodeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.queryByText("Audio output is unavailable")).toBeNull()
    })

    expect(screen.getByTestId("station-time").textContent).toContain("09:00:00")
    expect(screen.getByText("Asia/Tokyo")).toBeTruthy()
    expect(screen.getByText("15,000 Hz")).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: "Start signal" }))

    await waitFor(() => {
      expect(FakeAudioContext.instances).toHaveLength(1)
    })

    expect(FakeAudioContext.instances[0]?.oscillator.start).toHaveBeenCalled()

    await waitFor(() => {
      expect(screen.getByTestId("playback-status").textContent).toContain(
        "Signal is playing"
      )
    })

    fireEvent.click(screen.getByRole("button", { name: "Stop signal" }))

    expect(FakeAudioContext.instances[0]?.oscillator.stop).toHaveBeenCalled()
    expect(screen.getByTestId("playback-status").textContent).toContain(
      "Signal is stopped"
    )
  })

  test("shows an unsupported-browser alert without Web Audio", async () => {
    vi.stubGlobal("AudioContext", undefined)

    render(<RadioTimecodeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("Audio output is unavailable")).toBeTruthy()
    })

    expect(
      screen.getByRole<HTMLButtonElement>("button", { name: "Start signal" })
        .disabled
    ).toBe(true)
  })

  test("applies stored station, volume, and offset preferences", async () => {
    vi.stubGlobal("AudioContext", FakeAudioContext)
    window.localStorage.setItem("tools:radio-timecode:station", "wwvb")
    window.localStorage.setItem("tools:radio-timecode:volume", "0.42")
    window.localStorage.setItem("tools:radio-timecode:offset", "1000")

    render(<RadioTimecodeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.getByText("UTC")).toBeTruthy()
    })

    expect(screen.getByText("42%")).toBeTruthy()
    expect(screen.getByDisplayValue("1000")).toBeTruthy()
    expect(screen.getByTestId("station-time").textContent).toContain("00:00:01")
  })

  test("shows a start failure when the audio context throws", async () => {
    class ThrowingAudioContext {
      constructor() {
        throw new Error("blocked")
      }
    }

    vi.stubGlobal("AudioContext", ThrowingAudioContext)

    render(<RadioTimecodeClient language="en" messages={messages} />)

    await waitFor(() => {
      expect(screen.queryByText("Audio output is unavailable")).toBeNull()
    })

    fireEvent.click(screen.getByRole("button", { name: "Start signal" }))

    await waitFor(() => {
      expect(screen.getByText("Audio output failed")).toBeTruthy()
    })
  })
})
