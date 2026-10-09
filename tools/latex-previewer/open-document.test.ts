import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "./open-document"
class WorkerMock {
  static last: WorkerMock
  onmessage?: (event: { data: unknown }) => void
  onerror?: () => void
  onmessageerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    WorkerMock.last = this
  }
}
beforeEach(() => vi.stubGlobal("Worker", WorkerMock))
afterEach(() => vi.unstubAllGlobals())
const file = new File(["source"], "file.tex")
test("preserves source before rendering and releases the engine after success", async () => {
  const source = vi.fn()
  const controller = new AbortController()
  const pending = openDocument(file, controller.signal, source)
  const worker = WorkerMock.last
  worker.onmessage!({ data: { type: "source", source: "original" } })
  expect(source).toHaveBeenCalledWith("original")
  expect(worker.terminate).not.toHaveBeenCalled()
  worker.onmessage!({
    data: { type: "result", html: "result", css: "", diagnostics: [] },
  })
  expect(await pending).toMatchObject({ html: "result" })
  expect(worker.terminate).toHaveBeenCalledOnce()
  controller.abort()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test.each(["onerror", "onmessageerror"] as const)(
  "cleans up %s",
  async (event) => {
    const pending = openDocument(file, new AbortController().signal, vi.fn())
    WorkerMock.last[event]!()
    await expect(pending).rejects.toThrow("invalid")
    expect(WorkerMock.last.terminate).toHaveBeenCalledOnce()
  }
)
test("cancels reads, ignores late replies, and rejects already-cancelled requests", async () => {
  const controller = new AbortController()
  const source = vi.fn()
  const pending = openDocument(file, controller.signal, source)
  controller.abort()
  WorkerMock.last.onmessage!({ data: { type: "source", source: "late" } })
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(source).not.toHaveBeenCalled()
  expect(WorkerMock.last.terminate).toHaveBeenCalledOnce()
  expect(() => openDocument(file, controller.signal, source)).toThrow(/abort/i)
})
test("reports engine failures and releases the worker on transfer failure", async () => {
  const pending = openDocument(file, new AbortController().signal, vi.fn())
  WorkerMock.last.onmessage!({
    data: { type: "error", error: "resourceLimit" },
  })
  await expect(pending).rejects.toThrow("resourceLimit")
  vi.stubGlobal(
    "Worker",
    class extends WorkerMock {
      override postMessage = vi.fn(() => {
        throw new Error("transfer")
      })
    }
  )
  await expect(
    openDocument(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("transfer")
  expect(WorkerMock.last.terminate).toHaveBeenCalledOnce()
})
