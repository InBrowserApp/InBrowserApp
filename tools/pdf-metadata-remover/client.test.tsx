import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import PdfMetadataRemover from "./client"
import messages from "./messages/en.json"
import type { RemovalResult } from "./remove-metadata.worker"

class MockWorker {
  static current: MockWorker

  constructor() {
    MockWorker.current = this
  }

  onmessage?: (event: { data: RemovalResult }) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
}

beforeEach(() => {
  vi.stubGlobal("Worker", MockWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:cleaned")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function pick(file: File) {
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
}

function start() {
  const remove = screen.getByRole("button", { name: messages.removeMetadata })
  remove.focus()
  fireEvent.click(remove)
  return MockWorker.current
}

test("makes a separate PDF download and moves keyboard focus to it", () => {
  render(<PdfMetadataRemover messages={messages} />)
  expect(
    screen.queryByRole("button", { name: messages.removeMetadata })
  ).toBeNull()
  expect(screen.getByRole("button", { name: /Choose PDF/ })).toBeTruthy()
  const original = new File(["input"], "Proposal.PDF")
  pick(original)
  const worker = start()
  expect(worker.postMessage).toHaveBeenCalledWith(original)
  const removing = screen.getByRole("button", {
    name: messages.removingMetadata,
  })
  expect(removing).toBe(document.activeElement)
  expect(removing.getAttribute("aria-disabled")).toBe("true")
  fireEvent.click(removing)
  expect(worker.postMessage).toHaveBeenCalledOnce()

  const result = new Blob(["output"], { type: "application/pdf" })
  act(() => worker.onmessage?.({ data: { status: "success", pdf: result } }))
  expect(worker.terminate).toHaveBeenCalledOnce()
  const download = screen.getByRole("link", { name: messages.downloadPdf })
  expect(download).toBe(document.activeElement)
  expect(download.getAttribute("href")).toBe("blob:cleaned")
  expect(download.getAttribute("download")).toBe("Proposal-no-metadata.pdf")
  expect(screen.getByRole("status").textContent).toBe(messages.success)
  expect(URL.createObjectURL).toHaveBeenCalledWith(result)

  pick(new File(["another"], "another.pdf"))
  expect(screen.queryByRole("link", { name: messages.downloadPdf })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cleaned")
})

test("accepts a dropped PDF and preserves it for recovery", () => {
  const { unmount } = render(<PdfMetadataRemover messages={messages} />)
  const zone = screen.getByRole("button", { name: /Choose PDF/ })
  const file = new File(["invalid"], "draft.pdf")
  fireEvent.click(zone)
  fireEvent.dragOver(zone)
  fireEvent.dragLeave(zone)
  fireEvent.drop(zone, { dataTransfer: { files: [] } })
  fireEvent.drop(zone, { dataTransfer: { files: [file, file] } })
  expect(screen.getByRole("alert").textContent).toContain(messages.oneFile)
  fireEvent.drop(zone, { dataTransfer: { files: [file] } })
  const worker = start()
  act(() => worker.onmessage?.({ data: { status: "encryptedPdf" } }))
  expect(screen.getByRole("alert").textContent).toContain(messages.encryptedPdf)
  expect(screen.getByText(file.name)).toBeTruthy()
  const retry = start()
  act(() => retry.onerror?.())
  expect(screen.getByRole("alert").textContent).toContain(messages.invalidPdf)
  const pending = start()
  unmount()
  expect(pending.terminate).toHaveBeenCalledOnce()
})

test("recovers if the processing worker could not start", () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("Worker unavailable")
      }
    }
  )
  render(<PdfMetadataRemover messages={messages} />)
  pick(new File(["input"], "draft.pdf"))
  fireEvent.click(screen.getByRole("button", { name: messages.removeMetadata }))
  expect(screen.getByRole("alert").textContent).toContain(messages.invalidPdf)
  expect(
    screen.getByRole("button", { name: messages.removeMetadata })
  ).toBeTruthy()
})
