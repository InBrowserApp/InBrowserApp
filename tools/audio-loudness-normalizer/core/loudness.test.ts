import { describe, expect, it } from "vitest"
import { SAMPLE_RATE, measure, normalize } from "./loudness"
import { truePeak } from "./peak"
import { encodeWav } from "./wav"

function sine(seconds: number, amplitude: number, frequency = 1000, phase = 0) {
  return Float32Array.from(
    { length: seconds * SAMPLE_RATE },
    (_, i) =>
      amplitude * Math.sin((2 * Math.PI * frequency * i) / SAMPLE_RATE + phase)
  )
}

describe("loudness normalization", () => {
  it("matches the 1 kHz reference loudness and adds 3 LU for stereo", () => {
    const tone = sine(1, 0.1)
    const mono = measure([tone])
    expect(mono.loudness).toBeCloseTo(-23.0, 1)
    expect(mono.peak).toBeCloseTo(-20, 1)
    expect(measure([tone, tone]).loudness - mono.loudness).toBeCloseTo(3.01, 2)
    const output = normalize(mono, -16)
    expect(output.loudness).toBeCloseTo(-16)
    expect(output.gain).toBeCloseTo(7, 1)
    expect(output.limited).toBe(false)
  })

  it("ignores silence and evaluates short audio", () => {
    const audio = new Float32Array(5 * SAMPLE_RATE)
    audio.set(sine(2, 0.1))
    audio.set(sine(1, 0.0001), 4 * SAMPLE_RATE)
    expect(measure([audio]).loudness).toBeCloseTo(-23.35, 1)
    expect(measure([new Float32Array(900)]).loudness).toBe(-Infinity)
    expect(measure([sine(0.2, 0.1)]).loudness).toBeCloseTo(-26, 1)
  })

  it("measures intersample peaks and reduces the gain for high transients", () => {
    const intersample = sine(0.1, 0.8, 12000, Math.PI / 4)
    expect(truePeak(intersample)).toBeGreaterThan(-3)
    const recording = sine(1, 0.01)
    recording[400] = -0.99
    const output = normalize(measure([recording]), -16)
    expect(output.loudness).toBeLessThan(-16)
    expect(output.peak).toBeCloseTo(-1)
    expect(output.limited).toBe(true)
  })
})

describe("WAV encoding", () => {
  it("writes a PCM header and interleaves the scaled channels", () => {
    const encoded = encodeWav(
      [Float32Array.of(0.25, -1), Float32Array.of(-0.25, 1)],
      SAMPLE_RATE,
      20 * Math.log10(2)
    )
    const header = new DataView(encoded)
    expect(header.getUint32(0)).toBe(0x52494646)
    expect(header.getUint32(4, true)).toBe(44)
    expect(header.getUint16(22, true)).toBe(2)
    expect(header.getUint32(24, true)).toBe(SAMPLE_RATE)
    expect(header.getUint32(40, true)).toBe(8)
    expect([44, 46, 48, 50].map((byte) => header.getInt16(byte, true))).toEqual(
      [16384, -16384, -32768, 32767]
    )
  })

  it("rejects data that exceeds the RIFF size field", () => {
    expect(() =>
      encodeWav([{ length: 0x80000000 } as Float32Array], SAMPLE_RATE, 0)
    ).toThrow(RangeError)
  })
})
