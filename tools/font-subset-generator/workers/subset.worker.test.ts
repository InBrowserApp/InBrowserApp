import { afterEach, describe, expect, it, vi } from "vitest"
import { generateSubset } from "./engine"
import type { SubsetOutput } from "../types"

vi.mock("./engine", () => ({ generateSubset: vi.fn() }))
afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetAllMocks()
})

describe("font worker entry", () => {
  async function run(error?: unknown, ok = true) {
    vi.resetModules()
    const scope = {
      onmessage: undefined as unknown as (event: {
        data: object
      }) => Promise<void>,
      postMessage: vi.fn(),
    }
    const input = { input: new ArrayBuffer(4), text: "A", format: "woff2" }
    const result = { output: new ArrayBuffer(4) } as SubsetOutput
    vi.stubGlobal("self", scope)
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok,
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(4)),
      })
    )
    if (error !== undefined) vi.mocked(generateSubset).mockRejectedValue(error)
    else vi.mocked(generateSubset).mockResolvedValue(result)
    await import("./subset.worker")
    await scope.onmessage({ data: input })
    return { scope, result }
  }
  it("fetches the bundled engine and transfers output", async () => {
    const { scope, result } = await run()
    expect(scope.postMessage).toHaveBeenCalledWith({ ok: true, result }, [
      result.output,
    ])
  })
  it("reports failed engine asset responses", async () => {
    const { scope } = await run(undefined, false)
    expect(scope.postMessage).toHaveBeenCalledWith({
      ok: false,
      error: "WORKER_ERROR",
    })
  })
  it.each([
    [new Error("INVALID_FONT"), "INVALID_FONT"],
    ["unknown", "GENERATION_ERROR"],
  ])("reports a processing error", async (error, message) => {
    const { scope } = await run(error)
    expect(scope.postMessage).toHaveBeenCalledWith({
      ok: false,
      error: message,
    })
  })
})
