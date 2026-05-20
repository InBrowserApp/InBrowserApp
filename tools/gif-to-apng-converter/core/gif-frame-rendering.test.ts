import { describe, expect, test } from "vitest"

import {
  composeGifFrames,
  drawPatch,
  fillCanvas,
  isGifBytes,
  normalizeDelay,
  readGifBackgroundColor,
  readGifLoopCount,
  resolveGifBackgroundColor,
} from "./gif-frame-rendering"

import type { GifFrame, RgbaColor } from "./gif-frame-rendering"

function rgba(r: number, g: number, b: number, a = 255) {
  return new Uint8ClampedArray([r, g, b, a])
}

function frame(
  patch: Uint8ClampedArray,
  options: Partial<GifFrame> = {}
): GifFrame {
  return {
    delay: 50,
    dims: { height: 1, left: 0, top: 0, width: 1 },
    patch,
    ...options,
  }
}

function createLoopExtension(identifier = "NETSCAPE2.0", loopCount = 7) {
  const bytes = [0x21, 0xff, 0x0b]

  for (const char of identifier) {
    bytes.push(char.charCodeAt(0))
  }

  bytes.push(0x03, 0x01, loopCount & 0xff, (loopCount >> 8) & 0xff, 0x00)

  return new Uint8Array(bytes)
}

describe("GIF byte helpers", () => {
  test("detects GIF headers", () => {
    expect(isGifBytes(new Uint8Array([0x47, 0x49, 0x46]))).toBe(true)
    expect(isGifBytes(new Uint8Array([0x89, 0x50, 0x4e]))).toBe(false)
    expect(isGifBytes(new Uint8Array([0x47, 0x49]))).toBe(false)
  })

  test("reads GIF background color from the global color table", () => {
    const bytes = new Uint8Array([
      0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80, 0x01,
      0x00, 0xff, 0x00, 0x00, 0x11, 0x22, 0x33,
    ])

    expect(readGifBackgroundColor(bytes)).toEqual({
      a: 255,
      b: 0x33,
      g: 0x22,
      r: 0x11,
    })
  })

  test("returns null for missing or invalid background tables", () => {
    expect(readGifBackgroundColor(new Uint8Array([0x47]))).toBeNull()
    expect(
      readGifBackgroundColor(
        new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x00,
          0x00, 0x00,
        ])
      )
    ).toBeNull()
    expect(
      readGifBackgroundColor(
        new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80,
          0x03, 0x00, 0xff, 0x00, 0x00,
        ])
      )
    ).toBeNull()
    expect(
      readGifBackgroundColor(
        new Uint8Array([
          0x47, 0x49, 0x46, 0x38, 0x39, 0x61, 0x02, 0x00, 0x01, 0x00, 0x80,
          0x00, 0x00, 0xff,
        ])
      )
    ).toBeNull()
  })

  test("falls back to transparent background", () => {
    expect(resolveGifBackgroundColor(new Uint8Array())).toEqual({
      a: 0,
      b: 0,
      g: 0,
      r: 0,
    })
  })

  test("reads NETSCAPE and ANIMEXTS loop counts", () => {
    expect(readGifLoopCount(createLoopExtension("NETSCAPE2.0", 5))).toBe(5)
    expect(readGifLoopCount(createLoopExtension("ANIMEXTS1.0", 6))).toBe(6)
  })

  test("ignores malformed loop extensions", () => {
    const wrongIdentifier = createLoopExtension("APPLICATION", 5)
    const wrongControl = createLoopExtension("NETSCAPE2.0", 5)

    wrongControl[15] = 0x02

    expect(readGifLoopCount(wrongIdentifier)).toBeNull()
    expect(readGifLoopCount(wrongControl)).toBeNull()
    expect(readGifLoopCount(new Uint8Array([0x21, 0xff]))).toBeNull()
  })
})

describe("GIF frame composition", () => {
  const transparent = { a: 0, b: 0, g: 0, r: 0 } satisfies RgbaColor

  test("normalizes frame delay by speed and minimum delay", () => {
    expect(normalizeDelay(50, 2)).toBe(25)
    expect(normalizeDelay(1, 1)).toBe(10)
    expect(normalizeDelay(0, 1)).toBe(100)
  })

  test("fills a canvas with a background color", () => {
    const canvas = new Uint8ClampedArray(8)

    fillCanvas(canvas, { a: 255, b: 3, g: 2, r: 1 })

    expect([...canvas]).toEqual([1, 2, 3, 255, 1, 2, 3, 255])
  })

  test("draws alpha pixels and skips transparent pixels", () => {
    const canvas = new Uint8ClampedArray(8)
    const patch = new Uint8ClampedArray([9, 8, 7, 255, 1, 2, 3, 0])

    drawPatch(canvas, 2, patch, { height: 1, left: 0, top: 0, width: 2 })

    expect([...canvas]).toEqual([9, 8, 7, 255, 0, 0, 0, 0])
  })

  test("clips patches outside canvas bounds", () => {
    const canvas = new Uint8ClampedArray(4)

    drawPatch(canvas, 1, rgba(9, 8, 7), {
      height: 1,
      left: -1,
      top: 0,
      width: 1,
    })
    drawPatch(canvas, 1, rgba(9, 8, 7), {
      height: 1,
      left: 0,
      top: 2,
      width: 1,
    })

    expect([...canvas]).toEqual([0, 0, 0, 0])
  })

  test("rejects truncated patches", () => {
    expect(() =>
      drawPatch(new Uint8ClampedArray(4), 1, new Uint8ClampedArray(3), {
        height: 1,
        left: 0,
        top: 0,
        width: 1,
      })
    ).toThrowError("INVALID_FRAME")
  })

  test("composes disposal to background frames", () => {
    const result = composeGifFrames(
      [frame(rgba(255, 0, 0), { disposalType: 2 }), frame(rgba(0, 0, 255))],
      1,
      1,
      1,
      transparent
    )

    expect([...result.frameData[0]!]).toEqual([255, 0, 0, 255])
    expect([...result.frameData[1]!]).toEqual([0, 0, 255, 255])
    expect(result.delays).toEqual([50, 50])
  })

  test("composes disposal to previous frames", () => {
    const result = composeGifFrames(
      [
        frame(rgba(255, 0, 0)),
        frame(rgba(0, 255, 0), { disposalType: 3 }),
        frame(new Uint8ClampedArray([0, 0, 0, 0])),
      ],
      1,
      1,
      1,
      transparent
    )

    expect([...result.frameData[2]!]).toEqual([255, 0, 0, 255])
  })

  test("clips disposal rectangles outside canvas bounds", () => {
    const result = composeGifFrames(
      [
        frame(rgba(255, 0, 0), {
          dims: { height: 1, left: -1, top: 0, width: 1 },
          disposalType: 2,
        }),
        frame(rgba(0, 0, 255)),
        frame(rgba(255, 0, 0), {
          dims: { height: 1, left: 0, top: 2, width: 1 },
          disposalType: 2,
        }),
        frame(rgba(0, 255, 0)),
      ],
      1,
      1,
      1,
      transparent
    )

    expect([...result.frameData[1]!]).toEqual([0, 0, 255, 255])
    expect([...result.frameData[3]!]).toEqual([0, 255, 0, 255])
  })

  test("rejects frames without required data", () => {
    expect(() =>
      composeGifFrames(
        [
          {
            delay: 10,
            dims: undefined,
            patch: new Uint8ClampedArray(4),
          } as unknown as GifFrame,
        ],
        1,
        1,
        1,
        transparent
      )
    ).toThrowError("INVALID_FRAME")
  })
})
