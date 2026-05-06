import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import { SignalEngine, clampVolume } from "./signal-engine"
import { stations } from "../core/stations"

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
  currentTime = 0
  destination = {}
  gainNode = new FakeGainNode()
  oscillator = new FakeOscillatorNode()
  state: AudioContextState = "running"

  createGain() {
    return this.gainNode as unknown as GainNode
  }

  createOscillator() {
    return this.oscillator as unknown as OscillatorNode
  }

  resume = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)
}

describe("SignalEngine", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2024-01-01T00:00:00Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  test("starts and schedules audio", async () => {
    const fakeContext = new FakeAudioContext()
    const engine = new SignalEngine(
      () => fakeContext as unknown as AudioContext
    )
    const intervalSpy = vi.spyOn(window, "setInterval")

    await engine.start({
      station: stations[0]!,
      volume: 0.5,
      offsetMs: 0,
    })

    expect(fakeContext.oscillator.start).toHaveBeenCalled()
    expect(fakeContext.gainNode.gain.setValueAtTime).toHaveBeenCalled()
    expect(intervalSpy).toHaveBeenCalled()

    engine.stop()

    expect(fakeContext.oscillator.stop).toHaveBeenCalled()
    expect(fakeContext.close).toHaveBeenCalled()
  })

  test("updates gain when volume changes", async () => {
    const fakeContext = new FakeAudioContext()
    const engine = new SignalEngine(
      () => fakeContext as unknown as AudioContext
    )

    await engine.start({
      station: stations[0]!,
      volume: 0.5,
      offsetMs: 0,
    })

    fakeContext.currentTime = 3
    engine.setVolume(2)

    expect(fakeContext.gainNode.gain.setValueAtTime).toHaveBeenCalledWith(1, 3)
    engine.stop()
  })

  test("bails out when start is superseded", async () => {
    const fakeContext = new FakeAudioContext()
    fakeContext.state = "suspended"

    const engine = new SignalEngine(
      () => fakeContext as unknown as AudioContext
    )
    const startPromise = engine.start({
      station: stations[0]!,
      volume: 0.5,
      offsetMs: 0,
    })

    engine.stop()
    await startPromise

    expect(fakeContext.resume).toHaveBeenCalled()
  })

  test("ignores volume updates and schedule calls without active context", () => {
    const engine = new SignalEngine(
      () => new FakeAudioContext() as unknown as AudioContext
    )

    engine.setVolume(0.2)
    ;(engine as unknown as { schedule: () => void }).schedule()
  })
})

describe("clampVolume", () => {
  test("keeps volume inside the Web Audio gain range", () => {
    expect(clampVolume(-1)).toBe(0)
    expect(clampVolume(0.4)).toBe(0.4)
    expect(clampVolume(2)).toBe(1)
  })
})
