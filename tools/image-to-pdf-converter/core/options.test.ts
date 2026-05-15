import { describe, expect, test } from "vitest"

import { clampMarginMm, getJpegQuality, normalizeRotation } from "./options"

describe("image-to-pdf converter options", () => {
  test("clamps margins into the supported range", () => {
    expect(clampMarginMm(-1)).toBe(0)
    expect(clampMarginMm(12.4)).toBe(12)
    expect(clampMarginMm(12.6)).toBe(13)
    expect(clampMarginMm(41)).toBe(40)
    expect(clampMarginMm(Number.NaN)).toBe(12)
  })

  test("maps quality presets to JPEG quality values", () => {
    expect(getJpegQuality("best")).toBe(0.92)
    expect(getJpegQuality("balanced")).toBe(0.82)
    expect(getJpegQuality("small")).toBe(0.68)
  })

  test("normalizes arbitrary rotations to supported right angles", () => {
    expect(normalizeRotation(0)).toBe(0)
    expect(normalizeRotation(90)).toBe(90)
    expect(normalizeRotation(180)).toBe(180)
    expect(normalizeRotation(270)).toBe(270)
    expect(normalizeRotation(450)).toBe(90)
    expect(normalizeRotation(-90)).toBe(270)
    expect(normalizeRotation(17)).toBe(0)
  })
})
