import { mkdtemp, rm, writeFile } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"
import { gunzipSync } from "node:zlib"
import { expect, test, vi } from "vitest"
// @ts-expect-error The build-only plugin is a JavaScript Astro configuration helper.
import { gzipAssets } from "../apps/web/build/gzip-assets.mjs"

test("emits deterministic gzip bytes without emitting the original asset", async () => {
  const directory = await mkdtemp(join(tmpdir(), "gzip-assets-"))
  try {
    const path = join(directory, "engine.wasm")
    const input = Buffer.from("asset content".repeat(1000))
    await writeFile(path, input)
    const plugin = gzipAssets()
    plugin.configResolved({ command: "build" })
    const context = {
      resolve: vi.fn().mockResolvedValue({ id: path }),
      addWatchFile: vi.fn(),
      emitFile: vi.fn().mockReturnValue("asset0"),
    }
    expect(
      await plugin.resolveId.call(context, "ordinary", "entry")
    ).toBeUndefined()
    const id = await plugin.resolveId.call(
      context,
      "engine.wasm?gzip-url",
      "entry"
    )
    expect(await plugin.load.call(context, "ordinary")).toBeUndefined()
    expect(await plugin.load.call(context, id)).toBe(
      "export default import.meta.ROLLUP_FILE_URL_asset0"
    )
    const asset = context.emitFile.mock.calls[0]?.[0]
    expect(asset.name).toBe("engine.wasm.gz")
    expect(gunzipSync(asset.source)).toEqual(input)
    expect(context.emitFile).toHaveBeenCalledOnce()
    expect(context.addWatchFile).toHaveBeenCalledWith(path)
    await plugin.load.call(context, id)
    expect(context.emitFile.mock.calls[1]?.[0].source).toEqual(asset.source)
    context.resolve.mockResolvedValue(null)
    await expect(
      plugin.resolveId.call(context, "missing?gzip-url", "entry")
    ).rejects.toThrow("Cannot resolve")
  } finally {
    await rm(directory, { recursive: true })
  }
})

test("serves only resolved compressed assets during development", async () => {
  const directory = await mkdtemp(join(tmpdir(), "gzip-assets-"))
  try {
    const path = join(directory, "engine.wasm")
    await writeFile(path, "local asset")
    const plugin = gzipAssets()
    plugin.configResolved({ command: "serve" })
    const context = {
      resolve: vi.fn().mockResolvedValue({ id: path }),
      addWatchFile: vi.fn(),
      emitFile: vi.fn(),
    }
    const id = await plugin.resolveId.call(
      context,
      "engine.wasm?gzip-url",
      "entry"
    )
    const code = await plugin.load.call(context, id)
    const url = JSON.parse(code.replace("export default ", ""))
    const use = vi.fn()
    plugin.configureServer({ middlewares: { use } })
    const middleware = use.mock.calls[0]?.[0]
    const response = { setHeader: vi.fn(), end: vi.fn() }
    const next = vi.fn()
    middleware({ url: "/@gzip-assets/not-resolved.gz" }, response, next)
    expect(next).toHaveBeenCalledOnce()
    middleware({ url }, response, next)
    expect(response.setHeader).toHaveBeenCalledWith(
      "Content-Type",
      "application/gzip"
    )
    expect(gunzipSync(response.end.mock.calls[0]?.[0]).toString()).toBe(
      "local asset"
    )
    expect(context.emitFile).not.toHaveBeenCalled()
  } finally {
    await rm(directory, { recursive: true })
  }
})
