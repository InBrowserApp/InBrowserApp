import { PDFDocument } from "pdf-lib"
import { describe, expect, test, vi } from "vitest"

import {
  PDF_MERGER_ERROR,
  PDF_MIME_TYPE,
  createPdfBlob,
  copyBytesToArrayBuffer,
  formatBytes,
  formatProgressLabel,
  getFileSignature,
  inspectPdfBuffer,
  inspectPdfFile,
  isEncryptedPdfError,
  isPdfFile,
  mergePdfBuffers,
  normalizeOutputFileName,
  toInspectionErrorCode,
  toMergeErrorCode,
} from "./pdf-merger"

async function createPdf(pageSizes: readonly [number, number][]) {
  const document = await PDFDocument.create()

  for (const size of pageSizes) {
    document.addPage(size)
  }

  const bytes = await document.save()

  return copyBytesToArrayBuffer(bytes)
}

describe("pdf merger core", () => {
  test("detects PDF files by MIME type or extension", () => {
    expect(isPdfFile({ name: "scan.bin", type: PDF_MIME_TYPE })).toBe(true)
    expect(isPdfFile({ name: "report.PDF", type: "" })).toBe(true)
    expect(isPdfFile({ name: "report.txt", type: "text/plain" })).toBe(false)
  })

  test("normalizes output filenames", () => {
    expect(normalizeOutputFileName("")).toBe("merged.pdf")
    expect(normalizeOutputFileName("packet")).toBe("packet.pdf")
    expect(normalizeOutputFileName("already.PDF")).toBe("already.PDF")
    expect(normalizeOutputFileName("  signed forms.pdf  ")).toBe(
      "signed forms.pdf"
    )
  })

  test("formats bytes and progress labels", () => {
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(12 * 1024 * 1024)).toBe("12.0 MB")
    expect(formatProgressLabel("Preparing {completed} of {total}", 2, 5)).toBe(
      "Preparing 2 of 5"
    )
  })

  test("creates stable file signatures", () => {
    const file = new File(["pdf"], "scan.pdf", {
      lastModified: 12,
      type: PDF_MIME_TYPE,
    })

    expect(getFileSignature(file)).toBe("scan.pdf:3:12")
  })

  test("inspects valid PDF buffers", async () => {
    const buffer = await createPdf([
      [200, 300],
      [300, 400],
    ])

    await expect(inspectPdfBuffer(buffer)).resolves.toEqual({ pageCount: 2 })
    await expect(
      inspectPdfFile(
        new File([buffer], "scan.pdf", { type: "application/pdf" })
      )
    ).resolves.toEqual({ pageCount: 2 })
  })

  test("maps invalid and encrypted inspection errors", async () => {
    await expect(inspectPdfBuffer(new ArrayBuffer(3))).rejects.toThrow(
      PDF_MERGER_ERROR.invalid
    )

    const encrypted = new Error("encrypted")
    encrypted.name = "EncryptedPDFError"

    expect(isEncryptedPdfError(encrypted)).toBe(true)
    expect(isEncryptedPdfError(new Error("plain"))).toBe(false)
    expect(toInspectionErrorCode(encrypted)).toBe(PDF_MERGER_ERROR.encrypted)
    expect(toInspectionErrorCode(new Error("plain"))).toBe(
      PDF_MERGER_ERROR.invalid
    )
  })

  test("merges PDF buffers in queue order", async () => {
    const progress = vi.fn()
    const first = await createPdf([[200, 300]])
    const second = await createPdf([
      [400, 500],
      [500, 600],
    ])
    const mergedBytes = await mergePdfBuffers(
      [
        { buffer: first, name: "first.pdf" },
        { buffer: second, name: "second.pdf" },
      ],
      progress
    )
    const merged = await PDFDocument.load(mergedBytes)

    expect(merged.getPageCount()).toBe(3)
    expect(merged.getPages().map((page) => page.getSize().width)).toEqual([
      200, 400, 500,
    ])
    expect(progress).toHaveBeenNthCalledWith(1, { completed: 1, total: 2 })
    expect(progress).toHaveBeenNthCalledWith(2, { completed: 2, total: 2 })
  })

  test("rejects incomplete or invalid merge inputs", async () => {
    await expect(mergePdfBuffers([])).rejects.toThrow(
      PDF_MERGER_ERROR.notEnoughFiles
    )
    await expect(
      mergePdfBuffers([
        { buffer: await createPdf([[200, 300]]), name: "good.pdf" },
        { buffer: new ArrayBuffer(2), name: "bad.pdf" },
      ])
    ).rejects.toThrow(PDF_MERGER_ERROR.mergeFailed)

    const encrypted = new Error("encrypted")
    encrypted.name = "EncryptedPDFError"

    expect(toMergeErrorCode(encrypted)).toBe(PDF_MERGER_ERROR.encrypted)
    expect(toMergeErrorCode(new Error("plain"))).toBe(
      PDF_MERGER_ERROR.mergeFailed
    )
  })

  test("creates PDF blobs from saved bytes", async () => {
    const blob = createPdfBlob(new Uint8Array([37, 80, 68, 70]))

    expect(blob.type).toBe(PDF_MIME_TYPE)
    expect(blob.size).toBe(4)
  })
})
