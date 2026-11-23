import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"

import PdfCompressor from "./client"
import messages from "./messages/en.json"
import type { CompressionResult } from "./protocol"

class MockWorker {
  static instances: MockWorker[] = []

  constructor() {
    MockWorker.instances.push(this)
  }

  onmessage: ((event: { data: CompressionResult }) => void) | null = null
  onerror: (() => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
}

const makeUrl = vi.fn(() => "blob:pdf")
const revokeUrl = vi.fn()

beforeEach(() => {
  MockWorker.instances = []
  vi.stubGlobal("Worker", MockWorker)
  vi.spyOn(URL, "createObjectURL").mockImplementation(makeUrl)
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(revokeUrl)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

function renderTool() {
  return render(<PdfCompressor lang="en" messages={messages} />)
}

function pick(file: File) {
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
}

function start() {
  fireEvent.click(screen.getByRole("button", { name: messages.compress }))
  return MockWorker.instances.at(-1)!
}

function deliver(worker: MockWorker, data: CompressionResult) {
  act(() => worker.onmessage?.({ data }))
}

test("compares actual sizes before offering the compressed download", () => {
  const { unmount } = renderTool()
  expect(screen.getByLabelText(/Balanced/)).toHaveProperty("checked", true)
  expect(
    screen.getByRole("button", { name: messages.compress })
  ).toHaveProperty("disabled", true)
  const file = new File([new Uint8Array(4000)], "invoice.PDF")
  pick(file)
  const worker = start()
  expect(worker.postMessage).toHaveBeenCalledWith({ file, level: "balanced" })
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()

  deliver(worker, {
    status: "compressed",
    blob: new Blob([new Uint8Array(1000)]),
  })
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(screen.getAllByText("4 kB").length).toBeGreaterThan(0)
  expect(screen.getByText("1 kB")).toBeTruthy()
  expect(screen.getByText("75%")).toBeTruthy()
  expect(
    screen
      .getByRole("link", { name: messages.download })
      .getAttribute("download")
  ).toBe("invoice-compressed.pdf")

  fireEvent.click(screen.getByLabelText(/Smallest file/))
  expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  expect(revokeUrl).toHaveBeenCalledWith("blob:pdf")
  expect(start().postMessage).toHaveBeenCalledWith({ file, level: "small" })
  unmount()
  expect(MockWorker.instances.at(-1)?.terminate).toHaveBeenCalledOnce()
})

test("cancellation ignores old replies and lets the same PDF be retried", () => {
  renderTool()
  const file = new File(["PDF"], "retry.pdf")
  pick(file)
  const old = start()
  fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
  expect(screen.getByText(messages.cancelled)).toBeTruthy()
  expect(old.terminate).toHaveBeenCalledOnce()
  const next = start()
  deliver(old, { status: "invalidPdf" })
  expect(screen.queryByRole("alert")).toBeNull()

  deliver(next, { status: "noSavings" })
  expect(screen.getByText(messages.noSavings)).toBeTruthy()
  expect(screen.getByText("0%")).toBeTruthy()
  expect(
    screen
      .getByRole("link", { name: messages.downloadOriginal })
      .getAttribute("download")
  ).toBe("retry.pdf")
  expect(makeUrl).toHaveBeenLastCalledWith(file)
})

test("rejects multiple dropped files and retains the current input on failure", () => {
  renderTool()
  const zone = screen.getByRole("button", { name: /Choose a PDF/ })
  fireEvent.dragOver(zone)
  fireEvent.dragLeave(zone)
  const file = new File(["invalid"], "invalid.pdf")
  fireEvent.drop(zone, { dataTransfer: { files: [file, file] } })
  expect(screen.getByRole("alert").textContent).toContain(messages.oneFile)
  fireEvent.drop(zone, { dataTransfer: { files: [file] } })
  deliver(start(), { status: "invalidPdf" })
  expect(screen.getByRole("alert").textContent).toContain(messages.invalidPdf)
  expect(screen.getByText(file.name)).toBeTruthy()

  const retry = start()
  act(() => retry.onerror?.())
  expect(screen.getByRole("alert").textContent).toContain(
    messages.compressionFailed
  )
  pick(new File(["new"], "other.pdf"))
  deliver(start(), { status: "signed" })
  expect(screen.getByText(messages.signed)).toBeTruthy()
})
