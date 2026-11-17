import { describe, expect, it } from "vitest"
import {
  center,
  contains,
  createRegion,
  localPoint,
  resizeRegion,
  rotate,
  rotationAt,
  normalizeRotation,
} from "./geometry"
import type { Style } from "../types"

const style: Style = {
  effect: "solid",
  color: "#000000",
  strength: 24,
  brushSize: 20,
}
const rectangle = createRegion(
  "r",
  "rectangle",
  { x: 10, y: 20 },
  { x: 110, y: 80 },
  style
)

describe("image-space region geometry", () => {
  it("normalizes reverse drags and preserves image-space coordinates", () => {
    expect(
      createRegion("r", "rectangle", { x: 110, y: 80 }, { x: 10, y: 20 }, style)
    ).toEqual(rectangle)
    expect(center(rectangle)).toEqual({ x: 60, y: 50 })
    expect(
      createRegion("r", "ellipse", { x: 10, y: 10 }, { x: 10, y: 10 }, style)
    ).toMatchObject({ width: 1, height: 1 })
  })
  it("rotates and inversely maps points about the region center", () => {
    const region = { ...rectangle, rotation: 90 }
    const corner = rotate({ x: 10, y: 20 }, center(region), 90)
    expect(corner.x).toBeCloseTo(90)
    expect(corner.y).toBeCloseTo(0)
    const p = localPoint(region, corner)
    expect(p.x).toBeCloseTo(0)
    expect(p.y).toBeCloseTo(0)
    expect(contains(region, { x: 60, y: 0 })).toBe(true)
    expect(contains(region, { x: 10, y: 20 })).toBe(false)
  })
  it("hit-tests rectangle boundaries, ellipses, and the gaps outside them", () => {
    expect(contains(rectangle, { x: 110, y: 80 })).toBe(true)
    for (const p of [
      { x: 9, y: 50 },
      { x: 111, y: 50 },
      { x: 30, y: 19 },
      { x: 30, y: 81 },
    ]) {
      expect(contains(rectangle, p)).toBe(false)
    }
    const ellipse = { ...rectangle, shape: "ellipse" as const }
    expect(contains(ellipse, center(ellipse))).toBe(true)
    expect(contains(ellipse, { x: 10, y: 20 })).toBe(false)
  })
  it("includes brush radius, interpolated strokes, and single taps", () => {
    const brush = createRegion(
      "b",
      "brush",
      { x: 30, y: 40 },
      { x: 130, y: 40 },
      style
    )
    expect(brush).toMatchObject({
      x: 20,
      y: 30,
      width: 120,
      height: 20,
      points: [
        { x: 10, y: 10 },
        { x: 110, y: 10 },
      ],
    })
    expect(contains(brush, { x: 80, y: 49 })).toBe(true)
    expect(contains(brush, { x: 80, y: 51 })).toBe(false)
    expect(contains(brush, { x: 19, y: 40 })).toBe(false)
    const tap = createRegion(
      "t",
      "brush",
      { x: 50, y: 50 },
      { x: 50, y: 50 },
      style,
      [{ x: 50, y: 50 }]
    )
    expect(contains(tap, { x: 50, y: 50 })).toBe(true)
    expect(contains({ ...tap, points: [] }, { x: 50, y: 50 })).toBe(false)
  })
  it("resizes a rotated region while keeping its opposite corner fixed", () => {
    const region = { ...rectangle, rotation: 35 }
    const anchor = rotate(
      { x: region.x, y: region.y },
      center(region),
      region.rotation
    )
    const corner = rotate(
      { x: anchor.x + 200, y: anchor.y + 90 },
      anchor,
      region.rotation
    )
    const resized = resizeRegion(region, corner)
    expect(resized.width).toBeCloseTo(200)
    expect(resized.height).toBeCloseTo(90)
    const nextAnchor = rotate(
      { x: resized.x, y: resized.y },
      center(resized),
      resized.rotation
    )
    expect(nextAnchor.x).toBeCloseTo(anchor.x)
    expect(nextAnchor.y).toBeCloseTo(anchor.y)
    expect(resizeRegion(rectangle, { x: 0, y: 0 })).toMatchObject({
      width: 4,
      height: 4,
    })
  })
  it("scales brush geometry and supports snapped rotation", () => {
    const brush = createRegion(
      "b",
      "brush",
      { x: 20, y: 20 },
      { x: 40, y: 20 },
      style
    )
    const resized = resizeRegion(brush, {
      x: brush.x + brush.width * 2,
      y: brush.y + brush.height * 2,
    })
    expect(resized.brushSize).toBe(40)
    expect(resized.points[1]).toEqual({ x: 60, y: 20 })
    expect(rotationAt(rectangle, { x: 60, y: 0 }, false)).toBe(0)
    expect(rotationAt(rectangle, { x: 70, y: 0 }, true)).toBe(15)
    expect(rotationAt(rectangle, { x: 110, y: 50 }, false)).toBe(90)
    expect(normalizeRotation(270)).toBe(-90)
    expect(normalizeRotation(-181)).toBe(179)
    expect(normalizeRotation(180)).toBe(-180)
  })
  it("handles long brush strokes without spreading points onto the call stack", () => {
    const points = Array.from({ length: 150000 }, (_, i) => ({ x: i, y: 20 }))
    const brush = createRegion(
      "long",
      "brush",
      points[0]!,
      points.at(-1)!,
      style,
      points
    )
    expect(brush.width).toBe(150019)
    expect(brush.points).toHaveLength(150000)
  })
})
