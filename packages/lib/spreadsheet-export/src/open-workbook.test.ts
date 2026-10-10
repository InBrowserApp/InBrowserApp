import { afterEach, expect, test, vi } from "vitest"
import { openWorkbook } from "./open-workbook"
import type { Options } from "./types"

class TestWorker {
  static latest: TestWorker
  onmessage: ((event: { data: object }) => void) | null = null
  onerror:
    | ((event: { message: string; preventDefault: () => void }) => void)
    | null = null
  onmessageerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    TestWorker.latest = this
  }
}
const source = { file: new File(["book"], "test.xlsx") }
const options: Options = {
  sheet: 0,
  range: "",
  format: "csv",
  values: "raw",
  firstRowHeader: true,
}
const sheets = [{ name: "Data", range: "A1:B2", hidden: false }]
afterEach(() => vi.unstubAllGlobals())
async function setup() {
  vi.stubGlobal("Worker", TestWorker)
  const controller = new AbortController()
  const pending = openWorkbook(source, controller.signal)
  const worker = TestWorker.latest
  worker.onmessage?.({ data: { type: "open", sheets } })
  return { controller, worker, session: await pending }
}

test("keeps a workbook session for repeated exports and routes responses by request", async () => {
  const { controller, worker, session } = await setup()
  expect(session.sheets).toEqual(sheets)
  expect(worker.postMessage).toHaveBeenCalledWith({ type: "open", source })
  const first = session.export(options, new AbortController().signal)
  const second = session.export(
    { ...options, format: "json" },
    new AbortController().signal
  )
  worker.onmessage?.({
    data: { type: "export", id: 2, output: { text: "[]" } },
  })
  worker.onmessage?.({
    data: { type: "export", id: 1, output: { text: "data" } },
  })
  expect(await first).toEqual({ text: "data" })
  expect(await second).toEqual({ text: "[]" })
  expect(worker.terminate).not.toHaveBeenCalled()
  const third = session.export(options, new AbortController().signal)
  worker.onmessage?.({ data: { type: "error", id: 3, error: "invalidRange" } })
  await expect(third).rejects.toThrow("invalidRange")
  controller.abort()
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("cancels an individual export and ignores stale results without discarding the workbook", async () => {
  const { worker, session, controller } = await setup()
  const request = new AbortController()
  const pending = session.export(options, request.signal)
  request.abort(new Error("options changed"))
  await expect(pending).rejects.toThrow("options changed")
  expect(worker.postMessage).toHaveBeenLastCalledWith({ type: "cancel", id: 1 })
  worker.onmessage?.({
    data: { type: "export", id: 1, output: { text: "stale" } },
  })
  expect(worker.terminate).not.toHaveBeenCalled()
  expect(() => session.export(options, request.signal)).toThrow(
    "options changed"
  )
  const active = session.export(options, new AbortController().signal)
  controller.abort(new Error("closed"))
  await expect(active).rejects.toThrow("closed")
  expect(() => session.export(options, new AbortController().signal)).toThrow(
    "closed"
  )
  worker.onmessage?.({ data: { type: "error", error: "invalid" } })
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("closes a failed session, rejects all pending exports, and allows consumers to retry", async () => {
  const { worker, session, controller } = await setup()
  const pending = session.export(options, new AbortController().signal)
  const preventDefault = vi.fn()
  worker.onerror?.({ message: "out of memory", preventDefault })
  await expect(pending).rejects.toThrow("resource")
  await expect(
    session.export(options, new AbortController().signal)
  ).rejects.toThrow("engineUnavailable")
  expect(preventDefault).toHaveBeenCalledOnce()
  controller.abort()
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("handles malformed workbooks, unavailable scripts, worker construction and message failures", async () => {
  vi.stubGlobal("Worker", TestWorker)
  for (const kind of ["invalid", "message", "abort"] as const) {
    const controller = new AbortController()
    const pending = openWorkbook(source, controller.signal)
    if (kind === "invalid")
      TestWorker.latest.onmessage?.({
        data: { type: "error", error: "invalid" },
      })
    if (kind === "message") TestWorker.latest.onmessageerror?.()
    if (kind === "abort") controller.abort(new Error("aborted"))
    await expect(pending).rejects.toThrow(
      kind === "message"
        ? "engineUnavailable"
        : kind === "abort"
          ? "aborted"
          : "invalid"
    )
    expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  }
  vi.stubGlobal(
    "Worker",
    class extends TestWorker {
      override postMessage = vi.fn(() => {
        throw new Error("failed")
      })
    }
  )
  await expect(
    openWorkbook(source, new AbortController().signal)
  ).rejects.toThrow("engineUnavailable")
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new RangeError("allocation")
      }
    }
  )
  await expect(
    openWorkbook(source, new AbortController().signal)
  ).rejects.toThrow("resource")
  const aborted = new AbortController()
  aborted.abort(new Error("closed"))
  expect(() => openWorkbook(source, aborted.signal)).toThrow("closed")
})
