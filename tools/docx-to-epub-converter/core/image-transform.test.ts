// @vitest-environment jsdom
// @vitest-environment-options {"resources":"usable"}
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { imageTransform } from "./image-transform"
import type { ImageRun } from "./render"

const run: ImageRun = {
  type: "image",
  imagePath: "word/media/image.png",
  mimeType: "image/png",
  widthPt: 80,
  heightPt: 40,
}

function canvas(width: number, height: number) {
  const canvas = document.createElement("canvas")
  canvas.width = width
  canvas.height = height
  return { canvas, context: canvas.getContext("2d")! }
}

function drawableImage() {
  const image = document.createElement("img")
  // jsdom can load images and draw them to canvas, but lacks Image.decode().
  image.decode = () =>
    new Promise((resolve, reject) => {
      image.addEventListener("load", () => resolve(), { once: true })
      image.addEventListener("error", () => reject(new Error("Image decode")), {
        once: true,
      })
    })
  return image
}

const createImage = vi.fn(function () {
  return drawableImage()
})

beforeEach(() => vi.stubGlobal("Image", createImage))
afterEach(() => {
  createImage.mockReset()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

async function readPixels(url: string | null) {
  expect(url).toMatch(/^data:image\/png;base64,/)
  const image = drawableImage()
  image.src = url!
  await image.decode()
  const { naturalWidth: width, naturalHeight: height } = image
  const { context } = canvas(width, height)
  context.drawImage(image, 0, 0)
  const { data } = context.getImageData(0, 0, width, height)
  const pixels = Array.from({ length: width * height }, (_, index) =>
    Array.from(data.slice(index * 4, index * 4 + 4))
  )
  return { width, height, pixels }
}

it("keeps the original image when Word applies no visible transform", async () => {
  const original = "data:image/png;base64,original"
  const signal = new AbortController().signal
  await expect(imageTransform(original, run, signal)).resolves.toBe(original)
  await expect(
    imageTransform(original, { ...run, rotation: 360, alpha: 1 }, signal)
  ).resolves.toBe(original)
  expect(createImage).not.toHaveBeenCalled()
})

it("removes cropped pixels and applies horizontal mirroring, rotation and opacity to the exported PNG", async () => {
  const original = canvas(8, 4)
  original.context.fillStyle = "#ff0000"
  original.context.fillRect(0, 0, 8, 4)
  const colors = ["#0f0", "#00f", "#ff0", "#0ff", "#f0f", "#fff"]
  for (const [index, color] of colors.entries()) {
    original.context.fillStyle = color
    original.context.fillRect(2 + (index % 3), 1 + Math.floor(index / 3), 1, 1)
  }

  const output = await imageTransform(
    original.canvas.toDataURL(),
    {
      ...run,
      srcRect: { l: 0.25, t: 0.25, r: 0.375, b: 0.25 },
      flipH: true,
      rotation: 90,
      alpha: 0.5,
    },
    new AbortController().signal
  )
  const { width, height, pixels } = await readPixels(output)
  expect([width, height]).toEqual([2, 3])
  expect(pixels.map((pixel) => pixel.slice(0, 3))).toEqual([
    [255, 255, 255],
    [255, 255, 0],
    [255, 0, 255],
    [0, 0, 255],
    [0, 255, 255],
    [0, 255, 0],
  ])
  expect(pixels.every((pixel) => Math.abs(pixel[3]! - 127.5) <= 0.5)).toBe(true)
})

it.each([
  [
    2,
    [
      [0, 0, 255, 255],
      [255, 0, 0, 255],
    ],
  ],
  [
    -0.2,
    [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ],
] as const)(
  "mirrors vertically and limits opacity %s to the available range",
  async (alpha, pixels) => {
    const original = canvas(1, 2)
    original.context.fillStyle = "#f00"
    original.context.fillRect(0, 0, 1, 1)
    original.context.fillStyle = "#00f"
    original.context.fillRect(0, 1, 1, 1)
    const output = await imageTransform(
      original.canvas.toDataURL(),
      { ...run, flipV: true, alpha },
      new AbortController().signal
    )
    expect(await readPixels(output)).toEqual({ width: 1, height: 2, pixels })
  }
)

function mockImage(
  width: number,
  height: number,
  decode = vi.fn(async () => {})
) {
  const image = drawableImage()
  vi.spyOn(image, "naturalWidth", "get").mockReturnValue(width)
  vi.spyOn(image, "naturalHeight", "get").mockReturnValue(height)
  image.decode = decode
  const removed = vi.spyOn(image, "removeAttribute")
  createImage.mockImplementationOnce(function () {
    return image
  })
  return { image, removed }
}

it("scales a large image to the canvas limit without changing its aspect ratio", async () => {
  const { image, removed } = mockImage(9000, 2000)
  const context = {
    drawImage: vi.fn(),
    translate: vi.fn(),
    rotate: vi.fn(),
    scale: vi.fn(),
  }
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(context as unknown as CanvasRenderingContext2D)
  const output = "data:image/png;base64,large"
  vi.spyOn(HTMLCanvasElement.prototype, "toDataURL").mockImplementation(
    function (this: HTMLCanvasElement, type) {
      expect(type).toBe("image/png")
      expect([this.width, this.height]).toEqual([8192, 1821])
      return output
    }
  )
  await expect(
    imageTransform("", { ...run, flipH: true }, new AbortController().signal)
  ).resolves.toBe(output)
  expect(context.scale).toHaveBeenCalledWith(-8192 / 9000, 8192 / 9000)
  expect(context.drawImage).toHaveBeenCalledWith(
    image,
    0,
    0,
    9000,
    2000,
    -4500,
    -1000,
    9000,
    2000
  )
  expect(getContext.mock.contexts[0]).toMatchObject({ width: 0, height: 0 })
  expect(removed).toHaveBeenCalledWith("src")
})

it.each([
  { l: 0.5, t: 0, r: 0.5, b: 0 },
  { l: 0, t: 0.5, r: 0, b: 0.5 },
])("omits a fully cropped image without drawing", async (srcRect) => {
  const { removed } = mockImage(50, 20)
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext")
  await expect(
    imageTransform("", { ...run, srcRect }, new AbortController().signal)
  ).resolves.toBeNull()
  expect(getContext).not.toHaveBeenCalled()
  expect(removed).toHaveBeenCalledWith("src")
})

it("cleans up when canvas creation succeeds but a drawing context is unavailable", async () => {
  const { removed } = mockImage(50, 20)
  const getContext = vi
    .spyOn(HTMLCanvasElement.prototype, "getContext")
    .mockReturnValue(null)
  await expect(
    imageTransform("", { ...run, rotation: 45 }, new AbortController().signal)
  ).rejects.toThrow(RangeError)
  expect(getContext.mock.contexts[0]).toMatchObject({ width: 0, height: 0 })
  expect(removed).toHaveBeenCalledWith("src")
})

it("honors cancellation during decoding before drawing pixels", async () => {
  const controller = new AbortController()
  const { removed } = mockImage(
    50,
    20,
    vi.fn(async () => controller.abort())
  )
  const getContext = vi.spyOn(HTMLCanvasElement.prototype, "getContext")
  await expect(
    imageTransform("", { ...run, rotation: 90 }, controller.signal)
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(getContext).not.toHaveBeenCalled()
  expect(removed).toHaveBeenCalledWith("src")
})
