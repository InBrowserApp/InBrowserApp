import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"

import PdfRedactor from "./client"
import messages from "./messages/en.json"

const mocks = vi.hoisted(() => ({ openPdf: vi.fn(), exportPdf: vi.fn() }))
vi.mock("./pdfjs", () => ({ openPdf: mocks.openPdf }))
vi.mock("./export-pdf", () => ({ exportPdf: mocks.exportPdf }))

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.restoreAllMocks()
})

function choose(file: File) {
  fireEvent.change(screen.getByLabelText(messages.choosePdf), {
    target: { files: [file] },
  })
}

function reader() {
  const pdf = {
    numPages: 2,
    getPage: vi.fn(async () => ({
      getViewport: () => ({ width: 600, height: 800 }),
      render: () => ({ promise: Promise.resolve(), cancel: vi.fn() }),
      cleanup: vi.fn(),
    })),
  }
  const destroy = vi.fn(async () => undefined)
  mocks.openPdf.mockReturnValue({ promise: Promise.resolve(pdf), destroy })
  return { pdf, destroy }
}

function downloadButton() {
  return screen.getByRole<HTMLButtonElement>("button", {
    name: messages.download,
  })
}

test("opens a dropped PDF and keeps marks on their original page", async () => {
  reader()
  const { container } = render(<PdfRedactor messages={messages} />)
  const input = new File(["pdf"], "contract.pdf")
  fireEvent.dragOver(screen.getByText(messages.dropPdf))
  fireEvent.drop(screen.getByText(messages.dropPdf), {
    dataTransfer: { files: [input] },
  })
  const preview = await screen.findByRole("application", {
    name: messages.pagePreview,
  })
  expect(downloadButton().disabled).toBe(true)
  fireEvent.keyDown(preview, { key: "Enter" })
  fireEvent.keyDown(preview, { key: "ArrowRight", shiftKey: true })
  fireEvent.keyDown(preview, { key: "ArrowDown", shiftKey: true })
  fireEvent.keyDown(preview, { key: "Enter" })
  expect(downloadButton().disabled).toBe(false)
  expect(screen.getByText("Areas marked: 1")).toBeTruthy()

  fireEvent.click(screen.getByRole("button", { name: messages.nextPage }))
  await screen.findByText("Page 2 of 2")
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: messages.undo })
      .disabled
  ).toBe(true)
  fireEvent.drop(container.firstElementChild!, {
    dataTransfer: { files: [new File(["other"], "other.pdf")] },
  })
  expect(screen.queryByText("other.pdf")).toBeNull()

  fireEvent.click(screen.getByRole("button", { name: messages.previousPage }))
  await screen.findByText("Page 1 of 2")
  fireEvent.click(screen.getByRole("button", { name: messages.undo }))
  expect(downloadButton().disabled).toBe(true)
  expect(screen.getByText("Areas marked: 0")).toBeTruthy()
})

test("recovers from an unreadable document and releases the PDF reader", async () => {
  const destroy = vi.fn(async () => undefined)
  mocks.openPdf.mockImplementationOnce(() => ({
    promise: Promise.reject(new Error("invalid document")),
    destroy,
  }))
  const next = reader()
  const { unmount } = render(<PdfRedactor messages={messages} />)
  choose(new File(["broken"], "broken.pdf"))
  expect((await screen.findByRole("alert")).textContent).toContain(
    messages.openError
  )
  choose(new File(["valid"], "valid.pdf"))
  await screen.findByRole("application", { name: messages.pagePreview })
  expect(destroy).toHaveBeenCalledOnce()
  unmount()
  expect(next.destroy).toHaveBeenCalledOnce()
})

test("passes the selected page and coordinates to export and can retry a failing export", async () => {
  const { pdf } = reader()
  mocks.exportPdf.mockRejectedValueOnce(new Error("could not export"))
  mocks.exportPdf.mockResolvedValueOnce(new Uint8Array([1, 2]))
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:result")

  render(<PdfRedactor messages={messages} />)
  choose(new File(["valid"], "contract.PDF"))
  const preview = await screen.findByRole("application", {
    name: messages.pagePreview,
  })
  fireEvent.keyDown(preview, { key: "Enter" })
  fireEvent.keyDown(preview, { key: "ArrowLeft", shiftKey: true })
  fireEvent.keyDown(preview, { key: "ArrowUp", shiftKey: true })
  fireEvent.keyDown(preview, { key: "Enter" })
  fireEvent.click(downloadButton())
  expect((await screen.findByRole("alert")).textContent).toContain(
    messages.exportError
  )
  fireEvent.click(downloadButton())
  await screen.findByText(messages.downloaded)
  expect(mocks.exportPdf).toHaveBeenLastCalledWith(
    pdf,
    { 1: [{ left: 0.45, top: 0.45, right: 0.5, bottom: 0.5 }] },
    expect.any(Function)
  )
  expect(click).toHaveBeenCalledOnce()
})
