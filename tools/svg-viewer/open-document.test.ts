import { afterEach, expect, test, vi } from "vitest"
import { openDocument } from "./open-document"

class FakeWorker {
  static instances: FakeWorker[] = []
  onmessage?: (event: { data: unknown }) => void
  onerror?: (event: { message: string; preventDefault: () => void }) => void
  onmessageerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    FakeWorker.instances.push(this)
  }
}
afterEach(() => {
  vi.unstubAllGlobals()
  FakeWorker.instances = []
})

test("terminates successful, failed, malformed-message and cancelled worker tasks", async () => {
  vi.stubGlobal("Worker", FakeWorker)
  const file = new File(["x"], "file.svg")
  for (const type of [
    "success",
    "error",
    "empty",
    "crash",
    "memory",
    "messageerror",
    "abort",
  ]) {
    const controller = new AbortController()
    const promise = openDocument(file, controller.signal)
    const worker = FakeWorker.instances.at(-1)!
    expect(worker.postMessage).toHaveBeenCalledWith(file)
    if (type === "success") {
      worker.onmessage!({ data: { preview: { svg: "drawing" } } })
      expect(await promise).toEqual({ svg: "drawing" })
    } else {
      if (type === "error")
        worker.onmessage!({ data: { error: "compression" } })
      if (type === "empty") worker.onmessage!({ data: {} })
      if (type === "crash" || type === "memory") {
        const preventDefault = vi.fn()
        worker.onerror!({
          message: type === "memory" ? "out of memory" : "script load failed",
          preventDefault,
        })
        expect(preventDefault).toHaveBeenCalledOnce()
      }
      if (type === "messageerror") worker.onmessageerror!()
      if (type === "abort") controller.abort()
      const expected =
        type === "error"
          ? "compression"
          : type === "memory"
            ? "resourceLimit"
            : type === "crash" || type === "messageerror"
              ? "renderError"
              : type === "abort"
                ? /abort/i
                : "invalid"
      await expect(promise).rejects.toThrow(expected)
    }
    expect(worker.terminate).toHaveBeenCalledOnce()
    controller.abort()
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
})

test("cleans up posting failures and does not start an already cancelled task", async () => {
  vi.stubGlobal(
    "Worker",
    class extends FakeWorker {
      override postMessage = vi.fn(() => {
        throw new RangeError("allocation")
      })
    }
  )
  const file = new File(["x"], "file.svg")
  await expect(
    openDocument(file, new AbortController().signal)
  ).rejects.toThrow("allocation")
  expect(FakeWorker.instances[0]!.terminate).toHaveBeenCalledOnce()
  const controller = new AbortController()
  controller.abort()
  expect(() => openDocument(file, controller.signal)).toThrow(/abort/i)
  expect(FakeWorker.instances).toHaveLength(1)
})
