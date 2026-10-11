import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { ConversionError } from "./core/errors"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ prepare: vi.fn(), open: vi.fn() }))
vi.mock("./core/convert", () => ({ convert: mock.prepare }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const result = {
  pdf: new Blob(["%PDF-output"], { type: "application/pdf" }),
  pages: 2,
}
const reader = { page: vi.fn(), zoom: vi.fn(), dispose: vi.fn() }
function upload(name = "invoice.v2.RTF", content = "binary") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([content], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:pdf")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.prepare.mockImplementation(async (_file, _signal, progress) => {
    progress("converting")
    progress("saving")
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
test("previews exact output bytes with navigation, fit and download", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(screen.getByText(m.engineDownload)).toBeTruthy()
  upload()
  const download = await screen.findByRole("link", {
    name: m.download,
  })
  expect(download.getAttribute("download")).toBe("invoice.v2.pdf")
  expect(URL.createObjectURL).toHaveBeenCalledWith(result.pdf)
  expect(mock.open).toHaveBeenCalledWith(
    expect.objectContaining({ file: result.pdf })
  )
  expect(screen.getByText(m.layoutNotice)).toBeTruthy()
  expect(reader.zoom).toHaveBeenCalledWith("page-fit")
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(reader.page).toHaveBeenCalledWith(2)
  act(() => mock.open.mock.calls[0]![0].onChange({ page: 2 }))
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  expect(reader.page).toHaveBeenCalledWith(1)
  fireEvent.click(screen.getByRole("button", { name: m.fitWidth }))
  expect(reader.zoom).toHaveBeenCalledWith("page-width")
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  expect(reader.zoom).toHaveBeenLastCalledWith("page-fit")
  const signal = mock.prepare.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(signal.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:pdf")
})
test("replacing the same name removes downloads and cancels stale conversions", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  let finish!: (value: typeof result) => void
  mock.prepare.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  upload()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish(result))
  expect(mock.open).toHaveBeenCalledOnce()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
})
test("validates the extension and maps failed page/resource errors", async () => {
  render(<Client messages={m} />)
  upload("wrong.ofd")
  await screen.findByText(m.invalid)
  upload("empty.rtf", "")
  await screen.findByText(m.invalid)
  expect(mock.prepare).not.toHaveBeenCalled()
  mock.prepare.mockRejectedValueOnce(new ConversionError("unsupported"))
  upload()
  await screen.findByText(m.unsupported)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  mock.prepare.mockRejectedValueOnce(new RangeError("allocation"))
  upload()
  await screen.findByText(m.resource)
})
test.each(["onError", "onPassword"])(
  "revokes results after preview %s",
  async (callback) => {
    render(<Client messages={m} />)
    upload()
    await screen.findByRole("link", { name: m.download })
    act(() => mock.open.mock.calls[0]![0][callback]())
    await screen.findByText(m.failed)
    expect(screen.queryByRole("link", { name: m.download })).toBeNull()
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
    mock.prepare.mock.calls[1]![2]("converting")
    fail(new Error("stale"))
  })
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("cancels explicitly during conversion and suppresses late reader updates", async () => {
  mock.prepare.mockImplementationOnce(() => new Promise(() => {}))
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledOnce())
  const signal = mock.prepare.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(signal.aborted).toBe(true)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await screen.findByRole("link", { name: m.download })
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  act(() => mock.open.mock.calls[0]![0].onChange({ page: 99 }))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
})
test("always shows font and layout notes and handles preview loading failure", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  expect(screen.getByText(m.layoutNotice)).toBeTruthy()
  mock.open.mockRejectedValueOnce(new Error("private"))
  upload()
  await screen.findByText(m.failed)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
})

test.each(["RTF", "rtf"])(
  "accepts the %s OpenDocument format",
  async (extension) => {
    render(<Client messages={m} />)
    upload(`template.${extension}`)
    const download = await screen.findByRole("link", { name: m.download })
    expect(download.getAttribute("download")).toBe("template.pdf")
  }
)
