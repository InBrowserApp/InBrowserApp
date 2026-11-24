import { expect, it, vi } from "vitest"
import { compress } from "woff2-encoder"
import type { ConversionResult } from "../types"

vi.mock("woff2-encoder", () => ({ compress: vi.fn() }))

it("converts TrueType and CFF OpenType files and continues past malformed input", async () => {
  const scope = {
    postMessage:
      vi.fn<(result: ConversionResult, transfer?: Transferable[]) => void>(),
    onmessage: vi.fn<(event: MessageEvent<File[]>) => Promise<void>>(),
  }
  vi.stubGlobal("self", scope)
  try {
    await import("./convert.worker")
    const encoded = new Uint8Array([0x77, 0x4f, 0x46, 0x32])
    vi.mocked(compress)
      .mockResolvedValueOnce(encoded)
      .mockRejectedValueOnce(new Error("Bad font"))
      .mockResolvedValueOnce(encoded)
    const ttf = new File([new Uint8Array([0, 1, 0, 0])], "ok.ttf")
    const otf = new File(["OTTO"], "ok.otf")
    const malformed = new File(["test"], "invalid.ttf")
    const empty = new File([], "empty.ttf")
    await scope.onmessage(
      new MessageEvent("message", { data: [ttf, empty, malformed, ttf, otf] })
    )
    expect(compress).toHaveBeenCalledTimes(3)
    expect(scope.postMessage).toHaveBeenNthCalledWith(
      1,
      { index: 0, output: encoded.buffer },
      [encoded.buffer]
    )
    for (const index of [1, 2, 3]) {
      expect(scope.postMessage).toHaveBeenNthCalledWith(index + 1, {
        index,
        output: null,
      })
    }
    expect(scope.postMessage).toHaveBeenNthCalledWith(
      5,
      { index: 4, output: encoded.buffer },
      [encoded.buffer]
    )
  } finally {
    vi.unstubAllGlobals()
  }
})
