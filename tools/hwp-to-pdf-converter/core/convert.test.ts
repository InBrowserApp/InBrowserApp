import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { convert } from "./convert"
const mock = vi.hoisted(() => ({ prepare: vi.fn(), validate: vi.fn() }))
vi.mock("../prepare-svg", () => ({
  prepareSvg: mock.prepare,
  validateResources: mock.validate,
}))
let worker: FakeWorker
class FakeWorker {
  onmessage?: ((event: { data: unknown }) => void) | null
  onerror?: (() => void) | null
  onmessageerror?: (() => void) | null
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    // Capture the worker to drive asynchronous document lifecycle events.
    // oxlint-disable-next-line typescript/no-this-alias
    worker = this
  }
  reply(data: unknown) {
    this.onmessage?.({ data })
  }
}
const file = new File(["source"], "document.hwp")
beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal("Worker", FakeWorker)
  mock.prepare.mockResolvedValue("<svg/>")
  mock.validate.mockResolvedValue(undefined)
})
afterEach(() => vi.unstubAllGlobals())
async function start(
  signal = new AbortController().signal,
  progress = vi.fn()
) {
  const promise = convert(file, signal, progress)
  await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalled())
  return { promise }
}
test("validates resources and every page before assembling the downloadable PDF", async () => {
  const progress = vi.fn()
  const { promise } = await start(undefined, progress)
  const input = worker.postMessage.mock.calls[0]![0]
  expect(new TextDecoder().decode(input.bytes)).toBe("source")
  expect(worker.postMessage.mock.calls[0]![1]).toEqual([input.bytes.buffer])
  worker.reply({ type: "resources", resources: [] })
  await vi.waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith({ type: "continue" })
  )
  worker.reply({ type: "progress", stage: "engineLoading" })
  worker.reply({ type: "page", svg: "untrusted SVG", page: 1, total: 1 })
  await vi.waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith({
      type: "continue",
      svg: "<svg/>",
    })
  )
  expect(progress).toHaveBeenCalledWith({
    stage: "converting",
    page: 1,
    total: 1,
  })
  expect(mock.prepare).toHaveBeenCalledWith(
    "untrusted SVG",
    expect.any(AbortSignal)
  )
  worker.reply({
    type: "result",
    bytes: new TextEncoder().encode("%PDF-checked"),
    pages: 1,
  })
  const result = await promise
  expect(await result.pdf.text()).toBe("%PDF-checked")
  expect(result.pages).toBe(1)
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test.each([new Error("unsupported"), "invalid"])(
  "rejects unsafe page rendering without a result",
  async (reason) => {
    mock.prepare.mockRejectedValueOnce(reason)
    const { promise } = await start()
    worker.reply({ type: "page", svg: "bad", page: 3, total: 5 })
    await expect(promise).rejects.toMatchObject({
      message: "unsupported",
      page: 3,
    })
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
)
test("preserves worker failures and page numbers", async () => {
  const { promise } = await start()
  worker.reply({ type: "error", code: "protected", page: 2 })
  await expect(promise).rejects.toMatchObject({ message: "protected", page: 2 })
})
test.each(["onerror", "onmessageerror"] as const)(
  "handles worker %s",
  async (key) => {
    const { promise } = await start()
    worker[key]?.()
    await expect(promise).rejects.toThrow("engineUnavailable")
  }
)
test("cancellation interrupts an in-flight image check and never responds to stale work", async () => {
  let done!: () => void
  mock.validate.mockImplementationOnce(
    () =>
      new Promise<void>((resolve) => {
        done = resolve
      })
  )
  const controller = new AbortController()
  const { promise } = await start(controller.signal)
  worker.reply({ type: "resources", resources: [] })
  controller.abort()
  await expect(promise).rejects.toMatchObject({ name: "AbortError" })
  expect(mock.validate.mock.calls[0]![1].aborted).toBe(true)
  done()
  await Promise.resolve()
  await Promise.resolve()
  expect(worker.postMessage).toHaveBeenCalledTimes(1)
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("ignores a late page check after worker failure", async () => {
  let done!: (s: string) => void
  mock.prepare.mockImplementationOnce(
    () =>
      new Promise<string>((resolve) => {
        done = resolve
      })
  )
  const { promise } = await start()
  worker.reply({ type: "page", svg: "raw", page: 1, total: 1 })
  worker.onerror?.()
  await expect(promise).rejects.toThrow("engineUnavailable")
  done("<svg/>")
  await Promise.resolve()
  await Promise.resolve()
  expect(worker.postMessage).toHaveBeenCalledTimes(1)
})
test("does not begin cancelled reads", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(convert(file, controller.signal, vi.fn())).rejects.toMatchObject(
    { name: "AbortError" }
  )
})
test("checks cancellation after file bytes arrive", async () => {
  const controller = new AbortController()
  const file = {
    arrayBuffer: async () => {
      controller.abort()
      return new ArrayBuffer(0)
    },
  } as File
  await expect(convert(file, controller.signal, vi.fn())).rejects.toMatchObject(
    { name: "AbortError" }
  )
})
test("reports constructor and postMessage failures", async () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("unavailable")
      }
    }
  )
  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("engineUnavailable")
  vi.stubGlobal(
    "Worker",
    class extends FakeWorker {
      override postMessage = vi.fn(() => {
        throw new Error("post failed")
      })
    }
  )
  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("post failed")
  expect(worker.terminate).toHaveBeenCalledOnce()
})
