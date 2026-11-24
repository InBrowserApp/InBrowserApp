import { afterEach, expect, it, vi } from "vitest"
import { modelDownloader } from "./model-download"

afterEach(() => vi.unstubAllGlobals())

it("falls back to Cache Storage when OPFS files cannot be written", async () => {
  const getFileHandle = vi.fn().mockResolvedValue({
    getFile: vi.fn().mockResolvedValue(new File([], "model.onnx")),
  })
  vi.stubGlobal("navigator", {
    storage: {
      getDirectory: vi.fn().mockResolvedValue({
        getDirectoryHandle: vi.fn().mockResolvedValue({ getFileHandle }),
      }),
    },
  })
  const cache = {
    match: vi.fn().mockResolvedValue(undefined),
    put: vi.fn().mockResolvedValue(undefined),
    delete: vi.fn().mockResolvedValue(true),
  }
  vi.stubGlobal("caches", { open: vi.fn().mockResolvedValue(cache) })
  vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response("incomplete")))
  const asset = { url: "https://example.com/model.onnx", size: 500_000_000 }
  const download = modelDownloader("test-models", [asset], vi.fn())

  // A short response exercises the storage path without transferring model weights.
  await expect(download(asset)).rejects.toThrow("Model download is incomplete")
  expect(getFileHandle).toHaveBeenCalledOnce()
  expect(cache.put).toHaveBeenCalledWith(asset.url, expect.any(Response))
  expect(cache.delete).toHaveBeenCalledWith(asset.url)
})
