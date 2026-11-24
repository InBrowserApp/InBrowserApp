import { describe, expect, it } from "vitest"
import { countPixels, createHistogram, visibleChannels } from "./histogram"

describe("image histogram", () => {
  it("counts each RGB value and rounds weighted brightness", () => {
    const histogram = createHistogram()
    countPixels(
      histogram,
      Uint8ClampedArray.of(
        255,
        0,
        0,
        255,
        0,
        255,
        0,
        255,
        0,
        0,
        255,
        255,
        255,
        255,
        255,
        255,
        0,
        0,
        0,
        255
      )
    )

    expect(histogram.pixels).toBe(5)
    expect(histogram.bins.red[0]).toBe(3)
    expect(histogram.bins.red[255]).toBe(2)
    expect(histogram.bins.green[255]).toBe(2)
    expect(histogram.bins.blue[255]).toBe(2)
    for (const level of [0, 18, 54, 182, 255]) {
      expect(histogram.bins.brightness[level]).toBe(1)
    }
  })

  it("accumulates across tiles and counts only nonzero alpha", () => {
    const histogram = createHistogram()
    countPixels(histogram, Uint8ClampedArray.of(1, 2, 3, 0, 32, 32, 32, 1))
    countPixels(histogram, Uint8ClampedArray.of(32, 32, 32, 255))

    expect(histogram.pixels).toBe(2)
    for (const bins of Object.values(histogram.bins)) {
      expect(bins).toHaveLength(256)
      expect(bins[32]).toBe(2)
      expect(bins.reduce((sum, count) => sum + count)).toBe(2)
    }
  })

  it("selects a single channel or the RGB overlay", () => {
    expect(visibleChannels("brightness")).toEqual(["brightness"])
    expect(visibleChannels("rgb")).toEqual(["red", "green", "blue"])
  })
})
