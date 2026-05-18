import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"

import RemovePdfOwnerPasswordClient from "./client"

import type { RemovePdfOwnerPasswordMessages } from "./client/types"

const removePdfOwnerPasswordWithWorker = vi.fn()

vi.mock("./workers/remove-owner-password-worker-client", () => ({
  removePdfOwnerPasswordWithWorker: (...args: unknown[]) =>
    removePdfOwnerPasswordWithWorker(...args),
}))

const messages = {
  actionDescription:
    "Runs qpdf in a browser worker and writes a new PDF with permission restrictions removed.",
  actionLabel: "Remove owner password",
  changeFile: "Change file",
  description: "Remove restrictions.",
  downloadPdfLabel: "Download PDF",
  dragDropOrClick: "Drag and drop a PDF here, or click to upload",
  emptyFileError: "The selected PDF is empty.",
  errorTitle: "Unable to process PDF",
  fileNameLabel: "File name",
  fileSizeLabel: "File size",
  genericError: "PDF processing failed. Try another file.",
  localOnlyNote:
    "Processing runs locally in this browser. The file is not uploaded.",
  name: "Remove PDF Owner Password",
  noFileDescription: "Upload a PDF to remove owner password restrictions.",
  noFileTitle: "No PDF selected",
  openPasswordNote:
    "This does not recover or bypass a user/open password required to view the PDF.",
  outputSizeLabel: "Output size",
  processingDescription: "Removing permission restrictions in a worker.",
  processingLabel: "Processing PDF...",
  qpdfFailedError: "The PDF could not be unlocked.",
  readyDescription:
    "Review the selected file, then start removal when you are ready.",
  readyTitle: "Ready to process",
  removeFile: "Remove file",
  resultDescription:
    "Download the unrestricted PDF after processing completes.",
  resultTitle: "Result",
  selectedPdfTitle: "Selected PDF",
  successDescription:
    "Owner password restrictions were removed. Download the new PDF.",
  successTitle: "PDF ready",
  supportedFormats: "Supports local PDF files.",
  uploadDescription:
    "Choose the PDF whose owner password restrictions should be removed.",
  uploadTitle: "Upload PDF",
  unsupportedFile: "Unsupported file type. Please choose a PDF file.",
  workerUnsupportedError:
    "This browser cannot start the PDF processing worker.",
} satisfies RemovePdfOwnerPasswordMessages

beforeEach(() => {
  removePdfOwnerPasswordWithWorker.mockReset()
  URL.createObjectURL = vi.fn(() => "blob:output")
  URL.revokeObjectURL = vi.fn()
})

afterEach(() => {
  cleanup()
})

function uploadFile(file: File) {
  const input = screen.getByTestId("pdf-input") as HTMLInputElement

  fireEvent.change(input, {
    target: {
      files: [file],
    },
  })
}

describe("RemovePdfOwnerPasswordClient", () => {
  test("selects a PDF and downloads processed output", async () => {
    const input = new File(["pdf"], "locked.pdf", { type: "application/pdf" })
    const output = new Blob(["unlocked"], { type: "application/pdf" })

    removePdfOwnerPasswordWithWorker.mockResolvedValue(output)
    render(<RemovePdfOwnerPasswordClient messages={messages} />)

    uploadFile(input)

    expect(screen.getByText("locked.pdf")).toBeTruthy()
    expect(screen.getByText(messages.readyTitle)).toBeTruthy()

    fireEvent.click(screen.getByRole("button", { name: messages.actionLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.successTitle)).toBeTruthy()
    })

    expect(removePdfOwnerPasswordWithWorker).toHaveBeenCalledWith(input)

    const download = (await screen.findByRole("link", {
      name: messages.downloadPdfLabel,
    })) as HTMLAnchorElement

    expect(download.href).toBe("blob:output")
    expect(download.getAttribute("download")).toBe("locked-unlocked.pdf")
  })

  test("shows validation errors for unsupported and empty files", () => {
    render(<RemovePdfOwnerPasswordClient messages={messages} />)

    uploadFile(new File(["x"], "notes.txt", { type: "text/plain" }))
    expect(screen.getByText(messages.unsupportedFile)).toBeTruthy()

    uploadFile(new File([], "empty.pdf", { type: "application/pdf" }))
    expect(screen.getByText(messages.emptyFileError)).toBeTruthy()
  })

  test("maps worker failures to localized errors", async () => {
    removePdfOwnerPasswordWithWorker.mockRejectedValue(
      new Error("QPDF_DECRYPT_FAILED")
    )
    render(<RemovePdfOwnerPasswordClient messages={messages} />)

    uploadFile(new File(["pdf"], "locked.pdf", { type: "application/pdf" }))
    fireEvent.click(screen.getByRole("button", { name: messages.actionLabel }))

    await waitFor(() => {
      expect(screen.getByText(messages.qpdfFailedError)).toBeTruthy()
    })
  })

  test("clears the selected file", () => {
    render(<RemovePdfOwnerPasswordClient messages={messages} />)

    uploadFile(new File(["pdf"], "locked.pdf", { type: "application/pdf" }))
    fireEvent.click(screen.getByRole("button", { name: messages.removeFile }))

    expect(screen.getByText(messages.noFileTitle)).toBeTruthy()
  })
})
