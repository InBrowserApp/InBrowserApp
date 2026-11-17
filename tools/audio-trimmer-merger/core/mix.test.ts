import { describe, expect, test } from "vitest"
import { audioLayout, mixBlocks, validJoin } from "./mix"
import { SAMPLE_RATE } from "./settings"
const mono = (values: number[]) => ({ channels: [new Float32Array(values)] })
const flatten = (...args: Parameters<typeof mixBlocks>) =>
  Array.from(mixBlocks(...args)).flatMap((block) => Array.from(block[0]!))

describe("audio transitions", () => {
  test("validates transition seconds only when used", () => {
    expect(validJoin({ mode: "none", seconds: NaN })).toBe(true)
    for (const seconds of [NaN, Infinity, -1, 5.1])
      expect(validJoin({ mode: "gap", seconds })).toBe(false)
    for (const seconds of [0, 0.5, 5])
      expect(validJoin({ mode: "crossfade", seconds })).toBe(true)
  })
  test("counts gaps and clamps each crossfade to both adjacent half-lengths", () => {
    expect(audioLayout([], { mode: "none", seconds: 0 })).toEqual({
      starts: [],
      overlaps: [],
      frames: 0,
    })
    expect(audioLayout([4, 4, 4], { mode: "crossfade", seconds: 1 })).toEqual({
      starts: [0, 2, 4],
      overlaps: [0, 2, 2],
      frames: 8,
    })
    expect(
      audioLayout([2, 3], { mode: "gap", seconds: 2 / SAMPLE_RATE })
    ).toEqual({ starts: [0, 4], overlaps: [0, 0], frames: 7 })
  })
  test("mixes overlapping samples linearly across block boundaries", () => {
    const clips = [mono([0.5, 0.5, 0.5, 0.5]), mono([-0.5, -0.5, -0.5, -0.5])]
    expect(flatten(clips, false, { mode: "crossfade", seconds: 1 }, 3)).toEqual(
      [0.5, 0.5, 0.5, 0, -0.5, -0.5]
    )
    expect(flatten(clips, true, { mode: "crossfade", seconds: 1 }, 2)).toEqual([
      0, 0.25, 0.5, 0, -0.25, 0,
    ])
  })
  test("preserves source PCM and inserts actual silent samples", () => {
    const clip = mono([1, 1])
    expect(
      flatten(
        [clip, mono([0.5])],
        false,
        { mode: "gap", seconds: 2 / SAMPLE_RATE },
        2
      )
    ).toEqual([1, 1, 0, 0, 0.5])
    expect(Array.from(clip.channels[0]!)).toEqual([1, 1])
    expect(
      flatten([mono([1]), mono([0.5])], true, { mode: "crossfade", seconds: 0 })
    ).toEqual([1, 0.5])
  })
})
