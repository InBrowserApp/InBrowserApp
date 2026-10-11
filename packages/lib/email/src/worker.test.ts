import { afterEach, expect, test, vi } from "vitest"
const parse = vi.hoisted(() => vi.fn())
vi.mock("./parse", () => ({ parseEmail: parse }))
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
  parse.mockResolvedValueOnce({ subject: "Message" })
  await scope.onmessage({
    data: { buffer: new ArrayBuffer(1), name: "file.eml" },
  })
  expect(scope.postMessage).toHaveBeenLastCalledWith({
    email: { subject: "Message" },
  })
  parse.mockRejectedValueOnce(new RangeError("memory"))
  await scope.onmessage({
    data: { buffer: new ArrayBuffer(1), name: "file.eml" },
  })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ error: "resourceLimit" })
  const buffer = new ArrayBuffer(1)
  parse.mockResolvedValueOnce({ attachments: [] })
  await scope.onmessage({
    data: { buffer, name: "file.msg", options: { attachmentBytes: "all" } },
  })
  expect(parse).toHaveBeenLastCalledWith(buffer, "file.msg", {
    attachmentBytes: "all",
  })
})
