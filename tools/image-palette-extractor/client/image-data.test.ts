import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { isImageFile, loadImageData, scaleDimensions } from "./image-data"

const originalGetContext = HTMLCanvasElement.prototype.getContext

function makeImageData() {
  return typeof ImageData === "undefined"
    ? ({
        data: Uint8ClampedArray.from([0, 0, 0, 255]),
        height: 1,
        width: 1,
      } as ImageData)
    : new ImageData(Uint8ClampedArray.from([0, 0, 0, 255]), 1, 1)
}

function mockCanvasContext() {
  const context = {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => makeImageData()),
  }

  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: vi.fn(() => context),
  })

  return context
}

function mockImage(
  values: Partial<{
    naturalHeight: number
    naturalWidth: number
    shouldFail: boolean
  }> = {}
) {
  class MockImage {
    height = 0
    naturalHeight = values.naturalHeight ?? 20
    naturalWidth = values.naturalWidth ?? 40
    onerror: (() => void) | null = null
    onload: (() => void) | null = null
    width = 0

    set src(_value: string) {
      if (values.shouldFail) {
        this.onerror?.()
      } else {
        this.onload?.()
      }
    }
  }

  vi.stubGlobal("Image", MockImage)
}

beforeEach(() => {
  mockCanvasContext()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
    configurable: true,
    value: originalGetContext,
  })
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("image data loading", () => {
  it("detects image files by mime type or extension", () => {
    expect(
      isImageFile(new File(["x"], "photo.png", { type: "image/png" }))
    ).toBe(true)
    expect(isImageFile(new File(["x"], "photo.svgz", { type: "" }))).toBe(true)
    expect(
      isImageFile(new File(["x"], "notes.txt", { type: "text/plain" }))
    ).toBe(false)
    expect(isImageFile(null)).toBe(false)
  })

  it("scales dimensions within a max side", () => {
    expect(scaleDimensions(100, 50, 200)).toEqual({
      targetHeight: 50,
      targetWidth: 100,
    })
    expect(scaleDimensions(200, 100, 100)).toEqual({
      targetHeight: 50,
      targetWidth: 100,
    })
  })

  it("loads image data through createImageBitmap when available", async () => {
    const close = vi.fn()
    const createImageBitmapMock = vi.fn().mockResolvedValue({
      close,
      height: 100,
      width: 200,
    })
    vi.stubGlobal("createImageBitmap", createImageBitmapMock)
    const context = mockCanvasContext()

    const file = new File(["png"], "photo.png", { type: "image/png" })
    const result = await loadImageData(file, 100)

    expect(createImageBitmapMock).toHaveBeenCalledWith(file)
    expect(result).toMatchObject({
      height: 100,
      sampleHeight: 50,
      sampleWidth: 100,
      width: 200,
    })
    expect(context.drawImage).toHaveBeenCalledWith(
      expect.any(Object),
      0,
      0,
      100,
      50
    )
    expect(close).toHaveBeenCalled()
  })

  it("falls back to image element decoding", async () => {
    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockRejectedValue(new Error("fail"))
    )
    mockImage({ naturalHeight: 20, naturalWidth: 40 })

    const result = await loadImageData(
      new File(["png"], "fallback.png", { type: "image/png" }),
      100
    )

    expect(result.width).toBe(40)
    expect(result.height).toBe(20)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:test")
  })

  it("uses svg dimensions from attributes or viewBox", async () => {
    mockImage({ naturalHeight: 0, naturalWidth: 0 })

    const svgWithAttributes = new File(
      ['<svg width="320" height="180"></svg>'],
      "icon.svg",
      { type: "image/svg+xml" }
    )
    const svgWithViewBox = new File(
      ['<svg viewBox="0 0 120 80"></svg>'],
      "viewbox.svg",
      { type: "image/svg+xml" }
    )

    await expect(loadImageData(svgWithAttributes, 500)).resolves.toMatchObject({
      height: 180,
      width: 320,
    })
    await expect(loadImageData(svgWithViewBox, 500)).resolves.toMatchObject({
      height: 80,
      width: 120,
    })
  })

  it("falls back for malformed svg dimensions", async () => {
    mockImage({ naturalHeight: 0, naturalWidth: 0 })

    await expect(
      loadImageData(
        new File(['<svg viewBox="0 0 nope 80"></svg>'], "bad.svg", {
          type: "image/svg+xml",
        }),
        500
      )
    ).resolves.toMatchObject({ height: 150, width: 300 })
  })

  it("throws when decoding or canvas context fails", async () => {
    mockImage({ shouldFail: true })

    await expect(
      loadImageData(new File(["bad"], "bad.png", { type: "image/png" }), 100)
    ).rejects.toThrow("IMAGE_LOAD_FAILED")

    vi.stubGlobal(
      "createImageBitmap",
      vi.fn().mockResolvedValue({
        close: vi.fn(),
        height: 10,
        width: 10,
      })
    )
    Object.defineProperty(HTMLCanvasElement.prototype, "getContext", {
      configurable: true,
      value: vi.fn(() => null),
    })

    await expect(
      loadImageData(new File(["bad"], "bad.png", { type: "image/png" }), 100)
    ).rejects.toThrow("CANVAS_UNAVAILABLE")
  })
})
