import { describe, expect, it } from "vitest"

import {
  DEFAULT_PALETTE_OPTIONS,
  QUALITY_PRESETS,
  getSampleStride,
} from "./options"

describe("palette options", () => {
  it("defines defaults and quality presets", () => {
    expect(DEFAULT_PALETTE_OPTIONS.colorCount).toBe(8)
    expect(QUALITY_PRESETS.fast.maxDimension).toBeLessThan(
      QUALITY_PRESETS.precise.maxDimension
    )
    expect(QUALITY_PRESETS.balanced.targetSamples).toBeGreaterThan(
      QUALITY_PRESETS.fast.targetSamples
    )
  })

  it("calculates a safe sample stride", () => {
    expect(getSampleStride(100, 100, 1000)).toBe(10)
    expect(getSampleStride(10, 10, 1000)).toBe(1)
    expect(getSampleStride(-10, 10, 0)).toBe(1)
  })
})
