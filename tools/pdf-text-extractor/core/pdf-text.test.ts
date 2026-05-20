import { describe, expect, it, vi } from "vitest"

import {
  countWords,
  createTextDownloadFileName,
  extractPdfText,
  formatBytes,
  isPdfFile,
  isPdfPasswordError,
  normalizePageText,
  toOutputText,
} from "./pdf-text"

import type {
  PdfDocumentProxyLike,
  PdfPageProxyLike,
  PdfTextPage,
} from "./pdf-text"

function createPage(
  items: readonly unknown[],
  operations: readonly number[] = []
): PdfPageProxyLike {
  return {
    cleanup: vi.fn(),
    getOperatorList: vi.fn().mockResolvedValue({ fnArray: operations }),
    getTextContent: vi.fn().mockResolvedValue({ items }),
  }
}

function createFile(content = "%PDF-1.7") {
  return new File([content], "sample.pdf", { type: "application/pdf" })
}

describe("pdf text helpers", () => {
  it("detects PDFs and formats file metadata", () => {
    expect(
      isPdfFile(new File([""], "report.bin", { type: "application/pdf" }))
    ).toBe(true)
    expect(isPdfFile(new File([""], "report.PDF", { type: "" }))).toBe(true)
    expect(
      isPdfFile(new File([""], "report.txt", { type: "text/plain" }))
    ).toBe(false)

    expect(formatBytes(Number.NaN)).toBe("0 B")
    expect(formatBytes(-1)).toBe("0 B")
    expect(formatBytes(512)).toBe("512 B")
    expect(formatBytes(1536)).toBe("1.50 KB")
    expect(formatBytes(1536, "de")).toBe("1,50 KB")
    expect(formatBytes(12 * 1024 * 1024)).toBe("12.0 MB")

    expect(createTextDownloadFileName("Quarterly Report.pdf")).toBe(
      "Quarterly Report.txt"
    )
    expect(createTextDownloadFileName('bad<>:"/\\|?* name.pdf')).toBe(
      "bad- name.txt"
    )
    expect(createTextDownloadFileName("bad\u0001name.pdf")).toBe("bad-name.txt")
    expect(createTextDownloadFileName("   ")).toBe("extracted-text.txt")
  })

  it("normalizes text and counts words", () => {
    expect(normalizePageText(" Alpha  beta \r\n\n\n  Gamma\t\tDelta  ")).toBe(
      "Alpha beta\n\nGamma Delta"
    )
    expect(countWords("")).toBe(0)
    expect(countWords("Alpha beta\nGamma")).toBe(3)

    const pages: PdfTextPage[] = [
      {
        characterCount: 5,
        likelyScanned: false,
        pageNumber: 1,
        text: "Alpha",
        wordCount: 1,
      },
      {
        characterCount: 0,
        likelyScanned: true,
        pageNumber: 2,
        text: "",
        wordCount: 0,
      },
      {
        characterCount: 4,
        likelyScanned: false,
        pageNumber: 3,
        text: "Beta",
        wordCount: 1,
      },
    ]

    expect(toOutputText(pages)).toBe("Alpha\n\nBeta")
  })

  it("identifies PDF password errors by PDF.js error name", () => {
    const passwordError = new Error("needs password")
    passwordError.name = "PasswordException"

    expect(isPdfPasswordError(passwordError)).toBe(true)
    expect(isPdfPasswordError(new Error("PasswordException"))).toBe(false)
    expect(isPdfPasswordError("PasswordException")).toBe(false)
  })
})

describe("extractPdfText", () => {
  it("extracts selectable text and summarizes page coverage", async () => {
    const firstPage = createPage([
      { str: "Hello" },
      null,
      {},
      { str: 12 },
      { str: "world", hasEOL: true },
      { str: "" },
      { str: "Next line" },
    ])
    const scannedPage = createPage([], [99])
    const emptyPage = createPage([], [12])
    const pages = [firstPage, scannedPage, emptyPage]
    const documentProxy: PdfDocumentProxyLike = {
      destroy: vi.fn(),
      getPage: vi.fn((pageNumber: number) =>
        Promise.resolve(pages[pageNumber - 1]!)
      ),
      numPages: pages.length,
    }
    const loadingTask = {
      destroy: vi.fn(),
      promise: Promise.resolve(documentProxy),
    }
    const loadPdfDocument = vi.fn(() => loadingTask)

    const result = await extractPdfText(createFile(), {
      imagePaintOperations: new Set([99]),
      loadPdfDocument,
    })

    expect(loadPdfDocument).toHaveBeenCalledWith(expect.any(Uint8Array))
    expect(result).toEqual({
      characterCount: 21,
      emptyTextPages: 2,
      likelyScannedPages: 1,
      pageCount: 3,
      pages: [
        {
          characterCount: 21,
          likelyScanned: false,
          pageNumber: 1,
          text: "Hello world\nNext line",
          wordCount: 4,
        },
        {
          characterCount: 0,
          likelyScanned: true,
          pageNumber: 2,
          text: "",
          wordCount: 0,
        },
        {
          characterCount: 0,
          likelyScanned: false,
          pageNumber: 3,
          text: "",
          wordCount: 0,
        },
      ],
      text: "Hello world\nNext line",
      textPages: 1,
      wordCount: 4,
    })
    expect(firstPage.getTextContent).toHaveBeenCalledWith({
      disableNormalization: false,
      includeMarkedContent: false,
    })
    expect(firstPage.cleanup).toHaveBeenCalledTimes(1)
    expect(scannedPage.cleanup).toHaveBeenCalledTimes(1)
    expect(emptyPage.cleanup).toHaveBeenCalledTimes(1)
    expect(documentProxy.destroy).toHaveBeenCalledTimes(1)
    expect(loadingTask.destroy).not.toHaveBeenCalled()
  })

  it("cleans up the loading task when the document fails to open", async () => {
    const passwordError = new Error("password required")
    passwordError.name = "PasswordException"
    const loadingTask = {
      destroy: vi.fn(),
      promise: Promise.reject(passwordError),
    }
    const loadPdfDocument = vi.fn(() => loadingTask)

    await expect(
      extractPdfText(createFile(), {
        imagePaintOperations: new Set([99]),
        loadPdfDocument,
      })
    ).rejects.toBe(passwordError)

    expect(loadingTask.destroy).toHaveBeenCalledTimes(1)
  })

  it("cleans up a page when text extraction fails", async () => {
    const brokenPage: PdfPageProxyLike = {
      cleanup: vi.fn(),
      getOperatorList: vi.fn(),
      getTextContent: vi.fn().mockRejectedValue(new Error("broken text")),
    }
    const documentProxy: PdfDocumentProxyLike = {
      destroy: vi.fn(),
      getPage: vi.fn().mockResolvedValue(brokenPage),
      numPages: 1,
    }
    const loadingTask = {
      destroy: vi.fn(),
      promise: Promise.resolve(documentProxy),
    }

    await expect(
      extractPdfText(createFile(), {
        imagePaintOperations: new Set(),
        loadPdfDocument: () => loadingTask,
      })
    ).rejects.toThrow("broken text")

    expect(brokenPage.cleanup).toHaveBeenCalledTimes(1)
    expect(documentProxy.destroy).toHaveBeenCalledTimes(1)
  })
})
