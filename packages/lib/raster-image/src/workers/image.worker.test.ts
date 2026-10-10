import { afterEach, expect, test, vi } from "vitest"
const mock = vi.hoisted(() => ({ open: vi.fn(), render: vi.fn() }))
vi.mock("./decode", () => ({ openImage: mock.open, renderImage: mock.render }))
afterEach(() => vi.unstubAllGlobals())
test("transfers owned previews and classifies decoder errors", async () => {
  const target = {
    postMessage: vi.fn(),
    onmessage: null as unknown as (event: unknown) => Promise<void>,
  }
  vi.stubGlobal("self", target)
  await import("./image.worker")
  const preview = { mime: "image/png", bytes: new Uint8Array([1, 2, 3]) }
  mock.open.mockResolvedValue({ info: { count: 1 }, preview })
  await target.onmessage({ data: { id: 1, type: "open", file: "source" } })
  expect(mock.open).toHaveBeenCalledWith("source", undefined)
  expect(target.postMessage).toHaveBeenLastCalledWith(
    { id: 1, type: "opened", result: { info: { count: 1 }, preview } },
    { transfer: [preview.bytes.buffer] }
  )
  mock.render.mockReturnValue(preview)
  await target.onmessage({ data: { id: 2, type: "render", index: 3 } })
  expect(mock.render).toHaveBeenCalledWith(3, undefined)
  expect(target.postMessage).toHaveBeenLastCalledWith(
    { id: 2, type: "rendered", preview },
    { transfer: [preview.bytes.buffer] }
  )
  mock.render.mockImplementation(() => {
    throw new RangeError("allocation")
  })
  await target.onmessage({ data: { id: 3, type: "render", index: 4 } })
  expect(target.postMessage).toHaveBeenLastCalledWith(
    { id: 3, type: "error", failure: "resourceLimit" },
    { transfer: [] }
  )
})
