import { describe, expect, it, vi } from "vitest"

import { encodeToLimit } from "./target-size"

const dimensions = { width: 120, height: 80 }
const blob = (size: number) => new Blob([new Uint8Array(size)])

describe("encodeToLimit", () => {
  it("uses the highest quality in one try when it fits exactly", async () => {
    const encode = vi.fn(async (_size: typeof dimensions, _quality: number) =>
      blob(200)
    )
    const result = await encodeToLimit(dimensions, 200, false, encode)
    expect(result).toMatchObject(dimensions)
    expect(result.blob.size).toBe(200)
    expect(encode.mock.calls).toEqual([[dimensions, 100]])
  })

  it("finds a measured result at the highest fitting quality", async () => {
    const result = await encodeToLimit(
      dimensions,
      173,
      true,
      async (_, quality) => blob(100 + quality)
    )
    expect(result).toMatchObject(dimensions)
    expect(result.blob.size).toBe(173)
  })

  it("keeps pixel dimensions when the low-quality result still exceeds the limit", async () => {
    const result = await encodeToLimit(
      dimensions,
      99,
      false,
      async (_, quality) => blob(100 + quality)
    )
    expect(result).toMatchObject(dimensions)
    expect(result.blob.size).toBe(100)
  })

  it("reduces dimensions only when allowed, then searches for quality again", async () => {
    const encode = async (
      { width, height }: typeof dimensions,
      quality: number
    ) => blob(Math.ceil((width * height * (100 + quality)) / 100))
    const result = await encodeToLimit(dimensions, 3000, true, encode)
    expect(result.width).toBeLessThan(dimensions.width)
    expect(result.height).toBeLessThan(dimensions.height)
    expect(result.width / result.height).toBeCloseTo(1.5, 1)
    expect(result.blob.size).toBeLessThanOrEqual(3000)
    expect(result.blob.size).toBeGreaterThan(2900)
  })

  it("stops even when the format overhead alone exceeds the limit", async () => {
    const result = await encodeToLimit(
      { width: 1, height: 2 },
      1,
      true,
      async (_, quality) => blob(40 + quality)
    )
    expect(result).toMatchObject({ width: 1, height: 1 })
    expect(result.blob.size).toBe(40)
  })
  it("can retry at a smaller size when the browser cannot encode the original canvas", async () => {
    const encode = async ({ width }: typeof dimensions) =>
      width > 60 ? null : blob(100)
    await expect(
      encodeToLimit(dimensions, 100, true, encode)
    ).resolves.toMatchObject({
      width: 60,
      height: 40,
    })
    await expect(encodeToLimit(dimensions, 100, false, encode)).rejects.toThrow(
      "IMAGE_ENCODING_FAILED"
    )
  })

  it.each([0, 50])(
    "reports an encoder failure at quality %i",
    async (failureQuality) => {
      const encode = async (_: typeof dimensions, quality: number) =>
        quality === failureQuality ? null : blob(100 + quality)
      await expect(
        encodeToLimit(dimensions, 150, false, encode)
      ).rejects.toThrow("IMAGE_ENCODING_FAILED")
    }
  )
})
