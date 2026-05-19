import { describe, expect, test } from "vitest"

import { clampMarginPercent, computeSquareDrawLayout } from "./layout"

describe("clampMarginPercent", () => {
  test("returns 0 for non-finite input", () => {
    expect(clampMarginPercent(Number.NaN)).toBe(0)
    expect(clampMarginPercent(Number.POSITIVE_INFINITY)).toBe(0)
  })

  test("clamps negative input to 0", () => {
    expect(clampMarginPercent(-5)).toBe(0)
  })

  test("clamps input above 99 to 99", () => {
    expect(clampMarginPercent(150)).toBe(99)
  })

  test("passes through valid percentages", () => {
    expect(clampMarginPercent(0)).toBe(0)
    expect(clampMarginPercent(50)).toBe(50)
    expect(clampMarginPercent(99)).toBe(99)
  })
})

describe("computeSquareDrawLayout", () => {
  test("centers a square source within the target with no margin", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 100,
      sourceHeight: 100,
      targetSize: 200,
      marginPercent: 0,
    })

    expect(layout).toEqual({ x: 0, y: 0, width: 200, height: 200 })
  })

  test("centers a square source within the target with 50% margin", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 100,
      sourceHeight: 100,
      targetSize: 200,
      marginPercent: 50,
    })

    expect(layout.width).toBe(100)
    expect(layout.height).toBe(100)
    expect(layout.x).toBe(50)
    expect(layout.y).toBe(50)
  })

  test("preserves aspect ratio for wide sources", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 200,
      sourceHeight: 100,
      targetSize: 100,
      marginPercent: 0,
    })

    expect(layout.width).toBe(100)
    expect(layout.height).toBe(50)
    expect(layout.x).toBe(0)
    expect(layout.y).toBe(25)
  })

  test("preserves aspect ratio for tall sources", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 100,
      sourceHeight: 200,
      targetSize: 100,
      marginPercent: 0,
    })

    expect(layout.width).toBe(50)
    expect(layout.height).toBe(100)
    expect(layout.x).toBe(25)
    expect(layout.y).toBe(0)
  })

  test("treats zero or negative dimensions as 1px", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 0,
      sourceHeight: 0,
      targetSize: 0,
      marginPercent: 0,
    })

    expect(layout.width).toBeGreaterThanOrEqual(1)
    expect(layout.height).toBeGreaterThanOrEqual(1)
  })

  test("clamps margins above 99% rather than going negative", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 100,
      sourceHeight: 100,
      targetSize: 100,
      marginPercent: 200,
    })

    expect(layout.width).toBeGreaterThanOrEqual(1)
    expect(layout.height).toBeGreaterThanOrEqual(1)
    expect(layout.x).toBeGreaterThanOrEqual(0)
    expect(layout.y).toBeGreaterThanOrEqual(0)
  })

  test("never rounds to zero width/height for very small sources", () => {
    const layout = computeSquareDrawLayout({
      sourceWidth: 1,
      sourceHeight: 1,
      targetSize: 16,
      marginPercent: 0,
    })

    expect(layout.width).toBe(16)
    expect(layout.height).toBe(16)
  })
})
