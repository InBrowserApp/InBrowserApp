import { describe, expect, it, vi, beforeEach, afterEach } from 'vitest'
import { SignalEngine } from './signalEngine'
import { stations } from '../core/stations'

class FakeAudioParam {
  setValueAtTime = vi.fn()
}

class FakeGainNode {
  gain = new FakeAudioParam()
  connect = vi.fn()
  disconnect = vi.fn()
}

class FakeOscillatorNode {
  frequency = { value: 0 }
  type = 'square'
  connect = vi.fn()
  disconnect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeAudioContext {
  currentTime = 0
  state: AudioContextState = 'running'
  destination = {}
  oscillator = new FakeOscillatorNode()
  gainNode = new FakeGainNode()
  createOscillator() {
    return this.oscillator as unknown as OscillatorNode
  }
  createGain() {
    return this.gainNode as unknown as GainNode
  }
  resume = vi.fn().mockResolvedValue(undefined)
  close = vi.fn().mockResolvedValue(undefined)
}

describe('SignalEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('starts and schedules audio', async () => {
    const fakeContext = new FakeAudioContext()
    const engine = new SignalEngine(() => fakeContext as unknown as AudioContext)
    const intervalSpy = vi.spyOn(window, 'setInterval')
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
    intervalSpy.mockRestore()
  })

  it('updates gain when volume changes', async () => {
    const fakeContext = new FakeAudioContext()
    const engine = new SignalEngine(() => fakeContext as unknown as AudioContext)
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

  it('bails out when start is superseded', async () => {
    const fakeContext = new FakeAudioContext()
    fakeContext.state = 'suspended'
    const engine = new SignalEngine(() => fakeContext as unknown as AudioContext)

    const startPromise = engine.start({
      station: stations[0]!,
      volume: 0.5,
      offsetMs: 0,
    })

    engine.stop()
    await startPromise

    expect(fakeContext.resume).toHaveBeenCalled()
  })

  it('ignores volume updates without an active context', () => {
    const engine = new SignalEngine(() => new FakeAudioContext() as unknown as AudioContext)
    engine.setVolume(0.2)
  })

  it('skips scheduling when not initialized', () => {
    const engine = new SignalEngine(() => new FakeAudioContext() as unknown as AudioContext)
    ;(engine as unknown as { schedule: () => void }).schedule()
  })
})
