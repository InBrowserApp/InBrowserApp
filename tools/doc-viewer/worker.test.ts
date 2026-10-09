import { afterEach, expect, test, vi } from "vitest"
const parse = vi.hoisted(() => vi.fn())
vi.mock("./parse", () => ({ parseDocument: parse }))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})
test("worker returns parsed content or structured failures", async () => {
  const scope = {
    onmessage: null as unknown as (event: unknown) => Promise<void>,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./worker")
  parse.mockReturnValueOnce({ title: "Message" })
  await scope.onmessage({
    data: { buffer: new ArrayBuffer(1), name: "file.doc" },
  })
  expect(scope.postMessage).toHaveBeenLastCalledWith({
    document: { title: "Message" },
  })
  parse.mockImplementationOnce(() => {
    throw new RangeError("memory")
  })
  await scope.onmessage({
    data: { buffer: new ArrayBuffer(1), name: "file.doc" },
  })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ error: "resourceLimit" })
})
