import { afterEach, describe, expect, it, vi } from "vitest"
import type { DifferenceReply, DifferenceRequest } from "./difference.worker"

const originalHandler = self.onmessage

afterEach(() => {
  self.onmessage = originalHandler
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.resetModules()
})

function source() {
  return { width: 2, height: 1, close: vi.fn() } as unknown as ImageBitmap
}

function compareInWorker(data: DifferenceRequest) {
  self.dispatchEvent(new MessageEvent("message", { data }))
}

describe("difference worker", () => {
  it("clears between sources and reuses the original readback when tolerance changes", async () => {
    const before = source()
    const after = source()
    const output = new Uint8ClampedArray(8)
    const frame = source()
    const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
    const context = {
      drawImage: vi.fn(),
      clearRect: vi.fn(),
      getImageData: vi
        .fn()
        .mockReturnValueOnce({
          data: new Uint8ClampedArray([255, 0, 0, 255, 10, 10, 10, 255]),
        })
        .mockReturnValueOnce({
          data: new Uint8ClampedArray([0, 0, 0, 0, 11, 10, 10, 255]),
        }),
      createImageData: vi.fn(() => ({ data: output })),
      putImageData: vi.fn(),
    }
    vi.stubGlobal(
      "OffscreenCanvas",
      class {
        width = 2
        height = 1
        getContext = () => context
        transferToImageBitmap = () => frame
      }
    )

    await import("./difference.worker")
    compareInWorker({ before, after })
    expect(context.drawImage.mock.calls).toEqual([
      [before, 0, 0],
      [after, 0, 0],
    ])
    const [beforeDraw, afterDraw] = context.drawImage.mock.invocationCallOrder
    const [clear] = context.clearRect.mock.invocationCallOrder
    expect(beforeDraw).toBeLessThan(clear!)
    expect(clear).toBeLessThan(afterDraw!)
    expect(before.close).toHaveBeenCalledOnce()
    expect(after.close).toHaveBeenCalledOnce()

    compareInWorker(0)
    compareInWorker(10)
    expect(context.getImageData).toHaveBeenCalledTimes(2)
    expect(post).toHaveBeenNthCalledWith(
      1,
      {
        type: "result",
        tolerance: 0,
        bitmap: frame,
        changed: 2,
      } satisfies DifferenceReply,
      { transfer: [frame] }
    )
    expect(post).toHaveBeenNthCalledWith(
      2,
      {
        type: "result",
        tolerance: 10,
        bitmap: frame,
        changed: 1,
      } satisfies DifferenceReply,
      { transfer: [frame] }
    )
  })

  it("reports a canvas failure and releases both input bitmaps", async () => {
    const before = source()
    const after = source()
    const post = vi.spyOn(self, "postMessage").mockImplementation(() => {})
    vi.stubGlobal(
      "OffscreenCanvas",
      class {
        getContext = () => null
      }
    )

    await import("./difference.worker")
    compareInWorker({ before, after })

    expect(post).toHaveBeenCalledWith({ type: "error" })
    expect(before.close).toHaveBeenCalledOnce()
    expect(after.close).toHaveBeenCalledOnce()
  })
})
