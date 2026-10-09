import { afterEach, expect, test, vi } from "vitest"
import { PdfAssets } from "./pdf-assets"

afterEach(() => vi.unstubAllGlobals())
test("loads bundled fonts, CMaps and WASM without accepting arbitrary resource URLs", async () => {
  const fetch = vi
    .fn()
    .mockResolvedValue(new Response(new Uint8Array([1, 2, 3])))
  vi.stubGlobal("fetch", fetch)
  const assets = new PdfAssets()
  await expect(
    assets.fetch({ kind: "standardFontDataUrl", filename: "FoxitSerif.pfb" })
  ).resolves.toEqual(new Uint8Array([1, 2, 3]))
  expect(fetch).toHaveBeenCalledWith(expect.stringContaining("FoxitSerif"))
  await expect(
    assets.fetch({ kind: "cMapUrl", filename: "../../evil" })
  ).rejects.toThrow("PDF_ASSET_UNAVAILABLE")
  await expect(
    assets.fetch({ kind: "unknown", filename: "x" })
  ).rejects.toThrow("PDF_ASSET_UNAVAILABLE")
  fetch.mockResolvedValueOnce(new Response(null, { status: 404 }))
  await expect(
    assets.fetch({ kind: "wasmUrl", filename: "openjpeg.wasm" })
  ).rejects.toThrow("PDF_ASSET_UNAVAILABLE")
})
