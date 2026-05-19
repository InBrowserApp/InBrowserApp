import { degrees, PDFDocument } from "pdf-lib"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  createOutputFileName,
  createPdfBlob,
  formatBytes,
  formatPageSize,
  inspectPdf,
  isPdfFile,
  movePage,
  normalizeRotation,
  organizePdf,
  removePage,
  rotatePage,
} from "./pdf-page-organizer"

afterEach(() => {
  vi.restoreAllMocks()
})

async function createSamplePdfFile(name = "source.pdf") {
  const document = await PDFDocument.create()
  document.addPage([300, 500])
  const rotatedPage = document.addPage([612, 792])
  rotatedPage.setRotation(degrees(90))
  document.addPage([400, 400])

  const bytes = await document.save()
  const pdfBuffer = bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength
  ) as ArrayBuffer

  return new File([pdfBuffer], name, { type: "application/pdf" })
}

describe("pdf page organizer helpers", () => {
  it("detects PDF files and formats display values", () => {
    expect(
      isPdfFile(new File([""], "report.bin", { type: "application/pdf" }))
    ).toBe(true)
    expect(isPdfFile(new File([""], "report.PDF", { type: "" }))).toBe(true)
    expect(
      isPdfFile(new File([""], "report.txt", { type: "text/plain" }))
    ).toBe(false)

    expect(normalizeRotation(-90)).toBe(270)
    expect(normalizeRotation(450)).toBe(90)
    expect(formatPageSize(612, 792.25)).toBe("612 x 792.25 pt")
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(10 * 1024)).toBe("10.0 KB")
    expect(formatBytes(1024 * 1024)).toBe("1.00 MB")
    expect(createOutputFileName(" report.pdf ")).toBe("report-organized.pdf")
    expect(createOutputFileName("")).toBe("document-organized.pdf")

    const blob = createPdfBlob(new Uint8Array([37, 80, 68, 70]))
    expect(blob).toBeInstanceOf(Blob)
    expect(blob.type).toBe("application/pdf")
  })

  it("moves, rotates, and removes page entries immutably", async () => {
    const file = await createSamplePdfFile()
    const inspection = await inspectPdf(file)
    const moved = movePage(inspection.pages, 0, 2)
    const rotated = rotatePage(moved, "page-1", 90)
    const removed = removePage(rotated, "page-2")

    expect(moved.map((page) => page.sourcePageNumber)).toEqual([2, 3, 1])
    expect(rotated.find((page) => page.id === "page-1")?.rotation).toBe(90)
    expect(removed.map((page) => page.sourcePageNumber)).toEqual([3, 1])
    expect(movePage(inspection.pages, -1, 1)).toEqual(inspection.pages)
  })
})

describe("inspectPdf", () => {
  it("extracts page count, sizes, and rotations from a real PDF", async () => {
    const file = await createSamplePdfFile()

    await expect(inspectPdf(file)).resolves.toEqual({
      pageCount: 3,
      pages: [
        {
          height: 500,
          id: "page-1",
          rotation: 0,
          sourcePageNumber: 1,
          width: 300,
        },
        {
          height: 792,
          id: "page-2",
          rotation: 90,
          sourcePageNumber: 2,
          width: 612,
        },
        {
          height: 400,
          id: "page-3",
          rotation: 0,
          sourcePageNumber: 3,
          width: 400,
        },
      ],
    })
  })

  it("maps encrypted and malformed read failures", async () => {
    const encryptedError = new Error("encrypted")
    encryptedError.name = "EncryptedPDFError"
    vi.spyOn(PDFDocument, "load").mockRejectedValueOnce(encryptedError)

    await expect(
      inspectPdf(new File(["%PDF-1.7"], "secret.pdf"))
    ).rejects.toThrow("ENCRYPTED_PDF")

    vi.spyOn(PDFDocument, "load").mockRejectedValueOnce(new Error("bad"))

    await expect(
      inspectPdf(new File(["broken"], "broken.pdf"))
    ).rejects.toThrow("INVALID_PDF")
  })
})

describe("organizePdf", () => {
  it("exports a new PDF using the chosen order and rotations", async () => {
    const file = await createSamplePdfFile("packet.pdf")
    const result = await organizePdf(file, [
      { sourcePageNumber: 3, rotation: 180 },
      { sourcePageNumber: 1, rotation: 90 },
    ])
    const output = await PDFDocument.load(result.bytes)
    const pages = output.getPages()

    expect(result.fileName).toBe("packet-organized.pdf")
    expect(result.pageCount).toBe(2)
    expect(pages).toHaveLength(2)
    expect(pages[0]?.getSize()).toEqual({ height: 400, width: 400 })
    expect(pages[0]?.getRotation().angle).toBe(180)
    expect(pages[1]?.getSize()).toEqual({ height: 500, width: 300 })
    expect(pages[1]?.getRotation().angle).toBe(90)
  })

  it("rejects empty and invalid export plans", async () => {
    const file = await createSamplePdfFile()

    await expect(organizePdf(file, [])).rejects.toThrow("NO_PAGES")
    await expect(
      organizePdf(file, [{ sourcePageNumber: 99, rotation: 0 }])
    ).rejects.toThrow("EXPORT_FAILED")

    const encryptedError = new Error("encrypted")
    encryptedError.name = "EncryptedPDFError"
    vi.spyOn(PDFDocument, "load").mockRejectedValueOnce(encryptedError)

    await expect(
      organizePdf(file, [{ sourcePageNumber: 1, rotation: 0 }])
    ).rejects.toThrow("ENCRYPTED_PDF")
  })
})
