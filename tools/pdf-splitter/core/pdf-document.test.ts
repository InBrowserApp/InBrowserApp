import { PDFDocument } from "pdf-lib"
import { describe, expect, test, vi } from "vitest"

import {
  PDF_DOCUMENT_ERROR,
  PDF_MIME_TYPE,
  createPdfBlob,
  formatBytes,
  getOutputBaseName,
  inspectPdfFile,
  isEncryptedPdfError,
  isPdfFile,
  sanitizeOutputBaseName,
  splitPdfDocument,
  withPdfExtension,
} from "./pdf-document"

async function createPdf(pageCount: number) {
  const document = await PDFDocument.create()

  for (let index = 0; index < pageCount; index += 1) {
    document.addPage([200 + index, 300 + index])
  }

  return document.save()
}

async function createPdfFile(pageCount: number, name = "sample.pdf") {
  const pdfBytes = await createPdf(pageCount)
  const buffer = new ArrayBuffer(pdfBytes.byteLength)
  const copy = new Uint8Array(buffer)
  copy.set(pdfBytes)

  return new File([buffer], name, { type: PDF_MIME_TYPE })
}

async function readPageCount(bytes: Uint8Array) {
  const document = await PDFDocument.load(bytes)
  return document.getPageCount()
}

describe("PDF file helpers", () => {
  test("detects PDF files by MIME type or extension", () => {
    expect(
      isPdfFile(new File([""], "report.bin", { type: PDF_MIME_TYPE }))
    ).toBe(true)
    expect(isPdfFile(new File([""], "report.PDF", { type: "" }))).toBe(true)
    expect(
      isPdfFile(new File([""], "report.txt", { type: "text/plain" }))
    ).toBe(false)
  })

  test("formats byte sizes for file summaries", () => {
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(Number.NaN)).toBe("0 B")
    expect(formatBytes(42)).toBe("42 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(12 * 1024)).toBe("12.0 KB")
    expect(formatBytes(5 * 1024 * 1024)).toBe("5.00 MB")
    expect(formatBytes(3 * 1024 * 1024 * 1024)).toBe("3.00 GB")
  })

  test("normalizes output file names", () => {
    expect(sanitizeOutputBaseName(' bad<>:"/\\|?* name.pdf ')).toBe(
      "bad- name.pdf"
    )
    expect(sanitizeOutputBaseName(`bad${String.fromCharCode(1)}name`)).toBe(
      "bad-name"
    )
    expect(sanitizeOutputBaseName("...")).toBe("split-result")
    expect(getOutputBaseName("report.pdf", "single")).toBe("report-selected")
    expect(getOutputBaseName("report.pdf", "multiple")).toBe("report-split")
    expect(withPdfExtension("result")).toBe("result.pdf")
    expect(withPdfExtension("result.PDF")).toBe("result.PDF")
    expect(withPdfExtension("   ")).toBe("split-result.pdf")
  })

  test("creates PDF blobs without sharing the source byte view", async () => {
    const bytes = new Uint8Array([1, 2, 3])
    const blob = createPdfBlob(bytes)
    bytes[0] = 9

    expect(blob.type).toBe(PDF_MIME_TYPE)
    expect(new Uint8Array(await blob.arrayBuffer())).toEqual(
      new Uint8Array([1, 2, 3])
    )
  })
})

describe("inspectPdfFile", () => {
  test("returns the page count for a valid PDF", async () => {
    await expect(inspectPdfFile(await createPdfFile(3))).resolves.toEqual({
      pageCount: 3,
    })
  })

  test("maps invalid and encrypted documents to stable error codes", async () => {
    await expect(
      inspectPdfFile(new File(["not pdf"], "bad.pdf", { type: PDF_MIME_TYPE }))
    ).rejects.toThrowError(PDF_DOCUMENT_ERROR.Invalid)

    const encryptedError = Object.assign(new Error("encrypted"), {
      name: "EncryptedPDFError",
    })
    const loadSpy = vi
      .spyOn(PDFDocument, "load")
      .mockRejectedValueOnce(encryptedError)

    await expect(
      inspectPdfFile(new File(["%PDF"], "locked.pdf", { type: PDF_MIME_TYPE }))
    ).rejects.toThrowError(PDF_DOCUMENT_ERROR.Encrypted)

    loadSpy.mockRestore()
    expect(isEncryptedPdfError(encryptedError)).toBe(true)
    expect(isEncryptedPdfError(new Error("other"))).toBe(false)
  })
})

describe("splitPdfDocument", () => {
  test("extracts selected pages into one PDF", async () => {
    const [output] = await splitPdfDocument({
      multipleMode: "ranges",
      outputBaseName: "sample-selected",
      outputMode: "single",
      pages: [1, 3],
      segments: [[1], [3]],
      sourceBytes: await createPdf(4),
    })

    expect(output?.name).toBe("sample-selected.pdf")
    await expect(readPageCount(output!.bytes)).resolves.toBe(2)
  })

  test("creates one PDF per range segment", async () => {
    const outputs = await splitPdfDocument({
      multipleMode: "ranges",
      outputBaseName: "sample-split",
      outputMode: "multiple",
      pages: [1, 2, 4],
      segments: [[1, 2], [], [4]],
      sourceBytes: await createPdf(4),
    })

    expect(outputs.map((output) => output.name)).toEqual([
      "sample-split-part-01.pdf",
      "sample-split-part-03.pdf",
    ])
    await expect(readPageCount(outputs[0]!.bytes)).resolves.toBe(2)
    await expect(readPageCount(outputs[1]!.bytes)).resolves.toBe(1)
  })

  test("creates one PDF per selected page", async () => {
    const outputs = await splitPdfDocument({
      multipleMode: "pages",
      outputBaseName: "sample-split",
      outputMode: "multiple",
      pages: [1, 12],
      segments: [[1], [12]],
      sourceBytes: await createPdf(12),
    })

    expect(outputs.map((output) => output.name)).toEqual([
      "sample-split-page-01.pdf",
      "sample-split-page-12.pdf",
    ])
    await expect(readPageCount(outputs[0]!.bytes)).resolves.toBe(1)
    await expect(readPageCount(outputs[1]!.bytes)).resolves.toBe(1)
  })
})
