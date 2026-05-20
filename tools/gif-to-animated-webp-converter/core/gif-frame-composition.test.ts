import { describe, expect, test } from "vitest"

import { composeGifFrames, drawFramePatch } from "./gif-frame-composition"

import type { DecodedGifFrame, RgbaColor } from "./gif-frame-rendering"

const transparent: RgbaColor = { a: 0, b: 0, g: 0, r: 0 }
const blue: RgbaColor = { a: 255, b: 255, g: 0, r: 0 }

function patch(r: number, g: number, b: number, a = 255) {
  return new Uint8ClampedArray([r, g, b, a])
}

function frame(
  color: Uint8ClampedArray,
  overrides: Partial<DecodedGifFrame> = {}
): DecodedGifFrame {
  return {
    delay: 50,
    dims: { height: 1, left: 0, top: 0, width: 1 },
    patch: color,
    ...overrides,
  }
}

describe("drawFramePatch", () => {
  test("draws opaque pixels and skips transparent pixels", () => {
    const canvas = new Uint8ClampedArray(2 * 1 * 4)

    drawFramePatch(
      canvas,
      2,
      1,
      new Uint8ClampedArray([255, 0, 0, 255, 0, 255, 0, 0]),
      { height: 1, left: 0, top: 0, width: 2 }
    )

    expect(Array.from(canvas)).toEqual([255, 0, 0, 255, 0, 0, 0, 0])
  })

  test("clips patches that extend outside the canvas", () => {
    const canvas = new Uint8ClampedArray(1 * 1 * 4)

    drawFramePatch(canvas, 1, 1, patch(8, 9, 10), {
      height: 1,
      left: -1,
      top: 0,
      width: 1,
    })

    expect(Array.from(canvas)).toEqual([0, 0, 0, 0])
  })

  test("treats patches without alpha bytes as transparent", () => {
    const canvas = new Uint8ClampedArray([1, 2, 3, 255])

    drawFramePatch(canvas, 1, 1, new Uint8ClampedArray(), {
      height: 1,
      left: 0,
      top: 0,
      width: 1,
    })

    expect(Array.from(canvas)).toEqual([1, 2, 3, 255])
  })
})

describe("composeGifFrames", () => {
  test("composes frames with disposal to background", () => {
    const frames = composeGifFrames(
      [
        frame(patch(255, 0, 0), { disposalType: 2 }),
        frame(patch(0, 255, 0), {
          dims: { height: 1, left: 1, top: 0, width: 1 },
        }),
      ],
      2,
      1,
      1,
      transparent
    )

    expect(Array.from(frames.frames[0]!)).toEqual([255, 0, 0, 255, 0, 0, 0, 0])
    expect(Array.from(frames.frames[1]!)).toEqual([0, 0, 0, 0, 0, 255, 0, 255])
    expect(frames.delays).toEqual([50, 50])
  })

  test("composes frames with disposal restore previous", () => {
    const frames = composeGifFrames(
      [
        frame(patch(1, 2, 3)),
        frame(patch(9, 9, 9), { disposalType: 3 }),
        frame(patch(4, 5, 6), {
          dims: { height: 1, left: 1, top: 0, width: 1 },
        }),
      ],
      2,
      1,
      1,
      transparent
    )

    expect(Array.from(frames.frames[2]!)).toEqual([1, 2, 3, 255, 4, 5, 6, 255])
  })

  test("fills the initial canvas with the GIF background", () => {
    const frames = composeGifFrames(
      [
        frame(patch(7, 8, 9), {
          dims: { height: 1, left: 1, top: 0, width: 1 },
        }),
      ],
      2,
      1,
      1,
      blue
    )

    expect(Array.from(frames.frames[0]!)).toEqual([
      0, 0, 255, 255, 7, 8, 9, 255,
    ])
  })

  test("rejects invalid frames and dimensions", () => {
    expect(() => composeGifFrames([], 0, 1, 1, transparent)).toThrowError(
      "INVALID_GIF"
    )
    expect(() =>
      composeGifFrames(
        [
          {
            delay: 10,
            dims: null as never,
            patch: new Uint8ClampedArray(),
          },
        ],
        1,
        1,
        1,
        transparent
      )
    ).toThrowError("INVALID_FRAME")
  })
})
