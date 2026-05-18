import { afterEach, describe, expect, test, vi } from "vitest"

import {
  getFileSignature,
  isProbablyImageFile,
  readImageDimensions,
  renderImageToJpeg,
} from "./image-processing"

import type { ImageProcessingEnvironment } from "./image-processing"

function createFile(name = "photo.png", type = "image/png") {
  return new File(["image"], name, {
    lastModified: 123,
    type,
  })
}

function createCanvasEnvironment(blob: Blob): ImageProcessingEnvironment {
  const context = {
    drawImage: vi.fn(),
    fillRect: vi.fn(),
    fillStyle: "",
    rotate: vi.fn(),
    translate: vi.fn(),
  } as unknown as CanvasRenderingContext2D
  const canvas = {
    toBlob: vi.fn((callback: BlobCallback) => {
      callback(blob)
    }),
  } as unknown as HTMLCanvasElement

  return {
    createCanvas: () => ({ canvas, context }),
  }
}

function createBitmap(width = 10, height = 20) {
  return {
    close: vi.fn(),
    height,
    width,
  }
}

function stubImageLoading(width: number, height: number) {
  class MockImage {
    decoding = ""
    height = height
    naturalHeight = 0
    naturalWidth = 0
    onerror: (() => void) | null = null
    onload: (() => void) | null = null
    width = width

    set src(_value: string) {
      queueMicrotask(() => {
        this.onload?.()
      })
    }
  }

  vi.stubGlobal("Image", MockImage)
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("image processing helpers", () => {
  test("checks file signatures and likely image files", () => {
    const file = createFile()

    expect(getFileSignature(file)).toBe("photo.png-5-123")
    expect(isProbablyImageFile(file)).toBe(true)
    expect(isProbablyImageFile(createFile("photo.avif", ""))).toBe(true)
    expect(isProbablyImageFile(createFile("notes.txt", "text/plain"))).toBe(
      false
    )
  })

  test("reads dimensions through createImageBitmap and closes the bitmap", async () => {
    const close = vi.fn()
    const dimensions = await readImageDimensions(createFile(), {
      createImageBitmap: vi.fn(async () => ({
        close,
        height: 480,
        width: 640,
      })) as unknown as typeof createImageBitmap,
    })

    expect(dimensions).toEqual({ width: 640, height: 480 })
    expect(close).toHaveBeenCalled()
  })

  test("falls back to HTML image loading when bitmap decoding fails", async () => {
    const revokeObjectUrl = vi.fn()
    const dimensions = await readImageDimensions(createFile(), {
      createImageBitmap: vi.fn(async () => {
        throw new Error("decode failed")
      }) as unknown as typeof createImageBitmap,
      loadHtmlImage: vi.fn(async () => ({
        element: {
          height: 0,
          naturalHeight: 600,
          naturalWidth: 800,
          width: 0,
        } as HTMLImageElement,
        objectUrl: "blob:image",
      })),
      revokeObjectUrl,
    })

    expect(dimensions).toEqual({ width: 800, height: 600 })
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:image")
  })

  test("loads HTML images through object URLs", async () => {
    const createObjectUrl = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:html-image")
    const revokeObjectUrl = vi
      .spyOn(URL, "revokeObjectURL")
      .mockImplementation(() => {})
    stubImageLoading(12, 24)

    const dimensions = await readImageDimensions(createFile(), {
      createImageBitmap: undefined,
    })

    expect(dimensions).toEqual({ width: 12, height: 24 })
    expect(createObjectUrl).toHaveBeenCalled()
    expect(revokeObjectUrl).toHaveBeenCalledWith("blob:html-image")
  })

  test("reports invalid images when object URLs cannot be created", async () => {
    stubImageLoading(12, 24)
    vi.stubGlobal("URL", {
      createObjectURL: undefined,
      revokeObjectURL: vi.fn(),
    })

    await expect(
      readImageDimensions(createFile(), {
        createImageBitmap: undefined,
      })
    ).rejects.toThrow("INVALID_IMAGE")
  })

  test("keeps HTML image cleanup optional when revoke is unavailable", async () => {
    stubImageLoading(12, 24)
    vi.stubGlobal("URL", {
      createObjectURL: vi.fn(() => "blob:no-revoke"),
      revokeObjectURL: undefined,
    })

    await expect(
      readImageDimensions(createFile(), {
        createImageBitmap: undefined,
      })
    ).resolves.toEqual({ width: 12, height: 24 })
  })

  test("retries createImageBitmap without orientation options", async () => {
    const close = vi.fn()
    const createImageBitmapMock = vi
      .fn()
      .mockRejectedValueOnce(new Error("orientation not supported"))
      .mockResolvedValueOnce({
        close,
        height: 320,
        width: 240,
      }) as unknown as typeof createImageBitmap

    const dimensions = await readImageDimensions(createFile(), {
      createImageBitmap: createImageBitmapMock,
    })

    expect(dimensions).toEqual({ width: 240, height: 320 })
    expect(createImageBitmapMock).toHaveBeenCalledTimes(2)
    expect(close).toHaveBeenCalled()
  })

  test("renders a rotated JPEG through a canvas", async () => {
    const close = vi.fn()
    const result = await renderImageToJpeg(
      createFile(),
      { qualityPreset: "balanced", rotation: 90 },
      {
        ...createCanvasEnvironment(new Blob([new Uint8Array([7])])),
        createImageBitmap: vi.fn(async () => ({
          close,
          height: 20,
          width: 10,
        })) as unknown as typeof createImageBitmap,
      }
    )

    expect(result.width).toBe(20)
    expect(result.height).toBe(10)
    expect(Array.from(result.jpegBytes)).toEqual([7])
    expect(close).toHaveBeenCalled()
  })

  test("reports canvas export failures", async () => {
    const failingCanvas = {
      toBlob: vi.fn((callback: BlobCallback) => {
        callback(null)
      }),
    } as unknown as HTMLCanvasElement

    await expect(
      renderImageToJpeg(
        createFile(),
        { qualityPreset: "small", rotation: 0 },
        {
          createCanvas: () => ({
            canvas: failingCanvas,
            context: {
              drawImage: vi.fn(),
              fillRect: vi.fn(),
              fillStyle: "",
              rotate: vi.fn(),
              translate: vi.fn(),
            } as unknown as CanvasRenderingContext2D,
          }),
          createImageBitmap: vi.fn(async () => ({
            close: vi.fn(),
            height: 20,
            width: 10,
          })) as unknown as typeof createImageBitmap,
        }
      )
    ).rejects.toThrow("CANVAS_EXPORT_FAILED")
  })

  test("reports missing canvas export APIs", async () => {
    await expect(
      renderImageToJpeg(
        createFile(),
        { qualityPreset: "small", rotation: 0 },
        {
          createCanvas: () => ({
            canvas: {} as HTMLCanvasElement,
            context: {
              drawImage: vi.fn(),
              fillRect: vi.fn(),
              fillStyle: "",
              rotate: vi.fn(),
              translate: vi.fn(),
            } as unknown as CanvasRenderingContext2D,
          }),
          createImageBitmap: vi.fn(async () =>
            createBitmap()
          ) as unknown as typeof createImageBitmap,
        }
      )
    ).rejects.toThrow("CANVAS_EXPORT_FAILED")
  })

  test("reports unavailable canvas contexts", async () => {
    await expect(
      renderImageToJpeg(
        createFile(),
        { qualityPreset: "small", rotation: 0 },
        {
          createCanvas: () => ({
            canvas: {} as HTMLCanvasElement,
            context: null,
          }),
          createImageBitmap: vi.fn(async () => ({
            close: vi.fn(),
            height: 20,
            width: 10,
          })) as unknown as typeof createImageBitmap,
        }
      )
    ).rejects.toThrow("CANVAS_UNAVAILABLE")
  })

  test("reports invalid images when no browser image loader exists", async () => {
    vi.stubGlobal("Image", undefined)

    await expect(
      readImageDimensions(createFile(), {
        createImageBitmap: undefined,
      })
    ).rejects.toThrow("INVALID_IMAGE")
  })

  test("uses browser canvas creation when no canvas factory is provided", async () => {
    const blob = new Blob([new Uint8Array([9])])
    const context = {
      drawImage: vi.fn(),
      fillRect: vi.fn(),
      fillStyle: "",
      rotate: vi.fn(),
      translate: vi.fn(),
    } as unknown as CanvasRenderingContext2D
    const canvas = {
      getContext: vi.fn(() => context),
      height: 0,
      toBlob: vi.fn((callback: BlobCallback) => {
        callback(blob)
      }),
      width: 0,
    } as unknown as HTMLCanvasElement

    vi.spyOn(document, "createElement").mockReturnValue(canvas)

    const result = await renderImageToJpeg(
      createFile(),
      { qualityPreset: "best", rotation: 0 },
      {
        createImageBitmap: vi.fn(async () =>
          createBitmap(15, 25)
        ) as unknown as typeof createImageBitmap,
      }
    )

    expect(result).toEqual({
      height: 25,
      jpegBytes: new Uint8Array([9]),
      width: 15,
    })
    expect(canvas.width).toBe(15)
    expect(canvas.height).toBe(25)
  })

  test("reports unavailable browser canvas creation", async () => {
    vi.stubGlobal("document", undefined)

    await expect(
      renderImageToJpeg(
        createFile(),
        { qualityPreset: "best", rotation: 0 },
        {
          createImageBitmap: vi.fn(async () =>
            createBitmap()
          ) as unknown as typeof createImageBitmap,
        }
      )
    ).rejects.toThrow("CANVAS_UNAVAILABLE")
  })
})
