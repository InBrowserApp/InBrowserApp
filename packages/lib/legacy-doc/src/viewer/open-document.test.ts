import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "./open-document"
import type { Result } from "./types"
class TestWorker {
  static instances: TestWorker[] = []
  onmessage!: (event: { data: Result }) => void
  onerror!: () => void
  onmessageerror!: () => void
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    TestWorker.instances.push(this)
  }
}
beforeEach(() => {
  TestWorker.instances = []
  vi.stubGlobal("Worker", TestWorker)
})
afterEach(() => vi.unstubAllGlobals())
const file = () => new File(["document"], "test.doc")

test("transfers file bytes and releases the worker on completion", async () => {
  const promise = openDocument(file(), new AbortController().signal)
  const worker = TestWorker.instances[0]!
  await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
  const [payload, transfer] = worker.postMessage.mock.calls[0]!
  expect(payload.name).toBe("test.doc")
  expect(transfer).toEqual([payload.buffer])
  const result = { html: "document" } as const
  worker.onmessage({ data: { document: result as never } })
  expect(await promise).toBe(result)
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("cancels parsing, including replacement during file reading", async () => {
  const controller = new AbortController()
  const promise = openDocument(file(), controller.signal)
  controller.abort()
  await expect(promise).rejects.toMatchObject({ name: "AbortError" })
  expect(TestWorker.instances[0]!.terminate).toHaveBeenCalled()
  const before = TestWorker.instances.length
  await expect(openDocument(file(), controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(TestWorker.instances).toHaveLength(before)
})

test("preserves parser feedback and terminates a crashed worker", async () => {
  const parser = openDocument(file(), new AbortController().signal)
  TestWorker.instances[0]!.onmessage({ data: { error: "protected" } })
  await expect(parser).rejects.toThrow("protected")
  const crashed = openDocument(file(), new AbortController().signal)
  TestWorker.instances[1]!.onerror()
  await expect(crashed).rejects.toThrow("invalid")
  expect(TestWorker.instances[1]!.terminate).toHaveBeenCalledOnce()
})

test("releases worker if file bytes cannot be read", async () => {
  const broken = file()
  vi.spyOn(broken, "arrayBuffer").mockRejectedValue(new RangeError("memory"))
  await expect(
    openDocument(broken, new AbortController().signal)
  ).rejects.toThrow("memory")
  expect(TestWorker.instances[0]!.terminate).toHaveBeenCalledOnce()
})

test("settles an unreadable worker message and removes cancellation handlers", async () => {
  const signal = new AbortController().signal
  const remove = vi.spyOn(signal, "removeEventListener")
  const pending = openDocument(file(), signal)
  const worker = TestWorker.instances[0]!
  await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
  worker.onmessageerror()
  await expect(pending).rejects.toThrow("invalid")
  expect(worker.terminate).toHaveBeenCalledOnce()
  expect(remove).toHaveBeenCalledWith("abort", expect.any(Function))
})
