import { afterEach, expect, test, vi } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

test("worker returns transferable WAV bytes or an error", async () => {
  const worker = {
    onmessage: null as unknown as (event: MessageEvent) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", worker)
  await import("./encode")
  worker.onmessage({
    data: { clips: [{ channels: [new Float32Array([1, 0])] }], smooth: false },
  } as MessageEvent)
  const [result, options] = worker.postMessage.mock.calls[0]!
  expect(result.buffer.byteLength).toBe(48)
  expect(options.transfer).toEqual([result.buffer])
  worker.onmessage({ data: { clips: [], smooth: false } } as MessageEvent)
  expect(worker.postMessage).toHaveBeenLastCalledWith({ error: true })
})
