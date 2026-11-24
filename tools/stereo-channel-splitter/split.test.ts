// @vitest-environment node
import { BlobSource, FLAC, Input, MP3 } from "mediabunny"
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest"
import type { ExportRequest, ExportResponse } from "./workers/export"
import { splitStereoFile } from "./split"
import { flacPcmFormat } from "./core/formats"

vi.mock("wasm-media-encoders/wasm/mp3?url", async () => {
  const { readFile } = await import("node:fs/promises")
  const { createRequire } = await import("node:module")
  return {
    default: await readFile(
      createRequire(import.meta.url).resolve("wasm-media-encoders/wasm/mp3")
    ),
  }
})

const signal = new AbortController().signal

afterEach(() => vi.unstubAllGlobals())

describe("splitStereoFile", () => {
  it.each([
    {
      bits: 16 as const,
      rate: 44_100,
      left: [-32768, -1, 1, 32767],
      right: [0, 0, 16385, -20000],
      float: false,
      flacAvailable: true,
    },
    {
      bits: 24 as const,
      rate: 96_000,
      left: [-8388608, -1, 1, 8388607],
      right: [2, -2, 4194305, -4194305],
      float: false,
      flacAvailable: true,
    },
    {
      bits: 32 as const,
      rate: 48_000,
      left: [-2147483647, -1, 1, 2147483646],
      right: [-1800000001, 1800000001, -2, 2],
      float: false,
      flacAvailable: false,
    },
    {
      bits: 32 as const,
      rate: 48_000,
      left: [-1.25, 0.25, -0.5, 1.5],
      right: [1.125, -1.125, -0.25, 0],
      float: true,
      flacAvailable: false,
    },
  ])(
    "preserves each $bits-bit channel at $rate Hz",
    async ({ bits, rate, left, right, float, flacAvailable }) => {
      const result = await splitStereoFile(
        pcmWav([left, right], rate, bits, float),
        signal
      )
      if ("error" in result) throw new Error(result.error)
      expect(result.flacAvailable).toBe(flacAvailable)
      await expect(parseMonoWav(result.files.left, float)).resolves.toEqual({
        rate,
        bits,
        samples: left,
      })
      await expect(parseMonoWav(result.files.right, float)).resolves.toEqual({
        rate,
        bits,
        samples: right,
      })
    }
  )

  it.each([
    [1, "monoError"],
    [6, "multichannelError"],
  ])("identifies a %i-channel recording", async (count, error) => {
    const channels = Array.from({ length: count }, () => [0, 1, 0])
    await expect(
      splitStereoFile(pcmWav(channels, 48_000, 16), signal)
    ).resolves.toEqual({ error })
  })

  it("uses browser decoding for an input with no recognized metadata", async () => {
    const channels = [Float32Array.of(0, 0.5), Float32Array.of(0.25, -0.25)]
    const context = vi.fn(function () {
      return {
        decodeAudioData: async () => ({
          numberOfChannels: 2,
          sampleRate: 48_000,
          getChannelData: (index: number) => channels[index]!,
        }),
      }
    })
    vi.stubGlobal("OfflineAudioContext", context)
    const result = await splitStereoFile(
      new File(["fallback"], "source.audio"),
      signal
    )
    if ("error" in result) throw new Error(result.error)
    expect(context).toHaveBeenCalledWith(2, 1, 48_000)
    await expect(parseMonoWav(result.files.left)).resolves.toEqual({
      rate: 48_000,
      bits: 24,
      samples: [0, 4194304],
    })
  })

  it("stops an abandoned request", async () => {
    await expect(
      splitStereoFile(pcmWav([[1], [1]], 44_100, 16), AbortSignal.abort())
    ).rejects.toMatchObject({ name: "AbortError" })
  })
})

function pcmWav(
  channels: number[][],
  rate: number,
  bits: 16 | 24 | 32,
  float = false
) {
  const bytes = bits / 8
  const frameBytes = bytes * channels.length
  const frames = channels[0]!.length
  const buffer = new ArrayBuffer(44 + frames * frameBytes)
  const view = new DataView(buffer)
  const text = new Uint8Array(buffer)
  text.set(new TextEncoder().encode("RIFF"))
  view.setUint32(4, buffer.byteLength - 8, true)
  text.set(new TextEncoder().encode("WAVEfmt "), 8)
  view.setUint32(16, 16, true)
  view.setUint16(20, float ? 3 : 1, true)
  view.setUint16(22, channels.length, true)
  view.setUint32(24, rate, true)
  view.setUint32(28, rate * frameBytes, true)
  view.setUint16(32, frameBytes, true)
  view.setUint16(34, bits, true)
  text.set(new TextEncoder().encode("data"), 36)
  view.setUint32(40, frames * frameBytes, true)
  for (let frame = 0; frame < frames; frame++) {
    for (let channel = 0; channel < channels.length; channel++) {
      const value = channels[channel]![frame]!
      const offset = 44 + frame * frameBytes + channel * bytes
      if (float) view.setFloat32(offset, value, true)
      else
        for (let byte = 0; byte < bytes; byte++)
          view.setUint8(offset + byte, value >> (8 * byte))
    }
  }
  return new File([buffer], "recording.wav", { type: "audio/wav" })
}

