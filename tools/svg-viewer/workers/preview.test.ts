import { afterEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({
  read: vi.fn(),
  failure: vi.fn(() => "invalid"),
}))
vi.mock("../core/read", () => mock)
afterEach(() => vi.restoreAllMocks())
test("passes complete worker results and classified failures back to the owner", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./preview")
  const file = new File(["x"], "a.svg")
  mock.read.mockResolvedValueOnce({ svg: "safe" })
  await self.onmessage!({ data: file } as MessageEvent)
  expect(post).toHaveBeenLastCalledWith({ preview: { svg: "safe" } })
  mock.read.mockRejectedValueOnce(new Error("bad"))
  await self.onmessage!({ data: file } as MessageEvent)
  expect(post).toHaveBeenLastCalledWith({ error: "invalid" })
})
