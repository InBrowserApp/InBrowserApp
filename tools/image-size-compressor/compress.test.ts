import { unzipSync } from "fflate"
import { afterEach, beforeEach, expect, it, vi } from "vitest"

import {
  canvasBlob,
  loadImageSource,
} from "@workspace/raster-image/browser-canvas"

import { compressImage, outputName, readyImagesZip } from "./compress"

vi.mock("@workspace/raster-image/browser-canvas", () => ({
  loadImageSource: vi.fn(),
  canvasBlob: vi.fn(),
}))

const cleanup = vi.fn()
const context = { drawImage: vi.fn(), fillRect: vi.fn(), fillStyle: "" }
const original = { mode: "original" } as const
const shrink = { mode: "shrink" } as const
const source = new File(["test"], "photo.png", { type: "image/png" })

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(loadImageSource).mockResolvedValue({
    width: 80,
    height: 60,
    image: document.createElement("img"),
    cleanup,
  })
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
  vi.mocked(canvasBlob).mockImplementation(
    async (_, mime) => new Blob([new Uint8Array(100)], { type: mime })
  )
})

afterEach(() => vi.restoreAllMocks())

it("uses opaque white for JPG and releases the source", async () => {
  const result = await compressImage(source, "jpg", 100, original)
  expect(result.blob.type).toBe("image/jpeg")
  expect(result.originalKept).toBe(false)
  expect(context.fillStyle).toBe("#fff")
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 80, 60)
  expect(cleanup).toHaveBeenCalledOnce()
})

it("keeps a verified JPG that is already within the limit", async () => {
  const jpeg = new File([Uint8Array.of(255, 216, 255, 42)], "draft.jpeg")
  const result = await compressImage(jpeg, "jpg", jpeg.size, original)
  expect(result.blob.size).toBe(jpeg.size)
  expect(result.blob.type).toBe("image/jpeg")
  expect(result.originalKept).toBe(true)
  expect(canvasBlob).not.toHaveBeenCalled()
})

it("keeps a still WebP but re-encodes an animated WebP", async () => {
  for (const [flag, originalKept] of [
    [0, true],
    [2, false],
  ] as const) {
    const webp = new File(
      ["RIFF    WEBPVP8X    ", Uint8Array.of(flag)],
      "test.webp"
    )
    expect(
      (await compressImage(webp, "webp", 100, original)).originalKept
    ).toBe(originalKept)
  }
  expect(canvasBlob).toHaveBeenCalledOnce()
  expect(context.fillRect).not.toHaveBeenCalled()
})

it("rejects fallback formats instead of labeling them WebP", async () => {
  vi.mocked(canvasBlob).mockResolvedValue(
    new Blob(["data"], { type: "image/png" })
  )
  await expect(compressImage(source, "webp", 100, shrink)).rejects.toThrow(
    "UNSUPPORTED_FORMAT"
  )
  expect(cleanup).toHaveBeenCalledOnce()
})

it("retries an oversized canvas only with resizing allowed", async () => {
  vi.mocked(canvasBlob).mockImplementation(async (canvas, mime) =>
    canvas.width > 40 ? null : new Blob(["data"], { type: mime })
  )
  await expect(compressImage(source, "jpg", 100, original)).rejects.toThrow(
    "IMAGE_ENCODING_FAILED"
  )
  await expect(
    compressImage(source, "jpg", 100, shrink)
  ).resolves.toMatchObject({
    width: 40,
    height: 30,
  })
})

it.each([
  ["contain", [0, 10, 80, 60]],
  ["cover", [-40 / 3, 0, 320 / 3, 80]],
] as const)(
  "renders exact square dimensions with %s",
  async (fit, rectangle) => {
    const result = await compressImage(source, "webp", Infinity, {
      mode: "exact",
      width: 80,
      height: 80,
      fit,
    })
    expect(result).toMatchObject({ width: 80, height: 80 })
    for (const [index, coordinate] of rectangle.entries()) {
      expect(context.drawImage.mock.calls[0]?.[index + 1]).toBeCloseTo(
        coordinate
      )
    }
    expect(context.fillRect).not.toHaveBeenCalled()
    expect(canvasBlob).toHaveBeenCalledOnce()
  }
)

it("keeps exact pixel dimensions even if the lowest quality exceeds the limit", async () => {
  const jpeg = new File([Uint8Array.of(255, 216, 255, 42)], "draft.jpeg")
  vi.mocked(canvasBlob).mockImplementation(async (canvas, mime, quality) => {
    expect(canvas.width).toBe(80)
    expect(canvas.height).toBe(60)
    return new Blob([new Uint8Array(5 + Math.round(100 * quality))], {
      type: mime,
    })
  })
  const result = await compressImage(jpeg, "jpg", 4, {
    mode: "exact",
    width: 80,
    height: 60,
    fit: "contain",
  })
  expect(result).toMatchObject({ originalKept: false, width: 80, height: 60 })
  expect(result.blob.size).toBe(5)
  expect(canvasBlob).toHaveBeenCalledTimes(2)
  expect(context.drawImage).toHaveBeenCalledOnce()
})

it("rejects dimensions normalized by the browser instead of returning a different size", async () => {
  const originalWidth = Object.getOwnPropertyDescriptor(
    HTMLCanvasElement.prototype,
    "width"
  )!
  vi.spyOn(HTMLCanvasElement.prototype, "width", "set").mockImplementation(
    function (this: HTMLCanvasElement, value) {
      originalWidth.set?.call(this, value === 80 ? 1 : value)
    }
  )
  await expect(
    compressImage(source, "jpg", 100, {
      mode: "exact",
      width: 80,
      height: 60,
      fit: "contain",
    })
  ).rejects.toThrow("IMAGE_ENCODING_FAILED")
  expect(canvasBlob).not.toHaveBeenCalled()
})

it("keeps ZIP names unique even if a suffix or lettercase already exists", async () => {
  const files = ["photo.png", "PHOTO-2.webp", "photo.gif", ".jpg"].map(
    (name) => new File(["test"], name)
  )
  const names = new Set<string>()
  const result = await compressImage(source, "jpg", 100, original)
  const zip = await readyImagesZip(
    files.map((file) => ({
      ...result,
      name: outputName(file, "jpg", names),
    }))
  )
  const entries = unzipSync(new Uint8Array(await zip.arrayBuffer()))
  expect(Object.keys(entries)).toEqual([
    "photo.jpg",
    "PHOTO-2.jpg",
    "photo-3.jpg",
    "image.jpg",
  ])
  expect(entries["photo-3.jpg"]?.length).toBe(100)
})
