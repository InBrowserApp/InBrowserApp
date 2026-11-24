import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

const { pipeline, processor, forward, transcribe } = vi.hoisted(() => ({
  pipeline: vi.fn(),
  processor: vi.fn(),
  forward: vi.fn(),
  transcribe: vi.fn(),
}))
vi.mock("@huggingface/transformers", () => ({
  env: {},
  pipeline,
  Tensor: class {},
}))

const send = vi.fn()
const requestAdapter = vi.fn()
const dispose = vi.fn()
const audio = new Float32Array(16000)
audio[1] = 0.2
async function run(data = {}) {
  await self.onmessage!(
    new MessageEvent("message", {
      data: { audio, model: "base", language: "", cpuOnly: false, ...data },
    })
  )
}
beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  vi.stubGlobal("postMessage", send)
  vi.stubGlobal("navigator", { gpu: { requestAdapter } })
  requestAdapter.mockResolvedValue(null)
  processor.mockResolvedValue({ input_features: {} })
  forward.mockResolvedValue({ logits: { data: [0, 5, 15], dispose } })
  transcribe.mockResolvedValue({
    chunks: [{ timestamp: [0, 0.8], text: "Transcript" }],
  })
  pipeline.mockResolvedValue(
    Object.assign(transcribe, {
      processor,
      model: {
        forward,
        generation_config: {
          decoder_start_token_id: 12,
          lang_to_id: { "<|en|>": 1, "<|zh|>": 2 },
          task_to_id: { transcribe: 42 },
        },
      },
    })
  )
  await import("./transcribe.worker")
})
afterEach(() => {
  vi.unstubAllGlobals()
  self.onmessage = null
})

describe("local transcription worker", () => {
  it("skips downloading a model for a silent recording", async () => {
    await run({ audio: new Float32Array(16000) })
    expect(pipeline).not.toHaveBeenCalled()
    expect(send).toHaveBeenLastCalledWith(
      { type: "done", segments: [] },
      { transfer: [] }
    )
  })

  it("detects the highest-scoring language and transcribes on CPU", async () => {
    await run()
    expect(pipeline).toHaveBeenCalledWith(
      "automatic-speech-recognition",
      "onnx-community/whisper-base",
      expect.objectContaining({ device: "wasm", dtype: "q8" })
    )
    expect(transcribe).toHaveBeenCalledWith(
      audio,
      expect.objectContaining({
        decoder_input_ids: [12, 2, 42],
        return_timestamps: true,
        task: "transcribe",
      })
    )
    expect(dispose).toHaveBeenCalledOnce()
    expect(send).toHaveBeenLastCalledWith(
      {
        type: "done",
        segments: [{ start: 0, end: 800, text: "Transcript" }],
      },
      { transfer: [] }
    )
  })

  it("passes an explicit language and reports the quantized GPU download", async () => {
    requestAdapter.mockResolvedValue({ features: new Set(["shader-f16"]) })
    const engine = await pipeline()
    pipeline.mockImplementationOnce(
      async (_task, _model, { progress_callback }) => {
        progress_callback({
          status: "progress",
          file: "config.json",
          loaded: 100,
        })
        progress_callback({
          status: "progress",
          file: "encoder.onnx",
          loaded: 282_000_000,
        })
        return engine
      }
    )
    await run({ model: "turbo", language: "ja" })
    expect(pipeline).toHaveBeenLastCalledWith(
      "automatic-speech-recognition",
      "onnx-community/whisper-large-v3-turbo",
      expect.objectContaining({ device: "webgpu", dtype: "q4f16" })
    )
    expect(forward).not.toHaveBeenCalled()
    expect(transcribe).toHaveBeenCalledWith(
      audio,
      expect.objectContaining({ language: "ja" })
    )
    expect(send).toHaveBeenCalledWith(
      { type: "loading", backend: "webgpu", progress: 0.5 },
      { transfer: [] }
    )
  })

  it("returns decoded PCM to retry a failed WebGPU session on CPU", async () => {
    requestAdapter.mockResolvedValue({ features: new Set() })
    transcribe.mockRejectedValueOnce(Error("GPU lost"))
    await run({ model: "turbo", language: "en" })
    expect(pipeline).toHaveBeenLastCalledWith(
      "automatic-speech-recognition",
      "onnx-community/whisper-large-v3-turbo",
      expect.objectContaining({ device: "webgpu", dtype: "q4" })
    )
    expect(send).toHaveBeenLastCalledWith(
      { type: "retry", audio },
      { transfer: [audio.buffer] }
    )
  })

  it("distinguishes model loading failure from failed transcription", async () => {
    requestAdapter.mockRejectedValueOnce(Error("adapter unavailable"))
    pipeline.mockRejectedValueOnce(Error("fetch failed"))
    await run({ language: "en" })
    expect(send).toHaveBeenLastCalledWith(
      { type: "error", stage: "modelError" },
      { transfer: [] }
    )
    transcribe.mockRejectedValueOnce(Error("inference failed"))
    await run({ language: "en", cpuOnly: true })
    expect(requestAdapter).toHaveBeenCalledOnce()
    expect(send).toHaveBeenLastCalledWith(
      { type: "error", stage: "transcriptionError" },
      { transfer: [] }
    )
  })
})
