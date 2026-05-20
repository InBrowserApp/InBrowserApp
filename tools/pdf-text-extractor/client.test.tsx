import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import PdfTextExtractorClient from "./client"
import { extractPdfText } from "./core/pdf-text"

import type { PdfTextExtractorMessages } from "./client/types"
import type { PdfTextExtractionResult } from "./core/pdf-text"

vi.mock("./pdfjs", () => ({
  PDF_IMAGE_PAINT_OPERATIONS: new Set([99]),
  loadPdfDocument: vi.fn(),
}))

vi.mock("./core/pdf-text", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/pdf-text")>()

  return {
    ...actual,
    extractPdfText: vi.fn(),
  }
})

const messages: PdfTextExtractorMessages = {
  meta: {
    name: "PDF Text Extractor",
    description:
      "Extract selectable text from PDF files locally in your browser and export it as plain text.",
  },
  changeFile: "Change file",
  characterCount: "Characters",
  copiedText: "Copied",
  copyText: "Copy text",
  documentResults: "Extracted text",
  downloadTxt: "Download TXT",
  dragDropOrClick: "Drag and drop a PDF here, or click to upload",
  emptyTextPages: "Empty text pages",
  errorTitle: "PDF issue",
  extractingDescription: "Reading page text streams locally in your browser.",
  extractingTitle: "Extracting text",
  extractionNotice:
    "This tool extracts text already embedded in the PDF. Scanned pages or image-only documents need OCR, which is not part of this extractor.",
  extractionNoticeTitle: "Selectable text only",
  fileSize: "File size",
  likelyScannedPages: "Likely scanned pages",
  noFileDescription: "Upload a PDF to extract selectable text from its pages.",
  noFileTitle: "No PDF selected",
  noTextDescription:
    "The PDF opened successfully, but it did not expose selectable text. If the document is scanned, use OCR before extracting text.",
  noTextTitle: "No selectable text found",
  pageCount: "Pages",
  parseError: "Failed to extract text from the PDF.",
  passwordError: "Password-protected PDFs are not supported by this extractor.",
  removeFile: "Remove file",
  resultsDescription:
    "Review extraction coverage, copy the plain text, or download a TXT file.",
  scannedWarning:
    "One or more pages contain image operations without selectable text. Those pages may need OCR.",
  scannedWarningTitle: "Some pages may be scans",
  selectedPdf: "Selected PDF",
  supportedFormats: "Supports local PDF files.",
  textPages: "Pages with text",
  textPreviewLabel: "Plain text preview",
  unsupportedFile: "Unsupported file type. Please choose a PDF file.",
  uploadHint: "Runs locally in your browser. No uploads.",
  wordCount: "Words",
}

const extractionResult: PdfTextExtractionResult = {
  characterCount: 22,
  emptyTextPages: 1,
  likelyScannedPages: 1,
  pageCount: 2,
  pages: [
    {
      characterCount: 22,
      likelyScanned: false,
      pageNumber: 1,
      text: "Hello from the PDF text",
      wordCount: 5,
    },
    {
      characterCount: 0,
      likelyScanned: true,
      pageNumber: 2,
      text: "",
      wordCount: 0,
    },
  ],
  text: "Hello from the PDF text",
  textPages: 1,
  wordCount: 5,
}

function getInput(): HTMLInputElement {
  return screen.getByTestId("pdf-text-input") as HTMLInputElement
}

function renderClient() {
  render(<PdfTextExtractorClient lang="en" messages={messages} />)
}

function getUploadButton() {
  const uploadButton = screen
    .getAllByLabelText(messages.dragDropOrClick)
    .find((element) => element.tagName === "BUTTON")

  if (!uploadButton) {
    throw new Error("Upload button not found")
  }

  return uploadButton
}

