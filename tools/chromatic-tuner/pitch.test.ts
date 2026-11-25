import { expect, test } from "vitest"
import { detectPitch } from "./pitch"

const frameSize = 4096

function frame(sampleRate: number, makeSample: (time: number) => number) {
  return Float32Array.from({ length: frameSize }, (_, index) =>
    makeSample(index / sampleRate)
  )
}

function noiseSource() {
  let seed = 1
  return () => {
    seed = (Math.imul(seed, 1_664_525) + 1_013_904_223) >>> 0
    return seed / 0x1_0000_0000 - 0.5
  }
}

test.each([
  [40, 48_000],
  [50, 48_000],
  [82.4069, 44_100],
  [196, 48_000],
  [440, 96_000],
  [1_600, 48_000],
])("estimates %d Hz at a sample rate of %d Hz", (frequency, sampleRate) => {
  const samples = frame(
    sampleRate,
    (time) => Math.sin(2 * Math.PI * frequency * time + 0.7) * 0.35
  )
  const pitch = detectPitch(samples, sampleRate)
  expect(pitch).not.toBeNull()
  expect(Math.abs(1200 * Math.log2(pitch! / frequency))).toBeLessThan(3)
})

test("finds the fundamental when the second harmonic is louder", () => {
  const frequency = 329.6276
  const sampleRate = 48_000
  const samples = frame(sampleRate, (time) => {
    const phase = 2 * Math.PI * frequency * time
    return (
      0.2 * Math.sin(phase) +
      0.55 * Math.sin(2 * phase) +
      0.17 * Math.sin(3 * phase) +
      0.1 * Math.sin(4 * phase)
    )
  })
  const pitch = detectPitch(samples, sampleRate)
  expect(pitch).not.toBeNull()
  expect(Math.abs(1200 * Math.log2(pitch! / frequency))).toBeLessThan(3)
})

test.each([82.4069, 1318.5102])(
  "recognizes %d Hz when the second harmonic dominates",
  (frequency) => {
    const sampleRate = 48_000
    const samples = frame(sampleRate, (time) => {
      const phase = 2 * Math.PI * frequency * time
      return (
        0.1 * Math.sin(phase) +
        0.82 * Math.sin(2 * phase) +
        0.05 * Math.sin(3 * phase) +
        0.1 * Math.sin(4 * phase)
      )
    })
    const pitch = detectPitch(samples, sampleRate)
    expect(pitch).not.toBeNull()
    expect(Math.abs(1200 * Math.log2(pitch! / frequency))).toBeLessThan(3)
  }
)

test("keeps a higher fundamental with some noise across both periods", () => {
  const frequency = 1467.3
  const sampleRate = 48_000
  const noise = noiseSource()
  const samples = frame(
    sampleRate,
    (time) => 0.3 * Math.sin(2 * Math.PI * frequency * time) + 0.2 * noise()
  )
  const pitch = detectPitch(samples, sampleRate)
  expect(pitch).not.toBeNull()
  expect(Math.abs(1200 * Math.log2(pitch! / frequency))).toBeLessThan(6)
})

test("rejects silence, a constant offset, and unpitched noise", () => {
  const sampleRate = 48_000
  const noise = frame(sampleRate, noiseSource())
  expect(detectPitch(new Float32Array(frameSize), sampleRate)).toBeNull()
  expect(
    detectPitch(
      frame(sampleRate, () => 0.3),
      sampleRate
    )
  ).toBeNull()
  expect(detectPitch(noise, sampleRate)).toBeNull()
})

test("does not mistake an above-range tone for a lower octave", () => {
  const sampleRate = 48_000
  const samples = frame(sampleRate, (time) =>
    Math.sin(2 * Math.PI * 2_400 * time)
  )
  expect(detectPitch(samples, sampleRate)).toBeNull()
})
