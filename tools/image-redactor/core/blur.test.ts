import { describe, expect, it } from "vitest"
import { blurPixels } from "./blur"

function reference(
  input: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
) {
  const r = Math.max(1, Math.round(radius))
  const result = new Uint8ClampedArray(input.length)
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++) {
      const sum = [0, 0, 0, 0]
      for (let dy = -r; dy <= r; dy++)
        for (let dx = -r; dx <= r; dx++) {
          const i =
            (Math.max(0, Math.min(height - 1, y + dy)) * width +
              Math.max(0, Math.min(width - 1, x + dx))) *
            4
          const a = input[i + 3]! / 255
          for (let c = 0; c < 3; c++) sum[c]! += input[i + c]! * a
          sum[3]! += input[i + 3]!
        }
      const i = (y * width + x) * 4
      for (let c = 0; c < 3; c++)
        result[i + c] = sum[3]! > 0 ? (sum[c]! * 255) / sum[3]! : 0
      result[i + 3] = sum[3]! / (2 * r + 1) ** 2
    }
  return result
}

describe("portable alpha-aware blur", () => {
  it.each([
    [1, 1, 1],
    [5, 3, 1],
    [2, 4, 5],
    [3, 2, 0.1],
  ])(
    "matches a reference convolution (%i × %i, radius %i)",
    (width, height, radius) => {
      const input = new Uint8ClampedArray(width * height * 4)
      for (let i = 0; i < input.length; i++) input[i] = (i * 37 + 71) % 256
      const original = input.slice()
      const output = blurPixels(input, width, height, radius)
      const expected = reference(input, width, height, radius)
      output.forEach((value, i) =>
        expect(Math.abs(value - expected[i]!)).toBeLessThanOrEqual(1)
      )
      expect(input).toEqual(original)
    }
  )
  it("keeps transparent images transparent and opaque colors constant", () => {
    expect(blurPixels(new Uint8ClampedArray(16), 2, 2, 3)).toEqual(
      new Uint8ClampedArray(16)
    )
    const white = new Uint8ClampedArray(16).fill(255)
    expect(blurPixels(white, 2, 2, 4)).toEqual(white)
  })
  it("does not darken colors next to transparent pixels", () => {
    const output = blurPixels(
      new Uint8ClampedArray([255, 0, 0, 255, 0, 0, 0, 0]),
      2,
      1,
      1
    )
    expect(output).toEqual(
      new Uint8ClampedArray([255, 0, 0, 170, 255, 0, 0, 85])
    )
  })
})
