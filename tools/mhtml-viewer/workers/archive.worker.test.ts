import { expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({ convert: vi.fn() }))
vi.mock("../convert-archive", () => ({
  convertArchive: mock.convert,
  failure: () => "invalid",
}))

test("worker reads byte-preserving files and returns converted archives or errors", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./archive.worker")
  const file = { arrayBuffer: async () => new Uint8Array([1, 2]).buffer }
  mock.convert.mockResolvedValueOnce({ source: "safe" })
  await self.onmessage!({ data: file } as unknown as MessageEvent)
  expect(mock.convert).toHaveBeenCalledWith(new Uint8Array([1, 2]))
  expect(post).toHaveBeenLastCalledWith({ result: { source: "safe" } })
  mock.convert.mockRejectedValueOnce(new Error("bad"))
  await self.onmessage!({ data: file } as unknown as MessageEvent)
  expect(post).toHaveBeenLastCalledWith({ error: "invalid" })
  post.mockRestore()
  self.onmessage = null
})
