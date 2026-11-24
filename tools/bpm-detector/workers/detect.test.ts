import { afterEach, expect, it, vi } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it("posts the tempo result from the worker", async () => {
  const scope = {
    onmessage: null as unknown as (
      event: MessageEvent<Float32Array[][]>
    ) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./detect")
  scope.onmessage(
    new MessageEvent("message", { data: [[new Float32Array(100)]] })
  )
  expect(scope.postMessage).toHaveBeenCalledWith(null)
})
