import { describe, expect, test } from "vitest"

import { encodeIco, readPngDimensions } from "./ico-encoder"

function makePngStub(width: number, height: number, payload = 0): Uint8Array {
  const bytes = new Uint8Array(40)
  bytes[0] = 0x89
  bytes[1] = 0x50
  bytes[2] = 0x4e
  bytes[3] = 0x47
  bytes[4] = 0x0d
  bytes[5] = 0x0a
  bytes[6] = 0x1a
  bytes[7] = 0x0a
  const view = new DataView(bytes.buffer)
  view.setUint32(16, width, false)
  view.setUint32(20, height, false)
  bytes[39] = payload
  return bytes
}

describe("readPngDimensions", () => {
  test("reads width and height from the IHDR chunk", () => {
    expect(readPngDimensions(makePngStub(32, 32))).toEqual({
      width: 32,
      height: 32,
    })
    expect(readPngDimensions(makePngStub(48, 16))).toEqual({
      width: 48,
      height: 16,
    })
  })

  test("throws when the buffer is too small", () => {
    expect(() => readPngDimensions(new Uint8Array(10))).toThrow(
      "ICO_PNG_TOO_SMALL"
    )
  })

  test("throws when the PNG signature is wrong", () => {
    const bytes = makePngStub(16, 16)
    bytes[0] = 0
    expect(() => readPngDimensions(bytes)).toThrow("ICO_PNG_INVALID_SIGNATURE")
  })

  test("throws when either dimension is zero", () => {
    expect(() => readPngDimensions(makePngStub(0, 32))).toThrow(
      "ICO_PNG_ZERO_DIMENSION"
    )
  })
})

describe("encodeIco", () => {
  test("rejects an empty image list", () => {
    expect(() => encodeIco([])).toThrow("ICO_NO_IMAGES")
  })

  test("writes the ICO file header and per-image directory entries", () => {
    const pngs = [
      { pngBytes: makePngStub(16, 16, 0xaa) },
      { pngBytes: makePngStub(32, 32, 0xbb) },
      { pngBytes: makePngStub(48, 48, 0xcc) },
    ] as const

    const ico = encodeIco(pngs)
    const view = new DataView(ico.buffer)

    expect(ico[0]).toBe(0)
    expect(ico[1]).toBe(0)
    expect(view.getUint16(2, true)).toBe(1)
    expect(view.getUint16(4, true)).toBe(3)

    const headerSize = 6 + 16 * 3
    expect(ico.byteLength).toBe(
      headerSize + pngs.reduce((sum, p) => sum + p.pngBytes.byteLength, 0)
    )

    const entry0 = 6
    expect(ico[entry0]).toBe(16)
    expect(ico[entry0 + 1]).toBe(16)
    expect(ico[entry0 + 2]).toBe(0)
    expect(view.getUint16(entry0 + 4, true)).toBe(1)
    expect(view.getUint16(entry0 + 6, true)).toBe(32)
    expect(view.getUint32(entry0 + 8, true)).toBe(40)
    expect(view.getUint32(entry0 + 12, true)).toBe(headerSize)

    const entry1 = entry0 + 16
    expect(ico[entry1]).toBe(32)
    expect(view.getUint32(entry1 + 12, true)).toBe(headerSize + 40)

    const entry2 = entry1 + 16
    expect(ico[entry2]).toBe(48)
    expect(view.getUint32(entry2 + 12, true)).toBe(headerSize + 40 + 40)

    expect(ico[headerSize + 39]).toBe(0xaa)
    expect(ico[headerSize + 40 + 39]).toBe(0xbb)
    expect(ico[headerSize + 80 + 39]).toBe(0xcc)
  })

  test("writes a width/height byte of 0 for 256-pixel and larger images", () => {
    const png = makePngStub(256, 256)
    const ico = encodeIco([{ pngBytes: png }])

    expect(ico[6]).toBe(0)
    expect(ico[7]).toBe(0)
  })
})
