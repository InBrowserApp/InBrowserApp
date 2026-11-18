import { decompressFrames, parseGIF } from "gifuct-js"
import { expect, test } from "vitest"

import { createGifEncoder } from "./animation"
import { animationSize, frameRect } from "./size"

const red = [240, 0, 0, 255]
const blue = [0, 0, 240, 255]
const transparent = [0, 0, 0, 0]

test.each([
  [0, [1, 0, 0]],
  [1, undefined],
  [3, [1, 2, 0]],
  [65536, [1, 255, 255]],
])(
  "encodes %i total plays and the requested frame timing",
  async (plays, extension) => {
    const encoder = createGifEncoder(2, 1, plays)
    encoder.addFrame(new Uint8ClampedArray([...red, ...red]), 120)
    encoder.addFrame(new Uint8ClampedArray([...transparent, ...blue]), 350)

    const blob = encoder.finish()
    expect(blob.type).toBe("image/gif")

    const parsed = parseGIF(await blob.arrayBuffer())
    expect(parsed.lsd).toMatchObject({ width: 2, height: 1 })
    const loop = parsed.frames.find((frame) => "application" in frame)
    expect(loop ? Array.from(loop.application.blocks) : undefined).toEqual(
      extension
    )
    const frames = decompressFrames(parsed, true)
    expect(
      frames.map(({ delay, disposalType, transparentIndex }) => ({
        delay,
        disposalType,
        transparentIndex,
      }))
    ).toEqual([
      { delay: 120, disposalType: 2, transparentIndex: 0 },
      { delay: 350, disposalType: 2, transparentIndex: 0 },
    ])
    expect([...frames[0]!.patch]).toEqual([...red, ...red])
    expect([...frames[1]!.patch]).toEqual([...transparent, ...blue])
  }
)

test("centers smaller frames without enlarging them and scales large inputs together", () => {
  const portrait = { width: 201, height: 401 }
  const landscape = { width: 600, height: 300 }
  const canvas = animationSize([portrait, landscape])
  expect(canvas).toEqual({ width: 600, height: 401, scale: 1 })
  expect(frameRect(portrait, canvas, canvas.scale)).toEqual({
    x: 199,
    y: 0,
    ...portrait,
  })
  expect(frameRect(landscape, canvas, canvas.scale)).toEqual({
    x: 0,
    y: 50,
    ...landscape,
  })

  const large = animationSize([{ width: 2560, height: 1440 }, landscape])
  expect(large).toEqual({ width: 1280, height: 720, scale: 0.5 })
  expect(frameRect(landscape, large, large.scale)).toEqual({
    x: 490,
    y: 285,
    width: 300,
    height: 150,
  })

  const narrow = animationSize([{ width: 1, height: 4000 }])
  expect(narrow).toEqual({ width: 1, height: 1280, scale: 0.32 })
  expect(frameRect({ width: 1, height: 1 }, narrow, narrow.scale)).toEqual({
    x: 0,
    y: 639,
    width: 1,
    height: 1,
  })
})
