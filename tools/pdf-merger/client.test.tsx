import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import PdfMergerClient from "./client"
import { mergePdfFilesWithWorker } from "./client/pdf-merge-worker"
import { QueueCard } from "./components/queue-card"
import { UploadCard } from "./components/upload-card"
import type { PdfMergerMessages } from "./client/types"
import { inspectPdfFile } from "./core/pdf-merger"

vi.mock("./core/pdf-merger", async () => {
  const actual =
    await vi.importActual<typeof import("./core/pdf-merger")>(
      "./core/pdf-merger"
    )

  return {
    ...actual,
    inspectPdfFile: vi.fn(),
  }
})

vi.mock("./client/pdf-merge-worker", async () => {
  const actual = await vi.importActual<
    typeof import("./client/pdf-merge-worker")
  >("./client/pdf-merge-worker")

  return {
    ...actual,
    mergePdfFilesWithWorker: vi.fn(),
  }
})

const mockedInspectPdfFile = vi.mocked(inspectPdfFile)
const mockedMergePdfFilesWithWorker = vi.mocked(mergePdfFilesWithWorker)

const messages: PdfMergerMessages = {
  addFilesLabel: "Add PDF files",
  changeFilesLabel: "Choose files",
  clearAllLabel: "Clear all",
  closePreviewLabel: "Close preview",
  downloadPdfLabel: "Download merged PDF",
  duplicateFileError: "That PDF is already in the merge queue.",
  emptyQueueDescription: "Add at least two PDF files.",
  emptyQueueTitle: "No PDFs in the queue",
  emptyResultDescription: "The merged file will appear here.",
  emptyResultTitle: "No merged PDF yet",
  encryptedPdfError: "Encrypted PDFs cannot be merged here.",
  errorTitle: "Unable to merge PDFs",
  fileCountLabel: "Files",
  fileSizeLabel: "Input size",
  invalidPdfError: "One or more files are not valid PDFs.",
  localOnlyNote: "Files stay in this browser session.",
  mergeFailedError: "The PDFs could not be merged.",
  mergeLabel: "Merge PDFs",
  mergingLabel: "Merging PDFs…",
  meta: {
    description: "Merge PDFs in your browser.",
    name: "PDF Merger",
  },
  moveDownLabel: "Move down",
  moveUpLabel: "Move up",
  noFilesError: "Add at least two valid PDF files before merging.",
  outputFileDescription: "The .pdf extension is added automatically.",
  outputFileLabel: "Output filename",
  outputFilePlaceholder: "merged.pdf",
  outputSizeLabel: "Output size",
  pageCountLabel: "Pages",
  pageStatusLabel: "{count} page",
  pagesStatusLabel: "{count} pages",
  previewLabel: "Preview",
  previewTitle: "Preview: {name}",
  processingStatusLabel: "Preparing {completed} of {total} files",
  queueDescription: "Control the merge order.",
  queueTitle: "Merge queue",
  readingPdfLabel: "Reading pages…",
  readyStatusLabel: "Ready",
  removeFileLabel: "Remove file",
  resultDescription: "Download the combined PDF.",
  resultReadyTitle: "Merged PDF ready",
  resultTitle: "Result",
  summaryTitle: "Merge summary",
  supportedFormatsLabel: "Supports PDF files only.",
  uploadDescription: "Drop multiple PDFs.",
  uploadTitle: "Upload PDFs",
  workerUnavailableError: "This browser cannot run the background PDF worker.",
}

function createPdfFile(name: string, type = "application/pdf") {
  return new File([new Uint8Array([37, 80, 68, 70])], name, {
    lastModified: 1,
    type,
  })
}

function getFileInput() {
  return screen.getByTestId("pdf-merger-input") as HTMLInputElement
}

