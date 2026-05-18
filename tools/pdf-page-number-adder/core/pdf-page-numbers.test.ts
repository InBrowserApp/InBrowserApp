import { PDFDocument, StandardFonts } from "pdf-lib"
import { describe, expect, test } from "vitest"

import {
  PDF_MIME_TYPE,
  addPageNumbersToPdf,
  createPdfBlob,
  getNumberedPdfFileName,
  inspectPdfBytes,
  isPdfFile,
  resolveStandardFont,
} from "./pdf-page-numbers"

async function createSamplePdf() {
  const document = await PDFDocument.create()
  document.addPage([300, 400])
  document.addPage([300, 400])
  return document.save()
}

describe("PDF page numbering", () => {
  test("detects PDF files and output filenames", () => {
    expect(isPdfFile({ name: "scan.bin", type: PDF_MIME_TYPE })).toBe(true)
    expect(isPdfFile({ name: "scan.PDF", type: "" })).toBe(true)
    expect(isPdfFile({ name: "scan.txt", type: "text/plain" })).toBe(false)
    expect(getNumberedPdfFileName("report.pdf")).toBe("report-numbered.pdf")
    expect(getNumberedPdfFileName("  ")).toBe("numbered-numbered.pdf")
  })

  test("resolves PDF standard fonts", () => {
    expect(resolveStandardFont("serif")).toBe(StandardFonts.TimesRoman)
    expect(resolveStandardFont("sans-serif")).toBe(StandardFonts.Helvetica)
  })

  test("inspects a PDF and writes page numbers into a new PDF blob", async () => {
    const source = await createSamplePdf()

    await expect(inspectPdfBytes(source)).resolves.toEqual({ pageCount: 2 })

    const result = await addPageNumbersToPdf(source, {
      fontFamily: "sans-serif",
      fontSize: 14,
      format: "number-total",
      marginX: 24,
      marginY: 24,
      pages: [1, 2],
      position: "bottom-center",
      startNumber: 3,
    })
    const resultDocument = await PDFDocument.load(result)
    const blob = createPdfBlob(result)

    expect(resultDocument.getPageCount()).toBe(2)
    expect(result.length).toBeGreaterThan(source.length)
    expect(blob.type).toBe(PDF_MIME_TYPE)
    expect(blob.size).toBe(result.length)
  })
})
