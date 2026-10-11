import { afterEach, expect, test, vi } from "vitest"
import { imageResource, checkImages } from "./images"
afterEach(() => vi.unstubAllGlobals())
test.each([
  [[137, 80, 78, 71, 13, 10, 26, 10], "image/png"],
  [[255, 216, 255], "image/jpeg"],
  [[71, 73, 70, 56], "image/gif"],
  [[66, 77], "image/bmp"],
  [[82, 73, 70, 70, 0, 0, 0, 0, 87, 69, 66, 80], "image/webp"],
])("recognizes raster bytes before browser decoding", (bytes, mime) => {
  expect(imageResource(new Uint8Array(bytes as number[]))?.type).toBe(mime)
})
const svg = (content: string) =>
  new TextEncoder().encode(
    `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20">${content}</svg>`
  )
test("accepts standalone vector shapes and local paint references", () => {
  expect(
    imageResource(svg('<rect fill="url(#paint)"/><use href="#shape"/>'))
  ).toBeUndefined()
})
test.each([
  "<script/>",
  "<foreignObject/>",
  "<style/>",
  "<animate/>",
  "<set/>",
  '<image href="https://example.org/a.png"/>',
  '<rect onload="run()"/>',
  '<rect fill="url(https://example.org/a.svg)"/>',
  '<rect style="fill: u\\72l(other)"/>',
])("rejects unsafe vector content %s", (content) => {
  expect(() => imageResource(svg(content))).toThrow("unsupported")
})
test("rejects non-image XML and malformed raster payloads", () => {
  expect(() => imageResource(new TextEncoder().encode("<html/>"))).toThrow(
    "unsupported"
  )
  expect(() => imageResource(new Uint8Array([82, 73, 70, 70]))).toThrow(Error)
})
test("decodes each bitmap and closes browser resources", async () => {
  const close = vi.fn()
  const decode = vi.fn(async () => ({ close }))
  vi.stubGlobal("createImageBitmap", decode)
  const image = new Blob(["image"])
  await checkImages([image])
  expect(decode).toHaveBeenCalledWith(image)
  expect(close).toHaveBeenCalledOnce()
})
test.each([
  [new Error("broken raster"), "unsupported"],
  [new RangeError("allocation failed"), "resource"],
])("reports failed bitmap decoding", async (error, expected) => {
  vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(error))
  await expect(checkImages([new Blob()])).rejects.toThrow(expected as string)
})
