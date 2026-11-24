import { describe, expect, it } from "vitest"
import { detectTempo, SAMPLE_RATE, selectSections } from "./tempo"

function beats(bpm: number, seconds = 10) {
  const samples = new Float32Array(seconds * SAMPLE_RATE)
  for (let beat = 0; beat < ((seconds - 0.3) * bpm) / 60; beat++) {
    const start = Math.round(SAMPLE_RATE * (0.3 + (beat * 60) / bpm))
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
    const tone = Float32Array.from(
      { length: 5 * SAMPLE_RATE },
      (_, i) => Math.sin((i * 2 * Math.PI * 440) / SAMPLE_RATE) / 2
    )
    expect(detectTempo([[tone]])).toBeNull()
    let random = 12345
    const noise = Float32Array.from({ length: SAMPLE_RATE * 8 }, () => {
      random = (Math.imul(random, 1664525) + 1013904223) >>> 0
      return random / 2 ** 32 - 0.5
    })
    expect(detectTempo([[noise]])).toBeNull()
  })

  it("takes bounded, owned sections across long audio", () => {
    const samples = new Float32Array(72 * SAMPLE_RATE)
    samples[0] = 0.1
    samples[Math.floor((samples.length - 15 * SAMPLE_RATE) / 2)] = 0.2
    samples[samples.length - 1] = 0.3
    const sections = selectSections([samples])
    expect(sections.map((section) => section[0]!.length)).toEqual(
      Array.from({ length: 3 }, () => 15 * SAMPLE_RATE)
    )
    expect(sections[0]![0]![0]).toBeCloseTo(0.1)
    expect(sections[1]![0]![0]).toBeCloseTo(0.2)
    expect(sections[2]![0]!.at(-1)).toBeCloseTo(0.3)
    expect(sections[0]![0]!.buffer).not.toBe(samples.buffer)
  })
})
