import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { prepareCover } from "./cover"

const png = new Blob([
  Uint8Array.of(0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a),
])
const jpeg = new Blob([Uint8Array.of(0xff, 0xd8, 0xff, 0xe0)])

const decode = vi.fn()
const fillRect = vi.fn()
const drawImage = vi.fn()
const context = { fillRect, drawImage } as unknown as CanvasRenderingContext2D

describe("EPUB cover images", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "Image",
      class {
        src = ""
        naturalWidth = 320
        naturalHeight = 480
        decode = decode
      }
    )
    decode.mockResolvedValue(undefined)
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image")
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(context)
    vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
      (done, type) => done(new Blob(["converted"], { type }))
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.clearAllMocks()
  })

  it("identifies images from bytes and retains matching formats without conversion", async () => {
    const output = await prepareCover(png, null)
    expect(output.type).toBe("image/png")
    expect(await output.arrayBuffer()).toEqual(await png.arrayBuffer())
    expect((await prepareCover(jpeg, "image/jpeg")).type).toBe("image/jpeg")
    expect(drawImage).not.toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  })

  it("converts a replacement to the existing cover type without changing its dimensions", async () => {
    const output = await prepareCover(png, "image/jpeg")
    expect(output.type).toBe("image/jpeg")
    expect(await output.text()).toBe("converted")
    expect(fillRect).toHaveBeenCalledWith(0, 0, 320, 480)
    expect(drawImage).toHaveBeenCalledWith(expect.anything(), 0, 0)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:image")

    fillRect.mockClear()
    expect((await prepareCover(jpeg, "image/png")).type).toBe("image/png")
    expect(fillRect).not.toHaveBeenCalled()
  })

  it("rejects an invalid or unreadable cover and releases the preview URL", async () => {
    await expect(prepareCover(new Blob(["not a cover"]), null)).rejects.toThrow(
      "invalid"
    )
    expect(URL.createObjectURL).not.toHaveBeenCalled()
    decode.mockRejectedValueOnce(new Error("decode failed"))
    await expect(prepareCover(png, null)).rejects.toThrow("decode failed")
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:image")
  })

  it("fails cleanly if the browser cannot produce the requested cover type", async () => {
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
    await expect(prepareCover(png, "image/jpeg")).rejects.toThrow("invalid")
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
      (done) => done(null)
    )
    await expect(prepareCover(png, "image/jpeg")).rejects.toThrow("invalid")
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
      (done) => done(new Blob(["other"], { type: "image/png" }))
    )
    await expect(prepareCover(png, "image/jpeg")).rejects.toThrow("invalid")
  })
})
