// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "./open-document"
import type { WorkerResult } from "./worker"
import { failure } from "./core/errors"
class FakeWorker {
  static last: FakeWorker
  constructor() {
    FakeWorker.last = this
  }
  onmessage: ((event: MessageEvent<WorkerResult>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  onmessageerror: (() => void) | null = null
  terminate = vi.fn()
  postMessage = vi.fn()
  finish(result: WorkerResult) {
    this.onmessage!(new MessageEvent("message", { data: result }))
  }
}
beforeEach(() => vi.stubGlobal("Worker", FakeWorker))
afterEach(() => vi.unstubAllGlobals())
const file = () => new File(["# A manual"], "manual.md")

test("converts in an owned worker, sanitizes the result and terminates on success", async () => {
  const f = file(),
    signal = new AbortController().signal
  const pending = openDocument(f, signal)
  const worker = FakeWorker.last
  expect(worker.postMessage).toHaveBeenCalledWith(f)
  worker.finish({
    html: "<h1>Manual</h1><script>alert(1)</script>",
  })
  const preview = await pending
  expect(preview.html).toContain("Manual")
  expect(preview.html).not.toContain("<script")
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test.each(["encoding", "resource", "invalid"] as const)(
  "terminates and propagates %s worker failure",
  async (error) => {
    const pending = openDocument(file(), new AbortController().signal)
    FakeWorker.last.finish({ error })
    await pending.catch((reason) => expect(failure(reason).code).toBe(error))
    expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
  }
)

test("terminates immediately on cancel and discards late messages", async () => {
  const controller = new AbortController()
  const pending = openDocument(file(), controller.signal)
  const worker = FakeWorker.last
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(worker.terminate).toHaveBeenCalledOnce()
  await expect(openDocument(file(), controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
})

test("cleans up worker load, deserialization, and postMessage failures", async () => {
  let pending = openDocument(file(), new AbortController().signal)
  const event = new ErrorEvent("error", {
    message: "worker unavailable",
    cancelable: true,
  })
  FakeWorker.last.onerror!(event)
  expect(event.defaultPrevented).toBe(true)
  await expect(pending).rejects.toThrow("worker unavailable")
  expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
  pending = openDocument(file(), new AbortController().signal)
  FakeWorker.last.onmessageerror!()
  await expect(pending).rejects.toThrow("INVALID")
  expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
  vi.stubGlobal(
    "Worker",
    class extends FakeWorker {
      override postMessage = vi.fn(() => {
        throw new Error("clone failed")
      })
    }
  )
  await expect(
    openDocument(file(), new AbortController().signal)
  ).rejects.toThrow("clone failed")
  expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
})

test("an abort after conversion discards the result before DOM preparation", async () => {
  const controller = new AbortController()
  const pending = openDocument(file(), controller.signal)
  FakeWorker.last.finish({ html: "Result" })
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
})
