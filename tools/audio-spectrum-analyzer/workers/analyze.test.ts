import { afterEach, expect, it, vi } from "vitest"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it("transfers the measured bins to the page", async () => {
  const scope = {
    onmessage: null as unknown as (event: MessageEvent<Float32Array[]>) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./analyze")
  scope.onmessage(
    new MessageEvent("message", { data: [new Float32Array(100)] })
  )
  const result = scope.postMessage.mock.lastCall?.[0]
  expect(result.peak).toBe(0)
  expect(scope.postMessage).toHaveBeenCalledWith(result, {
    transfer: [result.levels.buffer],
  })
})
