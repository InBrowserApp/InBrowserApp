import { expect, test } from "vitest"
import { limitTempo, readTempo, recordTap } from "./tempo"

test("estimates a rounded BPM from recent tap intervals", () => {
  let taps: number[] = []
  for (const time of [0, 500, 1_000, 1_500, 2_000, 2_600]) {
    const result = recordTap(taps, time)
    taps = result.taps
  }
  expect(taps).toEqual([500, 1_000, 1_500, 2_000, 2_600])
  expect(recordTap(taps, 3_100).bpm).toBe(114)
})

test("starts a fresh measure after a pause or until two distinct taps", () => {
  expect(recordTap([0, 500], 3_500)).toEqual({ taps: [3_500], bpm: null })
  expect(recordTap([3_500], 3_500).bpm).toBeNull()
  expect(recordTap([3_500], 4_250).bpm).toBe(80)
})

test("keeps the tempo within the available control range", () => {
  expect(limitTempo(0)).toBe(30)
  expect(limitTempo(400)).toBe(300)
  expect(limitTempo(123.8)).toBe(124)
})

test("accepts local and fullwidth digits in the tempo field", () => {
  expect(readTempo("١٢٠", "ar")).toBe(120)
  expect(readTempo("๑๒๐", "th")).toBe(120)
  expect(readTempo("１２０", "ja")).toBe(120)
  expect(readTempo("120", "th")).toBe(120)
  expect(readTempo("120 BPM", "en")).toBeNull()
})
