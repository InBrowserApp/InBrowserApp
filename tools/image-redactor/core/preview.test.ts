import { describe, expect, it } from "vitest"
import { previewDimensions } from "./preview"

describe("image redactor preview dimensions", () => {
  it("preserves small images without upscaling", () => {
    expect(previewDimensions(1200, 760)).toEqual({ width: 1200, height: 760 })
    expect(previewDimensions(1, 1)).toEqual({ width: 1, height: 1 })
  })

  it("bounds long screenshots in both orientations", () => {
    expect(previewDimensions(1000, 20000)).toEqual({ width: 102, height: 2048 })
    expect(previewDimensions(20000, 1000)).toEqual({ width: 2048, height: 102 })
    expect(previewDimensions(5000, 5000)).toEqual({ width: 2048, height: 2048 })
  })

  it("keeps very thin images drawable after rounding", () => {
    expect(previewDimensions(1, 20000)).toEqual({ width: 1, height: 2048 })
    expect(previewDimensions(20000, 1)).toEqual({ width: 2048, height: 1 })
  })
})
