// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openDocument } from "./open"
import type { Reply, Request } from "./types"
const page =
  '<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800"><text>한글</text></svg>'
class FakeWorker {
  static all: FakeWorker[] = []
  onmessage: ((e: MessageEvent<Reply>) => void) | null = null
  onerror: (() => void) | null = null
  onmessageerror: (() => void) | null = null
  terminate = vi.fn()
  requests: Request[] = []
  constructor() {
    FakeWorker.all.push(this)
  }
  postMessage(request: Request) {
    this.requests.push(request)
  }
  reply(reply: Reply) {
    this.onmessage?.({ data: reply } as MessageEvent<Reply>)
  }
}
const upload = () => ({ arrayBuffer: async () => new ArrayBuffer(3) }) as File
const tick = () => new Promise((resolve) => setTimeout(resolve, 0))
beforeEach(() => {
  FakeWorker.all = []
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => vi.unstubAllGlobals())
test("opens, renders only requested pages and releases every pending request on disposal", async () => {
  const controller = new AbortController()
  const opening = openDocument(upload(), controller.signal)
  await tick()
  const worker = FakeWorker.all[0]!
  worker.reply({ id: 0, total: 1001 })
  const document = await opening
  expect(document.total).toBe(1001)
  const rendering = document.page(1000)
  worker.reply({ id: 99, page })
  worker.reply({ id: 1, page })
  expect(await rendering).toMatchObject({ width: 600, height: 800 })
  const pending = document.page(1).catch((error: unknown) => error)
  document.dispose()
  document.dispose()
  worker.onerror!()
  expect(await pending).toMatchObject({ name: "AbortError" })
  expect(worker.terminate).toHaveBeenCalledTimes(1)
  await expect(document.page(0)).rejects.toMatchObject({ name: "AbortError" })
})
test("terminates immediately on abort during parsing, ignoring stale replies", async () => {
  const controller = new AbortController()
  const opening = openDocument(upload(), controller.signal)
  await tick()
  const worker = FakeWorker.all[0]!
  const rejected = opening.catch((error: unknown) => error)
  controller.abort()
  worker.reply({ id: 0, total: 2 })
  expect(await rejected).toMatchObject({ name: "AbortError" })
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("does not start a worker for an already cancelled file", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(openDocument(upload(), controller.signal)).rejects.toMatchObject(
    { name: "AbortError" }
  )
  expect(FakeWorker.all).toHaveLength(0)
})
test.each([
  { id: 0, error: "protected" },
  { id: 0, total: 0 },
  { id: 0, page },
])("rejects invalid open responses and frees the worker", async (reply) => {
  const opening = openDocument(upload(), new AbortController().signal)
  const rejected = opening.catch((error: unknown) => error)
  await tick()
  FakeWorker.all[0]!.reply(reply as Reply)
  expect(await rejected).toBeInstanceOf(Error)
  expect(FakeWorker.all[0]!.terminate).toHaveBeenCalledOnce()
})
test.each(["onerror", "onmessageerror"] as const)(
  "reports worker startup %s and releases resources",
  async (event) => {
    const opening = openDocument(upload(), new AbortController().signal)
    const rejected = opening.catch((error: unknown) => error)
    await tick()
    FakeWorker.all[0]![event]!()
    expect(await rejected).toMatchObject({ message: "engineUnavailable" })
    expect(FakeWorker.all[0]!.terminate).toHaveBeenCalledOnce()
  }
)
test.each(["onerror", "onmessageerror"] as const)(
  "preserves runtime %s for pending and later page requests",
  async (event) => {
    const controller = new AbortController()
    const opening = openDocument(upload(), controller.signal)
    await tick()
    const worker = FakeWorker.all[0]!
    worker.reply({ id: 0, total: 2 })
    const document = await opening
    const first = document.page(0).catch((error: unknown) => error)
    const second = document.page(1).catch((error: unknown) => error)
    worker[event]!()
    worker.reply({ id: 1, page })
    controller.abort()
    document.dispose()
    expect(await first).toMatchObject({ message: "engineUnavailable" })
    expect(await second).toMatchObject({ message: "engineUnavailable" })
    await expect(document.page(1)).rejects.toThrow("engineUnavailable")
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
)
test("rejects malformed render responses without confusing them with pages", async () => {
  const opening = openDocument(upload(), new AbortController().signal)
  await tick()
  const worker = FakeWorker.all[0]!
  worker.reply({ id: 0, total: 1 })
  const document = await opening
  const rendering = document.page(0)
  worker.reply({ id: 1, total: 1 })
  await expect(rendering).rejects.toThrow("pageError")
  document.dispose()
})
