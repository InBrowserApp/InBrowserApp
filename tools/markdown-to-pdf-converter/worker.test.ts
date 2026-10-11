import { afterEach, expect, test, vi } from "vitest"
const mocks = vi.hoisted(() => ({ parse: vi.fn() }))
vi.mock("./core/parse", () => mocks)
afterEach(() => {
  vi.restoreAllMocks()
  vi.clearAllMocks()
})

test("reads a local file and returns HTML or a classified failure", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./worker")
  const bytes = new ArrayBuffer(2)
  const event = {
    data: { arrayBuffer: async () => bytes },
  } as MessageEvent<File>
  mocks.parse.mockReturnValue("<h1>Manual</h1>")
  await self.onmessage!(event)
  expect(mocks.parse).toHaveBeenCalledWith(new Uint8Array(bytes))
  expect(post).toHaveBeenCalledWith({ html: "<h1>Manual</h1>" })
  mocks.parse.mockImplementation(() => {
    throw new RangeError("allocation")
  })
  await self.onmessage!(event)
  expect(post).toHaveBeenLastCalledWith({ error: "resource" })
})
