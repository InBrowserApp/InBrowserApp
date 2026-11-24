import { describe, expect, it } from "vitest"
import {
  averageSpectrum,
  BIN_HZ,
  FFT_SIZE,
  fractionAtFrequency,
  frequencyAtFraction,
  MIN_DB,
  SAMPLE_RATE,
  selectFrames,
} from "./spectrum"

const analyze = (channels: Float32Array[]) =>
  averageSpectrum(selectFrames(channels))

describe("average frequency spectrum", () => {
  it("finds a calibrated tone without canceling opposite stereo channels", () => {
    const tone = Float32Array.from(
      { length: 3 * FFT_SIZE },
      (_, i) => Math.sin((2 * Math.PI * 170 * i) / FFT_SIZE) / 4
    )
    const inverse = tone.map((value) => -value)
    const mono = analyze([tone])
    const stereo = analyze([tone, inverse])
    expect(mono.peak).toBe(170)
    expect(stereo.levels[170]).toBeCloseTo(20 * Math.log10(0.25), 3)
    expect(stereo.levels).toEqual(mono.levels)
    expect(stereo.levels[FFT_SIZE / 2]).toBe(MIN_DB)
  })

  it("handles short and silent audio at the chart floor", () => {
    const result = analyze([new Float32Array(10)])
    expect(result.peak).toBeNull()
    expect(result.levels.length).toBe(FFT_SIZE / 2 + 1)
    expect(result.levels.every((level) => level === MIN_DB)).toBe(true)
  })

  it("normalizes a short tone using the actual window length", () => {
    const tone = Float32Array.from(
      { length: 960 },
      (_, i) => Math.sin((2 * Math.PI * i) / 48) / 2
    )
    const result = analyze([tone])
    expect(result.peak! * BIN_HZ).toBeCloseTo(1000, -1)
    expect(result.levels[result.peak!]).toBeCloseTo(-6.02, 1)
    expect(analyze([Float32Array.of(0.5)]).peak).not.toBeNull()
  })

  it("identifies DC and Nyquist instead of the adjacent Hann leakage", () => {
    const dc = analyze([new Float32Array(FFT_SIZE).fill(0.5)])
    expect(dc.peak).toBe(0)
    expect(dc.levels[0]).toBeCloseTo(-6.02, 2)
    const alternating = Float32Array.from({ length: FFT_SIZE }, (_, i) =>
      i % 2 ? -0.5 : 0.5
    )
    const nyquist = analyze([alternating])
    expect(nyquist.peak).toBe(FFT_SIZE / 2)
    expect(nyquist.levels[FFT_SIZE / 2]).toBeCloseTo(-6.02, 2)
  })

  it("samples bounded windows from both ends of a long file", () => {
    const samples = new Float32Array(SAMPLE_RATE * 60)
    samples[0] = 0.25
    samples[samples.length - 1] = 0.5
    const frames = selectFrames([samples])
    expect(frames.frameLength).toBe(FFT_SIZE)
    expect(frames.channels[0]!.length).toBe(192 * FFT_SIZE)
    expect(frames.channels[0]![0]).toBe(0.25)
    expect(frames.channels[0]!.at(-1)).toBe(0.5)
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
