import type { Scale, UpscaleRequest, UpscaleUpdate } from "../worker-messages"
import { createSession } from "./model"
import { toRgbPlanes, writeTile } from "./pixels"

const modelScale = 4
const tileSize = 192
// The model has 34 layers of 3×3 convolution. Keep their full input
// neighborhood around internal tile edges and crop it after inference.
const padding = 34

type UpscaleModel = Awaited<ReturnType<typeof createSession>>

let model: UpscaleModel | undefined
let backend: "webgpu" | "wasm" = "gpu" in navigator ? "webgpu" : "wasm"

function send(update: UpscaleUpdate) {
  self.postMessage(update)
}

async function upscale(
  bitmap: ImageBitmap,
  { session, Tensor }: UpscaleModel,
  scale: Scale
) {
  const { width, height } = bitmap
  const source = new OffscreenCanvas(width, height)
  const sourceContext = source.getContext("2d", { willReadFrequently: true })!
  sourceContext.drawImage(bitmap, 0, 0)

  const output = new OffscreenCanvas(width * scale, height * scale)
  const context = output.getContext("2d")!
  context.imageSmoothingQuality = "high"

  const scratch = new OffscreenCanvas(
    tileSize * modelScale,
    tileSize * modelScale
  )
  const scratchContext = scratch.getContext("2d")!
  const total = Math.ceil(width / tileSize) * Math.ceil(height / tileSize)
  let completed = 0

  for (let y = 0; y < height; y += tileSize) {
    for (let x = 0; x < width; x += tileSize) {
      const tileWidth = Math.min(tileSize, width - x)
      const tileHeight = Math.min(tileSize, height - y)
      const left = Math.max(0, x - padding)
      const top = Math.max(0, y - padding)
      const sampleWidth = Math.min(width, x + tileWidth + padding) - left
      const sampleHeight = Math.min(height, y + tileHeight + padding) - top
      const pixels = sourceContext.getImageData(
        left,
        top,
        sampleWidth,
        sampleHeight
      )
      const input = new Tensor("float32", toRgbPlanes(pixels), [
        1,
        3,
        sampleHeight,
        sampleWidth,
      ])

      const { upscaled: prediction } = await session.run({ image: input })
      const tile = scratchContext.createImageData(
        tileWidth * modelScale,
        tileHeight * modelScale
      )
      writeTile(
        tile.data,
        prediction!.data as Float32Array,
        sampleWidth * modelScale,
        sampleHeight * modelScale,
        (x - left) * modelScale,
        (y - top) * modelScale,
        tile.width,
        tile.height
      )
      scratchContext.putImageData(tile, 0, 0)
      context.drawImage(
        scratch,
        0,
        0,
        tile.width,
        tile.height,
        x * scale,
        y * scale,
        tileWidth * scale,
        tileHeight * scale
      )
      send({ type: "progress", fraction: ++completed / total })
    }
  }

  // Keep the original alpha channel, independently of the model's RGB output.
  context.globalCompositeOperation = "destination-in"
  context.drawImage(bitmap, 0, 0, output.width, output.height)
  return output.convertToBlob({ type: "image/png" })
}

async function run(bitmap: ImageBitmap, scale: Scale) {
  if (!model) {
    send({ type: "loading" })
    model = await createSession(backend)
  }
  send({ type: "progress", fraction: 0 })
  return upscale(bitmap, model, scale)
}

self.onmessage = async ({ data }: MessageEvent<UpscaleRequest>) => {
  try {
    const bitmap = await createImageBitmap(data.file)
    try {
      let png: Blob
      try {
        png = await run(bitmap, data.scale)
      } catch (error) {
        if (backend === "wasm") throw error
        backend = "wasm"
        const gpuSession = model?.session
        model = undefined
        await gpuSession?.release()
        png = await run(bitmap, data.scale)
      }
      send({ type: "done", png })
    } finally {
      bitmap.close()
    }
  } catch {
    send({ type: "failed" })
  }
}
