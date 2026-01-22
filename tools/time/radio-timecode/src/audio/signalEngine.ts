import type { Station } from '../core/stations'
import { getStationSignal } from '../core/encoders'

export type SignalEngineOptions = {
  station: Station
  volume: number
  offsetMs: number
}

export type AudioContextFactory = () => AudioContext

export class SignalEngine {
  private context: AudioContext | null = null
  private oscillator: OscillatorNode | null = null
  private gain: GainNode | null = null
  private timer: number | null = null
  private startTime = 0
  private baseTimeMs = 0
  private nextSecond = 0
  private options: SignalEngineOptions | null = null
  private readonly scheduleAhead = 1.2

  constructor(private readonly createContext: AudioContextFactory) {}

  async start(options: SignalEngineOptions) {
    this.stop()
    this.options = options
    const context = this.createContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()

    oscillator.type = 'square'
    oscillator.frequency.value = options.station.baseHz
    gain.gain.value = Math.max(0, Math.min(1, options.volume))

    oscillator.connect(gain)
    gain.connect(context.destination)

    const nowMs = Date.now() + options.offsetMs
    const nextMs = Math.ceil(nowMs / 1000) * 1000
    const delay = (nextMs - nowMs) / 1000

    this.context = context
    this.oscillator = oscillator
    this.gain = gain
    this.baseTimeMs = nextMs
    this.startTime = context.currentTime + delay
    this.nextSecond = 0

    oscillator.start(this.startTime)
    if (context.state === 'suspended') {
      await context.resume()
    }

    this.schedule()
    this.timer = window.setInterval(() => this.schedule(), 120)
  }

  stop() {
    if (this.timer !== null) {
      window.clearInterval(this.timer)
      this.timer = null
    }
    if (this.oscillator) {
      try {
        this.oscillator.stop()
      } catch {
        // ignore
      }
      this.oscillator.disconnect()
      this.oscillator = null
    }
    if (this.gain) {
      this.gain.disconnect()
      this.gain = null
    }
    if (this.context) {
      this.context.close()
      this.context = null
    }
    this.options = null
  }

  private schedule() {
    if (!this.context || !this.gain || !this.options) return

    const currentTime = this.context.currentTime
    while (this.startTime + this.nextSecond < currentTime + this.scheduleAhead) {
      const secondTime = this.startTime + this.nextSecond
      const systemTimeMs = this.baseTimeMs + this.nextSecond * 1000
      const signal = getStationSignal(this.options.station.id, new Date(systemTimeMs))
      const full = Math.max(0, Math.min(1, this.options.volume))
      const low = full * this.options.station.lowRatio

      this.gain.gain.setValueAtTime(full, secondTime)
      for (const window of signal.windows) {
        const start = secondTime + window.start
        const end = secondTime + window.end
        this.gain.gain.setValueAtTime(low, start)
        this.gain.gain.setValueAtTime(full, end)
      }

      this.nextSecond += 1
    }
  }
}
