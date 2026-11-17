import { afterEach, expect, it, vi } from "vitest"
import { exampleHar } from "../sample"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it("returns parsed captures and safe error codes from the worker", async () => {
  const scope = {
    postMessage: vi.fn(),
    onmessage: null as
      | ((event: { data: { text: () => Promise<string> } }) => Promise<void>)
      | null,
  }
  vi.stubGlobal("self", scope)
  await import("./parse.worker")
  await scope.onmessage!({ data: { text: async () => exampleHar() } })
  expect(scope.postMessage.mock.calls[0]?.[0].capture.entries).toHaveLength(9)
  await scope.onmessage!({ data: { text: async () => "{" } })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ error: "invalidJson" })
  await scope.onmessage!({ data: { text: () => Promise.reject("read error") } })
  expect(scope.postMessage).toHaveBeenLastCalledWith({ error: "readFailed" })
})
