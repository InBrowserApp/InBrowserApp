import { afterEach, describe, expect, test, vi } from "vitest"

import type { GifToAnimatedWebpWorkerRequest } from "./worker-types"

const mockConvertGifBytesToAnimatedWebp = vi.hoisted(() => vi.fn())

vi.mock("../core/animated-webp-conversion", () => ({
  convertGifBytesToAnimatedWebp: mockConvertGifBytesToAnimatedWebp,
  toArrayBuffer: (bytes: Uint8Array) => {
    const buffer = new ArrayBuffer(bytes.byteLength)

    new Uint8Array(buffer).set(bytes)

    return buffer
  },
}))

import {
  convertRequest,
  toWorkerErrorMessage,
} from "./gif-to-animated-webp.worker"

const request: GifToAnimatedWebpWorkerRequest = {
  id: 1,
  input: new Uint8Array([0x47, 0x49, 0x46]).buffer,
  options: {
    loopCount: 1,
    loopMode: "inherit",
    scale: 100,
    speed: 1,
  },
  outputName: "clip.webp",
}

afterEach(() => {
  mockConvertGifBytesToAnimatedWebp.mockReset()
  vi.unstubAllGlobals()
})

describe("GIF to animated WebP worker", () => {
  test("converts worker requests into transferable results", async () => {
    mockConvertGifBytesToAnimatedWebp.mockResolvedValue({
      bytes: new Uint8Array([1, 2, 3]),
      originalHeight: 20,
      originalWidth: 30,
      outputHeight: 20,
      outputName: "clip.webp",
      outputWidth: 30,
    })

    const result = await convertRequest(request)

    expect(mockConvertGifBytesToAnimatedWebp).toHaveBeenCalledWith(
      expect.any(Uint8Array),
      request.options,
      "clip.webp"
    )
    expect(result.buffer.byteLength).toBe(3)
    expect(result.outputName).toBe("clip.webp")
  })

  test("stringifies worker errors", () => {
    expect(toWorkerErrorMessage(new Error("INVALID_GIF"))).toBe("INVALID_GIF")
    expect(toWorkerErrorMessage("boom")).toBe("boom")
  })

  test("registers a message handler that posts converted results", async () => {
    vi.resetModules()
    mockConvertGifBytesToAnimatedWebp.mockResolvedValue({
      bytes: new Uint8Array([1, 2]),
      originalHeight: 10,
      originalWidth: 12,
      outputHeight: 10,
      outputName: "clip.webp",
      outputWidth: 12,
    })

    let messageListener:
      | ((event: MessageEvent<GifToAnimatedWebpWorkerRequest>) => Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./gif-to-animated-webp.worker")

    expect(messageListener).toBeTruthy()

    await messageListener!({
      data: request,
    } as MessageEvent<GifToAnimatedWebpWorkerRequest>)

    expect(postMessage).toHaveBeenCalledWith(
      {
        id: 1,
        ok: true,
        result: expect.objectContaining({
          outputName: "clip.webp",
        }),
      },
      [expect.any(ArrayBuffer)]
    )
  })

  test("posts worker failures as error messages", async () => {
    vi.resetModules()
    mockConvertGifBytesToAnimatedWebp.mockRejectedValue(new Error("EMPTY_GIF"))

    let messageListener:
      | ((event: MessageEvent<GifToAnimatedWebpWorkerRequest>) => Promise<void>)
      | null = null
    const postMessage = vi.fn()

    vi.stubGlobal("self", {
      addEventListener: vi.fn(
        (type: string, listener: typeof messageListener) => {
          if (type === "message") {
            messageListener = listener
          }
        }
      ),
      postMessage,
    })

    await import("./gif-to-animated-webp.worker")
    await messageListener!({
      data: request,
    } as MessageEvent<GifToAnimatedWebpWorkerRequest>)

    expect(postMessage).toHaveBeenCalledWith({
      id: 1,
      message: "EMPTY_GIF",
      ok: false,
    })
  })
})
