import { afterEach, expect, test, vi } from "vitest"
import { compileDocument } from "./compile-document"

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
const file = new File(["text"], "test.typ")
test("transfers worker results and terminates the worker", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const controller = new AbortController()
  const progress = vi.fn()
  const pending = compileDocument(file, controller.signal, progress)
  const worker = TestWorker.latest
  worker.onmessage?.({ data: { type: "progress", phase: "compiling" } })
  worker.onmessage?.({
    data: { type: "complete", diagnostics: [], pdf: new ArrayBuffer(1) },
  })
  expect((await pending).pdf?.byteLength).toBe(1)
  expect(progress).toHaveBeenCalledWith("compiling")
  expect(worker.postMessage).toHaveBeenCalledWith(file)
  expect(worker.terminate).toHaveBeenCalledOnce()
  controller.abort()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("cancels active work and refuses work that is already cancelled", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const controller = new AbortController()
  const pending = compileDocument(file, controller.signal, vi.fn())
  controller.abort(new Error("closed"))
  await expect(pending).rejects.toThrow("closed")
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  expect(() => compileDocument(file, controller.signal, vi.fn())).toThrow(
    "closed"
  )
})
test("cleans up worker crashes and synchronous post failures", async () => {
  vi.stubGlobal("Worker", TestWorker)
  const pending = compileDocument(file, new AbortController().signal, vi.fn())
  const preventDefault = vi.fn()
  TestWorker.latest.onerror?.({
    message: "worker script could not load",
    preventDefault,
  })
  expect(await pending).toEqual({ error: "engineUnavailable", diagnostics: [] })
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
    compileDocument(file, new AbortController().signal, vi.fn())
  ).resolves.toEqual({ error: "engineUnavailable", diagnostics: [] })
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
})

test("preserves worker allocation failures and handles unavailable worker transport", async () => {
  vi.stubGlobal("Worker", TestWorker)
  let pending = compileDocument(file, new AbortController().signal, vi.fn())
  TestWorker.latest.onerror?.({
    message: "out of memory",
    preventDefault: vi.fn(),
  })
  expect(await pending).toEqual({ error: "resource", diagnostics: [] })
  expect(TestWorker.latest.terminate).toHaveBeenCalledOnce()
  pending = compileDocument(file, new AbortController().signal, vi.fn())
  TestWorker.latest.onmessageerror?.()
  expect(await pending).toEqual({ error: "engineUnavailable", diagnostics: [] })
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
    compileDocument(file, new AbortController().signal, vi.fn())
  ).resolves.toEqual({ error: "engineUnavailable", diagnostics: [] })
})
