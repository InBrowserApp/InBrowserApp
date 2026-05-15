import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import PdfInfoViewerClient from "./client"
import { extractPdfInfo } from "./core/pdf-info"

import type { PdfInfoViewerMessages } from "./client/types"
import type { PdfInfo } from "./core/pdf-info"

vi.mock("./core/pdf-info", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/pdf-info")>()

  return {
    ...actual,
    extractPdfInfo: vi.fn(),
  }
})

const messages: PdfInfoViewerMessages = {
  meta: {
    name: "PDF Info Viewer",
    description:
      "View PDF metadata, page count, version, file details, and document properties locally in your browser.",
  },
  changeFile: "Change file",
  copiedJson: "Copied",
  copyAsJson: "Copy as JSON",
  documentResults: "Document details",
  downloadJson: "Download JSON",
  dragDropOrClick: "Drag and drop a PDF here, or click to upload",
  encrypted: "Encrypted",
  encryptedDescription:
    "The file appears to be encrypted, so only basic file and header details can be shown without a password.",
  encryptedTitle: "Encrypted PDF",
  encryptionStatus: "Encryption",
  errorTitle: "PDF issue",
  fieldAuthor: "Author",
  fieldCreationDate: "Creation date",
  fieldCreator: "Creator",
  fieldEncrypted: "Encrypted",
  fieldFileName: "File name",
  fieldFileSize: "File size",
  fieldFileType: "File type",
  fieldFirstPageSize: "First page size",
  fieldKeywords: "Keywords",
  fieldLastModified: "Last modified",
  fieldModificationDate: "Modification date",
  fieldName: "Field",
  fieldPageCount: "Page count",
  fieldPdfVersion: "PDF version",
  fieldProducer: "Producer",
  fieldSubject: "Subject",
  fieldTitle: "Title",
  fieldValue: "Value",
  fileSize: "File size",
  firstPageSize: "First page size",
  noFileDescription:
    "Upload a PDF to inspect its metadata and document details.",
  noFileTitle: "No PDF selected",
  noMetadataDescription:
    "The PDF opened successfully, but no title, author, dates, or other document metadata were found.",
  noMetadataTitle: "No document metadata",
  notAvailable: "Not available",
  notEncrypted: "Not encrypted",
  pageCount: "Pages",
  parseError: "Failed to read the PDF.",
  pdfVersion: "PDF version",
  readingDescription: "Parsing document structure and metadata.",
  readingTitle: "Reading PDF",
  removeFile: "Remove file",
  resultsDescription:
    "Review file details, PDF structure, metadata, and export a JSON summary.",
  sectionDocument: "PDF structure",
  sectionFile: "File details",
  sectionMetadata: "Document metadata",
  selectedPdf: "Selected PDF",
  supportedFormats: "Supports local PDF files.",
  unsupportedFile: "Unsupported file type. Please choose a PDF file.",
  uploadHint: "Runs locally in your browser. No uploads.",
}

const pdfInfo: PdfInfo = {
  document: {
    encrypted: false,
    firstPageSize: { height: 792, width: 612 },
    pageCount: 2,
    version: "1.7",
  },
  file: {
    lastModified: "2024-03-04T05:06:07.000Z",
    name: "sample.pdf",
    size: 2048,
    type: "application/pdf",
  },
  metadata: {
    author: "Docs Team",
    creationDate: "2024-01-02T03:04:05.000Z",
    keywords: ["pdf", "metadata"],
    producer: "pdf-lib",
    title: "Sample PDF",
  },
}

function getInput(): HTMLInputElement {
  return screen.getByTestId("pdf-input") as HTMLInputElement
}

function renderClient() {
  render(<PdfInfoViewerClient language="en-US" messages={messages} />)
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
  vi.mocked(extractPdfInfo).mockReset()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf-info-json")
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

describe("PdfInfoViewerClient", () => {
  it("renders upload and empty states", () => {
    renderClient()

    expect(screen.getByText(messages.dragDropOrClick)).toBeTruthy()
    expect(screen.getByText(messages.noFileTitle)).toBeTruthy()
  })

  it("reads a PDF and exposes metadata actions", async () => {
    vi.mocked(extractPdfInfo).mockResolvedValue(pdfInfo)

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "sample.pdf", { type: "application/pdf" })],
      },
    })

    await screen.findByText(messages.documentResults)

    expect(extractPdfInfo).toHaveBeenCalledTimes(1)
    expect(screen.getAllByText("sample.pdf").length).toBeGreaterThan(0)
    expect(screen.getByText("Sample PDF")).toBeTruthy()
    expect(screen.getByText("612 x 792 pt (8.50 x 11.00 in)")).toBeTruthy()
    expect(
      (await screen.findByText(messages.downloadJson))
        .closest("a")
        ?.getAttribute("href")
    ).toBe("blob:pdf-info-json")

    fireEvent.click(screen.getByText(messages.copyAsJson))

    await waitFor(() => {
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
        expect.stringContaining('"title": "Sample PDF"')
      )
    })
  })

  it("shows encrypted, unsupported, and parser error states", async () => {
    vi.mocked(extractPdfInfo).mockResolvedValueOnce({
      document: { encrypted: true, version: "1.7" },
      file: { name: "secret.pdf", size: 12, type: "application/pdf" },
      metadata: {},
    })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "secret.pdf", { type: "application/pdf" })],
      },
    })

    expect(await screen.findByText(messages.encryptedTitle)).toBeTruthy()
    expect(screen.getByText(messages.noMetadataTitle)).toBeTruthy()

    fireEvent.change(getInput(), {
      target: {
        files: [new File(["txt"], "notes.txt", { type: "text/plain" })],
      },
    })
    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()

    vi.mocked(extractPdfInfo).mockRejectedValueOnce(new Error("bad pdf"))
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "bad.pdf", { type: "application/pdf" })],
      },
    })

    expect(await screen.findByText("bad pdf")).toBeTruthy()
  })

  it("supports picker, clear, empty change, and drag-and-drop flows", async () => {
    vi.mocked(extractPdfInfo).mockResolvedValue(pdfInfo)
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
    expect(extractPdfInfo).not.toHaveBeenCalled()

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