async function parseMonoWav(file: Blob, float = false) {
  const buffer = await file.arrayBuffer()
  const view = new DataView(buffer)
  const tag = (offset: number) =>
    String.fromCharCode(...new Uint8Array(buffer, offset, 4))
  expect(tag(0)).toBe("RIFF")
  expect(tag(8)).toBe("WAVE")
  let rate = 0
  let bits = 0
  let samples: number[] = []
  for (let offset = 12; offset + 8 <= buffer.byteLength;) {
    const name = tag(offset)
    const size = view.getUint32(offset + 4, true)
    const start = offset + 8
    if (name === "fmt ") {
      expect(view.getUint16(start + 2, true)).toBe(1)
      rate = view.getUint32(start + 4, true)
      bits = view.getUint16(start + 14, true)
    }
    if (name === "data") {
      const bytes = bits / 8
      samples = Array.from({ length: size / bytes }, (_, index) => {
        const pos = start + index * bytes
        if (float) return view.getFloat32(pos, true)
        if (bits === 16) return view.getInt16(pos, true)
        if (bits === 32) return view.getInt32(pos, true)
        return (view.getInt16(pos + 1, true) << 8) | view.getUint8(pos)
      })
    }
    offset = start + size + (size % 2)
  }
  return { rate, bits, samples }
}

describe("compressed audio worker", () => {
  const scope = {
    postMessage: vi.fn<(message: ExportResponse) => void>(),
    onmessage: undefined as
      | ((event: { data: ExportRequest }) => Promise<void>)
      | undefined,
  }

  beforeAll(async () => {
    vi.stubGlobal("self", scope)
    await import("./workers/export")
  })

  it.each([
    {
      format: "flac" as const,
      bits: 16 as const,
      sourceRate: 44_100,
      rate: 44_100,
    },
    {
      format: "flac" as const,
      bits: 24 as const,
      sourceRate: 96_000,
      rate: 96_000,
    },
    {
      format: "mp3" as const,
      bits: 24 as const,
      sourceRate: 96_000,
      rate: 48_000,
    },
    {
      format: "mp3" as const,
      bits: 16 as const,
      sourceRate: 11_025,
      rate: 11_025,
    },
  ])(
    "creates mono $format at $rate Hz",
    async ({ format, bits, sourceRate, rate }) => {
      vi.stubGlobal("self", scope)
      scope.postMessage.mockClear()
      const left = pcmWav(
        [Array.from({ length: 5000 }, (_, index) => index % 100)],
        sourceRate,
        bits
      )
      await scope.onmessage!({ data: { format, files: { left, right: left } } })
      expect(scope.postMessage).toHaveBeenCalledOnce()
      const response = scope.postMessage.mock.calls[0]![0]
      if ("error" in response) throw new Error("Worker rejected the input")
      for (const blob of [response.left, response.right]) {
        const input = new Input({
          formats: [format === "flac" ? FLAC : MP3],
          source: new BlobSource(blob),
        })
        try {
          const track = (await input.getPrimaryAudioTrack())!
          await expect(track.getCodec()).resolves.toBe(format)
          await expect(track.getNumberOfChannels()).resolves.toBe(1)
          await expect(track.getSampleRate()).resolves.toBe(rate)
          if (format === "flac") {
            const config = (await track.getDecoderConfig())!
            expect(config.description).toBeInstanceOf(Uint8Array)
            expect(flacPcmFormat(config.description as Uint8Array)).toBe(
              bits === 16 ? "pcm-s16" : "pcm-s24"
            )
          }
        } finally {
          input.dispose()
        }
      }
    }
  )

  it("reports malformed audio back to the caller", async () => {
    vi.stubGlobal("self", scope)
    scope.postMessage.mockClear()
    const left = new Blob(["bad WAV"])
    await scope.onmessage!({
      data: { format: "mp3", files: { left, right: left } },
    })
    expect(scope.postMessage).toHaveBeenCalledExactlyOnceWith({ error: true })
  })
})
