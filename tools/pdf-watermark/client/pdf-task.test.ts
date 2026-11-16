import { afterEach, expect, test, vi } from "vitest"
import { runPdfTask } from "./pdf-task"
import { DEFAULT_OPTIONS } from "../types"

class MockWorker {
  static current: MockWorker
  onmessage?: (event: unknown) => void
  onerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    MockWorker.current = this
  }
}
afterEach(() => vi.unstubAllGlobals())

test("disposes workers when transferring a request fails synchronously", async () => {
  class FailingWorker extends MockWorker {
    override postMessage = vi.fn(() => {
      throw new Error("clone failed")
    })
  }
  vi.stubGlobal("Worker", FailingWorker)
  await expect(
    runPdfTask(
      { type: "inspect", source: new ArrayBuffer(0) },
      new AbortController().signal
    )
  ).rejects.toThrow("clone failed")
  expect(MockWorker.current.terminate).toHaveBeenCalledOnce()
})

test("transfers source bytes and terminates the worker after success", async () => {
  vi.stubGlobal("Worker", MockWorker)
  const source = new ArrayBuffer(3)
  const request = { type: "inspect" as const, source }
  const pending = runPdfTask(request, new AbortController().signal)
  expect(MockWorker.current.postMessage).toHaveBeenCalledWith(request, [source])
  MockWorker.current.onmessage!({ data: { ok: true, pages: [] } })
  await expect(pending).resolves.toEqual({ ok: true, pages: [] })
  expect(MockWorker.current.terminate).toHaveBeenCalledOnce()
})

test("rejects worker errors and aborts pending jobs", async () => {
  vi.stubGlobal("Worker", MockWorker)
  const request = { type: "inspect" as const, source: new ArrayBuffer(0) }
  let pending = runPdfTask(request, new AbortController().signal)
  MockWorker.current.onmessage!({
    data: { ok: false, error: "encryptedError" },
  })
  await expect(pending).rejects.toThrow("encryptedError")
  pending = runPdfTask(request, new AbortController().signal)
  MockWorker.current.onerror!()
  await expect(pending).rejects.toThrow("readError")
  const controller = new AbortController()
  pending = runPdfTask(request, controller.signal)
  controller.abort()
  await expect(pending).rejects.toThrow("aborted")
  await expect(runPdfTask(request, controller.signal)).rejects.toThrow(
    "aborted"
  )
  expect(MockWorker.current.terminate).toHaveBeenCalledOnce()
})

test("transfers watermark bytes for export and reports export worker failures", async () => {
  vi.stubGlobal("Worker", MockWorker)
  const request = {
    type: "generate" as const,
    source: new ArrayBuffer(0),
    layers: [{ png: new ArrayBuffer(1), options: DEFAULT_OPTIONS, pages: [1] }],
  }
  const pending = runPdfTask(request, new AbortController().signal)
  expect(MockWorker.current.postMessage).toHaveBeenCalledWith(request, [
    request.source,
    request.layers[0]!.png,
  ])
  MockWorker.current.onerror!()
  await expect(pending).rejects.toThrow("generateError")
})
