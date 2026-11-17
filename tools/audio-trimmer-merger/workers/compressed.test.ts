import { beforeEach, expect, test, vi } from "vitest"
import { createEncoder } from "wasm-media-encoders"
import { encodeCompressed } from "./compressed"
import { DEFAULT_SETTINGS } from "../core/settings"
vi.mock("wasm-media-encoders", () => ({ createEncoder: vi.fn() }))
const shared = new Uint8Array([1, 2])
const encoder = {
  configure: vi.fn(),
  encode: vi.fn(() => {
    shared[0] = shared[0]! + 1
    return shared
  }),
  finalize: vi.fn(() => {
    shared[0] = 9
    return shared
  }),
}
beforeEach(() => {
  vi.clearAllMocks()
  shared.set([1, 2])
  vi.mocked(createEncoder).mockResolvedValue(encoder as never)
})
test("encodes MP3 in blocks and copies transient WASM output before reuse", async () => {
  const progress = vi.fn()
  const buffer = await encodeCompressed(
    {
      clips: [{ channels: [new Float32Array(20000)] }],
      settings: DEFAULT_SETTINGS,
    },
    progress
  )
  expect(encoder.configure).toHaveBeenCalledWith({
    channels: 1,
    sampleRate: 48000,
    bitrate: 192,
    outputSampleRate: 48000,
  })
  expect(Array.from(new Uint8Array(buffer))).toEqual([2, 2, 3, 2, 9, 2])
  expect(progress).toHaveBeenLastCalledWith(99)
})
test("configures Vorbis quality and retains stereo", async () => {
  await encodeCompressed(
    {
      clips: [{ channels: [new Float32Array(2), new Float32Array(2)] }],
      settings: { ...DEFAULT_SETTINGS, format: "ogg", quality: "high" },
    },
    vi.fn()
  )
  expect(createEncoder).toHaveBeenCalledWith("audio/ogg", expect.any(String))
  expect(encoder.configure).toHaveBeenCalledWith({
    channels: 2,
    sampleRate: 48000,
    vbrQuality: 8,
  })
})
