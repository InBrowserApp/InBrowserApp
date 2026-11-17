import { afterEach, expect, test, vi } from "vitest"
import { DEFAULT_SETTINGS } from "../core/settings"
import { encodeNative } from "./native"
import type { NativeFormat } from "../types"

const state = vi.hoisted(() => ({
  samples: [] as {
    data: Float32Array
    timestamp: number
    numberOfChannels: number
    close: ReturnType<typeof vi.fn>
  }[],
  source: vi.fn(),
  add: vi.fn(async () => {}),
  close: vi.fn(),
  formats: [] as string[],
  start: vi.fn(async () => {}),
  finalize: vi.fn(async () => {}),
  cancel: vi.fn(async () => {}),
}))
vi.mock("mediabunny", () => ({
  BufferTarget: class {
    buffer = new ArrayBuffer(123)
  },
  Output: class {
    target: { buffer: ArrayBuffer }
    constructor({ target }: { target: { buffer: ArrayBuffer } }) {
      this.target = target
    }
    addAudioTrack = vi.fn()
    start = state.start
    finalize = state.finalize
    cancel = state.cancel
  },
  AudioSampleSource: class {
    constructor(config: unknown) {
      state.source(config)
    }
    add = state.add
    close = state.close
  },
  AudioSample: class {
    close = vi.fn()
    constructor(init: object) {
      Object.assign(this, init)
      state.samples.push(this as unknown as (typeof state.samples)[number])
    }
  },
  Quality: class {
    constructor(options: object) {
      Object.assign(this, options)
    }
  },
  Mp4OutputFormat: class {
    constructor() {
      state.formats.push("m4a")
    }
  },
  WebMOutputFormat: class {
    constructor() {
      state.formats.push("webm")
    }
  },
  Mp3OutputFormat: class {
    constructor() {
      state.formats.push("mp3")
    }
  },
  OggOutputFormat: class {
    constructor() {
      state.formats.push("ogg")
    }
  },
}))
afterEach(() => {
  state.samples.length = 0
  state.formats.length = 0
  vi.clearAllMocks()
})

test.each(["m4a", "webm", "mp3", "ogg"] as NativeFormat[])(
  "muxes %s with bounded planar samples and correct timestamps",
  async (format) => {
    const clips = [
      {
        channels: [
          new Float32Array(20000).fill(0.25),
          new Float32Array(20000).fill(-0.5),
        ],
      },
    ]
    const progress = vi.fn()
    expect(
      (
        await encodeNative(
          { clips, settings: { ...DEFAULT_SETTINGS, format } },
          progress
        )
      ).byteLength
    ).toBe(123)
    expect(state.formats).toEqual([format])
    expect(state.samples).toHaveLength(2)
    expect(state.samples[0]!.data[16384]).toBe(-0.5)
    expect(state.samples[1]!.timestamp).toBe(16384 / 48000)
    expect(state.samples[1]!.numberOfChannels).toBe(2)
    expect(
      state.samples.every((sample) => sample.close.mock.calls.length === 1)
    ).toBe(true)
    expect(state.source).toHaveBeenCalledWith(
      expect.objectContaining({
        quality: expect.objectContaining({
          bitrateMode: format === "mp3" ? "constant" : "variable",
        }),
      })
    )
    expect(state.close).toHaveBeenCalledOnce()
    expect(state.finalize).toHaveBeenCalledOnce()
    expect(state.cancel).not.toHaveBeenCalled()
    expect(progress).toHaveBeenLastCalledWith(99)
  }
)

test("closes samples and cancels the container when native encoding fails", async () => {
  state.add.mockRejectedValueOnce(Error("Native encoder failed"))
  await expect(
    encodeNative(
      {
        clips: [{ channels: [new Float32Array(20)] }],
        settings: { ...DEFAULT_SETTINGS, format: "m4a" },
      },
      vi.fn()
    )
  ).rejects.toThrow("Native encoder failed")
  expect(state.samples[0]!.close).toHaveBeenCalledOnce()
  expect(state.cancel).toHaveBeenCalledOnce()
  expect(state.finalize).not.toHaveBeenCalled()
})
