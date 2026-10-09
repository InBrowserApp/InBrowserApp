import { afterEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({ open: vi.fn(), page: vi.fn(), free: vi.fn() }))
vi.mock("./engine", () => ({ openEngine: mock.open }))
afterEach(() => {
  self.onmessage = null
  vi.restoreAllMocks()
})
test("owns one parsed document, bounds page requests, and classifies errors", async () => {
  vi.resetModules()
  mock.open.mockResolvedValue({
    pageCount: () => 2,
    free: mock.free,
    renderPageSvg: mock.page,
  })
  mock.page.mockReturnValue("<svg/>")
  const send = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./worker")
  const request = (data: object) => self.onmessage!({ data } as MessageEvent)
  await request({ id: 0, type: "page", index: 0 })
  expect(send).toHaveBeenLastCalledWith({ id: 0, error: "pageError" })
  await request({ id: 1, type: "open", buffer: new ArrayBuffer(0) })
  expect(send).toHaveBeenLastCalledWith({ id: 1, total: 2 })
  await request({ id: 2, type: "page", index: 1 })
  expect(send).toHaveBeenLastCalledWith({ id: 2, page: "<svg/>" })
  for (const index of [-1, 2, 0.5])
    await request({ id: 3, type: "page", index })
  expect(send).toHaveBeenLastCalledWith({ id: 3, error: "pageError" })
  await request({ id: 4, type: "open", buffer: new ArrayBuffer(0) })
  expect(mock.free).toHaveBeenCalledOnce()
  mock.page.mockImplementation(() => {
    throw new Error("out of memory")
  })
  await request({ id: 5, type: "page", index: 0 })
  expect(send).toHaveBeenLastCalledWith({ id: 5, error: "resourceLimit" })
})
