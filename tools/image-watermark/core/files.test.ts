import { describe, expect, test } from "vitest"
import { assertDimensions, outputName, validFiles } from "./files"

function file(size: number, type = "image/png") {
  return { size, type } as File
}
describe("input bounds", () => {
  test("accepts supported images at the limits", () => {
    expect(validFiles([file(20 * 1024 * 1024)])).toBe(true)
    expect(validFiles(Array.from({ length: 50 }, () => file(1)))).toBe(true)
    expect(
      validFiles(Array.from({ length: 5 }, () => file(20 * 1024 * 1024)))
    ).toBe(true)
  })
  test("rejects unsupported, oversize, too many and excessive aggregate files", () => {
    expect(validFiles([file(1, "image/svg+xml")])).toBe(false)
    expect(validFiles([file(20 * 1024 * 1024 + 1)])).toBe(false)
    expect(validFiles(Array.from({ length: 51 }, () => file(1)))).toBe(false)
    expect(
      validFiles(Array.from({ length: 6 }, () => file(20 * 1024 * 1024)))
    ).toBe(false)
  })
  test.each([
    [0, 1],
    [1, -1],
    [16385, 1],
    [1, 16385],
    [6000, 4001],
    [NaN, 1],
    [1, Infinity],
    [1.5, 1],
  ])("rejects invalid dimensions %s × %s", (w, h) => {
    expect(() => assertDimensions(w, h)).toThrow("IMAGE_DIMENSIONS")
  })
  test("accepts a 24 megapixel image", () => {
    expect(() => assertDimensions(6000, 4000)).not.toThrow()
  })
})
test("creates safe unique names, preserving Unicode and actual encoding extensions", () => {
  const used = new Set<string>()
  expect(outputName("旅行.png", "image/jpeg", used)).toBe(
    "旅行-watermarked.jpg"
  )
  expect(outputName("旅行.png", "image/jpeg", used)).toBe(
    "旅行-watermarked-2.jpg"
  )
  expect(outputName("旅行.jpg", "image/jpeg", used)).toBe(
    "旅行-watermarked-3.jpg"
  )
  expect(outputName("../photo\\name\u0000.webp", "image/webp", used)).toBe(
    ".._photo_name_-watermarked.webp"
  )
  expect(outputName(".png", "image/png", used)).toBe("image-watermarked.png")
  expect(outputName("IMAGE", "image/png", used)).toBe("IMAGE-watermarked-2.png")
})
