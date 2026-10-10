import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { Request } from "./types"
const mock = vi.hoisted(() => ({
  read: vi.fn(),
  export: vi.fn(),
  post: vi.fn(),
}))
vi.mock("./read-workbook", () => ({ readWorkbook: mock.read }))
vi.mock("./export-worksheet", () => ({ exportWorksheet: mock.export }))
beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  vi.stubGlobal("postMessage", mock.post)
  vi.stubGlobal("onmessage", null)
  await import("./worker")
})
afterEach(() => vi.unstubAllGlobals())
const send = (data: Request) =>
  (
    globalThis.onmessage as unknown as (event: {
      data: Request
    }) => Promise<void>
  )({ data })
const open: Request = {
  type: "open",
  source: { file: new File(["xlsx"], "book.xlsx") },
}
const request: Request = {
  type: "export",
  id: 1,
  options: {
    sheet: 0,
    range: "",
    format: "csv",
    values: "raw",
    firstRowHeader: true,
  },
}
test("opens once, returns exports, and reports invalid workbooks and range errors", async () => {
  await send(request)
  expect(mock.post).toHaveBeenLastCalledWith({
    type: "error",
    id: 1,
    error: "invalid",
  })
  mock.read.mockRejectedValueOnce(new Error("protected"))
  await send(open)
  expect(mock.post).toHaveBeenLastCalledWith({
    type: "error",
    id: undefined,
    error: "protected",
  })
  const book = { sheets: [{ name: "Data", hidden: false, range: "A1" }] }
  mock.read.mockResolvedValue(book)
  await send(open)
  expect(mock.post).toHaveBeenLastCalledWith({
    type: "open",
    sheets: book.sheets,
  })
  mock.export.mockResolvedValue({ text: "result" })
  await send(request)
  expect(mock.post).toHaveBeenLastCalledWith({
    type: "export",
    id: 1,
    output: { text: "result" },
  })
  mock.export.mockRejectedValueOnce(new Error("invalidRange"))
  await send(request)
  expect(mock.post).toHaveBeenLastCalledWith({
    type: "error",
    id: 1,
    error: "invalidRange",
  })
})
test("forwards cancellation and suppresses cancelled export failures", async () => {
  mock.read.mockResolvedValue({ sheets: [] })
  await send(open)
  let fail!: (error: Error) => void
  mock.export.mockImplementation(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  const pending = send(request)
  await send({ type: "cancel", id: 1 })
  expect((mock.export.mock.calls[0]![2] as AbortSignal).aborted).toBe(true)
  fail(new Error("aborted"))
  await pending
  expect(mock.post).toHaveBeenCalledOnce()
  await send({ type: "cancel", id: 42 })
})
