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
const mock = vi.hoisted(() => ({ convert: vi.fn(), createZip: vi.fn() }))
vi.mock("./core/convert", () => ({ convert: mock.convert }))
vi.mock("./core/zip", () => ({ createZip: mock.createZip }))
const result = {
  subject: "Saved mail",
  from: "Mina",
  attachments: [
    {
      name: "image.png",
      filename: "image.png",
      kind: "inline" as const,
      file: new Blob(["image"]),
    },
    {
      name: "../data.bin",
      filename: "_data.bin",
      kind: "attachment" as const,
      file: new Blob(["data"]),
    },
    {
      name: "",
      filename: "message.eml",
      kind: "nested" as const,
      file: new Blob([]),
    },
  ],
}
function upload(name = "report.EML", content = "mail") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([content], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockImplementation(
    (blob) => `blob:${(blob as Blob).size}`
  )
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  mock.convert.mockResolvedValue(result)
  mock.createZip.mockResolvedValue(new Blob(["zip"]))
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
const ready = () => screen.findByRole("link", { name: "Download _data.bin" })

test("lists inert individually downloadable files with explicit roles, original names and empty-file metadata", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await ready()
  expect(screen.getByText("../data.bin")).toBeTruthy()
  expect(screen.getByText(m.unnamed)).toBeTruthy()
  expect(screen.getByText(new RegExp(m.emptyAttachment))).toBeTruthy()
  expect(
    screen
      .getByRole("link", { name: "Download _data.bin" })
      .getAttribute("download")
  ).toBe("_data.bin")
  expect(
    screen
      .getByRole("checkbox", { name: "Select image.png" })
      .getAttribute("aria-checked")
  ).toBe("false")
  expect(screen.getByText("2 of 3 selected")).toBeTruthy()
  expect(document.querySelector("iframe")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.queryByRole("link")).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3)
})
test("archives only the selection and immediately withdraws obsolete ZIP downloads after toggles", async () => {
  render(<Client messages={m} />)
  upload()
  await ready()
  fireEvent.click(screen.getByRole("button", { name: m.prepareZip }))
  const zip = await screen.findByRole("link", { name: m.zipDownload })
  expect(zip.getAttribute("download")).toBe("report.zip")
  expect(mock.createZip.mock.calls[0]![0]).toEqual(result.attachments.slice(1))
  fireEvent.click(screen.getByRole("checkbox", { name: "Select image.png" }))
  expect(screen.queryByRole("link", { name: m.zipDownload })).toBeNull()
  expect(screen.getByText("3 of 3 selected")).toBeTruthy()
  fireEvent.click(screen.getByRole("checkbox", { name: "Select _data.bin" }))
  expect(screen.getByText("2 of 3 selected")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.selectNone }))
  expect(
    (screen.getByRole("button", { name: m.prepareZip }) as HTMLButtonElement)
      .disabled
  ).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.selectAll }))
  fireEvent.click(screen.getByRole("button", { name: m.prepareZip }))
  await screen.findByRole("link", { name: m.zipDownload })
  expect(mock.createZip.mock.calls[1]![0]).toEqual(result.attachments)
})
test("cancels ZIP generation, ignores late completion and reports packaging errors without losing individual downloads", async () => {
  let resolve!: (file: Blob) => void
  mock.createZip.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  upload()
  await ready()
  fireEvent.click(screen.getByRole("button", { name: m.prepareZip }))
  await waitFor(() => expect(mock.createZip).toHaveBeenCalledOnce())
  const signal = mock.createZip.mock.calls[0]![1] as AbortSignal
  fireEvent.click(screen.getByRole("button", { name: m.cancelZip }))
  expect(signal.aborted).toBe(true)
  await act(async () => resolve(new Blob(["late"])))
  expect(screen.queryByRole("link", { name: m.zipDownload })).toBeNull()
  mock.createZip.mockRejectedValueOnce(new Error("allocation"))
  fireEvent.click(screen.getByRole("button", { name: m.prepareZip }))
  await screen.findByText(m.zipFailed)
  expect(await ready()).toBeTruthy()
})
test("selection changes and close abort pending ZIPs and discard late failures", async () => {
  let reject!: (reason: Error) => void
  mock.createZip.mockImplementationOnce(
    () =>
      new Promise((_done, fail) => {
        reject = fail
      })
  )
  render(<Client messages={m} />)
  upload()
  await ready()
  fireEvent.click(screen.getByRole("button", { name: m.prepareZip }))
  await waitFor(() => expect(mock.createZip).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.selectNone }))
  expect(mock.createZip.mock.calls[0]![1].aborted).toBe(true)
  await act(async () => reject(new Error("late")))
  expect(screen.queryByText(m.zipFailed)).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.queryByRole("link")).toBeNull()
})
test("invalid replacement removes every old export; parser and resource errors are actionable", async () => {
  render(<Client messages={m} />)
  upload()
  await ready()
  upload("wrong.pdf")
  await screen.findByText(m.invalid)
  expect(screen.queryByRole("link")).toBeNull()
  upload("empty.eml", "")
  await screen.findByText(m.invalid)
  mock.convert.mockRejectedValueOnce(new Error("incomplete"))
  upload()
  await screen.findByText(m.incomplete)
  mock.convert.mockRejectedValueOnce(new RangeError("allocation"))
  upload()
  await screen.findByText(m.resource)
})
test("cancels parsing and ignores both late success and late failure, then recovers", async () => {
  let resolve!: (value: typeof result) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.convert).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(mock.convert.mock.calls[0]![1].aborted).toBe(true)
  await act(async () => resolve(result))
  expect(screen.queryByRole("link")).toBeNull()
  let reject!: (reason: Error) => void
  mock.convert.mockImplementationOnce(
    () =>
      new Promise((_done, fail) => {
        reject = fail
      })
  )
  upload()
  await waitFor(() => expect(mock.convert).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => reject(new Error("late")))
  expect(screen.queryByRole("alert")).toBeNull()
  upload()
  await ready()
})
test("empty attachment lists remain a successful result with fallback headers", async () => {
  mock.convert.mockResolvedValueOnce({ subject: "", from: "", attachments: [] })
  render(<Client messages={m} />)
  upload()
  await screen.findByText(m.noAttachments)
  expect(screen.getByText(m.subjectFallback)).toBeTruthy()
  expect(screen.getByText(m.unknown)).toBeTruthy()
  expect(screen.queryByRole("button", { name: m.prepareZip })).toBeNull()
})
