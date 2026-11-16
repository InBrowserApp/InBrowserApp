import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { centeredCrop, INITIAL_TRANSFORM } from "../core/crop"
import { drawImage, exportImage, loadImage } from "./image"

const ctx = {
  fillRect: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  drawImage: vi.fn(),
  fillStyle: "",
  imageSmoothingQuality: "",
}
const source = {
  image: {} as ImageBitmap,
  width: 800,
  height: 600,
  dispose: vi.fn(),
}

beforeEach(() => {
  vi.clearAllMocks()
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    ctx as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:source")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback, type) => callback(new Blob(["image"], { type }))
  )
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

describe("local image decoding", () => {
  it("rejects unsupported content without creating any URL", async () => {
    await expect(
      loadImage(new File(["text"], "file.svg", { type: "image/svg+xml" }))
    ).rejects.toThrow("UNSUPPORTED_IMAGE")
    expect(URL.createObjectURL).not.toHaveBeenCalled()
  })
  it("uses EXIF-aware bitmap decoding and releases the bitmap", async () => {
    const close = vi.fn()
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValue({ width: 600, height: 800, close })
    )
    const loaded = await loadImage(
      new File(["data"], "phone.jpg", { type: "image/jpeg" })
    )
    expect(loaded).toMatchObject({ width: 600, height: 800 })
    loaded.dispose()
    expect(close).toHaveBeenCalledOnce()
  })
  it.each([true, false])(
    "falls back to browser image decoding (bitmap available: %s)",
    async (bitmapAvailable) => {
      vi.stubGlobal(
        "createImageBitmap",
        bitmapAvailable ? vi.fn().mockRejectedValue(new Error()) : undefined
      )
      vi.spyOn(HTMLImageElement.prototype, "decode").mockResolvedValue(
        undefined
      )
      vi.spyOn(
        HTMLImageElement.prototype,
        "naturalWidth",
        "get"
      ).mockReturnValue(800)
      vi.spyOn(
        HTMLImageElement.prototype,
        "naturalHeight",
        "get"
      ).mockReturnValue(600)
      const loaded = await loadImage(
        new File(["data"], "test.png", { type: "image/png" })
      )
      expect(loaded).toMatchObject({ width: 800, height: 600 })
      loaded.dispose()
      expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:source")
    }
  )
  it("releases URLs when the fallback decoder fails", async () => {
    vi.stubGlobal("createImageBitmap", undefined)
    vi.spyOn(HTMLImageElement.prototype, "decode").mockRejectedValue(
      new Error("INVALID")
    )
    await expect(
      loadImage(new File(["bad"], "bad.png", { type: "image/png" }))
    ).rejects.toThrow("INVALID")
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:source")
  })
})

describe("canvas crop export", () => {
  it("translates the crop before rotating/flipping the original source", () => {
    const canvas = document.createElement("canvas")
    drawImage(
      canvas,
      source,
      { rotation: 90, flipHorizontal: true, flipVertical: true },
      { x: 10, y: 20, width: 200, height: 100 },
      0.5
    )
    expect(canvas.width).toBe(100)
    expect(canvas.height).toBe(50)
    expect(ctx.translate.mock.calls).toEqual([
      [-10, -20],
      [300, 400],
    ])
    expect(ctx.scale.mock.calls).toEqual([
      [0.5, 0.5],
      [-1, -1],
    ])
    expect(ctx.rotate).toHaveBeenCalledWith(Math.PI / 2)
    expect(ctx.drawImage).toHaveBeenCalledWith(source.image, -400, -300)
    expect(ctx.fillRect).not.toHaveBeenCalled()
  })
  it.each(["image/png", "image/jpeg", "image/webp"] as const)(
    "exports %s at native crop resolution and releases canvas memory",
    async (format) => {
      const result = await exportImage(
        source,
        "photo.png",
        centeredCrop(source, 1),
        INITIAL_TRANSFORM,
        format,
        92
      )
      expect(result).toMatchObject({ width: 600, height: 600 })
      expect(result.blob.type).toBe(format)
      expect(HTMLCanvasElement.prototype.toBlob).toHaveBeenCalledWith(
        expect.any(Function),
        format,
        0.92
      )
      const canvas = vi.mocked(HTMLCanvasElement.prototype.toBlob).mock
        .instances[0]! as HTMLCanvasElement
      expect(canvas.width).toBe(0)
      expect(canvas.height).toBe(0)
      expect(ctx.fillRect).toHaveBeenCalledTimes(
        format === "image/jpeg" ? 1 : 0
      )
      if (format === "image/jpeg") expect(ctx.fillStyle).toBe("#ffffff")
    }
  )
  it("uses the actual MIME type when a browser falls back to PNG", async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation(
      (callback) => callback(new Blob(["png"], { type: "image/png" }))
    )
    const result = await exportImage(
      source,
      "photo.jpg",
      centeredCrop(source),
      INITIAL_TRANSFORM,
      "image/webp",
      80
    )
    expect(result.name).toBe("photo-cropped.png")
  })
  it("reports null encodings and unavailable contexts", async () => {
    vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementation(
      (callback) => callback(null)
    )
    await expect(
      exportImage(
        source,
        "photo",
        centeredCrop(source),
        INITIAL_TRANSFORM,
        "image/png",
        92
      )
    ).rejects.toThrow("ENCODING_FAILED")
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null)
    await expect(
      exportImage(
        source,
        "photo",
        centeredCrop(source),
        INITIAL_TRANSFORM,
        "image/png",
        92
      )
    ).rejects.toThrow("CANVAS_UNAVAILABLE")
  })
})
