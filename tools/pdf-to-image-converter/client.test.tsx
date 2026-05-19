import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PdfToImageClient from "./client"

import type { PdfToImageMessages } from "./client/types"

const rendererMocks = vi.hoisted(() => ({
  destroy: vi.fn(),
  getNumPages: vi.fn(),
  renderPage: vi.fn(),
}))

vi.mock("./client/pdf-renderer", () => ({
  PdfToImageRenderer: class PdfToImageRendererMock {
    destroy = rendererMocks.destroy
    getNumPages = rendererMocks.getNumPages
    renderPage = rendererMocks.renderPage
  },
}))

const messages: PdfToImageMessages = {
  addPdfLabel: "Add PDF",
  canvasExportFailedError: "Canvas export failed.",
  canvasUnavailableError: "Canvas unavailable.",
  changePdfLabel: "Change PDF",
  downloadCurrentLabel: "Download page",
  downloadZipLabel: "Download ZIP",
  dpiDescription: "Higher DPI creates larger images.",
  dpiLabel: "DPI",
  dpiPresetLabel: "DPI presets",
  emptyPreviewDescription: "Upload a PDF to preview pages.",
  emptyPreviewTitle: "No PDF selected",
  errorTitle: "PDF conversion issue",
  exportAllLabel: "Export all pages",
  exportFailedError: "Export failed.",
  exportProgressLabel: "Export progress",
  exportingAllLabel: "Exporting pages...",
  fileSizeLabel: "File size",
  imageDetails: "{width} x {height}px - {dpi} DPI - {size}",
  invalidPdfError: "Invalid PDF.",
  jpegFormat: "JPG",
  loadFailedError: "Load failed.",
  loadingDocumentLabel: "Loading PDF pages...",
  localOnlyNote: "Runs locally. No uploads.",
  meta: {
    description: "Convert PDF pages to images.",
    name: "PDF to Image Converter",
  },
  outputFormatLabel: "Output format",
  pageCountLabel: "Pages",
  pageInputLabel: "Page number",
  pageLabel: "Page",
  pageSummary: "Page {page} / {total}",
  pngFormat: "PNG",
  previewAlt: "Rendered preview for page {page}",
  previewDescription: "Review the selected page.",
  previewTitle: "Preview",
  qualityDescription: "Controls compression.",
  qualityLabel: "Quality",
  removePdfLabel: "Remove PDF",
  renderFailedError: "Render failed.",
  renderingPreviewDescription: "Preparing page.",
  renderingPreviewTitle: "Rendering preview",
  selectedPdfTitle: "Selected PDF",
  settingsDescription: "Pick output settings.",
  settingsTitle: "Export settings",
  supportedFormatsLabel: "Supports PDF files.",
  unsupportedFileError: "Choose a PDF file.",
  uploadDescription: "Choose a PDF.",
  uploadTitle: "Upload PDF",
  webpFormat: "WebP",
}

function createPdfFile(name = "sample.pdf") {
  return new File(["%PDF"], name, { type: "application/pdf" })
}

function createPageBlob(page: number) {
  return new Blob([`page-${page}`], { type: "image/png" })
}

function getInput(): HTMLInputElement {
  return screen.getByTestId("pdf-to-image-input") as HTMLInputElement
}

