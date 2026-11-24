import { describe, expect, it } from "vitest"

import {
  audioLevels,
  findCuts,
  removedFrames,
  SAMPLE_RATE,
  trimChannels,
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
  })

  it("shortens the center of a long pause and keeps a short pause", () => {
    const samples = tone([
      [0, 1],
      [3, 3.5],
      [4, 6],
    ])
    const { cuts } = findCuts(audioLevels([samples]), -42, 0.8)
    expect(cuts).toEqual([{ start: at(1.075), end: at(2.925) }])
    const [left, right] = trimChannels([samples, samples], cuts)
    expect(left).toEqual(right)
    expect(left!.length).toBe(at(4.15))
    expect(left![at(1.2)]).toBeCloseTo(0.2)
    expect(left![at(1.8)]).toBe(0)
    expect(left![at(2.4)]).toBeCloseTo(0.2)
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
    const [audio] = trimChannels(
      [new Float32Array(10).fill(1)],
      [{ start: 4, end: 6 }]
    )
    expect(audio!.length).toBe(8)
    expect(audio![3]).toBe(0)
    expect(audio![4]).toBe(0)
    expect(audio![2]).toBeCloseTo(1 / at(0.005))
  })
})
