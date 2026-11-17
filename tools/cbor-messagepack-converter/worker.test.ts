import { afterEach, expect, test, vi } from "vitest"

const request = {
  input: "true",
  format: "cbor",
  direction: "encode",
  representation: "hex",
  extended: false,
}
afterEach(() => {
  vi.restoreAllMocks()
  vi.resetModules()
})

test("worker returns conversion result and serializable errors", async () => {
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./worker")
  self.onmessage?.call(self, { data: request } as MessageEvent)
  expect(post).toHaveBeenLastCalledWith(
    expect.objectContaining({ result: expect.objectContaining({ text: "f5" }) })
  )
  self.onmessage?.call(self, {
    data: { ...request, input: "{" },
  } as MessageEvent)
  expect(post).toHaveBeenLastCalledWith({ error: expect.any(String) })
})

test("worker handles non-Error exceptions", async () => {
  vi.doMock("./core/convert", () => ({
    convert: () => {
      throw "failed"
    },
  }))
  const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  await import("./worker")
  self.onmessage?.call(self, { data: request } as MessageEvent)
  expect(post).toHaveBeenLastCalledWith({ error: "failed" })
  vi.doUnmock("./core/convert")
})
