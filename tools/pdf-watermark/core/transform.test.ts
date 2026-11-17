import { expect, test } from "vitest"
import {
  beginTransform,
  customPosition,
  normalizeAngle,
  transformOptions,
} from "./transform"
import { watermarkLayout } from "./layout"
import { DEFAULT_OPTIONS } from "../types"

const page = { width: 600, height: 800, x: 20, y: 30, rotation: 0 }
const options = { ...DEFAULT_OPTIONS, size: 40, rotation: 0 }
const tolerance = { x: 6, y: 6 }

test("preserves the current anchor when converting to a custom center", () => {
  expect(customPosition(page, 4, options)).toMatchObject({
    position: "custom",
    x: 50,
    y: 50,
  })
  const placed = customPosition({ ...page, rotation: 90 }, 4, {
    ...options,
    position: 0,
  })
  const before = watermarkLayout({ ...page, rotation: 90 }, 4, {
    ...options,
    position: 0,
  }).centers[0]!
  expect(placed.x).toBeCloseTo((before.x / 800) * 100, 1)
  expect(placed.y).toBeCloseTo((1 - before.y / 600) * 100, 1)
})

test("moves in visible page coordinates, snaps to center guides, and keeps the center on the page", () => {
  const start = beginTransform("move", { x: 300, y: 400 }, page, 4, options)
  expect(
    transformOptions(start, { x: 420, y: 520 }, false, tolerance)
  ).toMatchObject({
    options: { x: 70, y: 65, position: "custom" },
    guideX: false,
    guideY: false,
  })
  expect(
    transformOptions(start, { x: 303, y: 398 }, false, tolerance)
  ).toMatchObject({ options: { x: 50, y: 50 }, guideX: true, guideY: true })
  expect(
    transformOptions(start, { x: -10000, y: 10000 }, false, tolerance).options
  ).toMatchObject({ x: 0, y: 100 })
  const custom = watermarkLayout(page, 4, {
    ...options,
    position: "custom",
    x: 20,
    y: 75,
  })
  expect(custom.centers).toEqual([{ x: 120, y: 200 }])
})

test("rotates about the watermark center with optional 15 degree snapping and angle wrapping", () => {
  const start = beginTransform("rotate", { x: 300, y: 300 }, page, 4, options)
  expect(
    transformOptions(start, { x: 400, y: 400 }, false, tolerance).options
      .rotation
  ).toBe(90)
  const pointer = {
    x: 300 + Math.cos((-78 * Math.PI) / 180) * 100,
    y: 400 + Math.sin((-78 * Math.PI) / 180) * 100,
  }
  expect(
    transformOptions(start, pointer, false, tolerance).options.rotation
  ).toBe(12)
  expect(
    transformOptions(start, pointer, true, tolerance).options.rotation
  ).toBe(15)
  expect(normalizeAngle(350)).toBe(-10)
  expect(normalizeAngle(-350)).toBe(10)
})

test("resizes proportionally about the opposite corner without jumping when grabbed off-center", () => {
  const start = beginTransform("resize", { x: 422, y: 432 }, page, 4, options, {
    x: 1,
    y: 1,
  })
  expect(
    transformOptions(start, start.pointer, false, tolerance).options.size
  ).toBe(40)
  const next = transformOptions(
    start,
    { x: 482, y: 447 },
    false,
    tolerance
  ).options
  expect(next.size).toBe(50)
  expect(next).toMatchObject({ x: 55, y: 50.9 })
  expect(
    transformOptions(start, { x: -9999, y: -9999 }, false, tolerance).options
      .size
  ).toBe(1)
  expect(
    transformOptions(start, { x: 9999, y: 9999 }, false, tolerance).options.size
  ).toBe(100)
  const rotated = beginTransform(
    "resize",
    { x: 400, y: 500 },
    page,
    4,
    { ...options, rotation: 45 },
    { x: -1, y: -1 }
  )
  const enlarged = transformOptions(
    rotated,
    { x: 400 + rotated.diagonal.x / 2, y: 500 + rotated.diagonal.y / 2 },
    false,
    tolerance
  )
  expect(enlarged.options.size).toBe(60)
})

test("resizes the visible mark when page fitting has already limited its dimensions", () => {
  const tall = { ...options, size: 80 }
  const start = beginTransform("resize", { x: 400, y: 700 }, page, 0.1, tall)
  const limited = transformOptions(
    start,
    { x: 9000, y: 9000 },
    false,
    tolerance
  ).options
  expect(limited.x).toBe(50)
  expect(limited.y).toBe(50)
  const smaller = transformOptions(
    start,
    {
      x: start.pointer.x - start.diagonal.x / 2,
      y: start.pointer.y - start.diagonal.y / 2,
    },
    false,
    tolerance
  ).options
  const layout = watermarkLayout(page, 0.1, smaller)
  expect(layout.markWidth).toBeLessThan(start.markWidth)
  expect(layout.centers[0]!.x - layout.markWidth / 2).toBeCloseTo(
    start.anchor.x,
    0
  )
  expect(
    page.height - layout.centers[0]!.y - layout.markHeight / 2
  ).toBeCloseTo(start.anchor.y, 0)
})
