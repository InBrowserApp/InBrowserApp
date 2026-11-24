import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import PdfBookmarkEditor from "./client"
import { readPdfBookmarks, writePdfBookmarks } from "./core/pdf-bookmarks"
import messages from "./messages/en.json"
import { openPreview, renderPreview } from "./pdf-preview"
import type { PDFDocumentProxy } from "pdfjs-dist"

vi.mock("./core/pdf-bookmarks", () => ({
  readPdfBookmarks: vi.fn(),
  writePdfBookmarks: vi.fn(),
}))
vi.mock("./pdf-preview", () => ({
  openPreview: vi.fn(),
  renderPreview: vi.fn(),
}))

const pdf = {
  pageCount: 5,
  bookmarks: [
    { id: 0, depth: 0, title: "Chapter one", page: 1 },
    { id: 1, depth: 1, title: "Topic", page: 2 },
    { id: 2, depth: 0, title: "External link", page: null },
  ],
} as Awaited<ReturnType<typeof readPdfBookmarks>>

const button = (name: string | RegExp) => screen.getByRole("button", { name })
const input = (name: string) =>
  screen.getByLabelText<HTMLInputElement>(name, { selector: "input" })
const click = (name: string) => fireEvent.click(button(name), { detail: 1 })

function file(name = "guide.pdf") {
  return new File(["fixture"], name, { type: "application/pdf" })
}

function choose(chosen = file()) {
  fireEvent.change(input(messages.openPdf), { target: { files: [chosen] } })
}

async function mount() {
  render(<PdfBookmarkEditor messages={messages} />)
  choose()
  await screen.findByRole("button", { name: messages.downloadPdf })
}

beforeEach(() => {
  vi.mocked(readPdfBookmarks).mockResolvedValue(pdf)
  vi.mocked(writePdfBookmarks).mockResolvedValue(new Uint8Array([1, 2, 3]))
  vi.mocked(openPreview).mockResolvedValue({} as PDFDocumentProxy)
  vi.mocked(renderPreview).mockImplementation(async () =>
    document.createElement("canvas")
  )
})

afterEach(() => {
  cleanup()
  vi.resetAllMocks()
  vi.restoreAllMocks()
})

test("opens from the file picker, adds at the preview page, edits structure and downloads one PDF", async () => {
  const pick = vi.spyOn(HTMLInputElement.prototype, "click")
  const download = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  render(<PdfBookmarkEditor messages={messages} />)
  fireEvent.change(input(messages.openPdf), { target: { files: [] } })
  fireEvent.dragLeave(button(/Choose a PDF/))
  fireEvent.dragOver(button(/Choose a PDF/), { dataTransfer: {} })
  fireEvent.click(button(/Choose a PDF/))
  expect(pick).toHaveBeenCalledOnce()
  choose(file("Guide.PDF"))
  await screen.findByRole("img", { name: "Page 1" })
  click(messages.changePdf)
  expect(pick).toHaveBeenCalledTimes(2)

  const preview = input(messages.previewPage)
  fireEvent.change(preview, { target: { value: "4" } })
  fireEvent.keyDown(preview, { key: "Enter" })
  await screen.findByRole("img", { name: "Page 4" })
  click(messages.previousPage)
  click(messages.addBookmark)
  const title = input(messages.bookmarkTitle)
  expect(title).toBe(document.activeElement)
  expect(title.value).toBe("Page 3")
  fireEvent.change(title, { target: { value: "New section" } })
  click(messages.indent)
  click(messages.outdent)
  click(messages.moveDown)
  click(messages.moveUp)
  click(messages.nextPage)
  click(messages.usePreviewPage)

  const destination = input(messages.destinationPage)
  fireEvent.change(destination, { target: { value: "" } })
  fireEvent.blur(destination)
  expect(destination.value).toBe("4")
  fireEvent.change(destination, { target: { value: "99" } })
  fireEvent.blur(destination)
  expect(destination.value).toBe("5")
  click(messages.downloadPdf)
  await waitFor(() => expect(download).toHaveBeenCalledOnce())
  expect((download.mock.contexts[0] as HTMLAnchorElement).download).toBe(
    "Guide-bookmarks.pdf"
  )
  expect(vi.mocked(writePdfBookmarks).mock.calls[0]?.[1]).toEqual([
    ...pdf.bookmarks.slice(0, 2),
    { id: 3, depth: 0, title: "New section", page: 5 },
    pdf.bookmarks[2],
  ])
})

test("keeps child bookmarks after deleting a parent and supports undo", async () => {
  await mount()
  click(messages.deleteBookmark)
  expect(
    screen.queryByRole("button", { name: "Chapter one Page 1" })
  ).toBeNull()
  expect(button("Topic Page 2")).toBeTruthy()
  click(messages.undoDelete)
  expect(button("Chapter one Page 1").getAttribute("aria-current")).toBe("true")
  fireEvent.click(button("External link"))
  expect(input(messages.bookmarkTitle)).toBe(document.activeElement)
  expect(screen.getByText(messages.originalDestination)).toBeTruthy()
})

test("accepts a dropped PDF without bookmarks and can delete the last entry", async () => {
  vi.mocked(readPdfBookmarks).mockResolvedValueOnce({ ...pdf, bookmarks: [] })
  render(<PdfBookmarkEditor messages={messages} />)
  fireEvent.drop(button(/Choose a PDF/), { dataTransfer: { files: [file()] } })
  await screen.findByText(messages.noBookmarks)
  click(messages.addBookmark)
  expect(input(messages.bookmarkTitle).value).toBe("Page 1")
  click(messages.deleteBookmark)
  expect(screen.getByText(messages.noBookmarks)).toBeTruthy()
  click(messages.undoDelete)
  expect(input(messages.bookmarkTitle).value).toBe("Page 1")
})

test("keeps the current edits if a replacement is invalid and lets the user retry export", async () => {
  await mount()
  vi.mocked(readPdfBookmarks).mockResolvedValueOnce({ ...pdf, pageCount: 0 })
  choose(file("empty.pdf"))
  await screen.findByText(messages.openError)
  expect(input(messages.bookmarkTitle).value).toBe("Chapter one")
  vi.mocked(writePdfBookmarks).mockRejectedValueOnce(new Error("save failed"))
  click(messages.downloadPdf)
  await screen.findByText(messages.saveError)
  click(messages.downloadPdf)
  await waitFor(() => expect(screen.queryByText(messages.saveError)).toBeNull())
})

test("keeps editing available if the PDF preview cannot open or render", async () => {
  vi.mocked(openPreview).mockRejectedValueOnce(new Error("preview failed"))
  await mount()
  await screen.findByText(messages.previewError)
  vi.mocked(renderPreview).mockRejectedValueOnce(new Error("page failed"))
  choose(file("replacement.pdf"))
  await waitFor(() => expect(openPreview).toHaveBeenCalledTimes(2))
  await screen.findByText(messages.previewError)
  click(messages.nextPage)
  await screen.findByRole("img", { name: "Page 2" })
  click(messages.addBookmark)
  expect(input(messages.bookmarkTitle).value).toBe("Page 2")
})
