import { afterEach, expect, test, vi } from "vitest"
import { download, loadImage } from "./browser"

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
const file = new File(["image"], "photo.png", { type: "image/png" })
test("decodes with EXIF orientation and releases the bitmap", async () => {
  const bitmap = { width: 640, height: 480, close: vi.fn() }
  const decode = vi.fn().mockResolvedValue(bitmap)
  vi.stubGlobal("createImageBitmap", decode)
  const source = await loadImage(file)
  expect(decode).toHaveBeenCalledWith(file, { imageOrientation: "from-image" })
  expect(source.width).toBe(640)
  source.close()
  expect(bitmap.close).toHaveBeenCalledOnce()
  bitmap.width = 20000
  await expect(loadImage(file)).rejects.toThrow("IMAGE_DIMENSIONS")
  expect(bitmap.close).toHaveBeenCalledTimes(2)
})
test("rejects unsupported file types", async () => {
  await expect(
    loadImage(new File(["svg"], "logo.svg", { type: "image/svg+xml" }))
  ).rejects.toThrow("IMAGE_TYPE")
})
test("falls back to HTMLImageElement and cleans up object URLs on success and failure", async () => {
  vi.stubGlobal("createImageBitmap", undefined)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:image")
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  const decode = vi.fn().mockResolvedValue(undefined)
  vi.stubGlobal(
    "Image",
    class {
      src = ""
      naturalWidth = 320
      naturalHeight = 200
      decode = decode
    }
  )
  const source = await loadImage(file)
  expect(source.height).toBe(200)
  source.close()
  expect(revoke).toHaveBeenCalledWith("blob:image")
  decode.mockRejectedValue(new Error("bad image"))
  await expect(loadImage(file)).rejects.toThrow("bad image")
  expect(revoke).toHaveBeenCalledTimes(2)
})
test("downloads via a temporary link and revokes the URL after the browser consumes it", () => {
  vi.useFakeTimers()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:download")
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  download(new Blob(["image"]), "photo.png")
  expect(click).toHaveBeenCalledOnce()
  expect(document.querySelector("a")).toBeNull()
  expect(revoke).not.toHaveBeenCalled()
  vi.runAllTimers()
  expect(revoke).toHaveBeenCalledWith("blob:download")
})
