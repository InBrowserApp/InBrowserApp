import { describe, expect, test } from "vitest"

import {
  DEFAULT_PAGE_NUMBER_OPTIONS,
  MAX_FONT_SIZE,
  MAX_MARGIN_PT,
  MIN_FONT_SIZE,
  MIN_MARGIN_PT,
  PAGE_NUMBER_FONT_FAMILIES,
  PAGE_NUMBER_FORMATS,
  PAGE_NUMBER_POSITIONS,
  clampInteger,
  normalizePageNumberOptions,
} from "./options"

describe("page number options", () => {
  test("exposes option lists", () => {
    expect(PAGE_NUMBER_FORMATS).toContain("number-total")
    expect(PAGE_NUMBER_FONT_FAMILIES).toContain("sans-serif")
    expect(PAGE_NUMBER_POSITIONS).toContain("bottom-center")
  })

  test("clamps integer values", () => {
    expect(clampInteger(Number.NaN, 5, 1, 10)).toBe(5)
    expect(clampInteger(20.8, 5, 1, 10)).toBe(10)
    expect(clampInteger(-2, 5, 1, 10)).toBe(1)
    expect(clampInteger(6.9, 5, 1, 10)).toBe(6)
  })

  test("normalizes numeric options while preserving choices", () => {
    expect(
      normalizePageNumberOptions({
        ...DEFAULT_PAGE_NUMBER_OPTIONS,
        fontSize: 999,
        marginX: -10,
        marginY: 999,
        pages: [1, 2],
        startNumber: Number.NaN,
      })
    ).toEqual({
      ...DEFAULT_PAGE_NUMBER_OPTIONS,
      fontSize: MAX_FONT_SIZE,
      marginX: MIN_MARGIN_PT,
      marginY: MAX_MARGIN_PT,
      pages: [1, 2],
      startNumber: DEFAULT_PAGE_NUMBER_OPTIONS.startNumber,
    })

    expect(MIN_FONT_SIZE).toBe(6)
  })
})
