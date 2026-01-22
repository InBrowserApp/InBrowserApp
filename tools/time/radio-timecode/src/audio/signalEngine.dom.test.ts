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
    await engine.start({
      station: stations[0],
      volume: 0.5,
      offsetMs: 0,
    })

    expect(fakeContext.oscillator.start).toHaveBeenCalled()
    expect(fakeContext.gainNode.gain.setValueAtTime).toHaveBeenCalled()

    engine.stop()
    expect(fakeContext.oscillator.stop).toHaveBeenCalled()
    expect(fakeContext.close).toHaveBeenCalled()
  })
})
