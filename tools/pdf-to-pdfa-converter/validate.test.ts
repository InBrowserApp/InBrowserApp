import type { PDFDocumentProxy, PDFPageProxy } from "pdfjs-dist"
import { describe, expect, it, vi } from "vitest"

import { validateArchive } from "./validate"

function page(text: string, width = 300, height = 400) {
  return {
    getTextContent: vi.fn().mockResolvedValue({ items: [{ str: text }] }),
    getViewport: vi.fn().mockReturnValue({ width, height }),
    cleanup: vi.fn(),
  } as unknown as PDFPageProxy
}

function pdf(pages: PDFPageProxy[], part = "2") {
  return {
    numPages: pages.length,
    getMetadata: vi.fn().mockResolvedValue({
      metadata: new Map([
        ["pdfaid:part", part],
        ["pdfaid:conformance", "B"],
      ]),
    }),
    getPage: vi.fn(async (index: number) => pages[index - 1]),
  } as unknown as PDFDocumentProxy
}

const options = { profile: 2 as const, fontEncodingChanged: false }

describe("reopened PDF/A checks", () => {
  it("accepts matching text regardless of spacing, ligatures, or page-size rounding", async () => {
    const original = pdf([page("A ﬂower\n花"), page("")])
    const archive = pdf([page("A flower 花", 300.04, 399.99), page("")])
    await expect(validateArchive(original, archive, options)).resolves.toBe(
      "ready"
    )
  })

  it("rejects unchanged XMP that claims a different profile", async () => {
    const doc = pdf([page("Text")])
    await expect(
      validateArchive(doc, doc, { ...options, profile: 1 })
    ).resolves.toBe("checkFailed")
  })

  it("rejects missing pages", async () => {
    await expect(
      validateArchive(pdf([page("A")]), pdf([]), options)
    ).resolves.toBe("contentChanged")
  })

  it("rejects different searchable text", async () => {
    await expect(
      validateArchive(pdf([page("AB")]), pdf([page("A")]), options)
    ).resolves.toBe("contentChanged")
  })

  it("accepts repaired character mappings only while retaining the searchable glyph count", async () => {
    const source = pdf([page("345678")])
    const output = pdf([page("✓✔✕✖✗✘")])
    const repaired = { ...options, fontEncodingChanged: true }
    await expect(validateArchive(source, output, options)).resolves.toBe(
      "contentChanged"
    )
    await expect(validateArchive(source, output, repaired)).resolves.toBe(
      "ready"
    )
    await expect(
      validateArchive(source, pdf([page("✓")]), repaired)
    ).resolves.toBe("contentChanged")
  })

  it("rejects changes to physical page size", async () => {
    const source = pdf([page("Text")])
    const archive = pdf([page("Text", 600, 800)])
    await expect(validateArchive(source, archive, options)).resolves.toBe(
      "contentChanged"
    )
  })
})
