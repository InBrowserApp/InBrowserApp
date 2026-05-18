import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import PdfSplitterClient from "./client"
import messagesCatalog from "./messages/en.json"
import meta from "./meta/en.json"
import { inspectPdfFile } from "./core/pdf-document"
import { splitPdfWithWorker } from "./client/split-pdf-worker"

import type { PdfSplitterMessages } from "./client/types"

vi.mock("./core/pdf-document", async (importOriginal) => {
  const actual = await importOriginal<typeof import("./core/pdf-document")>()

  return {
    ...actual,
    inspectPdfFile: vi.fn(),
  }
})

vi.mock("./client/split-pdf-worker", () => ({
  splitPdfWithWorker: vi.fn(),
}))

vi.mock("./client/use-pdf-page-previews", () => ({
  usePdfPagePreviews: () => ({}),
}))

const messages: PdfSplitterMessages = {
  meta,
  ...messagesCatalog,
}

function renderClient() {
  render(<PdfSplitterClient messages={messages} />)
}

function getInput() {
  return screen.getByTestId("pdf-splitter-input") as HTMLInputElement
}

beforeEach(() => {
  vi.mocked(inspectPdfFile).mockReset()
  vi.mocked(splitPdfWithWorker).mockReset()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf-splitter-result")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("PdfSplitterClient", () => {
  it("renders upload and empty states", () => {
    renderClient()

    expect(screen.getByText(messages.dragDropOrClick)).toBeTruthy()
    expect(screen.getByText(messages.noFileTitle)).toBeTruthy()
  })

  it("rejects unsupported files before inspection", () => {
    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["text"], "notes.txt", { type: "text/plain" })],
      },
    })

    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()
    expect(inspectPdfFile).not.toHaveBeenCalled()
  })

  it("loads a PDF and supports range and tile selection", async () => {
    vi.mocked(inspectPdfFile).mockResolvedValue({ pageCount: 4 })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "sample.pdf", { type: "application/pdf" })],
      },
    })

    expect(await screen.findByText("sample.pdf")).toBeTruthy()
    expect(screen.getAllByText("4 / 4 pages selected").length).toBeGreaterThan(
      0
    )

    fireEvent.change(screen.getByLabelText(messages.rangeLabel), {
      target: { value: "2-3" },
    })
    expect(screen.getAllByText("2 / 4 pages selected").length).toBeGreaterThan(
      0
    )

    fireEvent.click(screen.getByLabelText("Toggle page 4"), {
      shiftKey: true,
    })
    expect(screen.getAllByText("3 / 4 pages selected").length).toBeGreaterThan(
      0
    )

    fireEvent.change(screen.getByLabelText(messages.rangeLabel), {
      target: { value: "5" },
    })
    expect(screen.getByText(messages.rangeOutOfBounds)).toBeTruthy()
  })

  it("generates one selected PDF for download", async () => {
    vi.mocked(inspectPdfFile).mockResolvedValue({ pageCount: 2 })
    vi.mocked(splitPdfWithWorker).mockResolvedValue({
      ok: true,
      result: [
        { bytes: new Uint8Array([1, 2, 3]), name: "sample-selected.pdf" },
      ],
    })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "sample.pdf", { type: "application/pdf" })],
      },
    })

    await screen.findByText("sample.pdf")
    fireEvent.click(screen.getByText(messages.generate))

    await waitFor(() => {
      expect(splitPdfWithWorker).toHaveBeenCalledWith(
        expect.objectContaining({
          outputBaseName: "sample-selected",
          outputMode: "single",
          pages: [1, 2],
          segments: [[1, 2]],
        })
      )
    })

    const downloadLink = await screen.findByText(messages.downloadPdf)
    expect(downloadLink.closest("a")?.getAttribute("download")).toBe(
      "sample-selected.pdf"
    )
    expect(downloadLink.closest("a")?.getAttribute("href")).toBe(
      "blob:pdf-splitter-result"
    )
  })

  it("generates a ZIP when multiple PDF output is selected", async () => {
    vi.mocked(inspectPdfFile).mockResolvedValue({ pageCount: 3 })
    vi.mocked(splitPdfWithWorker).mockResolvedValue({
      ok: true,
      result: [
        { bytes: new Uint8Array([1]), name: "sample-split-page-01.pdf" },
        { bytes: new Uint8Array([2]), name: "sample-split-page-03.pdf" },
      ],
    })

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "sample.pdf", { type: "application/pdf" })],
      },
    })

    await screen.findByText("sample.pdf")
    fireEvent.click(screen.getByText(messages.modeMultiple))
    fireEvent.click(screen.getByText(messages.strategyPages))
    fireEvent.change(screen.getByLabelText(messages.rangeLabel), {
      target: { value: "1,3" },
    })
    fireEvent.click(screen.getByText(messages.generate))

    await waitFor(() => {
      expect(splitPdfWithWorker).toHaveBeenCalledWith(
        expect.objectContaining({
          multipleMode: "pages",
          outputBaseName: "sample-split",
          outputMode: "multiple",
          pages: [1, 3],
          segments: [[1], [3]],
        })
      )
    })

    const downloadLink = await screen.findByText(messages.downloadZip)
    expect(downloadLink.closest("a")?.getAttribute("download")).toBe(
      "sample-split.zip"
    )
  })

  it("surfaces inspection and generation errors", async () => {
    vi.mocked(inspectPdfFile).mockRejectedValueOnce(new Error("invalid-pdf"))

    renderClient()
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "bad.pdf", { type: "application/pdf" })],
      },
    })
    expect(await screen.findByText(messages.invalidPdf)).toBeTruthy()

    vi.mocked(inspectPdfFile).mockResolvedValue({ pageCount: 1 })
    vi.mocked(splitPdfWithWorker).mockResolvedValue({
      code: "worker-not-supported",
      ok: false,
    })
    fireEvent.change(getInput(), {
      target: {
        files: [new File(["pdf"], "sample.pdf", { type: "application/pdf" })],
      },
    })
    await screen.findByText("sample.pdf")
    fireEvent.click(screen.getByText(messages.generate))
    expect(await screen.findByText(messages.workerUnsupported)).toBeTruthy()
  })
})
