import { describe, expect, it } from "vitest"
import {
  centeredCrop,
  INITIAL_TRANSFORM,
  outputName,
  pixelCrop,
  transformedDimensions,
  updatePixelCrop,
} from "./crop"

const size = { width: 800, height: 600 }

describe("crop geometry", () => {
  it("keeps native dimensions or swaps them for quarter turns", () => {
    expect(INITIAL_TRANSFORM).toEqual({
      rotation: 0,
      flipHorizontal: false,
      flipVertical: false,
    })
    for (const rotation of [0, 180, 360])
      expect(transformedDimensions(size, rotation)).toEqual(size)
    for (const rotation of [90, 270])
      expect(transformedDimensions(size, rotation)).toEqual({
        width: 600,
        height: 800,
      })
  })

  it("centers the largest inscribed selection for each orientation", () => {
    expect(centeredCrop(size)).toEqual({
      unit: "%",
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    })
    expect(pixelCrop(centeredCrop(size, 1), size)).toEqual({
      x: 100,
      y: 0,
      width: 600,
      height: 600,
    })
    expect(pixelCrop(centeredCrop(size, 2), size)).toEqual({
      x: 0,
      y: 100,
      width: 800,
      height: 400,
    })
    const portrait = { width: 600, height: 800 }
    expect(pixelCrop(centeredCrop(portrait, 3 / 4), portrait)).toEqual({
      x: 0,
      y: 0,
      ...portrait,
    })
  })

  it("rounds in original pixels and keeps degenerate/out-of-bounds crops inside the image", () => {
    expect(
      pixelCrop(
        { unit: "%", x: 10.1, y: 10.1, width: 10.1, height: 10.1 },
        size
      )
    ).toEqual({ x: 81, y: 61, width: 81, height: 61 })
    expect(
      pixelCrop({ unit: "%", x: 100, y: 100, width: 100, height: 100 }, size)
    ).toEqual({ x: 799, y: 599, width: 1, height: 1 })
    expect(
      pixelCrop({ unit: "%", x: -20, y: NaN, width: 0, height: Infinity }, size)
    ).toEqual({ x: 0, y: 0, width: 1, height: 1 })
  })

  it("edits exact dimensions and positions without crossing image edges", () => {
    let crop = centeredCrop(size, 1)
    crop = updatePixelCrop(crop, size, "width", 200)
    crop = updatePixelCrop(crop, size, "height", 300)
    crop = updatePixelCrop(crop, size, "x", 1000)
    crop = updatePixelCrop(crop, size, "y", 1000)
    expect(pixelCrop(crop, size)).toEqual({
      x: 600,
      y: 300,
      width: 200,
      height: 300,
    })
    expect(
      pixelCrop(updatePixelCrop(crop, size, "width", -1), size).width
    ).toBe(1)
  })

  it("maintains fixed ratios when editing either dimension, and refits the selection", () => {
    const crop = centeredCrop(size)
    expect(
      pixelCrop(updatePixelCrop(crop, size, "width", 400, 2), size)
    ).toEqual({ x: 0, y: 0, width: 400, height: 200 })
    expect(
      pixelCrop(updatePixelCrop(crop, size, "height", 100, 2), size)
    ).toEqual({ x: 0, y: 0, width: 200, height: 100 })
    expect(
      pixelCrop(updatePixelCrop(crop, size, "width", 800, 1), size)
    ).toEqual({ x: 0, y: 0, width: 600, height: 600 })
    expect(pixelCrop(updatePixelCrop(crop, size, "x", 50, 1), size).x).toBe(0)
    expect(
      pixelCrop(updatePixelCrop(crop, size, "height", NaN, 0.001), size)
    ).toEqual({ x: 0, y: 0, width: 1, height: 600 })
  })

  it.each([
    ["photo.jpeg", "image/png", "photo-cropped.png"],
    ["photo.png", "image/jpeg", "photo-cropped.jpg"],
    ["photo.part.png", "image/webp", "photo.part-cropped.webp"],
    ["photo", "image/png", "photo-cropped.png"],
    ["", "image/png", "image-cropped.png"],
  ])("uses the actual encoded type for %s", (name, mime, expected) => {
    expect(outputName(name, mime)).toBe(expected)
  })
})
