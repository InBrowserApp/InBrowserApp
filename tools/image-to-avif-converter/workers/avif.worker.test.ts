import { describe, expect, test, vi } from "vitest"

import { encode } from "@jsquash/avif"

import { DEFAULT_AVIF_OPTIONS } from "../core/avif-conversion"
import { encodeRequest, toArrayBuffer } from "./avif.worker"

vi.mock("@jsquash/avif", () => ({
  encode: vi.fn(async () => new Uint8Array([1, 2, 3])),
}))

const mockedEncode = vi.mocked(encode)

class MockImageData {
  readonly data: Uint8ClampedArray
  readonly height: number
  readonly width: number

  constructor(data: Uint8ClampedArray, width: number, height: number) {
    this.data = data
    this.height = height
    this.width = width
  }
}

vi.stubGlobal("ImageData", MockImageData as unknown as typeof ImageData)

describe("avif worker helpers", () => {
  test("returns ArrayBuffer values unchanged", () => {
    const buffer = new ArrayBuffer(2)

    expect(toArrayBuffer(buffer)).toBe(buffer)
  })

  test("copies typed array slices to ArrayBuffer", () => {
    const bytes = new Uint8Array([0, 1, 2, 3]).subarray(1, 3)
    const buffer = toArrayBuffer(bytes)

    expect(Array.from(new Uint8Array(buffer))).toEqual([1, 2])
  })

  test("encodes an AVIF request through jsquash", async () => {
    const result = await encodeRequest({
      height: 1,
      options: {
        bitDepth: 8,
        lossless: DEFAULT_AVIF_OPTIONS.lossless,
        quality: DEFAULT_AVIF_OPTIONS.quality,
        speed: DEFAULT_AVIF_OPTIONS.speed,
      },
      pixels: new Uint8ClampedArray([1, 2, 3, 4]).buffer,
      width: 1,
    })

    expect(mockedEncode).toHaveBeenCalledWith(
      expect.any(ImageData),
      expect.objectContaining({ quality: DEFAULT_AVIF_OPTIONS.quality })
    )
    expect(Array.from(new Uint8Array(result))).toEqual([1, 2, 3])
  })
})
