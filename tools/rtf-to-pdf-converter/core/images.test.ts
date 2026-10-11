import { afterEach, expect, test, vi } from "vitest"
import { checkImages, pictureText } from "./images"
import type { Picture } from "./images"
afterEach(() => vi.unstubAllGlobals())
test("decodes each picture and releases the bitmap", async () => {
  const close = vi.fn()
  const decode = vi.fn(async () => ({ close }))
  vi.stubGlobal("createImageBitmap", decode)
  await checkImages([new Blob(["one"]), new Blob(["two"])])
  expect(decode).toHaveBeenCalledTimes(2)
  expect(close).toHaveBeenCalledTimes(2)
})
test.each([
  [new Error("bad picture"), "unsupported"],
  [new RangeError("allocation failed"), "resource"],
])("classifies picture decode errors", async (error, code) => {
  vi.stubGlobal("createImageBitmap", vi.fn().mockRejectedValue(error))
  await expect(checkImages([new Blob()])).rejects.toThrow(String(code))
})
test("joins hex nibbles across source spans", () => {
  const picture: Picture = { chunks: [] }
  pictureText(picture, new TextEncoder().encode("a"))
  pictureText(picture, new TextEncoder().encode("F01"))
  expect([...picture.chunks[1]!]).toEqual([175, 1])
  expect(picture.nibble).toBeUndefined()
})
