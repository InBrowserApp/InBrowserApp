import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PdfPageNumberAdderClient from "./client"
import { addPageNumbersToPdf, inspectPdfBytes } from "./core/pdf-page-numbers"

import type { PdfPageNumberAdderMessages } from "./client/types"

vi.mock("./core/pdf-page-numbers", async (importOriginal) => {
  const actual =
    await importOriginal<typeof import("./core/pdf-page-numbers")>()

  return {
    ...actual,
    addPageNumbersToPdf: vi.fn(),
    inspectPdfBytes: vi.fn(),
  }
})

const messages: PdfPageNumberAdderMessages = {
  allPagesSelected: "All pages selected",
  bottomCenterPosition: "Bottom center",
  bottomLeftPosition: "Bottom left",
  bottomRightPosition: "Bottom right",
  changeFile: "Change file",
  downloadPdfLabel: "Download PDF",
  dragDropOrClick: "Drag and drop a PDF here, or click to upload",
  emptyResultDescription:
    "Upload a PDF, adjust the settings, then generate the result.",
  emptyResultTitle: "No numbered PDF yet",
  encryptedPdfError: "Encrypted PDF detected.",
  errorTitle: "PDF issue",
  fileSizeLabel: "File size",
  fontFamilyLabel: "Font",
  fontSizeDescription: "Controls text size.",
  fontSizeLabel: "Font size",
  formatLabel: "Format",
  generateFailedError: "Failed to generate.",
  generateLabel: "Generate numbered PDF",
  generatingDescription: "Writing page numbers.",
  generatingLabel: "Generating...",
  generatingTitle: "Generating PDF",
  horizontalMarginLabel: "Horizontal margin",
  localOnlyNote: "The PDF stays in this browser session.",
  marginDescription: "Distance from edge.",
  meta: {
    description: "Add page numbers to PDF files.",
    name: "PDF Page Number Adder",
  },
  nextPreviewPageLabel: "Next preview page",
  noFileError: "Upload a PDF first.",
  numberOnlyFormat: "Number only",
  numberTotalFormat: "Number / total",
  outputSizeLabel: "Output size",
  pageCountLabel: "Pages",
  pageRangeDescription: "Leave blank for every page.",
  pageRangeLabel: "Pages to number",
  pageRangePlaceholder: "All pages",
  positionLabel: "Position",
  previewDescription: "Preview any selected page.",
  previewPageStatus: "Previewing page {page} of {total}",
  previewSamplePage: "Sample page",
  previewTitle: "Placement preview",
  previousPreviewPageLabel: "Previous preview page",
  rangeDescending: "Descending range.",
  rangeDuplicate: "Duplicate page.",
  rangeInvalidToken: "Invalid page range.",
  rangeOutOfBounds: "Out of bounds.",
  readPdfError: "Failed to read the PDF.",
  readingPdfDescription: "Checking page count.",
  readingPdfTitle: "Reading PDF",
  removeFile: "Remove file",
  resultDescription: "Generate and download a numbered PDF copy.",
  resultReadyTitle: "Numbered PDF ready",
  resultTitle: "Result",
  sansSerifFont: "Sans serif",
  selectedPagesCount: "{count} pages selected",
  selectedPdf: "Selected PDF",
  serifFont: "Serif",
  settingsDescription: "Pick pages and placement.",
  settingsTitle: "Numbering settings",
  startNumberLabel: "Start number",
  supportedFormats: "Supports local PDF files.",
  topCenterPosition: "Top center",
  topLeftPosition: "Top left",
  topRightPosition: "Top right",
  unsupportedFile: "Unsupported file type.",
  uploadDescription: "Choose a document.",
  uploadTitle: "Upload PDF",
  verticalMarginLabel: "Vertical margin",
}

const mockedInspectPdfBytes = vi.mocked(inspectPdfBytes)
const mockedAddPageNumbersToPdf = vi.mocked(addPageNumbersToPdf)

function getInput() {
  return screen.getByTestId("pdf-page-number-input") as HTMLInputElement
}

function createPdfFile(name = "report.pdf") {
  return new File([new Uint8Array([37, 80, 68, 70])], name, {
    type: "application/pdf",
  })
}

async function uploadPdf(name = "report.pdf", pageCount = 3) {
  mockedInspectPdfBytes.mockResolvedValueOnce({ pageCount })

  fireEvent.change(getInput(), {
    target: {
      files: [createPdfFile(name)],
    },
  })

  await screen.findByText(name)
}

