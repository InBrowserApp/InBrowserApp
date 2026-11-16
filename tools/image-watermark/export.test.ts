import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { unzipSync } from "fflate"
import { loadImage } from "./browser"
import { drawWatermark, encodeImage } from "./render"
import { exportImages } from "./export"
import { defaultOptions } from "./types"

vi.mock("./browser", () => ({ loadImage: vi.fn() }))
vi.mock("./render", () => ({ drawWatermark: vi.fn(), encodeImage: vi.fn() }))
const close = vi.fn()
const files = [
  new File(["one"], "photo.png", { type: "image/png" }),
  new File(["two"], "photo.png", { type: "image/png" }),
]
beforeEach(() => {
  vi.mocked(loadImage).mockResolvedValue({
    image: {} as ImageBitmap,
    width: 400,
    height: 300,
    close,
  })
  vi.mocked(encodeImage).mockResolvedValue(
    new Blob(["output"], { type: "image/png" })
  )
})
afterEach(() => {
  vi.resetAllMocks()
})
test("downloads one image with the original dimensions and cleans up", async () => {
  const progress = vi.fn()
  const result = await exportImages(
    files.slice(0, 1),
    null,
    defaultOptions("Test"),
    false,
    progress
  )
  expect(result.name).toBe("photo-watermarked.png")
  expect(progress).toHaveBeenCalledWith(1)
  expect(drawWatermark).toHaveBeenCalledOnce()
  expect(close).toHaveBeenCalledOnce()
})
test("exports duplicate names as separate ZIP entries and decodes one logo per batch", async () => {
  const progress = vi.fn()
  const result = await exportImages(
    files,
    files[0]!,
    { ...defaultOptions(""), kind: "image" },
    true,
    progress
  )
  const entries = unzipSync(new Uint8Array(await result.blob.arrayBuffer()))
  expect(Object.keys(entries)).toEqual([
    "photo-watermarked.png",
    "photo-watermarked-2.png",
  ])
  expect(new TextDecoder().decode(entries["photo-watermarked.png"])).toBe(
    "output"
  )
  expect(progress.mock.calls).toEqual([[1], [2]])
  expect(loadImage).toHaveBeenCalledTimes(3)
  expect(close).toHaveBeenCalledTimes(3)
})
test("releases source and logo on encoding failure", async () => {
  vi.mocked(encodeImage).mockRejectedValue(new Error("encode"))
  await expect(
    exportImages(
      files,
      files[0]!,
      { ...defaultOptions(""), kind: "image" },
      true,
      vi.fn()
    )
  ).rejects.toThrow("encode")
  expect(close).toHaveBeenCalledTimes(2)
})
test("releases the logo on a source decode failure", async () => {
  vi.mocked(loadImage)
    .mockResolvedValueOnce({
      image: {} as ImageBitmap,
      width: 1,
      height: 1,
      close,
    })
    .mockRejectedValueOnce(new Error("decode"))
  await expect(
    exportImages(
      files,
      files[0]!,
      { ...defaultOptions(""), kind: "image" },
      true,
      vi.fn()
    )
  ).rejects.toThrow("decode")
  expect(close).toHaveBeenCalledOnce()
})
test("bounds aggregate output size before allocating ZIP bytes", async () => {
  vi.mocked(encodeImage).mockResolvedValue({
    type: "image/png",
    size: 151 * 1024 * 1024,
  } as Blob)
  await expect(
    exportImages(files, null, defaultOptions("Test"), true, vi.fn())
  ).rejects.toThrow("EXPORT_TOO_LARGE")
  expect(close).toHaveBeenCalledOnce()
})
