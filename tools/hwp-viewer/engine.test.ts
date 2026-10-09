import { afterEach, beforeEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({
  init: vi.fn(),
  preflight: vi.fn(),
  free: vi.fn(),
  count: vi.fn(),
  measure: vi.fn(),
  construct: vi.fn(),
}))
vi.mock("@rhwp/core", () => ({
  default: mock.init,
  HwpDocument: class {
    constructor(bytes: Uint8Array) {
      mock.construct(bytes)
    }
    pageCount = mock.count
    free = mock.free
  },
}))
vi.mock("./preflight", () => ({ preflight: mock.preflight }))
import { openEngine } from "./engine"
beforeEach(() => {
  vi.resetAllMocks()
  mock.count.mockReturnValue(2)
  mock.measure.mockReturnValue({ width: 18 })
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return { font: "", measureText: mock.measure }
      }
    }
  )
})
afterEach(() => {
  vi.unstubAllGlobals()
  Reflect.deleteProperty(globalThis, "measureTextWidth")
})
test("registers worker font measurement before WASM initialization and opens bytes", async () => {
  mock.init.mockImplementation(() => {
    expect(
      Reflect.get(globalThis, "measureTextWidth")("12px serif", "한글")
    ).toBe(18)
  })
  const bytes = new Uint8Array([1])
  const result = await openEngine(bytes)
  expect(mock.preflight).toHaveBeenCalledWith(bytes)
  expect(mock.construct).toHaveBeenCalledWith(bytes)
  expect(result.pageCount()).toBe(2)
})
test("disposes an empty engine document", async () => {
  mock.count.mockReturnValue(0)
  await expect(openEngine(new Uint8Array())).rejects.toThrow("empty")
  expect(mock.free).toHaveBeenCalledOnce()
})
test("explains missing renderer capabilities and failed WASM downloads", async () => {
  vi.stubGlobal("OffscreenCanvas", undefined)
  await expect(openEngine(new Uint8Array())).rejects.toThrow(
    "browserUnsupported"
  )
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return null
      }
    }
  )
  await expect(openEngine(new Uint8Array())).rejects.toThrow(
    "browserUnsupported"
  )
})
test("distinguishes engine load failure from a document parsing failure", async () => {
  mock.init.mockRejectedValue(new TypeError("fetch failed"))
  await expect(openEngine(new Uint8Array())).rejects.toThrow(
    "engineUnavailable"
  )
})
