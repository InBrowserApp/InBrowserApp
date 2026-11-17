import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { processFont } from "./processor"
import type { SubsetOutput } from "../types"

let worker: {
  onmessage: (event: MessageEvent) => void
  onerror: () => void
  onmessageerror: () => void
  postMessage: ReturnType<typeof vi.fn>
  terminate: ReturnType<typeof vi.fn>
}
beforeEach(() => {
  worker = {
    onmessage: vi.fn(),
    onerror: vi.fn(),
    onmessageerror: vi.fn(),
    postMessage: vi.fn(),
    terminate: vi.fn(),
  }
  vi.stubGlobal(
    "Worker",
    vi.fn(function () {
      return worker
    })
  )
})
afterEach(() => vi.unstubAllGlobals())
const file = () =>
  ({
    arrayBuffer: vi.fn().mockResolvedValue(new ArrayBuffer(8)),
  }) as unknown as File
const options = { text: "A", format: "woff2" } as const
const started = async (signal = new AbortController().signal) => {
  const promise = processFont(file(), options, signal)
  await Promise.resolve()
  return { promise }
}

describe("disposable font workers", () => {
  it("transfers input, returns output and terminates the worker", async () => {
    const { promise } = await started()
    expect(worker.postMessage).toHaveBeenCalledWith(
      { ...options, input: expect.any(ArrayBuffer) },
      [expect.any(ArrayBuffer)]
    )
    const output = { output: new ArrayBuffer(4) } as SubsetOutput
    worker.onmessage({ data: { ok: true, result: output } } as MessageEvent)
    await expect(promise).resolves.toBe(output)
    expect(worker.terminate).toHaveBeenCalledOnce()
  })
  it("returns worker errors and always releases resources", async () => {
    const { promise } = await started()
    worker.onmessage({
      data: { ok: false, error: "INVALID_FONT" },
    } as MessageEvent)
    await expect(promise).rejects.toThrow("INVALID_FONT")
    expect(worker.terminate).toHaveBeenCalledOnce()
  })
  it.each(["onerror", "onmessageerror"] as const)(
    "handles %s",
    async (event) => {
      const { promise } = await started()
      worker[event]()
      await expect(promise).rejects.toThrow("WORKER_ERROR")
      expect(worker.terminate).toHaveBeenCalledOnce()
    }
  )
  it("handles worker startup failure", async () => {
    vi.stubGlobal(
      "Worker",
      class {
        constructor() {
          throw new Error("blocked")
        }
      }
    )
    await expect(
      processFont(file(), options, new AbortController().signal)
    ).rejects.toThrow("WORKER_ERROR")
  })
  it("aborts running work and avoids starting work after an early abort", async () => {
    const controller = new AbortController()
    const { promise } = await started(controller.signal)
    controller.abort(new Error("Canceled"))
    await expect(promise).rejects.toThrow("Canceled")
    expect(worker.terminate).toHaveBeenCalledOnce()
    await expect(
      processFont(file(), options, controller.signal)
    ).rejects.toThrow("Canceled")
  })
})
