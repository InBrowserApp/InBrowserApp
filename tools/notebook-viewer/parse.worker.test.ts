import { afterEach, expect, test, vi } from "vitest"
const mocks = vi.hoisted(() => ({ parse: vi.fn(), decode: vi.fn() }))
vi.mock("./core/parse", () => ({ parse: mocks.parse }))
vi.mock("./core/failure", async (original) => ({
  ...(await original<object>()),
  decode: mocks.decode,
}))
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

test("the worker reads locally and returns conversion output or a classified failure", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./parse.worker")
  const bytes = new ArrayBuffer(2)
  const event = {
    data: { arrayBuffer: async () => bytes },
  } as MessageEvent<File>
  mocks.decode.mockReturnValue("Manual")
  mocks.parse.mockReturnValue({ cells: [] })
  await self.onmessage!(event)
  expect(mocks.decode).toHaveBeenCalledWith(new Uint8Array(bytes))
  expect(post).toHaveBeenCalledWith({
    result: { cells: [] },
  })
  mocks.parse.mockImplementation(() => {
    throw new RangeError("allocation")
  })
  await self.onmessage!(event)
  expect(post).toHaveBeenLastCalledWith({ error: "resourceLimit" })
})
