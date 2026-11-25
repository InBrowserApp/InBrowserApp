// @vitest-environment jsdom
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { createPng, createRaster } from "./render"

vi.mock("mermaid", () => ({
  default: { initialize: vi.fn() },
}))

const context = { drawImage: vi.fn(), fillRect: vi.fn(), fillStyle: "" }
const canvases: HTMLCanvasElement[] = []
let size: [number, number]

beforeEach(() => {
  vi.clearAllMocks()
  canvases.length = 0
  vi.stubGlobal(
    "Image",
    class {
      naturalWidth = 100
      naturalHeight = 60
      decode = async () => {}
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockImplementation(
    function (this: HTMLCanvasElement) {
      canvases.push(this)
      return context as unknown as CanvasRenderingContext2D
    }
  )
  vi.spyOn(HTMLCanvasElement.prototype, "toBlob").mockImplementation(function (
    this: HTMLCanvasElement,
    callback,
    type
  ) {
    size = [this.width, this.height]
    callback(new Blob(["data"], { type }))
  })
})

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

it("keeps the old PNG export at 2× with transparency", async () => {
  expect((await createPng("data:image/svg+xml,svg")).type).toBe("image/png")
  expect(size).toEqual([200, 120])
  expect(context.fillRect).not.toHaveBeenCalled()
  expect(canvases[0]?.width).toBe(0)
})

it("fills JPG with white and honors the requested raster size", async () => {
  const blob = await createRaster("data:image/svg+xml,svg", {
    type: "image/jpeg",
    scale: 1,
    white: false,
  })
  expect(blob.type).toBe("image/jpeg")
  expect(size).toEqual([100, 60])
  expect(context.fillStyle).toBe("#fff")
  expect(context.fillRect).toHaveBeenCalledWith(0, 0, 100, 60)
})

it("rejects a fallback media type so the requested extension stays accurate", async () => {
  vi.mocked(HTMLCanvasElement.prototype.toBlob).mockImplementationOnce(
    (callback) => callback(new Blob([], { type: "image/png" }))
  )
  await expect(
    createRaster("data:image/svg+xml,svg", {
      type: "image/webp",
      scale: 2,
      white: false,
    })
  ).rejects.toThrow("Image export failed")
  expect(canvases[0]?.width).toBe(0)
})
