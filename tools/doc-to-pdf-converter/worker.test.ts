import { afterEach, expect, test, vi } from "vitest"
import { parseDocument } from "./core/parse"
vi.mock("./core/parse", () => ({ parseDocument: vi.fn() }))
afterEach(() => {
  vi.resetAllMocks()
  vi.unstubAllGlobals()
  vi.resetModules()
})
test("returns parsed content and sanitized failures through the worker boundary", async () => {
  const worker = {
    onmessage: null as unknown as (event: unknown) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", worker)
  await import("./worker")
  const source = { html: "<p>body</p>", css: "" },
    data = { buffer: new ArrayBuffer(2), name: "report.doc" }
  vi.mocked(parseDocument).mockReturnValueOnce(source)
  worker.onmessage({ data })
  expect(worker.postMessage).toHaveBeenLastCalledWith({ source })
  vi.mocked(parseDocument).mockImplementationOnce(() => {
    throw new Error("protected")
  })
  worker.onmessage({ data })
  expect(worker.postMessage).toHaveBeenLastCalledWith({ error: "protected" })
})
