import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { importFile } from "./import-file"
import { defaultImportOptions } from "./formats"
const mock = vi.hoisted(() => ({
  postMessage: vi.fn(),
  terminate: vi.fn(),
  onmessage: null as ((event: MessageEvent) => void) | null,
  onerror: null as (() => void) | null,
}))
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        return mock
      }
    }
  )
})
afterEach(() => vi.unstubAllGlobals())
test("transfers local input and shuts down the worker after successful parsing", async () => {
  const data = new ArrayBuffer(2)
  const pending = importFile(
    data,
    "a.xls",
    defaultImportOptions,
    new AbortController().signal
  )
  expect(mock.postMessage).toHaveBeenCalledWith(
    { data, name: "a.xls", options: defaultImportOptions },
    [data]
  )
  const result = { data: new ArrayBuffer(4), names: ["First"], notices: [] }
  mock.onmessage!(new MessageEvent("message", { data: { result } }))
  await expect(pending).resolves.toEqual(result)
  expect(mock.terminate).toHaveBeenCalledOnce()
})
test("cancels an active worker when a file is replaced or closed", async () => {
  const controller = new AbortController()
  const pending = importFile(
    new ArrayBuffer(2),
    "a.xls",
    defaultImportOptions,
    controller.signal
  )
  controller.abort()
  await expect(pending).rejects.toThrow("aborted")
  expect(mock.terminate).toHaveBeenCalledOnce()
  expect(() =>
    importFile(
      new ArrayBuffer(2),
      "a.xls",
      defaultImportOptions,
      controller.signal
    )
  ).toThrow("aborted")
})
test("releases the worker after parser and runtime failures", async () => {
  const first = importFile(
    new ArrayBuffer(2),
    "a.xls",
    defaultImportOptions,
    new AbortController().signal
  )
  mock.onmessage!(new MessageEvent("message", { data: { error: "TOO_LARGE" } }))
  await expect(first).rejects.toThrow("TOO_LARGE")
  const second = importFile(
    new ArrayBuffer(2),
    "b.xls",
    defaultImportOptions,
    new AbortController().signal
  )
  mock.onerror!()
  await expect(second).rejects.toThrow("INVALID")
  expect(mock.terminate).toHaveBeenCalledTimes(2)
})

test("releases the worker if transferring input fails synchronously", async () => {
  mock.postMessage.mockImplementationOnce(() => {
    throw new Error("Transfer failed")
  })
  const controller = new AbortController()
  await expect(
    importFile(
      new ArrayBuffer(2),
      "a.xls",
      defaultImportOptions,
      controller.signal
    )
  ).rejects.toThrow("Transfer failed")
  controller.abort()
  expect(mock.terminate).toHaveBeenCalledOnce()
})
