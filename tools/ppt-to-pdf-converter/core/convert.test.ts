import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { convert } from "./convert"

let worker: FakeWorker
class FakeWorker {
  onmessage?: (event: { data: unknown }) => void
  onerror?: () => void
  onmessageerror?: () => void
  terminate = vi.fn()
  postMessage = vi.fn()
  constructor() {
    // Capture the browser-created worker to deliver test events.
    // oxlint-disable-next-line typescript/no-this-alias
    worker = this
  }
  reply(data: unknown) {
    this.onmessage?.({ data })
  }
}
const file = new File(["presentation"], "deck.ppt")
beforeEach(() => {
  vi.stubGlobal("crossOriginIsolated", true)
  vi.stubGlobal("Worker", FakeWorker)
})
afterEach(() => vi.unstubAllGlobals())
async function begin(
  signal = new AbortController().signal,
  progress = vi.fn()
) {
  const result = convert(file, signal, progress)
  await vi.waitFor(() => expect(worker.postMessage).toHaveBeenCalled())
  return { result }
}
test("transfers the file, reports stages, and disposes the worker after receiving the checked PDF", async () => {
  const progress = vi.fn()
  const { result } = await begin(undefined, progress)
  const input = worker.postMessage.mock.calls[0]![0] as ArrayBuffer
  expect(new TextDecoder().decode(input)).toBe("presentation")
  expect(worker.postMessage.mock.calls[0]![1]).toEqual([input])
  worker.reply({ type: "progress", stage: "engineLoading" })
  expect(progress).toHaveBeenCalledWith("engineLoading")
  const bytes = new TextEncoder().encode("%PDF-output").buffer
  worker.reply({ type: "result", bytes, pages: 3 })
  const output = await result
  expect(output.pages).toBe(3)
  expect(await output.pdf.text()).toBe("%PDF-output")
  expect(output.pdf.type).toBe("application/pdf")
  worker.onerror?.()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test.each(["crossOriginIsolated", "SharedArrayBuffer"])(
  "requires %s",
  async (name) => {
    vi.stubGlobal(name, undefined)
    await expect(
      convert(file, new AbortController().signal, vi.fn())
    ).rejects.toThrow("engineUnavailable")
  }
)
test("preserves structured conversion failures and terminates", async () => {
  const { result } = await begin()
  worker.reply({ type: "error", code: "protected" })
  await expect(result).rejects.toThrow("protected")
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test.each(["onerror", "onmessageerror"] as const)(
  "cleans up after %s",
  async (name) => {
    const { result } = await begin()
    worker[name]?.()
    await expect(result).rejects.toThrow("engineUnavailable")
    expect(worker.terminate).toHaveBeenCalledOnce()
  }
)
test("cancels work immediately and ignores late worker messages", async () => {
  const controller = new AbortController()
  const progress = vi.fn()
  const { result } = await begin(controller.signal, progress)
  controller.abort()
  worker.reply({ type: "progress", stage: "converting" })
  await expect(result).rejects.toMatchObject({ name: "AbortError" })
  expect(progress).not.toHaveBeenCalled()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
test("does not start work for an already cancelled file", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(convert(file, controller.signal, vi.fn())).rejects.toMatchObject(
    { name: "AbortError" }
  )
})
test("checks cancellation after reading input bytes", async () => {
  const controller = new AbortController()
  const source = {
    arrayBuffer: async () => {
      controller.abort()
      return new ArrayBuffer(0)
    },
  } as File
  await expect(
    convert(source, controller.signal, vi.fn())
  ).rejects.toMatchObject({ name: "AbortError" })
})
test("maps worker allocation failure without keeping a pending operation", async () => {
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new RangeError("allocation failed")
      }
    }
  )
  await expect(
    convert(file, new AbortController().signal, vi.fn())
  ).rejects.toThrow("resource")
})
