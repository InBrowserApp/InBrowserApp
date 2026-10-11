import { afterEach, expect, test, vi } from "vitest"
import { checkImages, rasterImage } from "./images"

afterEach(() => vi.unstubAllGlobals())
test.each([17, 33])(
  "extracts PNG data after a %s-byte BLIP prefix",
  async (offset) => {
    const bytes = new Uint8Array(offset + 8)
    bytes.set([137, 80, 78, 71, 13, 10, 26, 10], offset)
    const blob = rasterImage(0xf01e, bytes)!
    expect(blob.type).toBe("image/png")
    expect(new Uint8Array(await blob.arrayBuffer())[0]).toBe(137)
  }
)
test.each([0xf01d, 0xf02a])("extracts JPEG subtype %s", (type) => {
  const bytes = new Uint8Array(20)
  bytes.set([255, 216, 255], 17)
  expect(rasterImage(type, bytes)?.type).toBe("image/jpeg")
})
test("rejects damaged raster headers and leaves native metafiles to the office engine", () => {
  expect(() => rasterImage(0xf01e, new Uint8Array(25))).toThrow("unsupported")
  expect(rasterImage(0xf01a, new Uint8Array(50))).toBeUndefined()
})
test("checks one bitmap at a time and releases each decoded bitmap", async () => {
  const close = vi.fn()
  const decode = vi.fn(async () => ({ close }))
  vi.stubGlobal("createImageBitmap", decode)
  await checkImages([new Blob(), new Blob()])
  expect(decode).toHaveBeenCalledTimes(2)
  expect(close).toHaveBeenCalledTimes(2)
})
test.each([
  [new Error("image decoding failed"), "unsupported"],
  [new RangeError("allocation failed"), "resource"],
])(
  "reports a broken image without exporting partial slides",
  async (error, code) => {
    vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(error))
    await expect(checkImages([new Blob()])).rejects.toThrow(code as string)
  }
)
