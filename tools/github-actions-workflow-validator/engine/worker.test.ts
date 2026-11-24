// @vitest-environment node

import { gzipSync } from "node:zlib"
import { afterEach, expect, it, vi } from "vitest"

import { lintWithWasm } from "./actionlint"

vi.mock("./vendor/actionlint.wasm?gzip-url", () => ({
  default: "/actionlint.wasm.gz",
}))
vi.mock("./actionlint", () => ({ lintWithWasm: vi.fn() }))

afterEach(() => {
  vi.unstubAllGlobals()
  vi.resetModules()
  vi.clearAllMocks()
})

async function setupWorker(response: Response) {
  const self = {
    onmessage: undefined as
      | ((event: { data: string }) => Promise<void>)
      | undefined,
    postMessage: vi.fn(),
  }
  vi.stubGlobal("self", self)
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(response))
  await import("./worker")
  await self.onmessage!({ data: "on: push" })
  return self
}

it("inflates the WASM asset and relays diagnostics", async () => {
  vi.mocked(lintWithWasm).mockResolvedValue({ issues: [] })
  const asset = new Uint8Array([0, 97, 115, 109])
  const worker = await setupWorker(
    new Response(Uint8Array.from(gzipSync(asset)))
  )
  expect(lintWithWasm).toHaveBeenCalledWith(
    asset.buffer,
    "on: push",
    expect.any(Function)
  )
  expect(worker.postMessage).toHaveBeenCalledWith({ issues: [] })
})

it("reports asset-load failures to the editor", async () => {
  const worker = await setupWorker(new Response(null, { status: 404 }))
  expect(worker.postMessage).toHaveBeenCalledWith({
    error: expect.stringContaining("load"),
  })
})
