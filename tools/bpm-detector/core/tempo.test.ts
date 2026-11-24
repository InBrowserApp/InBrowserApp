import { describe, expect, it } from "vitest"
import { detectTempo, SAMPLE_RATE, selectSections } from "./tempo"

function beats(bpm: number, seconds = 10, intro = 0.3) {
  const samples = new Float32Array(seconds * SAMPLE_RATE)
  for (let beat = 0; beat < ((seconds - intro) * bpm) / 60; beat++) {
    const start = Math.round(SAMPLE_RATE * (intro + (beat * 60) / bpm))
    for (let i = 0; i < 4000 && start + i < samples.length; i++) {
      const t = i / SAMPLE_RATE
      const gain = Math.exp(-70 * t) * (beat % 4 === 0 ? 0.7 : 0.55)
      samples[start + i] =
        gain *
        (Math.sin(2 * Math.PI * 90 * t) +
          0.35 * Math.sin(2 * Math.PI * 1700 * t))
    }
  }
  return samples
}

describe("tempo detection", () => {
  it.each([45, 78, 98, 120, 171, 220])("detects a %i BPM pulse", (bpm) => {
    const result = detectTempo(selectSections([beats(bpm)]))
    expect(result).not.toBeNull()
    expect(Math.abs(result! - bpm)).toBeLessThanOrEqual(1)
  })

  it.each([110, 125, 140, 180, 220])(
    "detects a one-bar loop at %i BPM",
    (bpm) => {
      const loop = beats(bpm, 240 / bpm, 0.025)
      const result = detectTempo(selectSections([loop]))
      expect(result).not.toBeNull()
      expect(Math.abs(result! - bpm)).toBeLessThanOrEqual(1)
    }
  )

  it("keeps the same tempo when the track is quiet", () => {
    const track = beats(180).map((sample) => sample * 0.01)
    expect(detectTempo([[track]])).toBe(180)
  })

  it("detects opposite-phase stereo and combines consistent sections", () => {
    const first = beats(128)
    const second = beats(128, 5)
    expect(
      detectTempo([[first, first.map((sample) => -sample)], [second]])
    ).toBe(128)
  })

  it("does not give a tempo to a short clip, silence, a sustained tone, or uncorrelated noise", () => {
    expect(detectTempo([[new Float32Array(2400)]])).toBeNull()
    expect(detectTempo([[new Float32Array(3 * SAMPLE_RATE)]])).toBeNull()
    let random = 12345
    const noise = Float32Array.from({ length: SAMPLE_RATE * 8 }, () => {
      random = (Math.imul(random, 1664525) + 1013904223) >>> 0
      return random / 2 ** 32 - 0.5
    })
    expect(detectTempo([[noise]])).toBeNull()
    expect(detectTempo([[noise.subarray(0, 2.1 * SAMPLE_RATE)]])).toBeNull()
  })

  it.each([20, 27, 30, 40, 42, 60, 88, 440])(
    "distinguishes a steady %i Hz tone from a beat",
    (frequency) => {
      const tone = Float32Array.from(
        { length: 6 * SAMPLE_RATE },
        (_, i) => Math.sin((i * 2 * Math.PI * frequency) / SAMPLE_RATE) / 2
      )
      expect(detectTempo([[tone]])).toBeNull()
    }
  )

  it("recognizes repeated bass attacks alongside the steady-tone rejection", () => {
    const samples = new Float32Array(5 * SAMPLE_RATE)
    for (let beat = 0; beat < 9; beat++) {
      const start = Math.round((0.25 + beat / 2) * SAMPLE_RATE)
      for (let i = 0; i < 3_600; i++) {
        const time = i / SAMPLE_RATE
        samples[start + i] =
          Math.sin(2 * Math.PI * 25 * time) * Math.exp(-40 * time)
      }
    }
    expect(detectTempo([[samples]])).toBe(120)
  })

  it("detects rhythm in a long recording with silent sections", () => {
    const samples = new Float32Array(90 * SAMPLE_RATE)
    const rhythmic = beats(120, 22)
    samples.set(rhythmic, 15 * SAMPLE_RATE)
    samples.set(rhythmic, Math.round(52.5 * SAMPLE_RATE))
    expect(detectTempo(selectSections([samples]))).toBe(120)
  })

  it("rejects isolated attacks with no repeated period in the tempo range", () => {
    const samples = new Float32Array(10 * SAMPLE_RATE)
    const pulse = beats(1, 0.15, 0.025)
    samples.set(pulse, Math.round(0.2 * SAMPLE_RATE))
    expect(detectTempo([[samples]])).toBeNull()
    for (const seconds of [2.05, 3.9, 6.25, 8.31]) {
      samples.set(pulse, Math.round(seconds * SAMPLE_RATE))
    }
    expect(detectTempo([[samples]])).toBeNull()
  })

  it("takes bounded, owned sections across long audio", () => {
    const samples = new Float32Array(72 * SAMPLE_RATE)
    samples[0] = 0.1
    samples[Math.floor((samples.length - 9 * SAMPLE_RATE) / 2)] = 0.2
    samples[samples.length - 1] = 0.3
    const sections = selectSections([samples])
    expect(sections.map((section) => section[0]!.length)).toEqual(
      Array.from({ length: 5 }, () => 9 * SAMPLE_RATE)
    )
    expect(sections[0]![0]![0]).toBeCloseTo(0.1)
    expect(sections[2]![0]![0]).toBeCloseTo(0.2)
    expect(sections[4]![0]!.at(-1)).toBeCloseTo(0.3)
    expect(sections[0]![0]!.buffer).not.toBe(samples.buffer)
  })
})
