import { describe, expect, it } from "vitest"
import {
  flacPcmFormat,
  mp3SampleRate,
  pcmFormat,
  supportsFlac,
} from "./formats"

describe("export precision", () => {
  it.each([
    ["pcm-u8", "pcm-u8"],
    ["pcm-s16", "pcm-s16"],
    ["pcm-s24", "pcm-s24"],
    ["pcm-s32", "pcm-s32"],
    ["pcm-f32", "pcm-f32"],
    ["pcm-f64", "pcm-f32"],
    ["pcm-s24be", "pcm-s24"],
    ["mp3", undefined],
    [null, undefined],
  ])("uses an appropriate WAV encoding for %s", (codec, expected) => {
    expect(pcmFormat(codec)).toBe(expected)
  })

  it.each([
    [8, "pcm-u8"],
    [16, "pcm-s16"],
    [24, "pcm-s24"],
    [32, "pcm-s32"],
  ])("reads the %i-bit depth from FLAC STREAMINFO", (bits, expected) => {
    const bytes = new Uint8Array(42)
    bytes[20] = (bits - 1) >> 4
    bytes[21] = ((bits - 1) & 15) << 4
    expect(flacPcmFormat(bytes)).toBe(expected)
  })

  it("uses 24-bit PCM when FLAC decoder metadata is unavailable", () => {
    expect(flacPcmFormat(new Uint8Array())).toBe("pcm-s24")
  })

  it("offers FLAC only at a supported rate and without reducing precision", () => {
    expect(supportsFlac(96_000, "pcm-s24")).toBe(true)
    expect(supportsFlac(11_025, "pcm-s16")).toBe(false)
    expect(supportsFlac(44_100, "pcm-f32")).toBe(false)
    expect(supportsFlac(48_000, "pcm-s32")).toBe(false)
  })

  it("uses the nearest valid MP3 sample rate when the source rate cannot be used", () => {
    expect(mp3SampleRate(44_100)).toBe(44_100)
    expect(mp3SampleRate(96_000)).toBe(48_000)
    expect(mp3SampleRate(11_025)).toBe(11_025)
  })
})
