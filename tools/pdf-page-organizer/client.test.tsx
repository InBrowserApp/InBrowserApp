import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PdfPageOrganizerClient from "./client"
import { renderPdfPagePreviews } from "./client/pdf-preview"
import { inspectPdf, organizePdf } from "./core/pdf-page-organizer"

import type { PdfPageOrganizerMessages } from "./client/types"

vi.mock("./core/pdf-page-organizer", async () => {
  const actual = await vi.importActual<
    typeof import("./core/pdf-page-organizer")
  >("./core/pdf-page-organizer")

  return {
    ...actual,
    inspectPdf: vi.fn(),
    organizePdf: vi.fn(),
  }
})

vi.mock("./client/pdf-preview", () => ({
  renderPdfPagePreviews: vi.fn(),
}))

const mockedInspectPdf = vi.mocked(inspectPdf)
const mockedOrganizePdf = vi.mocked(organizePdf)
const mockedRenderPdfPagePreviews = vi.mocked(renderPdfPagePreviews)
const originalElementFromPoint = document.elementFromPoint

const messages: PdfPageOrganizerMessages = {
  addPdfLabel: "Add PDF",
  changePdfLabel: "Change PDF",
  dragPageLabel: "Drag page",
  dragPagesHint:
    "Drag page previews to reorder them. Move buttons remain available for keyboard control.",
  downloadPdfLabel: "Download PDF",
  emptyPagesDescription: "Upload a PDF to review and organize its pages.",
  emptyPagesTitle: "No pages loaded",
  emptyResultDescription: "Organize the pages, then generate a PDF.",
  emptyResultTitle: "No export yet",
  encryptedPdfError: "Encrypted PDFs are not supported.",
  errorTitle: "Unable to organize PDF",
  exportDescription: "Generate a new PDF from the current page order.",
  exportFailedError: "The organized PDF could not be generated.",
  exportTitle: "Export",
  fileSizeLabel: "File size",
  generateLabel: "Generate PDF",
  generatingLabel: "Generating PDF…",
  invalidPdfError: "This PDF could not be read.",
  invalidPdfTypeError: "Choose a PDF file.",
  localOnlyNote: "Your PDF stays in this browser session.",
  meta: {
    description: "Reorder PDF pages.",
    name: "PDF Page Organizer",
  },
  moveDownLabel: "Move down",
  moveUpLabel: "Move up",
  noPagesError: "Keep at least one page before generating a PDF.",
  outputFileLabel: "Output file",
  outputPagesLabel: "Output pages",
  outputSizeLabel: "Output size",
  pageCountLabel: "Pages",
  pageSizeLabel: "Page size",
  pagesDescription: "Move pages, rotate them, or remove pages.",
  pagesTitle: "Page order",
  previewAltLabel: "Preview of source page",
  previewUnavailableLabel: "Preview unavailable",
  readingPdfLabel: "Reading PDF…",
  removePageLabel: "Remove page",
  renderingPreviewsLabel: "Rendering previews…",
  resetPagesLabel: "Reset pages",
  resultReadyTitle: "Organized PDF ready",
  rotateClockwiseLabel: "Rotate clockwise",
  rotationLabel: "Rotation",
  selectedFileLabel: "Selected PDF",
  sourcePageLabel: "Source page",
  supportedFormatsLabel: "Supports PDF files only.",
  uploadDescription: "Choose the PDF whose page order you want to edit.",
  uploadTitle: "Upload PDF",
}

function createPdfFile(name = "packet.pdf", type = "application/pdf") {
  return new File([new Uint8Array([37, 80, 68, 70])], name, { type })
}

function getFileInput(): HTMLInputElement {
  return screen.getByTestId("pdf-page-organizer-input") as HTMLInputElement
}

async function getEnabledGenerateButton() {
  const button = screen.getByRole("button", { name: messages.generateLabel })

  await waitFor(() => {
    expect(button).toHaveProperty("disabled", false)
  })

  return button
}

beforeEach(() => {
  mockedInspectPdf.mockReset()
  mockedInspectPdf.mockResolvedValue({
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
  mockedOrganizePdf.mockReset()
  mockedOrganizePdf.mockResolvedValue({
    bytes: new Uint8Array([37, 80, 68, 70]),
    fileName: "packet-organized.pdf",
    pageCount: 3,
  })
  mockedRenderPdfPagePreviews.mockReset()
  mockedRenderPdfPagePreviews.mockResolvedValue([
    {
      dataUrl: "data:image/jpeg;base64,page-1",
      height: 160,
      pageNumber: 1,
      width: 96,
    },
    {
      dataUrl: "data:image/jpeg;base64,page-2",
      height: 144,
      pageNumber: 2,
      width: 112,
    },
    {
      dataUrl: "data:image/jpeg;base64,page-3",
      height: 120,
      pageNumber: 3,
      width: 120,
    },
  ])
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:organized")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  Object.defineProperty(document, "elementFromPoint", {
    configurable: true,
    value: originalElementFromPoint,
  })
  vi.restoreAllMocks()
})

