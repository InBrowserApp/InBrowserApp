import { describe, expect, test } from "vitest"

import {
  resolveGifDimensions,
  shouldUseLosslessGif2WebpEncoder,
  toArrayBuffer,
} from "./animated-webp-conversion"

describe("resolveGifDimensions", () => {
  test("uses GIF logical screen dimensions first", () => {
    expect(
      resolveGifDimensions({ lsd: { height: 20, width: 30 } }, [
        {
          delay: 10,
          dims: { height: 2, left: 0, top: 0, width: 3 },
          patch: new Uint8ClampedArray(),
        },
      ])
    ).toEqual({ height: 20, width: 30 })
  })

  test("falls back to the first frame or one pixel", () => {
    expect(
      resolveGifDimensions({}, [
        {
          delay: 10,
          dims: { height: 2, left: 0, top: 0, width: 3 },
          patch: new Uint8ClampedArray(),
        },
      ])
    ).toEqual({ height: 2, width: 3 })
    expect(resolveGifDimensions({}, [])).toEqual({ height: 1, width: 1 })
  })
})

describe("toArrayBuffer", () => {
  test("copies Uint8Array bytes into a standalone ArrayBuffer", () => {
    const source = new Uint8Array([1, 2, 3])
    const buffer = toArrayBuffer(source)
    const copy = new Uint8Array(buffer)

    source[0] = 9

    expect(copy).toEqual(new Uint8Array([1, 2, 3]))
  })
})

describe("shouldUseLosslessGif2WebpEncoder", () => {
  test("uses optimized lossless gif2webp for unchanged GIF playback", () => {
    expect(
      shouldUseLosslessGif2WebpEncoder({
        loopCount: 1,
        loopMode: "inherit",
        scale: 100,
        speed: 1,
      })
    ).toBe(true)
  })

  test("keeps the transform pipeline for edited output", () => {
    expect(
      shouldUseLosslessGif2WebpEncoder({
        loopCount: 1,
        loopMode: "inherit",
        scale: 50,
        speed: 1,
      })
    ).toBe(false)
    expect(
      shouldUseLosslessGif2WebpEncoder({
        loopCount: 1,
        loopMode: "infinite",
        scale: 100,
        speed: 1,
      })
    ).toBe(false)
    expect(
      shouldUseLosslessGif2WebpEncoder({
        loopCount: 1,
        loopMode: "inherit",
        scale: 100,
        speed: 2,
      })
    ).toBe(false)
  })
})
