import { PDFDocument } from "pdf-lib"
import { afterEach, describe, expect, it, vi } from "vitest"

import {
  extractPdfInfo,
  formatBytes,
  formatDateTime,
  formatPageSize,
  getMetadataFieldCount,
  isPdfFile,
  pdfInfoToJson,
} from "./pdf-info"

import type { PdfInfo } from "./pdf-info"

afterEach(() => {
  vi.restoreAllMocks()
})

describe("pdf info helpers", () => {
  it("detects PDF files by mime type or extension", () => {
    expect(
      isPdfFile(new File([""], "report.bin", { type: "application/pdf" }))
    ).toBe(true)
    expect(isPdfFile(new File([""], "report.PDF", { type: "" }))).toBe(true)
    expect(
      isPdfFile(new File([""], "report.txt", { type: "text/plain" }))
    ).toBe(false)
  })

  it("formats bytes, dates, page sizes, and metadata counts", () => {
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(12 * 1024 * 1024)).toBe("12.0 MB")

    expect(formatDateTime(undefined, "en-US")).toBe("")
    expect(formatDateTime("not a date", "en-US")).toBe("")
    expect(formatDateTime("2024-01-02T03:04:05.000Z", "en-US")).toContain(
      "2024"
    )

    expect(formatPageSize(undefined)).toBe("")
    expect(formatPageSize({ width: 612, height: 792 })).toBe(
      "612 x 792 pt (8.50 x 11.00 in)"
    )
    expect(formatPageSize({ width: 612.5, height: 792.25 })).toBe(
      "612.5 x 792.25 pt (8.51 x 11.00 in)"
    )

    expect(
      getMetadataFieldCount({
        author: "",
        keywords: ["alpha"],
        producer: "pdf-lib",
      })
    ).toBe(2)
  })

  it("serializes PDF info as stable JSON", () => {
    const info: PdfInfo = {
      document: { encrypted: false, pageCount: 1, version: "1.7" },
      file: { name: "sample.pdf", size: 42, type: "application/pdf" },
      metadata: { title: "Sample" },
    }

    expect(pdfInfoToJson(info)).toContain('"title": "Sample"')
  })
})

