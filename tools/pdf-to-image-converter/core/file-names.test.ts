import { describe, expect, test } from "vitest"

import {
  createPageImageName,
  createZipName,
  stripPdfExtension,
} from "./file-names"

describe("PDF to image file names", () => {
  test("strips PDF extensions and falls back for blank names", () => {
    expect(stripPdfExtension("Report.pdf")).toBe("Report")
    expect(stripPdfExtension("report.PDF")).toBe("report")
    expect(stripPdfExtension("pdf")).toBe("pdf")
    expect(stripPdfExtension("   ")).toBe("document")
    expect(stripPdfExtension(".pdf")).toBe("document")
  })

  test("creates current page image names", () => {
    expect(createPageImageName("scan.pdf", 2, "png")).toBe("scan-p2.png")
    expect(createPageImageName("scan.pdf", 2.6, "jpeg")).toBe("scan-p3.jpg")
    expect(createPageImageName("scan.pdf", -1, "webp")).toBe("scan-p1.webp")
  })

  test("creates ZIP names with clamped DPI", () => {
    expect(createZipName("scan.pdf", 144, "png")).toBe(
      "scan-144dpi-png-images.zip"
    )
    expect(createZipName("scan.pdf", 9999, "jpeg")).toBe(
      "scan-600dpi-jpeg-images.zip"
    )
  })
})
