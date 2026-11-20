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
  const result = await compressImage(source, "jpg", 100, false)
  expect(result.blob.type).toBe("image/jpeg")
  expect(result.originalKept).toBe(false)
  expect(context.fillStyle).toBe("#fff")
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 80, 60)
  expect(cleanup).toHaveBeenCalledOnce()
})

it("keeps a verified JPG that is already within the limit", async () => {
  const jpeg = new File([Uint8Array.of(255, 216, 255, 42)], "draft.jpeg")
  const result = await compressImage(jpeg, "jpg", jpeg.size, false)
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
    expect((await compressImage(webp, "webp", 100, false)).originalKept).toBe(
      originalKept
    )
  }
  expect(canvasBlob).toHaveBeenCalledOnce()
  expect(context.fillRect).not.toHaveBeenCalled()
})

it("rejects fallback formats instead of labeling them WebP", async () => {
  vi.mocked(canvasBlob).mockResolvedValue(
    new Blob(["data"], { type: "image/png" })
  )
  await expect(compressImage(source, "webp", 100, true)).rejects.toThrow(
    "UNSUPPORTED_FORMAT"
  )
  expect(cleanup).toHaveBeenCalledOnce()
})

it("retries an oversized canvas only with resizing allowed", async () => {
  vi.mocked(canvasBlob).mockImplementation(async (canvas, mime) =>
    canvas.width > 40 ? null : new Blob(["data"], { type: mime })
  )
  await expect(compressImage(source, "jpg", 100, false)).rejects.toThrow(
    "IMAGE_ENCODING_FAILED"
  )
  await expect(compressImage(source, "jpg", 100, true)).resolves.toMatchObject({
    width: 40,
    height: 30,
  })
})

it("keeps ZIP names unique even if a suffix or lettercase already exists", async () => {
  const files = ["photo.png", "PHOTO-2.webp", "photo.gif", ".jpg"].map(
    (name) => new File(["test"], name)
  )
  const names = new Set<string>()
  const result = await compressImage(source, "jpg", 100, false)
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