beforeEach(() => {
  mockedInspectPdfFile.mockReset()
  mockedInspectPdfFile.mockResolvedValue({ pageCount: 2 })
  mockedMergePdfFilesWithWorker.mockReset()
  mockedMergePdfFilesWithWorker.mockImplementation(async (options) => {
    options.onProgress?.({ completed: 1, total: options.files.length })

    return {
      blob: new Blob([new Uint8Array([37, 80, 68, 70])], {
        type: "application/pdf",
      }),
      fileName: `${options.outputName.replace(/\\.pdf$/i, "")}.pdf`,
      pageCount: options.pageCount,
    }
  })

  let urlCounter = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    () => `about:blank#pdf-${++urlCounter}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

describe("PdfMergerClient", () => {
  test("renders initial upload, queue, action, and result states", () => {
    render(<PdfMergerClient messages={messages} />)

    expect(screen.getByText(messages.uploadTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyQueueTitle)).toBeTruthy()
    expect(screen.getByText(messages.summaryTitle)).toBeTruthy()
    expect(screen.getByText(messages.emptyResultTitle)).toBeTruthy()
    expect(
      screen.getByRole("button", { name: messages.mergeLabel })
    ).toHaveProperty("disabled", true)
  })

  test("adds PDFs, reorders them, and creates a downloadable merge", async () => {
    render(<PdfMergerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createPdfFile("first.pdf"), createPdfFile("second.pdf")],
      },
    })

    await screen.findByText("first.pdf")
    await screen.findByText("second.pdf")
    await waitFor(() => {
      expect(screen.getAllByText(/2 pages/)).toHaveLength(2)
    })

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.moveUpLabel}: second.pdf`,
      })
    )
    fireEvent.change(
      screen.getByRole("textbox", { name: messages.outputFileLabel }),
      {
        target: { value: "combined-report" },
      }
    )
    fireEvent.click(screen.getByRole("button", { name: messages.mergeLabel }))

    const downloadLink = await screen.findByRole("link", {
      name: messages.downloadPdfLabel,
    })

    expect(mockedMergePdfFilesWithWorker).toHaveBeenCalledTimes(1)
    expect(
      mockedMergePdfFilesWithWorker.mock.calls[0]?.[0].files[0]?.name
    ).toBe("second.pdf")
    expect(screen.getByText(messages.resultReadyTitle)).toBeTruthy()
    expect(downloadLink.getAttribute("download")).toBe("combined-report.pdf")
  })

  test("adds files from drop and paste interactions", async () => {
    render(<PdfMergerClient messages={messages} />)

    fireEvent.drop(screen.getByLabelText(messages.addFilesLabel), {
      dataTransfer: {
        files: [createPdfFile("dropped.pdf")],
      },
    })

    await screen.findByText("dropped.pdf")

    fireEvent.paste(window, {
      clipboardData: {
        files: [createPdfFile("pasted.pdf")],
      },
    })

    await screen.findByText("pasted.pdf")
    expect(mockedInspectPdfFile).toHaveBeenCalledTimes(2)
  })

  test("shows validation errors for duplicate, invalid, and encrypted files", async () => {
    render(<PdfMergerClient messages={messages} />)

    const file = createPdfFile("scan.pdf")
    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })
    await screen.findByText("scan.pdf")

    fireEvent.change(getFileInput(), {
      target: { files: [file] },
    })
    await screen.findByText(messages.duplicateFileError)

    fireEvent.change(getFileInput(), {
      target: { files: [createPdfFile("notes.txt", "text/plain")] },
    })
    await screen.findByText(messages.invalidPdfError)

    mockedInspectPdfFile.mockRejectedValueOnce(new Error("encrypted-pdf"))
    fireEvent.change(getFileInput(), {
      target: { files: [createPdfFile("locked.pdf")] },
    })
    await screen.findByText("locked.pdf")
    await screen.findByText((content) =>
      content.includes(messages.encryptedPdfError)
    )
  })

  test("previews, removes, and clears queued PDFs", async () => {
    render(<PdfMergerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createPdfFile("first.pdf"), createPdfFile("second.pdf")],
      },
    })

    await screen.findByText("first.pdf")
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.previewLabel}: first.pdf`,
      })
    )
    expect(screen.getByTitle("first.pdf")).toBeTruthy()
    fireEvent.click(
      screen.getByRole("button", { name: messages.closePreviewLabel })
    )

    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.removeFileLabel}: first.pdf`,
      })
    )
    expect(screen.queryByText("first.pdf")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("about:blank#pdf-1")

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )
    expect(screen.queryByText("second.pdf")).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("about:blank#pdf-2")
  })

  test("maps merge failures to visible errors", async () => {
    mockedMergePdfFilesWithWorker.mockRejectedValueOnce(
      new Error("worker-unavailable")
    )

    render(<PdfMergerClient messages={messages} />)

    fireEvent.change(getFileInput(), {
      target: {
        files: [createPdfFile("first.pdf"), createPdfFile("second.pdf")],
      },
    })

    await screen.findByText("second.pdf")
    fireEvent.click(screen.getByRole("button", { name: messages.mergeLabel }))

    await screen.findByText(messages.workerUnavailableError)
  })

  test("handles direct upload card interactions", () => {
    const onFilesSelected = vi.fn()
    const inputClickSpy = vi
      .spyOn(HTMLInputElement.prototype, "click")
      .mockImplementation(() => {})

    render(
      <UploadCard
        disabled={false}
        inputId="direct-pdf-upload"
        messages={messages}
        onFilesSelected={onFilesSelected}
      />
    )

    const dataTransfer = {
      dropEffect: "none",
      files: [createPdfFile("dragged.pdf")],
    }

    fireEvent.dragOver(screen.getByLabelText(messages.addFilesLabel), {
      dataTransfer,
    })
    fireEvent.dragLeave(screen.getByLabelText(messages.addFilesLabel))
    fireEvent.drop(screen.getByLabelText(messages.addFilesLabel), {
      dataTransfer,
    })
    fireEvent.change(screen.getByTestId("pdf-merger-input"), {
      target: { files: [createPdfFile("picked.pdf")] },
    })
    fireEvent.click(
      screen.getByRole("button", { name: messages.changeFilesLabel })
    )

    expect(onFilesSelected).toHaveBeenCalledWith([
      expect.objectContaining({ name: "dragged.pdf" }),
    ])
    expect(onFilesSelected).toHaveBeenCalledWith([
      expect.objectContaining({ name: "picked.pdf" }),
    ])
    expect(inputClickSpy).toHaveBeenCalled()
  })

  test("ignores disabled upload card drag and drop", () => {
    const onFilesSelected = vi.fn()

    render(
      <UploadCard
        disabled={true}
        inputId="disabled-pdf-upload"
        messages={messages}
        onFilesSelected={onFilesSelected}
      />
    )

    fireEvent.dragOver(screen.getByLabelText(messages.addFilesLabel), {
      dataTransfer: { dropEffect: "none", files: [] },
    })
    fireEvent.drop(screen.getByLabelText(messages.addFilesLabel), {
      dataTransfer: {
        files: [createPdfFile("ignored.pdf")],
      },
    })

    expect(onFilesSelected).not.toHaveBeenCalled()
  })

  test("handles direct queue card actions and drag ordering", () => {
    const readyItem = {
      errorCode: null,
      file: createPdfFile("ready.pdf"),
      id: "ready",
      name: "ready.pdf",
      pageCount: 4,
      previewUrl: "about:blank#ready",
      size: 2048,
      status: "ready" as const,
    }
    const readingItem = {
      ...readyItem,
      id: "reading",
      name: "reading.pdf",
      pageCount: null,
      status: "reading" as const,
    }
    const encryptedItem = {
      ...readyItem,
      errorCode: "encrypted-pdf" as const,
      id: "encrypted",
      name: "encrypted.pdf",
      pageCount: null,
      status: "error" as const,
    }

    const onClear = vi.fn()
    const onMoveDown = vi.fn()
    const onMoveUp = vi.fn()
    const onPreview = vi.fn()
    const onRemove = vi.fn()
    const onReorder = vi.fn()

    render(
      <QueueCard
        disabled={false}
        inputSizeLabel="2 KB"
        items={[readyItem, readingItem, encryptedItem]}
        messages={messages}
        onClear={onClear}
        onMoveDown={onMoveDown}
        onMoveUp={onMoveUp}
        onPreview={onPreview}
        onRemove={onRemove}
        onReorder={onReorder}
        readyPageCount={4}
      />
    )

    expect(
      screen.getByText((content) => content.includes(messages.readingPdfLabel))
    ).toBeTruthy()
    expect(
      screen.getByText((content) =>
        content.includes(messages.encryptedPdfError)
      )
    ).toBeTruthy()

    fireEvent.click(
      screen.getByRole("button", { name: messages.clearAllLabel })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.moveDownLabel}: ready.pdf`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.moveUpLabel}: reading.pdf`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.previewLabel}: ready.pdf`,
      })
    )
    fireEvent.click(
      screen.getByRole("button", {
        name: `${messages.removeFileLabel}: ready.pdf`,
      })
    )

    const readyRow = screen.getByText("ready.pdf").closest("li")!
    const readingRow = screen.getByText("reading.pdf").closest("li")!
    fireEvent.dragStart(readyRow, {
      dataTransfer: { effectAllowed: "copy" },
    })
    fireEvent.dragOver(readingRow, {
      dataTransfer: { dropEffect: "none" },
    })
    fireEvent.drop(readingRow, {
      dataTransfer: { dropEffect: "none" },
    })
    fireEvent.dragEnd(readyRow)

    expect(onClear).toHaveBeenCalled()
    expect(onMoveDown).toHaveBeenCalledWith(0)
    expect(onMoveUp).toHaveBeenCalledWith(1)
    expect(onPreview).toHaveBeenCalledWith("ready")
    expect(onRemove).toHaveBeenCalledWith("ready")
    expect(onReorder).toHaveBeenCalledWith(0, 1)
  })
})
