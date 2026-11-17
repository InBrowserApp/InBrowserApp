import { afterEach, expect, test, vi } from "vitest"
import { DEFAULT_SETTINGS } from "../core/settings"
import { encodeCompressed } from "./compressed"
vi.mock("./compressed", () => ({ encodeCompressed: vi.fn() }))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
  vi.clearAllMocks()
})

test("worker sends progress and transferable WAV bytes or an error", async () => {
  const worker = {
    onmessage: null as unknown as (event: MessageEvent) => Promise<void>,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", worker)
  await import("./encode")
  await worker.onmessage({
    data: {
      clips: [{ channels: [new Float32Array([1, 0])] }],
      settings: { ...DEFAULT_SETTINGS, format: "wav" },
    },
  } as MessageEvent)
  const [result, options] = worker.postMessage.mock.calls.at(-1)!
  expect(result.buffer.byteLength).toBe(48)
  expect(options.transfer).toEqual([result.buffer])
  expect(worker.postMessage).toHaveBeenCalledWith({ progress: 0 })
  expect(worker.postMessage).toHaveBeenCalledWith({ progress: 100 })
  await worker.onmessage({
    data: { clips: [], settings: { ...DEFAULT_SETTINGS, format: "wav" } },
  } as MessageEvent)
  expect(worker.postMessage).toHaveBeenLastCalledWith({ error: true })
})
test("worker lazy-loads compressed encoding and suppresses duplicate progress", async () => {
  const worker = {
    onmessage: null as unknown as (event: MessageEvent) => Promise<void>,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", worker)
  vi.mocked(encodeCompressed).mockImplementation(async (_, progress) => {
    progress(50)
    progress(50)
    return new ArrayBuffer(3)
  })
  await import("./encode")
  await worker.onmessage({
    data: { clips: [], settings: DEFAULT_SETTINGS },
  } as MessageEvent)
  expect(
    worker.postMessage.mock.calls.filter(([data]) => data.progress === 50)
  ).toHaveLength(1)
  expect(worker.postMessage.mock.calls.at(-1)![0].buffer.byteLength).toBe(3)
  vi.mocked(encodeCompressed).mockRejectedValueOnce(Error())
  await worker.onmessage({
    data: { clips: [], settings: DEFAULT_SETTINGS },
  } as MessageEvent)
  expect(worker.postMessage).toHaveBeenLastCalledWith({ error: true })
})
