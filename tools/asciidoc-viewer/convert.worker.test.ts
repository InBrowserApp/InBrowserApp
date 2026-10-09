import { afterEach, expect, test, vi } from "vitest"
const mocks = vi.hoisted(() => ({ convert: vi.fn(), decode: vi.fn() }))
vi.mock("./core/convert", () => mocks)
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

test("the worker reads locally and returns conversion output or a classified failure", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./convert.worker")
  const bytes = new ArrayBuffer(2)
  const event = {
    data: { arrayBuffer: async () => bytes },
  } as MessageEvent<File>
  mocks.decode.mockReturnValue("Manual")
  mocks.convert.mockResolvedValue({ html: "<h1>Manual</h1>", warnings: false })
  await self.onmessage!(event)
  expect(mocks.decode).toHaveBeenCalledWith(new Uint8Array(bytes))
  expect(post).toHaveBeenCalledWith({
    result: { html: "<h1>Manual</h1>", warnings: false },
  })
  mocks.convert.mockRejectedValue(new RangeError("allocation"))
  await self.onmessage!(event)
  expect(post).toHaveBeenLastCalledWith({ error: "resourceLimit" })
})
