import { afterEach, expect, it, vi } from "vitest"
import { selectFrames } from "../core/spectrum"
import type { Request } from "./analyze"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
})

it("transfers the measured bins to the page", async () => {
  const scope = {
    onmessage: null as unknown as (event: MessageEvent<Request>) => void,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", scope)
  await import("./analyze")
  scope.onmessage(
    new MessageEvent("message", { data: selectFrames([new Float32Array(100)]) })
  )
  const result = scope.postMessage.mock.lastCall?.[0]
  expect(result.peak).toBeNull()
  expect(scope.postMessage).toHaveBeenCalledWith(result, {
    transfer: [result.levels.buffer],
  })
})
