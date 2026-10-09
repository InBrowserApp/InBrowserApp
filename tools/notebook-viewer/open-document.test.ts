// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openDocument, failure } from "./open-document"
import type { WorkerResult } from "./types"
import m from "./messages/en.json"
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
const file = () => new File(["= A manual"], "manual.ipynb")

test("converts in an owned worker, sanitizes the result and terminates on success", async () => {
  const f = file(),
    signal = new AbortController().signal
  const pending = openDocument(f, signal, m)
  const worker = FakeWorker.last
  expect(worker.postMessage).toHaveBeenCalledWith(f)
  worker.finish({
    result: {
      cells: [
        {
          kind: "markdown",
          html: "<h1>Manual</h1><script>alert(1)</script>",
          attachments: {},
          count: null,
          outputs: [],
        },
      ],
    },
  })
  const preview = await pending
  expect(preview.outline[1]?.label).toBe("Manual")
  expect(preview.html).not.toContain("<script")
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test.each(["encoding", "resourceLimit", "invalid", "version"] as const)(
  "terminates and propagates %s worker failure",
  async (error) => {
    const pending = openDocument(file(), new AbortController().signal, m)
    FakeWorker.last.finish({ error })
    await pending.catch((reason) => expect(failure(reason)).toBe(error))
    expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
  }
)

test("terminates immediately on cancel and discards late messages", async () => {
  const controller = new AbortController()
  const pending = openDocument(file(), controller.signal, m)
  const worker = FakeWorker.last
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
  expect(worker.terminate).toHaveBeenCalledOnce()
  await expect(
    openDocument(file(), controller.signal, m)
  ).rejects.toMatchObject({ name: "AbortError" })
})

test("cleans up worker load, deserialization, and postMessage failures", async () => {
  let pending = openDocument(file(), new AbortController().signal, m)
  const event = new ErrorEvent("error", {
    message: "worker unavailable",
    cancelable: true,
  })
  FakeWorker.last.onerror!(event)
  expect(event.defaultPrevented).toBe(true)
  await expect(pending).rejects.toThrow("worker unavailable")
  expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
  pending = openDocument(file(), new AbortController().signal, m)
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
    openDocument(file(), new AbortController().signal, m)
  ).rejects.toThrow("clone failed")
  expect(FakeWorker.last.terminate).toHaveBeenCalledOnce()
})

test("an abort after conversion discards the result before DOM preparation", async () => {
  const controller = new AbortController()
  const pending = openDocument(file(), controller.signal, m)
  FakeWorker.last.finish({ result: { cells: [] } })
  controller.abort()
  await expect(pending).rejects.toMatchObject({ name: "AbortError" })
})