beforeEach(() => {
  mockedInspectPdfBytes.mockReset()
  mockedAddPageNumbersToPdf.mockReset()
  mockedAddPageNumbersToPdf.mockResolvedValue(new Uint8Array([1, 2, 3, 4]))
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:numbered-pdf")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("PdfPageNumberAdderClient", () => {
  test("renders upload, settings, preview, and empty result states", () => {
    render(<PdfPageNumberAdderClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.settingsTitle)).toBeTruthy()
    expect(screen.getByText(messages.previewTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
    expect(
      screen
        .getByText(messages.uploadTitle)
        .compareDocumentPosition(screen.getByText(messages.settingsTitle)) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      screen
        .getByText(messages.settingsTitle)
        .compareDocumentPosition(screen.getByText(messages.previewTitle)) &
        Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)
  })

  test("uploads a PDF and generates numbered output for every page", async () => {
    render(<PdfPageNumberAdderClient messages={messages} />)
    await uploadPdf("packet.pdf", 3)

    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedAddPageNumbersToPdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedAddPageNumbersToPdf.mock.calls[0]?.[1]).toMatchObject({
      fontFamily: "serif",
      format: "number",
      pages: [1, 2, 3],
      position: "bottom-center",
      startNumber: 1,
    })
    expect(screen.getByText(messages.resultReadyTitle)).toBeTruthy()
    expect(
      screen.getByRole("link", { name: messages.downloadPdfLabel })
    ).toHaveProperty("download", "packet-numbered.pdf")
  })

  test("applies page range and numbering settings", async () => {
    render(<PdfPageNumberAdderClient messages={messages} />)
    await uploadPdf("draft.pdf", 5)

    fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
      target: { value: "2-3" },
    })
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.startNumberLabel }),
      {
        target: { value: "7" },
      }
    )
    fireEvent.click(screen.getByText(messages.numberTotalFormat))
    fireEvent.click(screen.getByText(messages.topRightPosition))
    fireEvent.click(screen.getByText(messages.sansSerifFont))
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.fontSizeLabel }),
      {
        target: { value: "18" },
      }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.horizontalMarginLabel }),
      {
        target: { value: "36" },
      }
    )
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.verticalMarginLabel }),
      {
        target: { value: "48" },
      }
    )
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )

    await waitFor(() => {
      expect(mockedAddPageNumbersToPdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedAddPageNumbersToPdf.mock.calls[0]?.[1]).toMatchObject({
      fontFamily: "sans-serif",
      fontSize: 18,
      format: "number-total",
      marginX: 36,
      marginY: 48,
      pages: [2, 3],
      position: "top-right",
      startNumber: 7,
    })
    expect(screen.getByText("2 pages selected")).toBeTruthy()
  })

  test("previews selected pages with lightweight page controls", async () => {
    render(<PdfPageNumberAdderClient messages={messages} />)
    await uploadPdf("preview.pdf", 5)

    expect(screen.getByText("Previewing page 1 of 5")).toBeTruthy()
    fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
      target: { value: "2-3" },
    })
    expect(screen.getByText("Previewing page 2 of 5")).toBeTruthy()

    const previousButton = screen.getByRole("button", {
      name: messages.previousPreviewPageLabel,
    })
    const nextButton = screen.getByRole("button", {
      name: messages.nextPreviewPageLabel,
    })
    expect(previousButton).toHaveProperty("disabled", true)

    await waitFor(() => {
      expect(nextButton).toHaveProperty("disabled", false)
    })
    fireEvent.click(nextButton)

    expect(screen.getByText("Previewing page 3 of 5")).toBeTruthy()
    expect(nextButton).toHaveProperty("disabled", true)
  })

  test("shows range, unsupported file, read, and generation errors", async () => {
    render(<PdfPageNumberAdderClient messages={messages} />)
    await uploadPdf("range.pdf", 2)

    fireEvent.change(screen.getByLabelText(messages.pageRangeLabel), {
      target: { value: "9" },
    })
    expect(screen.getByText(messages.rangeOutOfBounds)).toBeTruthy()

    fireEvent.change(getInput(), {
      target: {
        files: [new File(["text"], "notes.txt", { type: "text/plain" })],
      },
    })
    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()
    expect(screen.queryByText("range.pdf")).toBeNull()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)

    const encryptedError = new Error("encrypted")
    encryptedError.name = "EncryptedPDFError"
    mockedInspectPdfBytes.mockRejectedValueOnce(encryptedError)
    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile("secret.pdf")],
      },
    })
    expect(await screen.findByText(messages.encryptedPdfError)).toBeTruthy()

    await uploadPdf("bad-output.pdf", 1)
    mockedAddPageNumbersToPdf.mockRejectedValueOnce(new Error("write failed"))
    fireEvent.click(
      screen.getByRole("button", { name: messages.generateLabel })
    )
    expect(await screen.findByText("write failed")).toBeTruthy()
  })

  test("supports drop upload and file removal", async () => {
    mockedInspectPdfBytes.mockResolvedValueOnce({ pageCount: 1 })
    render(<PdfPageNumberAdderClient messages={messages} />)

    fireEvent.drop(screen.getByLabelText(messages.dragDropOrClick), {
      dataTransfer: {
        files: [createPdfFile("dropped.pdf")],
      },
    })

    expect(await screen.findByText("dropped.pdf")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: messages.removeFile }))
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
  })
})