beforeEach(() => {
  vi.mocked(extractPdfText).mockReset()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf-text")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  Object.defineProperty(navigator, "clipboard", {
    configurable: true,
    value: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("PdfTextExtractorClient", () => {
  it("renders upload guidance and empty state", () => {
    renderClient()

    expect(screen.getByText(messages.extractionNoticeTitle)).toBeTruthy()
    expect(screen.getByText(messages.dragDropOrClick)).toBeTruthy()
    expect(screen.getByText(messages.noFileTitle)).toBeTruthy()
  })

  it("extracts text and exposes copy and download actions", async () => {
    vi.mocked(extractPdfText).mockResolvedValue(extractionResult)

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [
          new File(["pdf"], "Quarterly Report.pdf", {
            type: "application/pdf",
          }),
        ],
      },
    })

    expect(await screen.findByText(messages.documentResults)).toBeTruthy()
    expect(extractPdfText).toHaveBeenCalledTimes(1)
    expect(screen.getByDisplayValue(extractionResult.text)).toBeTruthy()
    expect(screen.getByText(messages.scannedWarningTitle)).toBeTruthy()
    const downloadLink = (
      await screen.findByText(messages.downloadTxt)
    ).closest("a") as HTMLAnchorElement

    expect(downloadLink.download).toBe("Quarterly Report.txt")
    expect(downloadLink.getAttribute("href")).toBe("blob:pdf-text")

    fireEvent.click(screen.getByText(messages.copyText))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        extractionResult.text
      )
    })
  })

  it("shows empty, unsupported, password, and parser error states", async () => {
    vi.mocked(extractPdfText).mockResolvedValueOnce({
      ...extractionResult,
      characterCount: 0,
      emptyTextPages: 1,
      likelyScannedPages: 1,
      pageCount: 1,
      pages: [
        {
          characterCount: 0,
          likelyScanned: true,
          pageNumber: 1,
          text: "",
          wordCount: 0,
        },
      ],
      text: "",
      textPages: 0,
      wordCount: 0,
    })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "scan.pdf", { type: "application/pdf" })],
      },
    })

    expect(await screen.findByText(messages.noTextTitle)).toBeTruthy()

    fireEvent.change(getInput(), {
      target: {
        files: [new File(["txt"], "notes.txt", { type: "text/plain" })],
      },
    })
    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()

    const passwordError = new Error("needs password")
    passwordError.name = "PasswordException"
    vi.mocked(extractPdfText).mockRejectedValueOnce(passwordError)
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "secret.pdf", { type: "application/pdf" })],
      },
    })
    expect(await screen.findByText(messages.passwordError)).toBeTruthy()

    vi.mocked(extractPdfText).mockRejectedValueOnce(new Error("bad pdf"))
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "bad.pdf", { type: "application/pdf" })],
      },
    })
    expect(await screen.findByText(messages.parseError)).toBeTruthy()
  })

  it("supports picker, empty change, clear, and drag-and-drop flows", async () => {
    vi.mocked(extractPdfText).mockResolvedValue(extractionResult)
    const inputClick = vi.spyOn(HTMLInputElement.prototype, "click")

    renderClient()
    const uploadButton = getUploadButton()

    fireEvent.click(uploadButton)
    expect(inputClick).toHaveBeenCalledTimes(1)

    fireEvent.change(getInput(), {
      target: {
        files: [],
      },
    })
    expect(extractPdfText).not.toHaveBeenCalled()

    fireEvent.drop(uploadButton, {
      dataTransfer: {
        files: [new File(["pdf"], "dropped.pdf", { type: "application/pdf" })],
      },
    })
    expect(await screen.findByText(messages.documentResults)).toBeTruthy()

    fireEvent.click(screen.getByText(messages.changeFile))
    expect(inputClick).toHaveBeenCalledTimes(2)

    fireEvent.click(screen.getByText(messages.removeFile))
    expect(screen.getByText(messages.noFileTitle)).toBeTruthy()

    const nextUploadButton = getUploadButton()
    fireEvent.dragEnter(nextUploadButton)
    fireEvent.dragOver(nextUploadButton, {
      dataTransfer: {
        dropEffect: "none",
      },
    })
    fireEvent.dragLeave(nextUploadButton)
  })
})
