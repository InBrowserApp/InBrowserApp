import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { createSession, run } = vi.hoisted(() => ({
  createSession: vi.fn(),
  run: vi.fn(),
}))

vi.mock("onnxruntime-web/wasm", () => ({
  env: { wasm: {} },
  InferenceSession: { create: createSession },
  Tensor: class {},
}))
vi.mock("onnxruntime-web/ort-wasm-simd-threaded.wasm?url", () => ({
  default: "/runtime.wasm",
}))

const drawImage = vi.fn()
const putImageData = vi.fn()
const close = vi.fn()
const png = new Blob([], { type: "image/png" })
const convertToBlob = vi.fn()
const bitmap = { width: 800, height: 600, close }
const decode = vi.fn()
const send = vi.fn()
const file = new File([], "photo.jpg", { type: "image/jpeg" })

const context = {
  drawImage,
  globalCompositeOperation: "source-over",
  getImageData: () => ({ data: new Uint8ClampedArray(8) }),
  createImageData: () => ({ data: new Uint8ClampedArray(8) }),
  putImageData,
}

async function processImage() {
  await self.onmessage!(new MessageEvent("message", { data: file }))
}

beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  context.globalCompositeOperation = "source-over"
  decode.mockResolvedValue(bitmap)
  createSession.mockResolvedValue({
    run,
    inputNames: ["input"],
    outputNames: ["mask", "unused"],
  })
  run.mockResolvedValue({ mask: { data: new Float32Array([0, 1]) } })
  convertToBlob.mockResolvedValue(png)
  vi.stubGlobal("postMessage", send)
  vi.stubGlobal("createImageBitmap", decode)
  vi.stubGlobal(
    "OffscreenCanvas",
    class {
      getContext() {
        return context
      }
      convertToBlob = convertToBlob
    }
  )
  await import("./remove-background.worker")
})

afterEach(() => {
  self.onmessage = null
  vi.unstubAllGlobals()
})

describe("background removal worker", () => {
  it("loads the model once and exports a full-size transparent PNG for each image", async () => {
    await processImage()
    await processImage()

    expect(createSession).toHaveBeenCalledTimes(1)
    expect(run).toHaveBeenCalledWith({ input: expect.anything() }, ["mask"])
    expect(send.mock.calls.map(([update]) => update.type)).toEqual([
      "preparing",
      "processing",
      "ready",
      "processing",
      "ready",
    ])
    expect(send).toHaveBeenLastCalledWith({
      type: "ready",
      png,
      width: 800,
      height: 600,
    })
    expect(putImageData).toHaveBeenCalledWith(
      { data: new Uint8ClampedArray([0, 0, 0, 0, 0, 0, 0, 255]) },
      0,
      0
    )
    expect(drawImage).toHaveBeenLastCalledWith(
      expect.anything(),
      0,
      0,
      800,
      600
    )
    expect(context.globalCompositeOperation).toBe("destination-in")
    expect(convertToBlob).toHaveBeenCalledWith({ type: "image/png" })
    expect(close).toHaveBeenCalledTimes(2)
  })

  it("rejects unreadable files before loading model assets", async () => {
    decode.mockRejectedValueOnce(Error("not an image"))
    await processImage()

    expect(send).toHaveBeenCalledWith({ type: "invalidImage" })
    expect(createSession).not.toHaveBeenCalled()
  })

  it("reports a model load failure and closes the decoded bitmap", async () => {
    createSession.mockRejectedValueOnce(Error("network error"))
    await processImage()

    expect(send).toHaveBeenLastCalledWith({ type: "modelFailed" })
    expect(close).toHaveBeenCalledOnce()
  })

  it("reports processing failures and closes the decoded bitmap", async () => {
    convertToBlob.mockRejectedValueOnce(Error("canvas encoding failed"))
    await processImage()

    expect(send).toHaveBeenLastCalledWith({ type: "processingFailed" })
    expect(close).toHaveBeenCalledOnce()
  })
})