describe("PdfPageOrganizerClient", () => {
  test("renders the initial upload, page list, and export states", () => {
    render(<PdfPageOrganizerClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyPagesTitle)).toBeTruthy()
    expect(screen.getByText(messages.exportTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.generateLabel })
    ).toHaveProperty("disabled", true)
  })

  test("loads a PDF and exports the current page plan", async () => {
    const file = createPdfFile()
    render(<PdfPageOrganizerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("packet.pdf")
    expect(screen.queryByText(messages.uploadTitle)).toBeNull()
    expect(screen.getByText(messages.selectedFileLabel)).toBeTruthy()
    expect(
      await screen.findByAltText(`${messages.previewAltLabel} 1`)
    ).toBeTruthy()
    fireEvent.click(await getEnabledGenerateButton())

    await waitFor(() => {
      expect(mockedOrganizePdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedOrganizePdf).toHaveBeenCalledWith(file, [
      expect.objectContaining({ rotation: 0, sourcePageNumber: 1 }),
      expect.objectContaining({ rotation: 90, sourcePageNumber: 2 }),
      expect.objectContaining({ rotation: 0, sourcePageNumber: 3 }),
    ])
    expect(screen.getByText(messages.resultReadyTitle)).toBeTruthy()
    expect(
      (
        await screen.findByRole("link", {
          name: messages.downloadPdfLabel,
        })
      ).getAttribute("download")
    ).toBe("packet-organized.pdf")
  })

  test("moves, rotates, removes, and resets pages before export", async () => {
    const file = createPdfFile()
    render(<PdfPageOrganizerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    await screen.findByText("packet.pdf")
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.moveUpLabel}: ${messages.sourcePageLabel} 3`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.rotateClockwiseLabel}: ${messages.sourcePageLabel} 3`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.removePageLabel}: ${messages.sourcePageLabel} 2`,
      })
    )
    fireEvent.click(await getEnabledGenerateButton())

    await waitFor(() => {
      expect(mockedOrganizePdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedOrganizePdf.mock.calls[0]?.[1]).toMatchObject([
      { rotation: 0, sourcePageNumber: 1 },
      { rotation: 90, sourcePageNumber: 3 },
    ])

    fireEvent.click(
      screen.getByRole("button", { name: messages.resetPagesLabel })
    )
    fireEvent.click(await getEnabledGenerateButton())

    await waitFor(() => {
      expect(mockedOrganizePdf).toHaveBeenCalledTimes(2)
    })

    expect(mockedOrganizePdf.mock.calls[1]?.[1]).toMatchObject([
      { rotation: 0, sourcePageNumber: 1 },
      { rotation: 90, sourcePageNumber: 2 },
      { rotation: 0, sourcePageNumber: 3 },
    ])
  })

  test("reorders pages by dragging the page handle", async () => {
    const file = createPdfFile()
    render(<PdfPageOrganizerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })

    const pageOneHandle = await screen.findByRole("button", {
      name: `${messages.dragPageLabel}: ${messages.sourcePageLabel} 1`,
    })
    const pageThree = screen.getByLabelText(
      `${messages.outputPagesLabel} 3. ${messages.sourcePageLabel} 3`
    )

    Object.defineProperty(document, "elementFromPoint", {
      configurable: true,
      value: vi.fn(() => pageThree),
    })

    fireEvent.pointerDown(pageOneHandle, {
      buttons: 1,
      clientX: 10,
      clientY: 10,
      pointerId: 1,
    })
    fireEvent.pointerMove(pageOneHandle, {
      buttons: 1,
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    })
    fireEvent.pointerUp(pageOneHandle, {
      clientX: 20,
      clientY: 20,
      pointerId: 1,
    })
    expect(
      screen.getByText(
        `${messages.sourcePageLabel} 1. ${messages.outputPagesLabel} 3/3.`
      )
    ).toBeTruthy()
    fireEvent.click(await getEnabledGenerateButton())

    await waitFor(() => {
      expect(mockedOrganizePdf).toHaveBeenCalledTimes(1)
    })

    expect(mockedOrganizePdf.mock.calls[0]?.[1]).toMatchObject([
      { sourcePageNumber: 2 },
      { sourcePageNumber: 3 },
      { sourcePageNumber: 1 },
    ])
  })

  test("supports drag and drop uploads", async () => {
    render(<PdfPageOrganizerClient messages={messages} />)

    fireEvent.drop(screen.getByLabelText(messages.addPdfLabel), {
      dataTransfer: {
        files: [createPdfFile("dropped.pdf")],
      },
    })

    await screen.findByText("dropped.pdf")
    expect(mockedInspectPdf).toHaveBeenCalledTimes(1)
  })

  test("shows validation and generation errors", async () => {
    render(<PdfPageOrganizerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: { files: [createPdfFile("notes.txt", "text/plain")] },
    })
    await screen.findByText(messages.invalidPdfTypeError)

    mockedInspectPdf.mockRejectedValueOnce(new Error("ENCRYPTED_PDF"))
    fireEvent.change(getFileInput(), {
      target: { files: [createPdfFile("secret.pdf")] },
    })
    await screen.findByText(messages.encryptedPdfError)

    mockedOrganizePdf.mockRejectedValueOnce(new Error("EXPORT_FAILED"))
    fireEvent.change(getFileInput(), {
      target: { files: [createPdfFile("ready.pdf")] },
    })
    await screen.findByText("ready.pdf")
    fireEvent.click(await getEnabledGenerateButton())
    await screen.findByText(messages.exportFailedError)
  })
})
