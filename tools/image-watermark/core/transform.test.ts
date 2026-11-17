import { describe, expect, test } from "vitest"
import { defaultOptions, type Options } from "../types"
import {
  normalizeRotation,
  rotatePoint,
  watermarkPlan,
  type Point,
  type WatermarkGeometry,
} from "./geometry"
import {
  changeAroundCenter,
  CORNERS,
  cornerSigns,
  positionAt,
  transformOptions,
} from "./transform"

const options: Options = {
  ...defaultOptions("Test"),
  position: "custom",
  x: 50,
  y: 50,
}
const plan = (o = options, width = 1200, height = 800, aspect = 4) =>
  watermarkPlan(width, height, aspect, o).geometry
function expectInside(g: WatermarkGeometry) {
  const w =
    (g.width * Math.abs(Math.cos(g.radians)) +
      g.height * Math.abs(Math.sin(g.radians))) /
    2
  const h =
    (g.width * Math.abs(Math.sin(g.radians)) +
      g.height * Math.abs(Math.cos(g.radians))) /
    2
  expect(g.x - w).toBeGreaterThanOrEqual(g.margin - 1e-8)
  expect(g.y - h).toBeGreaterThanOrEqual(g.margin - 1e-8)
  expect(g.x + w).toBeLessThanOrEqual(g.imageWidth - g.margin + 1e-8)
  expect(g.y + h).toBeLessThanOrEqual(g.imageHeight - g.margin + 1e-8)
}
function oppositeCorner(g: WatermarkGeometry, signs: Point) {
  const offset = rotatePoint(
    { x: (-signs.x * g.width) / 2, y: (-signs.y * g.height) / 2 },
    g.radians
  )
  return { x: g.x + offset.x, y: g.y + offset.y }
}
describe("custom watermark geometry", () => {
  test("round trips a center into a relative position and scales across a batch", () => {
    const g = plan()
    const moved = positionAt(options, g, { x: g.x + 110, y: g.y - 90 })
    expect(moved.position).toBe("custom")
    expect(plan(moved).x).toBeCloseTo(g.x + 110)
    expect(plan(moved).y).toBeCloseTo(g.y - 90)
    expect(plan(moved, 2400, 1600).x).toBeCloseTo(plan(moved).x * 2)
    expect(plan(moved, 2400, 1600).y).toBeCloseTo(plan(moved).y * 2)
  })
  test("clamps custom coordinates and handles a mark filling either axis", () => {
    expectInside(plan({ ...options, x: -20, y: 150, rotation: 45 }))
    for (const [width, height, aspect] of [
      [400, 400, 1],
      [400, 600, 3],
      [600, 400, 0.1],
    ]) {
      const o = { ...options, size: 80, margin: 20 }
      const g = plan(o, width, height, aspect)
      const moved = positionAt(o, g, { x: -1000, y: 10000 })
      expect(Number.isFinite(moved.x) && Number.isFinite(moved.y)).toBe(true)
      expectInside(plan(moved, width, height, aspect))
    }
  })
  test("moving beyond all edges keeps rotated watermarks inside the margin", () => {
    for (const rotation of [-180, -90, -45, 0, 45, 90, 180]) {
      const o = { ...options, rotation }
      const g = plan(o)
      for (const delta of [
        { x: 10000, y: 10000 },
        { x: -10000, y: -10000 },
      ]) {
        expectInside(
          plan(transformOptions(o, g, "move", { x: 0, y: 0 }, delta))
        )
      }
    }
  })
  test("precise position changes retain the chosen preset's visual placement", () => {
    for (const [position, x, y] of [
      ["topLeft", 0, 0],
      ["center", 50, 50],
      ["bottomRight", 100, 100],
    ] as const) {
      const preset = plan({ ...options, position })
      const custom = plan({ ...options, x, y })
      expect(custom.x).toBeCloseTo(preset.x)
      expect(custom.y).toBeCloseTo(preset.y)
    }
  })
})
describe("direct transforms", () => {
  test.each(CORNERS)(
    "resizes from %s, preserving the opposite corner and aspect ratio",
    (corner) => {
      for (const rotation of [0, 45, -90, 180]) {
        const o = { ...options, rotation }
        const g = plan(o)
        const signs = cornerSigns(corner)
        const offset = rotatePoint(
          { x: signs.x * g.width * 0.2, y: signs.y * g.height * 0.2 },
          g.radians
        )
        const next = transformOptions(
          o,
          g,
          corner,
          { x: 20, y: 30 },
          { x: 20 + offset.x, y: 30 + offset.y }
        )
        const after = plan(next)
        expect(after.width / after.height).toBeCloseTo(g.width / g.height)
        expect(after.width).toBeCloseTo(g.width * 1.2)
        const anchor = oppositeCorner(g, signs)
        const afterAnchor = oppositeCorner(after, signs)
        expect(afterAnchor.x).toBeCloseTo(anchor.x)
        expect(afterAnchor.y).toBeCloseTo(anchor.y)
        expectInside(after)
      }
    }
  )
  test("bounds corner scaling without flipping or cropping", () => {
    for (const corner of CORNERS) {
      const g = plan()
      const signs = cornerSigns(corner)
      for (const factor of [-100, 100]) {
        const next = transformOptions(
          options,
          g,
          corner,
          { x: 0, y: 0 },
          { x: factor * signs.x * 1000, y: factor * signs.y * 1000 }
        )
        expect(next.size).toBeGreaterThanOrEqual(5)
        expect(next.size).toBeLessThanOrEqual(80)
        expectInside(plan(next))
      }
    }
  })
  test("rotates around the center and snaps to 15 degrees with Shift", () => {
    const g = plan()
    const point = rotatePoint({ x: 0, y: -200 }, (38 * Math.PI) / 180)
    const next = transformOptions(
      options,
      g,
      "rotate",
      { x: g.x, y: g.y - 200 },
      { x: g.x + point.x, y: g.y + point.y }
    )
    expect(next.rotation).toBeCloseTo(38)
    expect(plan(next).x).toBeCloseTo(g.x)
    expect(plan(next).y).toBeCloseTo(g.y)
    const snapped = transformOptions(
      options,
      g,
      "rotate",
      { x: g.x, y: g.y - 200 },
      { x: g.x + point.x, y: g.y + point.y },
      true
    )
    expect(snapped.rotation).toBe(45)
  })
  test("normalizes rotations crossing the angle boundary", () => {
    expect(normalizeRotation(181)).toBe(-179)
    expect(normalizeRotation(-181)).toBe(179)
    expect(normalizeRotation(720)).toBe(0)
    const o = { ...options, rotation: 179 }
    const g = plan(o)
    const next = changeAroundCenter(o, g, {
      rotation: normalizeRotation(o.rotation + 15),
      size: 45,
    })
    expect(next.rotation).toBe(-166)
    expect(plan(next).x).toBeCloseTo(g.x)
    expect(plan(next).y).toBeCloseTo(g.y)
  })
})
