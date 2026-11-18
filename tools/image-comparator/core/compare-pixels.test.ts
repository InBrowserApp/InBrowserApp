import { describe, expect, it } from "vitest"
import { comparePixels } from "./compare-pixels"

const pixels = (...values: number[]) => new Uint8ClampedArray(values)

describe("comparePixels", () => {
  it("highlights only changed pixels and keeps matching pixels as grayscale context", () => {
    const before = pixels(0, 0, 0, 255, 25, 60, 80, 255, 255, 255, 255, 255)
    const after = pixels(0, 0, 0, 255, 25, 60, 81, 255, 255, 255, 255, 255)
    const output = new Uint8ClampedArray(before.length)

    expect(comparePixels(before, after, output, 0)).toBe(1)
    expect(Array.from(output)).toEqual([
      168, 168, 168, 255, 224, 0, 111, 255, 242, 242, 242, 255,
    ])
  })

  it("counts alpha changes but ignores RGB values hidden by full transparency", () => {
    const before = pixels(255, 0, 0, 0, 0, 0, 0, 127)
    const after = pixels(0, 255, 0, 0, 0, 0, 0, 128)
    const output = new Uint8ClampedArray(before.length)

    expect(comparePixels(before, after, output, 0)).toBe(1)
    expect(Array.from(output)).toEqual([242, 242, 242, 255, 224, 0, 111, 255])
  })

  it("applies tolerance to opacity and visible channel changes", () => {
    const before = pixels(80, 80, 80, 255, 0, 0, 0, 200, 0, 0, 0, 30)
    const after = pixels(99, 80, 80, 255, 0, 0, 0, 230, 200, 0, 0, 30)
    const output = new Uint8ClampedArray(before.length)

    expect(comparePixels(before, after, output, 10)).toBe(1)
    expect(comparePixels(before, after, output, 100)).toBe(0)
  })
})
