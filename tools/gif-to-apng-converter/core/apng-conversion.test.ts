import { beforeEach, describe, expect, test, vi } from "vitest"

import {
  DEFAULT_APNG_OUTPUT_NAME,
  DEFAULT_GIF_TO_APNG_OPTIONS,
  calculateScaledDimensions,
  convertGifToApng,
  isSupportedGifFile,
  normalizeGifToApngOptions,
  resolveApngOutputName,
  resolveLoopCount,
  resolveUniqueApngOutputName,
} from "./apng-conversion"

const parseGIFMock = vi.hoisted(() => vi.fn())
const decompressFramesMock = vi.hoisted(() => vi.fn())
const encodeMock = vi.hoisted(() => vi.fn())

vi.mock("gifuct-js", () => ({
  decompressFrames: decompressFramesMock,
  parseGIF: parseGIFMock,
}))

vi.mock("upng-js", () => ({
  encode: encodeMock,
}))

function createGifBytes(loopCount?: number) {
  const bytes = [0x47, 0x49, 0x46, 0x38, 0x39, 0x61]

  if (typeof loopCount === "number") {
    const label = "NETSCAPE2.0"

    bytes.push(0x21, 0xff, 0x0b)

    for (const char of label) {
      bytes.push(char.charCodeAt(0))
    }

    bytes.push(0x03, 0x01, loopCount & 0xff, (loopCount >> 8) & 0xff, 0x00)
  }

  return new Uint8Array(bytes)
}

function createGifFile(bytes = createGifBytes()) {
  return new File([bytes], "demo.gif", { type: "image/gif" })
}

function createFrame(width = 2, height = 2) {
  return {
    delay: 25,
    dims: { height, left: 0, top: 0, width },
    patch: new Uint8ClampedArray(width * height * 4).fill(255),
  }
}

function createApngBuffer() {
  const buffer = new ArrayBuffer(28)
  const view = new DataView(buffer)
  const signature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]

  signature.forEach((value, index) => view.setUint8(index, value))
  view.setUint32(8, 8)
  view.setUint8(12, 0x61)
  view.setUint8(13, 0x63)
  view.setUint8(14, 0x54)
  view.setUint8(15, 0x4c)
  view.setUint32(16, 1)
  view.setUint32(20, 0)

  return buffer
}

beforeEach(() => {
  parseGIFMock.mockReset()
  decompressFramesMock.mockReset()
  encodeMock.mockReset()
  encodeMock.mockReturnValue(createApngBuffer())
})

describe("GIF to APNG options and filenames", () => {
  test("normalizes options with defaults, clamping, and invalid modes", () => {
    expect(normalizeGifToApngOptions()).toEqual(DEFAULT_GIF_TO_APNG_OPTIONS)
    expect(
      normalizeGifToApngOptions({
        loopCount: Number.NaN,
        loopMode: "custom",
        scale: 5,
        speed: Number.NaN,
      })
    ).toEqual({
      loopCount: 1,
      loopMode: "custom",
      scale: 10,
      speed: 1,
    })
    expect(normalizeGifToApngOptions({ loopCount: 2000 }).loopCount).toBe(999)
    expect(
      normalizeGifToApngOptions({
        loopMode: "bad" as "inherit",
        scale: 401,
        speed: 5,
      })
    ).toEqual({
      loopCount: 1,
      loopMode: "inherit",
      scale: 400,
      speed: 4,
    })
  })

  test("detects GIF files by MIME type or extension", () => {
    expect(
      isSupportedGifFile({ name: "animation.bin", type: "image/gif" })
    ).toBe(true)
    expect(isSupportedGifFile({ name: "animation.GIF", type: "" })).toBe(true)
    expect(isSupportedGifFile({ name: "image.png", type: "image/png" })).toBe(
      false
    )
  })

  test("resolves APNG output names", () => {
    expect(resolveApngOutputName("clip.gif")).toBe("clip.png")
    expect(resolveApngOutputName("clip")).toBe("clip.png")
    expect(resolveApngOutputName(" folder/clip.gif ")).toBe("folder_clip.png")
    expect(resolveApngOutputName("")).toBe(DEFAULT_APNG_OUTPUT_NAME)
  })

  test("deduplicates APNG output names", () => {
    const nameCounts = new Map<string, number>()

    expect(resolveUniqueApngOutputName("same.gif", nameCounts)).toBe("same.png")
    expect(resolveUniqueApngOutputName("same.GIF", nameCounts)).toBe(
      "same-2.png"
    )
  })

  test("calculates scaled dimensions", () => {
    expect(calculateScaledDimensions(320, 240, 50)).toEqual({
      height: 120,
      width: 160,
    })
    expect(calculateScaledDimensions(2, 2, 10)).toEqual({
      height: 1,
      width: 1,
    })
    expect(() => calculateScaledDimensions(0, 1, 100)).toThrowError(
      "INVALID_GIF"
    )
  })
})

