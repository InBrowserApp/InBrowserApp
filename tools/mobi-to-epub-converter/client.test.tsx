import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({ convert: vi.fn() }))
vi.mock("./core/convert", () => mock)
vi.mock("@workspace/ui/components/tool/document-frame", () => ({
  DocumentFrame: ({
    title,
    zoom,
    onMissing,
    onResourceError,
    onPosition,
  }: {
    title: string
    zoom: number
    onMissing: () => void
    onResourceError: () => void
    onPosition: (value: number) => void
  }) => (
    <div aria-label={title} data-zoom={zoom}>
      <button onClick={onMissing}>Missing reference</button>
      <button onClick={onResourceError}>Broken image</button>
      <button onClick={() => onPosition(45)}>Scroll document</button>
    </div>
  ),
}))
const result = {
  notes: [m.styleNotice, m.safePreview],
  file: new Blob(["<!doctype html><p>Safe HTML</p>"], {
    type: "text/html;charset=utf-8",
  }),
  preview: { html: "safe", title: "Report" },
  text: "From: Mina\n\nMessage 世界",
  textFile: new Blob(["From: Mina\n\nMessage 世界"], {
    type: "text/plain;charset=utf-8",
  }),
}
function upload(name = "report.v2.MOBI", content = "Book") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([content], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:html")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.convert.mockResolvedValue(result)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("previews the output with zoom, safe navigation and exact EPUB download", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  const download = await screen.findByRole("link", { name: m.download })
  expect(download.getAttribute("download")).toBe("report.v2.epub")
  expect(URL.createObjectURL).toHaveBeenCalledWith(result.file)
  expect(screen.getByText(m.ready)).toBeTruthy()
  expect(screen.getByText(m.notes).closest("details")!.open).toBe(false)
  expect(screen.getByText(m.layoutNotice)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(screen.getByLabelText(m.documentBody).getAttribute("data-zoom")).toBe(
    "125"
  )
  fireEvent.click(screen.getByRole("button", { name: "Scroll document" }))
  expect(screen.getByLabelText(`${m.position}: 45%`)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Missing reference" }))
  expect(screen.getByText(m.missingReference)).toBeTruthy()
  const signal = mock.convert.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(signal.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:html")
})

test("replacement immediately removes the old result and cancellation discards late conversion", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  let resolve!: (value: typeof result) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  upload()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  await waitFor(() => expect(mock.convert).toHaveBeenCalledTimes(2))
  const signal = mock.convert.mock.calls[1]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(signal.aborted).toBe(true)
  await act(async () => resolve(result))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("validation and parser errors never retain an earlier EPUB download", async () => {
  render(<Client messages={m} />)
  upload("wrong.html")
  await screen.findByText(m.unsupported)
  upload("empty.mobi", "")
  await screen.findByText(m.emptyFile)
  expect(mock.convert).not.toHaveBeenCalled()
  upload("report.prc")
  await screen.findByRole("link", { name: m.download })
  mock.convert.mockRejectedValueOnce(new Error("incomplete"))
  upload()
  await screen.findByText(m.incomplete)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  mock.convert.mockRejectedValueOnce(new RangeError("allocation"))
  upload()
  await screen.findByText(m.resourceLimit)
})

test("suppresses a late failure after close and recovers on the next document", async () => {
  let reject!: (reason: Error) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise((_done, fail) => {
        reject = fail
      })
  )
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.convert).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => reject(new Error("invalid")))
  expect(screen.queryByRole("alert")).toBeNull()
  upload()
  await screen.findByRole("link", { name: m.download })
})

test("withdraws a download after an unexpected preview image failure", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  fireEvent.click(screen.getByRole("button", { name: "Broken image" }))
  expect(screen.getByText(m.failed)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:html")
})
