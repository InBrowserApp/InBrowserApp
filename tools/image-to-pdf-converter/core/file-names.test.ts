import { describe, expect, test } from "vitest"

import {
  getOutputFileName,
  normalizeOutputFileName,
  stripFileExtension,
} from "./file-names"

describe("image-to-pdf file names", () => {
  test("creates output names for empty, single, and multi-image queues", () => {
    expect(getOutputFileName([])).toBe("images.pdf")
    expect(getOutputFileName([{ name: "scan.JPG" }])).toBe("scan.pdf")
    expect(getOutputFileName([{ name: "a.png" }, { name: "b.png" }])).toBe(
      "images-2-pages.pdf"
    )
  })

  test("sanitizes unsafe PDF names", () => {
    expect(normalizeOutputFileName('bad<>:"/\\|?*name.pdf')).toBe(
      "bad-name.pdf"
    )
    expect(normalizeOutputFileName("   ")).toBe("images.pdf")
    expect(normalizeOutputFileName("a".repeat(140))).toBe(
      `${"a".repeat(120)}.pdf`
    )
  })

  test("strips the final file extension", () => {
    expect(stripFileExtension("photo.scan.png")).toBe("photo.scan")
    expect(stripFileExtension("photo")).toBe("photo")
  })
})
