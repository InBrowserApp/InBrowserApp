import { describe, expect, it } from "vitest"
import { encodeWav } from "@workspace/pcm-audio"

import {
  audioLevels,
  findCuts,
  keptSpans,
  removedFrames,
  SAMPLE_RATE,
} from "./silence"

const at = (seconds: number) => Math.round(seconds * SAMPLE_RATE)
const tone = (segments: [number, number][]) => {
  const samples = new Float32Array(at(6))
  for (const [start, end] of segments) samples.fill(0.2, at(start), at(end))
  return samples
}

describe("automatic silence removal", () => {
  it("marks long leading and trailing gaps while retaining a short pause beside the sound", () => {
    const samples = tone([[1, 5]])
    const { cuts, allQuiet } = findCuts(audioLevels([samples]), -42, 0.8)
    expect(allQuiet).toBe(false)
    expect(cuts).toEqual([
      { start: 0, end: at(0.85) },
      { start: at(5.15), end: at(6) },
    ])
    expect(removedFrames(cuts)).toBe(at(1.7))
    expect(keptSpans(samples.length, cuts)).toEqual([
      { start: at(0.85), end: at(5.15) },
    ])
  })

  it("shortens the center of a long pause and keeps a short pause", () => {
    const samples = tone([
      [0, 1],
      [3, 3.5],
      [4, 6],
    ])
    const { cuts } = findCuts(audioLevels([samples]), -42, 0.8)
    expect(cuts).toEqual([{ start: at(1.075), end: at(2.925) }])
    const spans = keptSpans(samples.length, cuts)
    expect(spans).toEqual([
      { start: 0, end: at(1.075) },
      { start: at(2.925), end: samples.length },
    ])
    const wav = new DataView(
      encodeWav([samples, samples], SAMPLE_RATE, 0, {
        spans,
        fadeFrames: at(0.005),
      })
    )
    expect(wav.byteLength).toBe(44 + 4 * at(4.15))
    expect(wav.getInt16(44 + 4 * at(1.2), true)).toBeCloseTo(6554)
    expect(wav.getInt16(46 + 4 * at(1.2), true)).toBeCloseTo(6554)
    expect(wav.getInt16(44 + 4 * at(1.8), true)).toBe(0)
    expect(findCuts(audioLevels([samples]), -42, 2.1).cuts).toEqual([])
  })

  it("keeps passages audible in either channel and distinguishes entirely quiet audio", () => {
    const empty = tone([])
    const signal = tone([[0, 6]])
    expect(findCuts(audioLevels([empty, signal]), -42, 0.8)).toEqual({
      cuts: [],
      allQuiet: false,
    })
    expect(findCuts(audioLevels([empty]), -42, 0.8)).toEqual({
      cuts: [],
      allQuiet: true,
    })
    const partial = audioLevels([Float32Array.of(0.5, 0, 0)])
    expect(partial.length).toBe(3)
    expect(partial.levels[0]).toBeCloseTo(0.25 / 3)
  })

  it("smooths the joins without changing kept duration", () => {
    const samples = new Float32Array(10).fill(1)
    const wav = new DataView(
      encodeWav([samples], SAMPLE_RATE, 0, {
        spans: keptSpans(samples.length, [{ start: 4, end: 6 }]),
        fadeFrames: at(0.005),
      })
    )
    expect(wav.byteLength).toBe(44 + 16)
    expect(wav.getInt16(44 + 2 * 3, true)).toBe(0)
    expect(wav.getInt16(44 + 2 * 4, true)).toBe(0)
    expect(wav.getInt16(44 + 2 * 2, true)).toBe(Math.round(32768 / at(0.005)))
  })
})