beforeEach(() => {
  rendererMocks.destroy.mockReset()
  rendererMocks.getNumPages.mockReset()
  rendererMocks.getNumPages.mockResolvedValue(2)
  rendererMocks.renderPage.mockReset()
  rendererMocks.renderPage.mockImplementation((page: number, options) =>
    Promise.resolve({
      ...options,
      blob: createPageBlob(page),
      height: 200,
      page,
      width: 100,
    })
  )

  let urlCounter = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `blob:pdf-page-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("PdfToImageClient", () => {
  test("renders initial upload, settings, and preview states", () => {
    render(<PdfToImageClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.settingsTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyPreviewTitle)).toBeTruthy()
    const downloadButton = screen.getByRole("button", {
      name: messages.downloadCurrentLabel,
    })

    expect(downloadButton).toHaveProperty("disabled", true)
    expect(downloadButton.firstElementChild?.tagName.toLowerCase()).toBe("svg")
    expect(downloadButton.textContent).toContain(messages.downloadCurrentLabel)
  })

  test("loads a PDF and exposes current page download", async () => {
    render(<PdfToImageClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile()],
      },
    })

    await screen.findByText("sample.pdf")
    await screen.findByAltText("Rendered preview for page 1")

    expect(rendererMocks.getNumPages).toHaveBeenCalledTimes(1)
    expect(rendererMocks.renderPage).toHaveBeenCalledWith(
      1,
      expect.objectContaining({ dpi: 144, format: "png" })
    )
    expect(
      screen
        .getByRole("link", { name: messages.downloadCurrentLabel })
        .getAttribute("download")
    ).toBe("sample-p1.png")
  })

  test("updates page and DPI controls before rendering", async () => {
    render(<PdfToImageClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile()],
      },
    })

    await screen.findByAltText("Rendered preview for page 1")
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.dpiLabel }),
      {
        target: { value: "300" },
      }
    )

    await waitFor(() => {
      expect(rendererMocks.renderPage).toHaveBeenCalledWith(
        1,
        expect.objectContaining({ dpi: 300 })
      )
    })

    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.pageInputLabel }),
      {
        target: { value: "2" },
      }
    )

    await waitFor(() => {
      expect(rendererMocks.renderPage).toHaveBeenCalledWith(
        2,
        expect.objectContaining({ dpi: 300 })
      )
    })
  })

  test("clears stale downloads while a new preview is rendering", async () => {
    rendererMocks.renderPage.mockImplementation(
      (page: number, options) =>
        new Promise((resolve) => {
          setTimeout(
            () => {
              resolve({
                ...options,
                blob: createPageBlob(page),
                height: 200,
                page,
                width: 100,
              })
            },
            page === 2 ? 20 : 0
          )
        })
    )
    render(<PdfToImageClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile()],
      },
    })

    await screen.findByAltText("Rendered preview for page 1")
    fireEvent.change(
      screen.getByRole("spinbutton", { name: messages.pageInputLabel }),
      {
        target: { value: "2" },
      }
    )

    expect(
      screen.getByRole("button", { name: messages.downloadCurrentLabel })
    ).toHaveProperty("disabled", true)

    await screen.findByAltText("Rendered preview for page 2")
    expect(
      screen
        .getByRole("link", { name: messages.downloadCurrentLabel })
        .getAttribute("download")
    ).toBe("sample-p2.png")
  })

  test("exports all pages into a ZIP download", async () => {
    render(<PdfToImageClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile()],
      },
    })

    await screen.findByAltText("Rendered preview for page 1")
    fireEvent.click(
      screen.getByRole("button", { name: messages.exportAllLabel })
    )

    await screen.findByRole("link", { name: messages.downloadZipLabel })
    expect(
      screen
        .getByRole("link", { name: messages.downloadZipLabel })
        .getAttribute("download")
    ).toBe("sample-144dpi-png-images.zip")
  })

  test("shows unsupported, load, and render error states", async () => {
    render(<PdfToImageClient messages={messages} />)

    fireEvent.change(getInput(), {
      target: {
        files: [new File(["text"], "notes.txt", { type: "text/plain" })],
      },
    })
    expect(screen.getByText(messages.unsupportedFileError)).toBeTruthy()

    rendererMocks.getNumPages.mockRejectedValueOnce(new Error("invalid pdf"))
    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile("bad.pdf")],
      },
    })
    expect(await screen.findByText(messages.invalidPdfError)).toBeTruthy()

    rendererMocks.getNumPages.mockResolvedValueOnce(1)
    rendererMocks.renderPage.mockRejectedValueOnce(
      new Error("CANVAS_CONTEXT_UNAVAILABLE")
    )
    fireEvent.change(getInput(), {
      target: {
        files: [createPdfFile("canvas.pdf")],
      },
    })
    expect(
      await screen.findByText(messages.canvasUnavailableError)
    ).toBeTruthy()
  })
})