describe("extractPdfInfo", () => {
  it("extracts metadata from a real PDF", async () => {
    const pdfDocument = await PDFDocument.create()
    pdfDocument.addPage([612, 792])
    pdfDocument.setTitle(" Quarterly Report ")
    pdfDocument.setAuthor(" Docs Team ")
    pdfDocument.setSubject(" Metadata ")
    pdfDocument.setKeywords([" finance ", "report "])
    pdfDocument.setCreator("InBrowser.App tests")
    pdfDocument.setProducer("pdf-lib")
    pdfDocument.setCreationDate(new Date("2024-01-02T03:04:05.000Z"))
    pdfDocument.setModificationDate(new Date("2024-02-03T04:05:06.000Z"))

    const bytes = await pdfDocument.save()
    const pdfBuffer = bytes.buffer.slice(
      bytes.byteOffset,
      bytes.byteOffset + bytes.byteLength
    ) as ArrayBuffer
    const file = new File([pdfBuffer], "quarterly.pdf", {
      lastModified: Date.parse("2024-03-04T05:06:07.000Z"),
      type: "application/pdf",
    })

    const info = await extractPdfInfo(file)

    expect(info.file).toEqual({
      lastModified: "2024-03-04T05:06:07.000Z",
      name: "quarterly.pdf",
      size: file.size,
      type: "application/pdf",
    })
    expect(info.document.encrypted).toBe(false)
    expect(info.document.pageCount).toBe(1)
    expect(info.document.version).toMatch(/^\d\.\d$/)
    expect(info.document.firstPageSize).toEqual({ height: 792, width: 612 })
    expect(info.metadata).toMatchObject({
      author: "Docs Team",
      creationDate: "2024-01-02T03:04:05.000Z",
      creator: "InBrowser.App tests",
      keywords: ["finance  report"],
      subject: "Metadata",
      title: "Quarterly Report",
    })
    expect(info.metadata.modificationDate).toBeTruthy()
    expect(info.metadata.producer).toContain("pdf-lib")
  })

  it("normalizes string keywords and missing page size from loader data", async () => {
    const loadSpy = vi.spyOn(PDFDocument, "load")
    loadSpy.mockResolvedValueOnce({
      getAuthor: () => "",
      getCreationDate: () => new Date("invalid"),
      getCreator: () => " Creator ",
      getKeywords: () => "alpha; beta, gamma",
      getModificationDate: () => undefined,
      getPageCount: () => 0,
      getPages: () => [],
      getProducer: () => "",
      getSubject: () => undefined,
      getTitle: () => " Title ",
    } as unknown as PDFDocument)

    const file = {
      arrayBuffer: async () => new TextEncoder().encode("%PDF-1.6").buffer,
      lastModified: undefined,
      name: "mock.pdf",
      size: 8,
      type: "",
    } as unknown as File

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      document: {
        encrypted: false,
        firstPageSize: undefined,
        pageCount: 0,
        version: "1.6",
      },
      file: {
        lastModified: undefined,
        name: "mock.pdf",
        size: 8,
        type: "application/pdf",
      },
      metadata: {
        creator: "Creator",
        keywords: ["alpha", "beta", "gamma"],
        title: "Title",
      },
    })

    loadSpy.mockResolvedValueOnce({
      getAuthor: () => undefined,
      getCreationDate: () => undefined,
      getCreator: () => undefined,
      getKeywords: () => [" first ", ""],
      getModificationDate: () => undefined,
      getPageCount: () => 1,
      getPages: () => [],
      getProducer: () => undefined,
      getSubject: () => undefined,
      getTitle: () => undefined,
    } as unknown as PDFDocument)

    loadSpy.mockResolvedValueOnce({
      getAuthor: () => undefined,
      getCreationDate: () => undefined,
      getCreator: () => undefined,
      getKeywords: () => undefined,
      getModificationDate: () => undefined,
      getPageCount: () => 1,
      getPages: () => [],
      getProducer: () => undefined,
      getSubject: () => undefined,
      getTitle: () => undefined,
    } as unknown as PDFDocument)

    loadSpy.mockResolvedValueOnce({
      getAuthor: () => undefined,
      getCreationDate: () => undefined,
      getCreator: () => undefined,
      getKeywords: () => ["   "],
      getModificationDate: () => undefined,
      getPageCount: () => 1,
      getPages: () => [],
      getProducer: () => undefined,
      getSubject: () => undefined,
      getTitle: () => undefined,
    } as unknown as PDFDocument)

    loadSpy.mockResolvedValueOnce({
      getAuthor: () => undefined,
      getCreationDate: () => undefined,
      getCreator: () => undefined,
      getKeywords: () => " , ; ",
      getModificationDate: () => undefined,
      getPageCount: () => 1,
      getPages: () => [],
      getProducer: () => undefined,
      getSubject: () => undefined,
      getTitle: () => undefined,
    } as unknown as PDFDocument)

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      metadata: {
        keywords: ["first"],
      },
    })

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      metadata: {},
    })

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      metadata: {},
    })

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      metadata: {},
    })
  })

  it("returns basic info for encrypted PDFs", async () => {
    const encryptedError = new Error("encrypted")
    encryptedError.name = "EncryptedPDFError"
    vi.spyOn(PDFDocument, "load").mockRejectedValueOnce(encryptedError)

    const file = new File(["%PDF-1.5"], "secret.pdf", {
      type: "application/pdf",
    })

    await expect(extractPdfInfo(file)).resolves.toMatchObject({
      document: { encrypted: true, version: "1.5" },
      file: { name: "secret.pdf" },
      metadata: {},
    })
  })

  it("rethrows malformed PDF errors", async () => {
    vi.spyOn(PDFDocument, "load").mockRejectedValueOnce(new Error("broken"))

    const file = new File(["not pdf"], "broken.pdf", {
      type: "application/pdf",
    })

    await expect(extractPdfInfo(file)).rejects.toThrow("broken")
  })
})
