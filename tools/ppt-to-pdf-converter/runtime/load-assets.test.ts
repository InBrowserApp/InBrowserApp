import { Blob as NodeBlob } from "node:buffer"
import { gzipSync } from "node:zlib"
import { afterEach, expect, test, vi } from "vitest"
import { loadAssets } from "./load-assets"

vi.mock("./assets", () => ({
  files: {
    engine: "/engine.js",
    wasm: ["/wasm-a", "/wasm-b"],
    data: ["/data"],
    cjk: "/cjk",
    thai: "/thai",
    devanagari: "/devanagari",
  },
}))
afterEach(() => vi.unstubAllGlobals())
test("loads only self-hosted assets and inflates reassembled engine chunks", async () => {
  vi.stubGlobal("Blob", NodeBlob)
  const wasm = gzipSync("wasm bytes")
  const content: Record<string, Uint8Array> = {
    "/wasm-a": wasm.subarray(0, 10),
    "/wasm-b": wasm.subarray(10),
    "/data": gzipSync("archive"),
    "/cjk": new Uint8Array([1]),
    "/thai": new Uint8Array([2]),
    "/devanagari": new Uint8Array([3]),
  }
  const fetcher = vi.fn(
    async (url: string, _options?: RequestInit) =>
      new Response(Uint8Array.from(content[url]!))
  )
  vi.stubGlobal("fetch", fetcher)
  const assets = await loadAssets()
  expect(new TextDecoder().decode(assets.binary)).toBe("wasm bytes")
  expect(new TextDecoder().decode(assets.archive)).toBe("archive")
  expect(assets.fonts.map((font) => new Uint8Array(font)[0])).toEqual([1, 2, 3])
  expect(assets.engine).toBe(new URL("/engine.js", location.href).href)
  expect(fetcher).toHaveBeenCalledTimes(6)
  for (const call of fetcher.mock.calls)
    expect(call[1]).toEqual({ credentials: "omit", redirect: "error" })
})
test("rejects missing runtime assets", async () => {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => new Response(null, { status: 404 }))
  )
  await expect(loadAssets()).rejects.toThrow("Asset unavailable")
})
