import { afterEach, expect, test, vi } from "vitest"
import { nativeConfig, nativeSupport, supportsNative } from "./native-support"

afterEach(() => vi.unstubAllGlobals())
const request = { channels: 2, quality: "standard" } as const

test("probes exact settings, raw AAC/Opus packets, and isolates unsupported codecs", async () => {
  const check = vi.fn(async (config: AudioEncoderConfig) => {
    if (config.codec === "vorbis") throw Error("Unsupported codec")
    return { supported: config.codec === "opus" }
  })
  vi.stubGlobal("AudioEncoder", { isConfigSupported: check })
  vi.stubGlobal("AudioData", class {})
  expect(await nativeSupport(request)).toEqual({
    m4a: false,
    webm: true,
    mp3: false,
    ogg: false,
  })
  expect(check).toHaveBeenCalledWith({
    codec: "mp4a.40.2",
    numberOfChannels: 2,
    sampleRate: 48000,
    bitrate: 128000,
    bitrateMode: "variable",
    aac: { format: "aac" },
  })
  expect(nativeConfig("mp3", { channels: 1, quality: "high" })).toMatchObject({
    numberOfChannels: 1,
    bitrate: 320000,
    bitrateMode: "constant",
  })
  expect(nativeConfig("webm", request)).toMatchObject({
    opus: { format: "opus" },
    bitrate: 128000,
  })
})

test("missing WebCodecs uses compatible formats without guessing from playback support", async () => {
  vi.stubGlobal("AudioEncoder", undefined)
  expect(await supportsNative("m4a", request)).toBe(false)
  vi.stubGlobal("AudioEncoder", { isConfigSupported: vi.fn() })
  vi.stubGlobal("AudioData", undefined)
  expect(await supportsNative("webm", request)).toBe(false)
})
