import { describe, expect, test } from "vitest"
import { defaultOptions, POSITIONS } from "../types"
import { watermarkLayout } from "./layout"

const options = defaultOptions("Test")
describe("watermark layout", () => {
  test.each(POSITIONS)(
    "keeps the rotated mark inside the image at %s",
    (position) => {
      for (const rotation of [0, 45, -90, 180]) {
        const result = watermarkLayout(600, 400, 700, 200, {
          ...options,
          position,
          rotation,
        })
        const { x, y } = result.centers[0]!
        const w =
          (700 * Math.abs(Math.cos(result.radians)) +
            200 * Math.abs(Math.sin(result.radians))) *
          result.scale
        const h =
          (700 * Math.abs(Math.sin(result.radians)) +
            200 * Math.abs(Math.cos(result.radians))) *
          result.scale
        expect(x - w / 2).toBeGreaterThanOrEqual(16 - 1e-9)
        expect(x + w / 2).toBeLessThanOrEqual(584 + 1e-9)
        expect(y - h / 2).toBeGreaterThanOrEqual(16 - 1e-9)
        expect(y + h / 2).toBeLessThanOrEqual(384 + 1e-9)
      }
    }
  )
  test("positions and tile spacing scale with the source dimensions", () => {
    const a = watermarkLayout(600, 400, 100, 30, options)
    const b = watermarkLayout(1200, 800, 200, 60, options)
    expect(b.centers[0]!.x).toBe(a.centers[0]!.x * 2)
    expect(b.centers[0]!.y).toBe(a.centers[0]!.y * 2)
    const tiled = watermarkLayout(600, 400, 100, 30, {
      ...options,
      tiled: true,
    })
    expect(tiled.centers.length).toBeGreaterThan(10)
    expect(tiled.centers[1]!.x - tiled.centers[0]!.x).toBe(148)
    expect(Math.max(...tiled.centers.map(({ x }) => x))).toBeGreaterThan(500)
    expect(Math.max(...tiled.centers.map(({ y }) => y))).toBeGreaterThan(322)
  })
  test("bounds tile count for panoramic images", () => {
    expect(
      watermarkLayout(16384, 1, 0.1, 0.01, { ...options, tiled: true }).centers
        .length
    ).toBeLessThan(7000)
  })
})
