import { afterEach, describe, expect, it, vi } from "vitest"

import { splitStereoFile } from "./split"

const file = new File(["source"], "input.wav")

function setupDecoder(channels: Float32Array[]) {
  const decodeAudioData = vi.fn(async () => ({
    numberOfChannels: channels.length,
    sampleRate: 48000,
    getChannelData: (index: number) => channels[index]!,
  }))
  const createContext = vi.fn(function () {
    return { decodeAudioData }
  })
  vi.stubGlobal("OfflineAudioContext", createContext)
  return { createContext, decodeAudioData }
}

async function readWav(blob: Blob) {
  const buffer = await blob.arrayBuffer()
  const view = new DataView(buffer)
  const tag = (offset: number, length: number) =>
    String.fromCharCode(...new Uint8Array(buffer, offset, length))
  expect(blob.type).toBe("audio/wav")
  expect(tag(0, 4)).toBe("RIFF")
  expect(view.getUint32(4, true)).toBe(buffer.byteLength - 8)
  expect(tag(8, 8)).toBe("WAVEfmt ")
  expect(view.getUint32(16, true)).toBe(16)
  expect(view.getUint16(20, true)).toBe(1)
  expect(view.getUint16(22, true)).toBe(1)
  expect(view.getUint32(24, true)).toBe(48000)
  expect(view.getUint32(28, true)).toBe(96000)
  expect(view.getUint16(32, true)).toBe(2)
  expect(view.getUint16(34, true)).toBe(16)
  expect(tag(36, 4)).toBe("data")
  const dataBytes = view.getUint32(40, true)
  expect(buffer.byteLength).toBe(44 + dataBytes)
  return Array.from({ length: dataBytes / 2 }, (_, i) =>
    view.getInt16(44 + i * 2, true)
  )
}

afterEach(() => vi.unstubAllGlobals())

describe("splitStereoFile", () => {
  it("writes independent mono PCM channels with identical frame counts", async () => {
    const { createContext } = setupDecoder([
      Float32Array.of(-1.25, -0.5, 0.75, 32767 / 32768),
      Float32Array.of(0.25, 0, -0.25, 1.25),
    ])
    const result = await splitStereoFile(file, new AbortController().signal)
    expect(createContext).toHaveBeenCalledWith(2, 1, 48000)
    expect(result).toHaveProperty("left")
    if ("error" in result) throw new Error(result.error)
    await expect(readWav(result.left)).resolves.toEqual([
      -32768, -16384, 24576, 32767,
    ])
    await expect(readWav(result.right)).resolves.toEqual([
      8192, 0, -8192, 32767,
    ])
  })

  it.each([
    [1, "monoError"],
    [6, "multichannelError"],
  ])("identifies a %i-channel recording", async (count, error) => {
    setupDecoder(Array.from({ length: count }, () => Float32Array.of(0)))
    await expect(
      splitStereoFile(file, new AbortController().signal)
    ).resolves.toEqual({ error })
  })

  it("does not start decoding an abandoned request", async () => {
    const { createContext } = setupDecoder([])
    await expect(
      splitStereoFile(file, AbortSignal.abort())
    ).rejects.toMatchObject({ name: "AbortError" })
    expect(createContext).not.toHaveBeenCalled()
  })

  it("does not encode a recording abandoned while decoding", async () => {
    const controller = new AbortController()
    const { decodeAudioData } = setupDecoder([])
    decodeAudioData.mockImplementationOnce(async () => {
      controller.abort()
      return { numberOfChannels: 2, sampleRate: 48000, getChannelData: vi.fn() }
    })
    await expect(
      splitStereoFile(file, controller.signal)
    ).rejects.toMatchObject({ name: "AbortError" })
    expect(decodeAudioData).toHaveBeenCalledOnce()
  })
})
