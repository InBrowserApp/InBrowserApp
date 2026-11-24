import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { rasterize } from "./rasterize"

const bitmap = { width: 8, height: 12, close: vi.fn() }
const context = { fillStyle: "", fillRect: vi.fn(), drawImage: vi.fn() }
const encode = vi.fn()
let canvas: { width: number; height: number }
const decode = vi.fn()
beforeEach(() => {
  vi.resetAllMocks()
  decode.mockResolvedValue(bitmap)
  encode.mockResolvedValue(new Blob(["PNG"]))
  vi.stubGlobal("createImageBitmap", decode)
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      constructor(width: number, height: number) {
        canvas = { width, height }
        return Object.assign(canvas, {
          getContext: () => context,
          convertToBlob: encode,
        })
      }
    }
  )
})
afterEach(() => vi.unstubAllGlobals())
test("normalizes native-size orientation on white and releases decoded pixels", async () => {
  const blob = new Blob(["image"])
  const result = await rasterize(blob)
  expect(decode).toHaveBeenCalledWith(blob, { imageOrientation: "from-image" })
  expect(context.fillStyle).toBe("#ffffff")
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 8, 12)
  expect(context.drawImage).toHaveBeenCalledWith(bitmap, 0, 0)
  expect(encode).toHaveBeenCalledWith({ type: "image/png" })
  expect(result).toEqual({
    width: 8,
    height: 12,
    bytes: new TextEncoder().encode("PNG"),
  })
  expect(bitmap.close).toHaveBeenCalledOnce()
  expect(canvas).toMatchObject({ width: 0, height: 0 })
})
test("releases pixels on encoder errors and reports unsupported engines", async () => {
  encode.mockRejectedValueOnce(new Error("encode"))
  await expect(rasterize(new Blob())).rejects.toThrow("encode")
  expect(bitmap.close).toHaveBeenCalledOnce()
  expect(canvas).toMatchObject({ width: 0, height: 0 })
  vi.stubGlobal("createImageBitmap", undefined)
  await expect(rasterize(new Blob())).rejects.toMatchObject({
    detail: { code: "engineUnavailable" },
  })
})
test("rejects empty images and unavailable canvases without leaking bitmaps", async () => {
  decode.mockResolvedValueOnce({ ...bitmap, width: 0 })
  await expect(rasterize(new Blob())).rejects.toThrow("Empty")
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return null
      }
    }
  )
  await expect(rasterize(new Blob())).rejects.toMatchObject({
    detail: { code: "resourceLimit" },
  })
  expect(bitmap.close).toHaveBeenCalledTimes(2)
})
