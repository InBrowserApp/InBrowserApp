import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { ConversionError } from "@workspace/cbz/errors"
import { PdfExport } from "./pdf-export"
import messages from "./messages/en.json"
const m = messages.pdfExport
const prepare = vi.hoisted(() => vi.fn())
vi.mock("@workspace/cbz/pdf", () => ({ preparePdf: prepare }))
const file = new File(["zip"], "comic.cbz"),
  pdf = new Blob(["pdf"])
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  prepare.mockImplementation(async (_file, _signal, progress) => {
    progress({ page: 1, total: 1, name: "1.png", saving: false })
    progress({ page: 1, total: 1, name: "", saving: true })
    return { pdf, names: ["1.png"] }
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
test("exports a complete comic on demand and revokes the URL on closure", async () => {
  const view = render(<PdfExport file={file} m={m} />)
  expect(prepare).not.toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  const download = await screen.findByRole("link", { name: m.download })
  expect(download.getAttribute("download")).toBe("comic.pdf")
  expect(URL.createObjectURL).toHaveBeenCalledWith(pdf)
  expect(screen.getByText(m.ready.replace("{total}", "1"))).toBeTruthy()
  const signal = prepare.mock.calls[0]![1] as AbortSignal
  view.unmount()
  expect(signal.aborted).toBe(true)
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf")
})
test("can cancel and retry without publishing late output", async () => {
  let finish!: (value: { pdf: Blob; names: string[] }) => void
  prepare.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<PdfExport file={file} m={m} />)
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await waitFor(() => expect(prepare).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(prepare.mock.calls[0]![1].aborted).toBe(true)
  await act(async () => {
    prepare.mock.calls[0]![2]({ page: 1, total: 1, name: "stale" })
    finish({ pdf, names: [] })
  })
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByRole("link", { name: m.download })
})
test("reports a failed page and ignores cancelled errors", async () => {
  prepare.mockRejectedValueOnce(
    new ConversionError({ code: "unsupportedPage", page: 5, name: "5.svg" })
  )
  render(<PdfExport file={file} m={m} />)
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByRole("alert")
  expect(screen.getByRole("alert").textContent).toBe(
    "Page 5: 5.svg — " + m.unsupportedPage
  )
  let reject!: (reason: Error) => void
  prepare.mockImplementationOnce(
    () =>
      new Promise((_resolve, fail) => {
        reject = fail
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await waitFor(() => expect(prepare).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  await act(async () => reject(new Error("stale")))
  expect(screen.queryByRole("alert")).toBeNull()
})
