import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openEmail } from "./open-email"
import type { Result } from "./types"
class TestWorker {
  static instances: TestWorker[] = []
  onmessage!: (event: { data: Result }) => void
  onerror!: () => void
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
const file = () => new File(["Subject: test\r\n\r\nBody"], "test.eml")

test("transfers file bytes and releases the worker on completion", async () => {
  const promise = openEmail(file(), new AbortController().signal)
  const worker = TestWorker.instances[0]!
  await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalledOnce())
  const [payload, transfer] = worker.postMessage.mock.calls[0]!
  expect(payload.name).toBe("test.eml")
  expect(transfer).toEqual([payload.buffer])
  const result = { format: "EML" } as const
  worker.onmessage({ data: { email: result as never } })
  expect(await promise).toBe(result)
  expect(worker.terminate).toHaveBeenCalledOnce()
})

test("cancels parsing, including replacement during file reading", async () => {
  const controller = new AbortController()
  const promise = openEmail(file(), controller.signal)
  controller.abort()
  await expect(promise).rejects.toMatchObject({ name: "AbortError" })
  expect(TestWorker.instances[0]!.terminate).toHaveBeenCalled()
  const before = TestWorker.instances.length
  await expect(openEmail(file(), controller.signal)).rejects.toMatchObject({
    name: "AbortError",
  })
  expect(TestWorker.instances).toHaveLength(before)
})

test("preserves parser feedback and terminates a crashed worker", async () => {
  const parser = openEmail(file(), new AbortController().signal)
  TestWorker.instances[0]!.onmessage({ data: { error: "protected" } })
  await expect(parser).rejects.toThrow("protected")
  const crashed = openEmail(file(), new AbortController().signal)
  TestWorker.instances[1]!.onerror()
  await expect(crashed).rejects.toThrow("invalid")
  expect(TestWorker.instances[1]!.terminate).toHaveBeenCalledOnce()
})

test("releases worker if file bytes cannot be read", async () => {
  const broken = file()
  vi.spyOn(broken, "arrayBuffer").mockRejectedValue(new RangeError("memory"))
  await expect(openEmail(broken, new AbortController().signal)).rejects.toThrow(
    "memory"
  )
  expect(TestWorker.instances[0]!.terminate).toHaveBeenCalledOnce()
})
