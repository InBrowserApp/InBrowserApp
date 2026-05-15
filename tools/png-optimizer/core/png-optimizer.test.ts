import { describe, expect, it } from "vitest"

import {
  DEFAULT_PNG_OPTIMIZER_OPTIONS,
  DEFAULT_PNG_OUTPUT_NAME,
  INVALID_PNG_FILE_ERROR,
  calculatePngSavings,
  createPngOptimizationResult,
  isSupportedPngFile,
  normalizePngOptimizerOptions,
  resolvePngOutputName,
  assertSupportedPngFile,
} from "./png-optimizer"

describe("png optimizer core", () => {
  it("normalizes partial option input", () => {
    expect(normalizePngOptimizerOptions()).toEqual(
      DEFAULT_PNG_OPTIMIZER_OPTIONS
    )
    expect(
      normalizePngOptimizerOptions({
        interlace: true,
        level: 4.6,
        optimiseAlpha: false,
      })
    ).toEqual({
      interlace: true,
      level: 5,
      optimiseAlpha: false,
    })
  })

  it("clamps invalid optimization levels", () => {
    expect(normalizePngOptimizerOptions({ level: -1 }).level).toBe(0)
    expect(normalizePngOptimizerOptions({ level: 10 }).level).toBe(6)
    expect(normalizePngOptimizerOptions({ level: Number.NaN }).level).toBe(2)
  })

  it("detects supported PNG files by MIME type or extension", () => {
    expect(isSupportedPngFile({ name: "photo.bin", type: "image/png" })).toBe(
      true
    )
    expect(isSupportedPngFile({ name: "photo.PNG", type: "" })).toBe(true)
    expect(isSupportedPngFile({ name: "photo.jpg", type: "image/jpeg" })).toBe(
      false
    )
  })

  it("throws a stable error for non-PNG files", () => {
    expect(() =>
      assertSupportedPngFile({ name: "photo.jpg", type: "image/jpeg" })
    ).toThrow(INVALID_PNG_FILE_ERROR)
  })

  it("builds safe optimized output names", () => {
    expect(resolvePngOutputName("photo.png")).toBe("photo-optimized.png")
    expect(resolvePngOutputName(" folder/photo.PNG ")).toBe(
      "folder_photo-optimized.png"
    )
    expect(resolvePngOutputName("diagram")).toBe("diagram-optimized.png")
    expect(resolvePngOutputName(".png")).toBe(DEFAULT_PNG_OUTPUT_NAME)
    expect(resolvePngOutputName("")).toBe(DEFAULT_PNG_OUTPUT_NAME)
  })

  it("calculates positive, zero, and negative savings", () => {
    expect(calculatePngSavings(1000, 600)).toEqual({
      savedBytes: 400,
      savedPercent: 40,
    })
    expect(calculatePngSavings(1000, 1000)).toEqual({
      savedBytes: 0,
      savedPercent: 0,
    })
    expect(calculatePngSavings(1000, 1200)).toEqual({
      savedBytes: -200,
      savedPercent: -20,
    })
    expect(calculatePngSavings(0, 10)).toEqual({
      savedBytes: -10,
      savedPercent: 0,
    })
  })

  it("creates a result object from the source file and optimized blob", () => {
    const file = new File(["1234567890"], "photo.png", {
      type: "image/png",
    })
    const blob = new Blob(["1234"], { type: "image/png" })

    expect(createPngOptimizationResult(file, blob, { level: 3 })).toMatchObject(
      {
        blob,
        file,
        optimizedBytes: 4,
        options: {
          interlace: false,
          level: 3,
          optimiseAlpha: true,
        },
        originalBytes: 10,
        outputName: "photo-optimized.png",
        savedBytes: 6,
        savedPercent: 60,
      }
    )
  })
})
