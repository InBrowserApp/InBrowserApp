import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import jsQR from "jsqr"

import {
  QR_DECODER_ERRORS,
  decodeQrFromImageFile,
  decodeQrFromVideoFrame,
  isSupportedImageFile,
} from "./qr-decoder"

import type { QRCode } from "jsqr"

vi.mock("jsqr", () => ({
  default: vi.fn(),
}))

const jsQRMock = vi.mocked(jsQR)
const mockPoint = { x: 0, y: 0 }
const mockQrCode: QRCode = {
  binaryData: [],
  chunks: [] as unknown as QRCode["chunks"],
  data: "decoded value",
  location: {
    bottomLeftFinderPattern: mockPoint,
    bottomLeftCorner: mockPoint,
    bottomRightCorner: mockPoint,
    topLeftFinderPattern: mockPoint,
    topLeftCorner: mockPoint,
    topRightFinderPattern: mockPoint,
    topRightCorner: mockPoint,
  },
  version: 1,
}

function createContext(overrides: Partial<CanvasRenderingContext2D> = {}) {
  return {
    drawImage: vi.fn(),
    getImageData: vi.fn(() => ({
      data: new Uint8ClampedArray([1, 2, 3, 4]),
      height: 1,
      width: 1,
    })),
    ...overrides,
  } as unknown as CanvasRenderingContext2D
}

describe("qr decoder", () => {
  const OriginalImage = globalThis.Image
  const originalCreateObjectURL = URL.createObjectURL
  const originalRevokeObjectURL = URL.revokeObjectURL
  let getContextSpy: ReturnType<typeof vi.spyOn> | null = null

  beforeEach(() => {
    jsQRMock.mockReset()
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: vi.fn(() => "blob:qr"),
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: vi.fn(),
    })
  })

  afterEach(() => {
    globalThis.Image = OriginalImage
    Object.defineProperty(URL, "createObjectURL", {
      configurable: true,
      value: originalCreateObjectURL,
    })
    Object.defineProperty(URL, "revokeObjectURL", {
      configurable: true,
      value: originalRevokeObjectURL,
    })
    getContextSpy?.mockRestore()
    getContextSpy = null
  })

  it("checks image file support by MIME type", () => {
    expect(
      isSupportedImageFile(new File(["png"], "qr.png", { type: "image/png" }))
    ).toBe(true)
    expect(
      isSupportedImageFile(new File(["txt"], "qr.txt", { type: "text/plain" }))
    ).toBe(false)
  })

  it("decodes QR data from an image file", async () => {
    class ImmediateImage {
      height = 80
      naturalHeight = 80
      naturalWidth = 100
      onerror: null | (() => void) = null
      onload: null | (() => void) = null
      width = 100

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = ImmediateImage as typeof Image
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(createContext())
    jsQRMock.mockReturnValue(mockQrCode)

    await expect(
      decodeQrFromImageFile(new File(["png"], "qr.png", { type: "image/png" }))
    ).resolves.toEqual({
      data: "decoded value",
      height: 1,
      width: 1,
    })

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:qr")
  })

  it("returns null when an image contains no QR code", async () => {
    class ImmediateImage {
      height = 80
      naturalHeight = 80
      naturalWidth = 100
      onerror: null | (() => void) = null
      onload: null | (() => void) = null
      width = 100

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = ImmediateImage as typeof Image
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(createContext())
    jsQRMock.mockReturnValue(null)

    await expect(
      decodeQrFromImageFile(
        new File(["png"], "empty.png", { type: "image/png" })
      )
    ).resolves.toBe(null)
  })

  it("rejects unsupported files and failed image loads", async () => {
    await expect(
      decodeQrFromImageFile(new File(["txt"], "qr.txt", { type: "text/plain" }))
    ).rejects.toThrow(QR_DECODER_ERRORS.invalidFileType)

    class BrokenImage {
      height = 80
      naturalHeight = 80
      naturalWidth = 100
      onerror: null | (() => void) = null
      onload: null | (() => void) = null
      width = 100

      set src(_value: string) {
        this.onerror?.()
      }
    }

    globalThis.Image = BrokenImage as typeof Image

    await expect(
      decodeQrFromImageFile(new File(["png"], "bad.png", { type: "image/png" }))
    ).rejects.toThrow(QR_DECODER_ERRORS.imageLoadFailed)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:qr")
  })

  it("rejects images without dimensions", async () => {
    class EmptyImage {
      height = 0
      naturalHeight = 0
      naturalWidth = 0
      onerror: null | (() => void) = null
      onload: null | (() => void) = null
      width = 0

      set src(_value: string) {
        this.onload?.()
      }
    }

    globalThis.Image = EmptyImage as typeof Image

    await expect(
      decodeQrFromImageFile(
        new File(["png"], "empty.png", { type: "image/png" })
      )
    ).rejects.toThrow(QR_DECODER_ERRORS.imageLoadFailed)
  })

  it("decodes QR data from a video frame", () => {
    const video = document.createElement("video")
    Object.defineProperty(video, "videoWidth", { value: 120 })
    Object.defineProperty(video, "videoHeight", { value: 80 })
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValue(createContext())
    jsQRMock.mockReturnValue(mockQrCode)

    expect(
      decodeQrFromVideoFrame(video, document.createElement("canvas"))
    ).toEqual({
      data: "decoded value",
      height: 1,
      width: 1,
    })
  })

  it("returns null when the video frame is not ready", () => {
    const video = document.createElement("video")

    expect(
      decodeQrFromVideoFrame(video, document.createElement("canvas"))
    ).toBe(null)
    expect(jsQRMock).not.toHaveBeenCalled()
  })

  it("throws when canvas setup or pixel reading fails", () => {
    const video = document.createElement("video")
    Object.defineProperty(video, "videoWidth", { value: 120 })
    Object.defineProperty(video, "videoHeight", { value: 80 })
    getContextSpy = vi
      .spyOn(HTMLCanvasElement.prototype, "getContext")
      .mockReturnValueOnce(null)

    expect(() =>
      decodeQrFromVideoFrame(video, document.createElement("canvas"))
    ).toThrow(QR_DECODER_ERRORS.contextUnavailable)

    getContextSpy.mockReturnValueOnce(
      createContext({
        getImageData: vi.fn(() => {
          throw new DOMException("blocked", "SecurityError")
        }),
      })
    )

    expect(() =>
      decodeQrFromVideoFrame(video, document.createElement("canvas"))
    ).toThrow(QR_DECODER_ERRORS.canvasReadFailed)
  })
})
