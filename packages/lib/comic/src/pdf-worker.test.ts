import { afterEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({ convert: vi.fn() }))
vi.mock("./convert-pdf", () => ({ convertPdf: mock.convert }))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
  vi.resetAllMocks()
})
test("forwards progress, complete results and failures", async () => {
  const post = vi.fn()
  vi.stubGlobal("postMessage", post)
  vi.stubGlobal("onmessage", null)
  await import("./pdf-worker")
  const handler = globalThis.onmessage as unknown as (event: {
    data: File
  }) => Promise<void>
  const data = new File(["zip"], "comic.cbz")
  const result = { pdf: new Blob(), names: ["1.png"] }
  const progress = { page: 1, total: 1, name: "1.png", saving: false }
  mock.convert.mockImplementationOnce(async (_file, _signal, update) => {
    update(progress)
    return result
  })
  await handler({ data })
  expect(post).toHaveBeenNthCalledWith(1, { type: "progress", progress })
  expect(post).toHaveBeenNthCalledWith(2, { type: "result", result })
  mock.convert.mockRejectedValueOnce(new RangeError("allocation"))
  await handler({ data })
  expect(post).toHaveBeenLastCalledWith({
    type: "error",
    error: { code: "resourceLimit" },
  })
})