describe("resolveLoopCount", () => {
  test("uses infinite, custom, inherited, and fallback loop counts", () => {
    expect(
      resolveLoopCount(createGifBytes(4), {
        loopMode: "infinite",
        scale: 100,
        speed: 1,
      })
    ).toBe(0)
    expect(
      resolveLoopCount(createGifBytes(4), {
        loopMode: "custom",
        scale: 100,
        speed: 1,
      })
    ).toBe(1)
    expect(
      resolveLoopCount(createGifBytes(4), {
        loopCount: 3,
        loopMode: "custom",
        scale: 100,
        speed: 1,
      })
    ).toBe(3)
    expect(
      resolveLoopCount(createGifBytes(4), {
        loopMode: "inherit",
        scale: 100,
        speed: 1,
      })
    ).toBe(4)
    expect(
      resolveLoopCount(createGifBytes(), {
        loopMode: "inherit",
        scale: 100,
        speed: 1,
      })
    ).toBe(1)
  })
})

describe("convertGifToApng", () => {
  test("converts GIF frames to APNG and applies loop count", async () => {
    parseGIFMock.mockReturnValue({ lsd: { height: 2, width: 2 } })
    decompressFramesMock.mockReturnValue([createFrame()])

    const result = await convertGifToApng(
      createGifFile(),
      {
        loopCount: 3,
        loopMode: "custom",
        scale: 100,
        speed: 1,
      },
      "demo.png"
    )

    expect(result.outputName).toBe("demo.png")
    expect(result.originalWidth).toBe(2)
    expect(result.frameCount).toBe(1)
    expect(result.loopCount).toBe(3)
    expect(result.blob.type).toBe("image/png")
    expect(encodeMock).toHaveBeenCalledWith(expect.any(Array), 2, 2, 0, [25])
  })

  test("uses first-frame dimensions when logical screen size is missing", async () => {
    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([createFrame(3, 2)])

    const result = await convertGifToApng(createGifFile(), {}, "demo.png")

    expect(result.originalWidth).toBe(3)
    expect(result.originalHeight).toBe(2)
  })

  test("rejects non-GIF and empty GIF inputs", async () => {
    await expect(
      convertGifToApng(new File(["png"], "demo.png", { type: "image/png" }), {})
    ).rejects.toThrowError("INVALID_GIF")

    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([])

    await expect(convertGifToApng(createGifFile(), {})).rejects.toThrowError(
      "EMPTY_GIF"
    )
  })

  test("rejects frames without dimensions before rendering", async () => {
    parseGIFMock.mockReturnValue({})
    decompressFramesMock.mockReturnValue([
      {
        delay: 10,
        patch: new Uint8ClampedArray(4),
      },
    ])

    await expect(convertGifToApng(createGifFile(), {})).rejects.toThrowError(
      "INVALID_FRAME"
    )
  })
})
