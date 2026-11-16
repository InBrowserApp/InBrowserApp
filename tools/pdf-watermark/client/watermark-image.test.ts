import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { readImage, renderText } from "./watermark-image"
import { DEFAULT_OPTIONS } from "../types"

const context = {
  font: "",
  fillStyle: "",
  textAlign: "",
  measureText: vi.fn(() => ({
    width: 200,
    actualBoundingBoxAscent: 80,
    actualBoundingBoxDescent: 20,
  })),
  scale: vi.fn(),
  fillText: vi.fn(),
  drawImage: vi.fn(),
}
beforeEach(() => {
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(
    (callback) => callback(new Blob(["png"], { type: "image/png" }))
  )
  vi.stubGlobal(
    "Image",
    class {
      src = ""
      naturalWidth = 4000
      naturalHeight = 2000
      decode = async () => {}
    }
  )
  Object.defineProperty(document, "fonts", {
    configurable: true,
    value: { ready: Promise.resolve() },
  })
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
  vi.clearAllMocks()
})

test("renders Unicode multiline text using browser font metrics and transparent PNG", async () => {
  const mark = await renderText({
    ...DEFAULT_OPTIONS,
    text: "内部文件\nمستند سري",
    font: "serif",
  })
  expect(mark.blob.type).toBe("image/png")
  expect(mark.width).toBe(648)
  expect(mark.height).toBe(720)
  expect(context.font).toBe("600 72px serif")
  expect(context.fillText).toHaveBeenCalledWith("内部文件", 108, 88)
  expect(context.fillText).toHaveBeenCalledWith("مستند سري", 108, 200)
  await renderText(DEFAULT_OPTIONS)
  expect(context.font).toBe("600 72px sans-serif")
})

test.each(["", " ", "x".repeat(201), "a\nb\nc\nd\ne\nf"])(
  "rejects invalid text before allocating a canvas",
  async (text) => {
    await expect(renderText({ ...DEFAULT_OPTIONS, text })).rejects.toThrow(
      "textError"
    )
  }
)

test("limits raster dimensions and reports unavailable canvas/encoding", async () => {
  context.measureText.mockReturnValueOnce({
    width: 10000,
    actualBoundingBoxAscent: 80,
    actualBoundingBoxDescent: 20,
  })
  expect((await renderText(DEFAULT_OPTIONS)).width).toBe(4096)
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
  await expect(renderText(DEFAULT_OPTIONS)).rejects.toThrow("imageError")
  vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
    (callback) => callback(null)
  )
  await expect(renderText(DEFAULT_OPTIONS)).rejects.toThrow("imageError")
})

test("decodes local PNG/JPEG and reduces excessive resolution while revoking temporary URLs", async () => {
  const image = await readImage(
    new File(["jpeg"], "logo.jpg", { type: "image/jpeg" })
  )
  expect(image.width).toBe(2048)
  expect(image.height).toBe(1024)
  expect(context.drawImage).toHaveBeenCalled()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:image")
  await readImage(new File(["png"], "logo.PNG"))
  vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValueOnce(null)
  await expect(readImage(new File(["png"], "logo.png"))).rejects.toThrow(
    "imageError"
  )
})

test("rejects unsupported, oversized, damaged, and excessive-pixel images", async () => {
  await expect(
    readImage(new File(["svg"], "logo.svg", { type: "image/svg+xml" }))
  ).rejects.toThrow("imageError")
  await expect(
    readImage({
      type: "image/png",
      name: "logo.png",
      size: 21 * 1024 * 1024,
    } as File)
  ).rejects.toThrow("imageError")
  vi.stubGlobal(
    "Image",
    class {
      src = ""
      naturalWidth = 9000
      naturalHeight = 9000
      decode = async () => {}
    }
  )
  await expect(readImage(new File(["png"], "logo.png"))).rejects.toThrow(
    "imageError"
  )
  vi.stubGlobal(
    "Image",
    class {
      src = ""
      naturalWidth = 0
      naturalHeight = 0
      decode = async () => {}
    }
  )
  await expect(readImage(new File(["png"], "logo.png"))).rejects.toThrow(
    "imageError"
  )
  vi.stubGlobal(
    "Image",
    class {
      src = ""
      decode = async () => {
        throw new Error("decode")
      }
    }
  )
  await expect(readImage(new File(["png"], "logo.png"))).rejects.toThrow(
    "decode"
  )
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3)
})
