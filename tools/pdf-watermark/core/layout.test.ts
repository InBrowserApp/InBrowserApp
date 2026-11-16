import { expect, test } from "vitest"
import { pageMatrix, visibleSize, watermarkLayout } from "./layout"
import { DEFAULT_OPTIONS } from "../types"

const page = { width: 600, height: 800, x: 20, y: 30, rotation: 0 }

test.each([
  [0, [1, 0, 0, 1, 20, 30], 600, 800],
  [90, [0, 1, -1, 0, 620, 30], 800, 600],
  [180, [-1, 0, 0, -1, 620, 830], 600, 800],
  [270, [0, -1, 1, 0, 20, 830], 800, 600],
])(
  "maps visible coordinates into a cropped page rotated %s degrees",
  (rotation, matrix, width, height) => {
    expect(pageMatrix({ ...page, rotation })).toEqual(matrix)
    expect(visibleSize({ ...page, rotation })).toEqual({ width, height })
  }
)

test("keeps each anchored rotated watermark inside the visible page", () => {
  for (const position of [0, 1, 2, 3, 4, 5, 6, 7, 8]) {
    for (const rotation of [-180, -90, -35, 0, 45, 90, 180]) {
      const layout = watermarkLayout(page, 0.2, {
        ...DEFAULT_OPTIONS,
        position,
        rotation,
        size: 100,
      })
      const { markWidth: w, markHeight: h, cos, sin } = layout
      const c = layout.centers[0]!
      const halfW = (Math.abs(cos) * w + Math.abs(sin) * h) / 2
      const halfH = (Math.abs(sin) * w + Math.abs(cos) * h) / 2
      expect(c.x - halfW).toBeGreaterThanOrEqual(23.9999)
      expect(c.y - halfH).toBeGreaterThanOrEqual(23.9999)
      expect(c.x + halfW).toBeLessThanOrEqual(576.0001)
      expect(c.y + halfH).toBeLessThanOrEqual(776.0001)
    }
  }
})

test("tiles about the page center with configurable spacing and bounded density", () => {
  const dense = watermarkLayout(page, 4, {
    ...DEFAULT_OPTIONS,
    layout: "tile",
    spacing: 0,
  })
  const sparse = watermarkLayout(page, 4, {
    ...DEFAULT_OPTIONS,
    layout: "tile",
    spacing: 200,
  })
  expect(dense.centers.length).toBeGreaterThan(sparse.centers.length)
  expect(dense.centers).toContainEqual({ x: 300, y: 400 })
  const extreme = watermarkLayout({ ...page, height: 100000 }, 100000, {
    ...DEFAULT_OPTIONS,
    layout: "tile",
    size: 10,
    spacing: 0,
    rotation: 0,
  })
  expect(extreme.centers.length).toBeLessThanOrEqual(961)
})
