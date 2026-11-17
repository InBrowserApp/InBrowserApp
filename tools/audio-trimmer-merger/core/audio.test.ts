import { describe, expect, test } from "vitest"
import {
  encodeWav,
  formatDuration,
  frameRange,
  SAMPLE_RATE,
  validRange,
  waveform,
} from "./audio"

const mono = (samples: number[]) => ({ channels: [new Float32Array(samples)] })
const samples = (buffer: ArrayBuffer) =>
  Array.from({ length: (buffer.byteLength - 44) / 2 }, (_, i) =>
    new DataView(buffer).getInt16(44 + i * 2, true)
  )

describe("audio editing", () => {
  test("rounds trims to sample boundaries and clamps to source length", () => {
    expect(frameRange(-1, 5, 96000)).toEqual([0, 96000])
    expect(frameRange(0.5, 1.5, 96000)).toEqual([24000, 72000])
    expect(frameRange(3, 1, 96000)).toEqual([96000, 96000])
    expect(frameRange(0.00002, 0.00004, 3)).toEqual([1, 2])
  })
  test("rejects invalid, empty and sub-sample selections", () => {
    expect(validRange(0, 2, 2)).toBe(true)
    for (const range of [
      [NaN, 1, 2],
      [0, Infinity, 2],
      [-1, 1, 2],
      [0, 3, 2],
      [1, 1, 2],
      [2, 1, 2],
      [0, 0.000001, 2],
    ]) {
      expect(validRange(...(range as [number, number, number]))).toBe(false)
    }
  })
  test("renders peaks across channels including silence and short clips", () => {
    expect(
      waveform(
        [new Float32Array([0, -1, 0.2, 0]), new Float32Array([0, 0, 0, 0.5])],
        2
      )
    ).toEqual([1, 0.5])
    expect(waveform([new Float32Array([0])], 3)).toEqual([0, 0, 0])
    expect(waveform([new Float32Array()], 2)).toEqual([0, 0])
    expect(waveform([new Float32Array([0.5])])).toHaveLength(180)
  })
  test("formats duration with carry at second and minute boundaries", () => {
    expect(formatDuration(0)).toBe("0:00.000")
    expect(formatDuration(59.9996)).toBe("1:00.000")
    expect(formatDuration(3661.123)).toBe("61:01.123")
  })
  test("writes a valid PCM WAV header and concatenates clips in order", () => {
    const buffer = encodeWav([mono([-2, -0.5]), mono([0, 0.5, 2])], false)
    const view = new DataView(buffer)
    const text = (start: number, length: number) =>
      String.fromCharCode(...new Uint8Array(buffer, start, length))
    expect(text(0, 4)).toBe("RIFF")
    expect(text(8, 8)).toBe("WAVEfmt ")
    expect(text(36, 4)).toBe("data")
    expect(view.getUint32(4, true)).toBe(buffer.byteLength - 8)
    expect(view.getUint16(20, true)).toBe(1)
    expect(view.getUint16(22, true)).toBe(1)
    expect(view.getUint32(24, true)).toBe(SAMPLE_RATE)
    expect(view.getUint32(28, true)).toBe(96000)
    expect(view.getUint16(32, true)).toBe(2)
    expect(view.getUint16(34, true)).toBe(16)
    expect(view.getUint32(40, true)).toBe(10)
    expect(samples(buffer)).toEqual([-32768, -16384, 0, 16384, 32767])
  })
  test("duplicates mono into both channels when joined with stereo", () => {
    const buffer = encodeWav(
      [
        mono([1]),
        { channels: [new Float32Array([-1]), new Float32Array([0.5])] },
      ],
      false
    )
    expect(new DataView(buffer).getUint16(22, true)).toBe(2)
    expect(samples(buffer)).toEqual([32767, 32767, -32768, 16384])
  })
  test("smooths edges per clip without changing sample count", () => {
    const buffer = encodeWav([mono([1, 1, 1, 1]), mono([1])], true)
    expect(samples(buffer)).toEqual([0, 16384, 16384, 0, 32767])
    const long = samples(encodeWav([mono(Array(1000).fill(1))], true))
    expect(long[0]).toBe(0)
    expect(long[500]).toBe(32767)
    expect(long[999]).toBe(0)
  })
  test("rejects empty audio, multichannel output and RIFF overflow before allocating", () => {
    expect(() => encodeWav([], false)).toThrow(
      "Invalid WAV size or channel count"
    )
    expect(() => encodeWav([mono([])], false)).toThrow(
      "Invalid WAV size or channel count"
    )
    expect(() =>
      encodeWav([{ channels: Array(3).fill(new Float32Array(1)) }], false)
    ).toThrow("Invalid WAV size or channel count")
    expect(() =>
      encodeWav([{ channels: [{ length: 0xffffffff } as Float32Array] }], false)
    ).toThrow("Invalid WAV size or channel count")
  })
})
