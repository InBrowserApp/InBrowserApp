import { afterEach, expect, test, vi } from "vitest"
import { createReader } from "./reader"
import type { Info } from "./types"

class WorkerStub {
  static last: WorkerStub
  onmessage: Worker["onmessage"] = null
  onerror: Worker["onerror"] = null
  onmessageerror: Worker["onmessageerror"] = null
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    WorkerStub.last = this
  }
  reply(data: unknown) {
    this.onmessage?.call(
      this as unknown as Worker,
      new MessageEvent("message", { data })
    )
  }
}
afterEach(() => vi.unstubAllGlobals())
test("routes responses by ID, streams progress and ignores responses after disposal", async () => {
  vi.stubGlobal("Worker", WorkerStub)
  const reader = createReader()
  const worker = WorkerStub.last
  const progress = vi.fn()
  const first = reader.request<Info>(
    { type: "open", file: new File([], "file") },
    progress
  )
  const second = reader.request({ type: "page", start: 0, end: 2 })
  worker.reply({ id: 1, progress: 0 })
  expect(progress).toHaveBeenCalledWith(0)
  worker.reply({ id: 1, result: { rows: 2 } })
  await expect(first).resolves.toEqual({ rows: 2 })
  reader.dispose()
  await expect(second).rejects.toThrow("Reader stopped")
  expect(worker.terminate).toHaveBeenCalled()
  worker.reply({ id: 2, result: [] })
  await expect(
    reader.request({ type: "page", start: 0, end: 1 })
  ).rejects.toThrow("Reader stopped")
})
test("rejects parsing, startup and message decoding failures", async () => {
  vi.stubGlobal("Worker", WorkerStub)
  for (const failure of ["reply", "onerror", "onmessageerror"] as const) {
    const reader = createReader()
    const worker = WorkerStub.last
    const pending = reader.request({ type: "page", start: 0, end: 1 })
    if (failure === "reply") worker.reply({ id: 1, error: true })
    else if (failure === "onerror")
      worker.onerror?.call(worker as unknown as Worker, new ErrorEvent("error"))
    else
      worker.onmessageerror?.call(
        worker as unknown as Worker,
        new MessageEvent("messageerror")
      )
    await expect(pending).rejects.toThrow(
      /Unable to read Parquet|Reader stopped/
    )
    reader.dispose()
  }
})
