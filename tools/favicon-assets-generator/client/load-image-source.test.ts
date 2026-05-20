import { describe, expect, test } from "vitest"

import { isSvgFile, SVG_MIME } from "./load-image-source"

describe("isSvgFile", () => {
  test("returns true for files with the SVG mime type", () => {
    const file = new File(["<svg/>"], "anything.bin", { type: SVG_MIME })
    expect(isSvgFile(file)).toBe(true)
  })

  test("returns true for files whose name ends in .svg even when mime is missing", () => {
    const file = new File(["<svg/>"], "logo.SVG", { type: "" })
    expect(isSvgFile(file)).toBe(true)
  })

  test("returns false for non-svg files", () => {
    const file = new File([new Uint8Array([1, 2, 3])], "photo.png", {
      type: "image/png",
    })
    expect(isSvgFile(file)).toBe(false)
  })
})
