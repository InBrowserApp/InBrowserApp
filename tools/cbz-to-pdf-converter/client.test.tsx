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
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ prepare: vi.fn(), open: vi.fn() }))
vi.mock("@workspace/cbz/pdf", () => ({ preparePdf: mock.prepare }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const result = {
  pdf: new Blob(["%PDF-output"], { type: "application/pdf" }),
  names: ["章/page1.png", "章/page2.jpg"],
}
const reader = { page: vi.fn(), zoom: vi.fn(), dispose: vi.fn() }
function upload(name = "comic.v2.CBZ", content = "zip") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([content], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.prepare.mockImplementation(async (_file, _signal, progress) => {
    progress({ page: 1, total: 2, name: "章/page1.png", saving: false })
    progress({ page: 2, total: 2, name: "", saving: true })
    return result
  })
  mock.open.mockImplementation(async ({ onChange }) => {
    onChange({ total: 2, page: 1 })
    return reader
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
test("previews exact output bytes with source filenames, navigation, fit and download", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  const download = await screen.findByRole("link", {
    name: m.pdfExport.download,
  })
  expect(download.getAttribute("download")).toBe("comic.v2.pdf")
  expect(URL.createObjectURL).toHaveBeenCalledWith(result.pdf)
  expect(mock.open).toHaveBeenCalledWith(
    expect.objectContaining({ file: result.pdf })
  )
  expect(screen.getByText("章/page1.png")).toBeTruthy()
  expect(reader.zoom).toHaveBeenCalledWith("page-fit")
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(reader.page).toHaveBeenCalledWith(2)
  act(() => mock.open.mock.calls[0]![0].onChange({ page: 2 }))
  expect(screen.getByText("章/page2.jpg")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  expect(reader.page).toHaveBeenCalledWith(1)
  fireEvent.click(screen.getByRole("button", { name: m.fitWidth }))
  expect(reader.zoom).toHaveBeenCalledWith("page-width")
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  expect(reader.zoom).toHaveBeenLastCalledWith("page-fit")
  const signal = mock.prepare.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(signal.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.pdfExport.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf")
})
test("replacing the same name removes downloads and cancels stale conversions", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.pdfExport.download })
  let finish!: (value: typeof result) => void
  mock.prepare.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  upload()
  expect(screen.queryByRole("link", { name: m.pdfExport.download })).toBeNull()
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish(result))
  expect(mock.open).toHaveBeenCalledOnce()
  expect(screen.queryByRole("link", { name: m.pdfExport.download })).toBeNull()
})
test("validates the extension and maps failed page/resource errors", async () => {
  render(<Client messages={m} />)
  upload("wrong.cbr")
  await screen.findByText(m.invalid)
  upload("empty.cbz", "")
  await screen.findByText(m.invalid)
  expect(mock.prepare).not.toHaveBeenCalled()
  mock.prepare.mockRejectedValueOnce(
    new ConversionError({ code: "damagedPage", page: 2, name: "broken.png" })
  )
  upload()
  await screen.findByText("Page 2: broken.png — " + m.pdfExport.damagedPage)
  expect(screen.queryByRole("link", { name: m.pdfExport.download })).toBeNull()
  mock.prepare.mockRejectedValueOnce(new RangeError("allocation"))
  upload()
  await screen.findByText(m.pdfExport.resourceLimit)
})
test.each(["onError", "onPassword"])(
  "revokes results after preview %s",
  async (callback) => {
    render(<Client messages={m} />)
    upload()
    await screen.findByRole("link", { name: m.pdfExport.download })
    act(() => mock.open.mock.calls[0]![0][callback]())
    await screen.findByText(m.pdfExport.failed)
    expect(
      screen.queryByRole("link", { name: m.pdfExport.download })
    ).toBeNull()
  }
)
test("disposes late readers and suppresses progress/errors after closing", async () => {
  let finish!: (value: typeof reader) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish(reader))
  expect(reader.dispose).toHaveBeenCalledOnce()
  let fail!: (reason: Error) => void
  mock.prepare.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  upload()
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => {
    mock.prepare.mock.calls[1]![2]({
      page: 1,
      total: 1,
      name: "stale",
      saving: false,
    })
    fail(new Error("stale"))
  })
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
})
