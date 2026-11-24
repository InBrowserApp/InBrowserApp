import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import type { Reply } from "./histogram.worker"

const bitmap = { width: 1025, height: 1, close: vi.fn() }
const context = {
  clearRect: vi.fn(),
  drawImage: vi.fn(),
  getImageData: vi.fn(() => ({ data: Uint8ClampedArray.of(255, 0, 0, 255) })),
}
const preview = new Blob()
const postMessage = vi.fn()
const getContext = vi.fn(() => context)
const decode = vi.fn(async () => bitmap)

class Canvas {
  getContext = getContext
  convertToBlob = vi.fn(async () => preview)

  constructor(
    public width: number,
    public height: number
  ) {}
}

async function loadWorker() {
  vi.resetModules()
  await import("./histogram.worker")
  return self.onmessage as unknown as (event: {
    data: File | "sample"
  }) => Promise<void>
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal("OffscreenCanvas", Canvas)
  vi.stubGlobal("createImageBitmap", decode)
  vi.stubGlobal("postMessage", postMessage)
})

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("histogram worker", () => {
  it("reads partial edge tiles at native size and creates a bounded preview", async () => {
    const handle = await loadWorker()
    const file = new File(["image"], "photo.png")
    await handle({ data: file })

    expect(decode).toHaveBeenCalledWith(file)
    expect(context.drawImage).toHaveBeenNthCalledWith(
      1,
      bitmap,
      0,
      0,
      1024,
      1,
      0,
      0,
      1024,
      1
    )
    expect(context.drawImage).toHaveBeenNthCalledWith(
      2,
      bitmap,
      1024,
      0,
      1,
      1,
      0,
      0,
      1,
      1
    )
    expect(context.drawImage).toHaveBeenNthCalledWith(3, bitmap, 0, 0, 1024, 1)
    const reply = postMessage.mock.calls[0]![0] as Reply
    expect(reply).toMatchObject({
      width: 1025,
      height: 1,
      preview,
      histogram: { pixels: 2 },
    })
    expect(reply?.histogram.bins.red[255]).toBe(2)
    expect(bitmap.close).toHaveBeenCalledOnce()
  })

  it("loads the bundled sample only on request", async () => {
    const fetch = vi.fn(async () => new Response(preview))
    vi.stubGlobal("fetch", fetch)
    const handle = await loadWorker()
    await handle({ data: "sample" })
    expect(fetch).toHaveBeenCalledWith(expect.any(URL))
    expect(postMessage).toHaveBeenCalledWith(
      expect.objectContaining({ width: 1025 })
    )
  })

  it("reports decoding and canvas failures and closes decoded bitmaps", async () => {
    const handle = await loadWorker()
    const file = new File(["bad"], "photo.png")
    decode.mockRejectedValueOnce(new Error("Could not decode"))
    await handle({ data: file })
    expect(postMessage).toHaveBeenLastCalledWith(null)
    expect(bitmap.close).not.toHaveBeenCalled()

    getContext.mockReturnValueOnce(null as unknown as typeof context)
    await handle({ data: file })
    expect(postMessage).toHaveBeenLastCalledWith(null)
    expect(bitmap.close).toHaveBeenCalledOnce()
  })
})
