import { deflateSync } from "node:zlib"
import { afterEach, expect, test, vi } from "vitest"

import { reencodeImage } from "./image-codec"
import { jpegForPdf } from "./jpeg"

const settings = { maxSide: 2, jpegQuality: 0.6 }

function jpegFixture(width: number, height: number) {
  return new Uint8Array([
    0xff,
    0xd8,
    0xff,
    0xe1,
    0,
    8,
    0x45,
    0x78,
    0x69,
    0x66,
    0,
    0,
    0xff,
    0xc0,
    0,
    8,
    8,
    0,
    height,
    0,
    width,
    3,
    0xff,
    0xda,
    0,
    2,
    0xff,
    0xd9,
  ])
}

test("strips APP1 so camera orientation cannot be applied during JPEG decode", async () => {
  const bytes = jpegFixture(4, 2)
  const blob = jpegForPdf(bytes, 4, 2, 3)
  expect(blob?.type).toBe("image/jpeg")
  expect(new Uint8Array(await blob!.arrayBuffer())).toEqual(
    new Uint8Array([...bytes.subarray(0, 2), ...bytes.subarray(12)])
  )
  expect(jpegForPdf(bytes, 4, 3, 3)).toBeUndefined()
  expect(jpegForPdf(bytes, 4, 2, 1)).toBeUndefined()
  expect(jpegForPdf(bytes.subarray(0, -1), 4, 2, 3)).toBeUndefined()
})

function mockCanvas(width: number, height: number) {
  const bitmap = { width, height, close: vi.fn() }
  const context = { drawImage: vi.fn() }
  const encode = vi.fn(async () => new Blob(["jpeg"], { type: "image/jpeg" }))
  class Canvas {
    constructor(
      public width: number,
      public height: number
    ) {}
    getContext() {
      return context
    }
    convertToBlob = encode
  }
  vi.stubGlobal("OffscreenCanvas", Canvas)
  const decode = vi.fn(async (_source: unknown) => bitmap)
  vi.stubGlobal("createImageBitmap", decode)
  return { bitmap, decode, drawImage: context.drawImage, encode }
}

afterEach(() => vi.unstubAllGlobals())

test("resizes an embedded JPEG proportionally and closes the bitmap", async () => {
  const { decode, drawImage, encode, bitmap } = mockCanvas(4, 2)
  const output = await reencodeImage(
    jpegFixture(4, 2),
    "jpeg",
    4,
    2,
    3,
    settings
  )
  expect(output).toMatchObject({ width: 2, height: 1 })
  expect(decode).toHaveBeenCalledWith(expect.any(Blob), {
    imageOrientation: "none",
    colorSpaceConversion: "none",
  })
  expect(drawImage).toHaveBeenCalledWith(bitmap, 0, 0, 2, 1)
  expect(encode).toHaveBeenCalledWith({ type: "image/jpeg", quality: 0.6 })
  expect(bitmap.close).toHaveBeenCalledOnce()
})

test.each([
  { channels: 1 as const, samples: [24], rgba: [24, 24, 24, 255] },
  { channels: 3 as const, samples: [12, 24, 36], rgba: [12, 24, 36, 255] },
])(
  "converts $channels-channel deflate samples to opaque pixels",
  async ({ channels, samples, rgba }) => {
    const { decode, drawImage, bitmap } = mockCanvas(1, 1)
    vi.stubGlobal(
      "ImageData",
      class {
        data = new Uint8ClampedArray(4)
      }
    )
    await reencodeImage(
      deflateSync(new Uint8Array(samples)),
      "deflate",
      1,
      1,
      channels,
      settings
    )
    expect(decode).toHaveBeenCalledWith({ data: new Uint8ClampedArray(rgba) })
    expect(drawImage).toHaveBeenCalledWith(bitmap, 0, 0, 1, 1)
  }
)

test("skips streams whose decoded samples disagree with the PDF dimensions", async () => {
  const { bitmap, decode } = mockCanvas(2, 1)
  expect(
    await reencodeImage(jpegFixture(1, 1), "jpeg", 1, 1, 3, settings)
  ).toBeUndefined()
  expect(bitmap.close).toHaveBeenCalledOnce()
  for (const bytes of [
    deflateSync(new Uint8Array()),
    deflateSync(new Uint8Array(2)),
    new Uint8Array(2),
  ]) {
    expect(
      await reencodeImage(bytes, "deflate", 1, 1, 1, settings)
    ).toBeUndefined()
  }
  expect(decode).toHaveBeenCalledOnce()
})
