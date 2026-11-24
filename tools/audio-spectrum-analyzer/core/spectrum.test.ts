import { describe, expect, it } from "vitest"
import {
  averageSpectrum,
  BIN_HZ,
  FFT_SIZE,
  fractionAtFrequency,
  frequencyAtFraction,
  MIN_DB,
  SAMPLE_RATE,
} from "./spectrum"

describe("average frequency spectrum", () => {
  it("finds a calibrated tone without canceling opposite stereo channels", () => {
    const tone = Float32Array.from(
      { length: 3 * FFT_SIZE },
      (_, i) => Math.sin((2 * Math.PI * 170 * i) / FFT_SIZE) / 4
    )
    const inverse = tone.map((value) => -value)
    const mono = averageSpectrum([tone])
    const stereo = averageSpectrum([tone, inverse])
    expect(mono.peak).toBe(170)
    expect(stereo.levels[170]).toBeCloseTo(20 * Math.log10(0.25), 3)
    expect(stereo.levels).toEqual(mono.levels)
    expect(stereo.levels[FFT_SIZE / 2]).toBe(MIN_DB)
  })

  it("handles short and silent audio at the chart floor", () => {
    const result = averageSpectrum([new Float32Array(10)])
    expect(result.peak).toBe(0)
    expect(result.levels.length).toBe(FFT_SIZE / 2 + 1)
    expect(result.levels.every((level) => level === MIN_DB)).toBe(true)
  })

  it("uses invertible linear and logarithmic axis positions", () => {
    expect(frequencyAtFraction(-1, false)).toBe(0)
    expect(frequencyAtFraction(2, false)).toBe(SAMPLE_RATE / 2)
    expect(frequencyAtFraction(0, true)).toBe(BIN_HZ)
    expect(frequencyAtFraction(1, true)).toBe(SAMPLE_RATE / 2)
    expect(fractionAtFrequency(0, true)).toBe(0)
    expect(
      frequencyAtFraction(fractionAtFrequency(880, true), true)
    ).toBeCloseTo(880)
    expect(
      frequencyAtFraction(fractionAtFrequency(880, false), false)
    ).toBeCloseTo(880)
  })
})
