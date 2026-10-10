import { afterEach, expect, test, vi } from "vitest"
import { exportDocument } from "./export-document"

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
afterEach(() => vi.unstubAllGlobals())
const file = { file: new File(["text"], "test.docx") }
const labels = {} as import("./types").Labels
test("transfers worker results and terminates the worker", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const controller = new AbortController()
  const pending = exportDocument(file, labels, controller.signal)
  const worker = TestWorker.latest
  worker.onmessage?.({
    data: { text: "converted text" },
  })
  expect(await pending).toEqual({ text: "converted text" })
  expect(worker.postMessage).toHaveBeenCalledWith({ source: file, labels })
  expect(worker.terminate).toHaveBeenCalledOnce()
  controller.abort()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("cancels active work and refuses work that is already cancelled", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const controller = new AbortController()
  const pending = exportDocument(file, labels, controller.signal)
  controller.abort(new Error("closed"))
  await expect(pending).rejects.toThrow("closed")
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  expect(() => exportDocument(file, labels, controller.signal)).toThrow(
    "closed"
  )
})
test("cleans up worker crashes and synchronous post failures", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const pending = exportDocument(file, labels, new AbortController().signal)
  const preventDefault = vi.fn()
  TestWorker.latest.onerror?.({
    message: "worker script could not load",
    preventDefault,
  })
  expect(await pending).toEqual({ error: "engineUnavailable" })
  expect(preventDefault).toHaveBeenCalledOnce()
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  vi.stubGlobal(
    "Worker",
    class extends TestWorker {
      override postMessage = vi.fn(() => {
        throw new Error("post failed")
      })
    }
  )
  await expect(
    exportDocument(file, labels, new AbortController().signal)
  ).resolves.toEqual({ error: "engineUnavailable" })
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
})

test("preserves worker allocation failures and handles unavailable worker transport", async () => {
  vi.stubGlobal("Worker", TestWorker)
  let pending = exportDocument(file, labels, new AbortController().signal)
  TestWorker.latest.onerror?.({
    message: "out of memory",
    preventDefault: vi.fn(),
  })
  expect(await pending).toEqual({ error: "resource" })
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  pending = exportDocument(file, labels, new AbortController().signal)
  TestWorker.latest.onmessageerror?.()
  expect(await pending).toEqual({ error: "engineUnavailable" })
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("worker unavailable")
      }
    }
  )
  await expect(
    exportDocument(file, labels, new AbortController().signal)
  ).resolves.toEqual({ error: "engineUnavailable" })
})
