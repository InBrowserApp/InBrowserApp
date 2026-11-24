import { afterEach, beforeEach, expect, it, vi } from "vitest"

import type { Scale, UpscaleRequest } from "../worker-messages"

const { createSession } = vi.hoisted(() => ({ createSession: vi.fn() }))
vi.mock("./model", () => ({ createSession }))
class Tensor {
  constructor(
    readonly type: string,
    readonly data: Float32Array,
    readonly dims: [number, number, number, number]
  ) {}
}

const file = new File([], "photo.png", { type: "image/png" })
const png = new Blob([], { type: "image/png" })
const close = vi.fn()
const decode = vi.fn()
const send = vi.fn()
const run = vi.fn()
const release = vi.fn()
const drawImage = vi.fn()
const putImageData = vi.fn()
const encode = vi.fn()
const bitmap = { width: 193, height: 2, close }

function imageData(width: number, height: number) {
  const data = new Uint8ClampedArray(width * height * 4)
  data.set([255, 128, 0, 64])
  return { width, height, data }
}

const context = {
  drawImage,
  globalCompositeOperation: "source-over",
  getImageData: (_x: number, _y: number, width: number, height: number) =>
    imageData(width, height),
  createImageData: imageData,
  putImageData,
}

async function processImage(scale: Scale = 2) {
  await self.onmessage!(
    new MessageEvent<UpscaleRequest>("message", { data: { file, scale } })
  )
}

beforeEach(() => {
  vi.resetModules()
  vi.resetAllMocks()
  decode.mockResolvedValue(bitmap)
  createSession.mockResolvedValue({ session: { run, release }, Tensor })
  run.mockImplementation(({ image }) => {
    const [, , height, width] = image.dims
    const count = width * height * 16
    const data = new Float32Array(count * 3)
    data.fill(1, 0, count)
    data.fill(0.5, count, count * 2)
    return { upscaled: { data } }
  })
  encode.mockResolvedValue(png)
  vi.stubGlobal("navigator", {})
  vi.stubGlobal("postMessage", send)
  vi.stubGlobal("createImageBitmap", decode)
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      constructor(
        readonly width: number,
        readonly height: number
      ) {}
      getContext() {
        return context
      }
      convertToBlob = encode
    }
  )
})

afterEach(() => {
  self.onmessage = null
  vi.unstubAllGlobals()
})

it("normalizes RGB, uses a padded second tile and exports the requested dimensions with original alpha", async () => {
  await import("./upscale.worker")
  await processImage()

  expect(createSession).toHaveBeenCalledWith("wasm")
  const input = run.mock.calls[0]![0].image
  expect(input.dims).toEqual([1, 3, 2, 193])
  expect(input.data[0]).toBe(1)
  expect(input.data[386]).toBeCloseTo(128 / 255)
  expect(input.data[772]).toBe(0)
  expect(run.mock.calls[1]![0].image.dims).toEqual([1, 3, 2, 35])
  const tile = putImageData.mock.calls[1]![0]
  expect(Array.from(tile.data.slice(0, 4))).toEqual([255, 128, 0, 255])
  expect(drawImage).toHaveBeenLastCalledWith(bitmap, 0, 0, 386, 4)
  expect(context.globalCompositeOperation).toBe("destination-in")
  expect(encode).toHaveBeenCalledWith({ type: "image/png" })
  expect(send.mock.calls.map(([update]) => update)).toEqual([
    { type: "loading" },
    { type: "progress", fraction: 0 },
    { type: "progress", fraction: 0.5 },
    { type: "progress", fraction: 1 },
    { type: "done", png },
  ])
  expect(close).toHaveBeenCalledOnce()

  await processImage(4)
  expect(createSession).toHaveBeenCalledOnce()
  expect(drawImage).toHaveBeenLastCalledWith(bitmap, 0, 0, 772, 8)
})

it("switches from WebGPU to WASM when GPU inference fails", async () => {
  vi.stubGlobal("navigator", { gpu: {} })
  run.mockRejectedValueOnce(new Error("GPU device lost"))
  await import("./upscale.worker")
  await processImage()

  expect(createSession.mock.calls).toEqual([["webgpu"], ["wasm"]])
  expect(release).toHaveBeenCalledOnce()
  expect(send).toHaveBeenLastCalledWith({ type: "done", png })
})

it("reports a failed CPU run and closes the image", async () => {
  createSession.mockRejectedValueOnce(new Error("model unavailable"))
  await import("./upscale.worker")
  await processImage()

  expect(send).toHaveBeenLastCalledWith({ type: "failed" })
  expect(close).toHaveBeenCalledOnce()
})
