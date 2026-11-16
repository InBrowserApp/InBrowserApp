import { beforeEach, expect, test, vi } from "vitest"
import { defaultOptions, type ImageSource } from "./types"
import { drawWatermark, encodeImage } from "./render"

const source: ImageSource = {
  image: {} as ImageBitmap,
  width: 2400,
  height: 1600,
  close: vi.fn(),
}
const context = {
  scale: vi.fn(),
  fillRect: vi.fn(),
  drawImage: vi.fn(),
  measureText: vi.fn((text: string) => ({ width: text.length * 60 })),
  save: vi.fn(),
  translate: vi.fn(),
  rotate: vi.fn(),
  restore: vi.fn(),
  fillText: vi.fn(),
  globalAlpha: 1,
}
let canvas: HTMLCanvasElement
beforeEach(() => {
  vi.clearAllMocks()
  canvas = document.createElement("canvas")
  vi.spyOn(canvas, "getContext").mockReturnValue(
    context as unknown as CanvasRenderingContext2D
  )
})
test("uses identical coordinates for preview and full-resolution exports", () => {
  const options = { ...defaultOptions("Hello\nWorld"), rotation: 45 }
  drawWatermark(canvas, source, null, options, 1200)
  const previewPositions = context.translate.mock.calls
  expect(canvas.width).toBe(1200)
  expect(canvas.height).toBe(800)
  expect(context.scale).toHaveBeenCalledWith(0.5, 0.5)
  expect(context.fillText).toHaveBeenCalledTimes(2)
  expect(context.globalAlpha).toBe(0.55)
  vi.clearAllMocks()
  drawWatermark(canvas, source, null, options)
  expect(canvas.width).toBe(2400)
  expect(context.translate.mock.calls).toEqual(previewPositions)
})
test("flattens JPEG onto white and skips watermark in original view or without content", () => {
  drawWatermark(
    canvas,
    source,
    null,
    { ...defaultOptions("Hello"), format: "image/jpeg" },
    1200,
    true
  )
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 2400, 1600)
  expect(context.fillText).not.toHaveBeenCalled()
  drawWatermark(canvas, source, null, defaultOptions(" "))
  drawWatermark(canvas, source, null, { ...defaultOptions(""), kind: "image" })
  expect(context.translate).not.toHaveBeenCalled()
})
test("scales tall transparent logos and draws tiled overlays", () => {
  drawWatermark(
    canvas,
    source,
    { ...source, width: 10, height: 100 },
    { ...defaultOptions(""), kind: "image", tiled: true }
  )
  expect(context.drawImage.mock.calls.length).toBeGreaterThan(2)
  expect(context.fillText).not.toHaveBeenCalled()
})
test("rejects unavailable canvas contexts", () => {
  vi.mocked(canvas.getContext).mockReturnValue(null)
  expect(() => drawWatermark(canvas, source, null, defaultOptions(""))).toThrow(
    "CANVAS_UNAVAILABLE"
  )
})
test("encodes the requested format and rejects null or silently substituted output", async () => {
  const options = defaultOptions("Test")
  const blob = new Blob(["image"], { type: "image/png" })
  const encode = vi
    .spyOn(canvas, "toBlob")
    .mockImplementation((callback) => callback(blob))
  expect(await encodeImage(canvas, options)).toBe(blob)
  expect(encode).toHaveBeenCalledWith(expect.any(Function), "image/png", 0.92)
  encode.mockImplementation((callback) => callback(null))
  await expect(encodeImage(canvas, options)).rejects.toThrow("ENCODING_FAILED")
  encode.mockImplementation((callback) => callback(blob))
  await expect(
    encodeImage(canvas, { ...options, format: "image/webp" })
  ).rejects.toThrow("ENCODING_FAILED")
})
