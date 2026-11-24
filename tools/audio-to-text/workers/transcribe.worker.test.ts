import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import { SAMPLE_RATE } from "../worker-messages"

const { pipeline, processor, forward, transcribe, decodeAsr } = vi.hoisted(
  () => ({
    pipeline: vi.fn(),
    processor: vi.fn(),
    forward: vi.fn(),
    transcribe: vi.fn(),
    decodeAsr: vi.fn(),
  })
)
vi.mock("@huggingface/transformers", () => ({
  env: {},
  pipeline,
  Tensor: class {},
  WhisperTextStreamer: class {
    readonly callback_function: (text: string) => void
    readonly token_callback_function: (tokens: bigint[]) => void
    readonly end: () => void

    constructor(
      _tokenizer: unknown,
      options: {
        callback_function: (text: string) => void
        token_callback_function: (tokens: bigint[]) => void
        on_finalize: () => void
      }
    ) {
      this.callback_function = options.callback_function
      this.token_callback_function = options.token_callback_function
      this.end = options.on_finalize
    }
  },
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
  decodeAsr.mockReturnValue(["", {}])
  pipeline.mockResolvedValue(
    Object.assign(transcribe, {
      processor,
      tokenizer: { _decode_asr: decodeAsr },
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
  vi.restoreAllMocks()
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

  it("previews speech and publishes closed timed passages and an ETA", async () => {
    const longAudio = new Float32Array(65 * SAMPLE_RATE)
    longAudio[0] = 0.2
    let now = 4000
    vi.spyOn(performance, "now").mockImplementation(() => now)
    const firstPassage = { timestamp: [0, 11], text: "First completed passage" }
    decodeAsr
      .mockReturnValueOnce([
        "",
        {
          chunks: [firstPassage, { timestamp: [11, null], text: "Open tail" }],
        },
      ])
      .mockReturnValueOnce([
        "",
        {
          chunks: [
            firstPassage,
            { timestamp: [11, 32], text: "Second completed passage" },
            { timestamp: [40, 48], text: "Overlaps the next window" },
          ],
        },
      ])
    transcribe.mockImplementationOnce(async (_audio, { streamer }) => {
      streamer.token_callback_function([1n, 2n])
      streamer.callback_function("First words")
      now += 50
      streamer.callback_function(" " + "音".repeat(240))
      now += 250
      streamer.callback_function("完")
      now = 15000
      streamer.end()
      now = 23000
      streamer.token_callback_function([3n, 4n])
      streamer.callback_function("Second window")
      streamer.end()
      now = 31000
      streamer.end()
      return { chunks: [{ timestamp: [62, 64], text: "Finished" }] }
    })

    await run({ audio: longAudio, language: "en" })

    const events = send.mock.calls.map(([event]) => event)
    const updates = events.filter((event) => event.type === "transcribing")
    expect(
      updates.map(({ progress, preview, etaSeconds, partialSegments }) => ({
        progress,
        preview,
        etaSeconds,
        partialSegments,
      }))
    ).toEqual([
      { progress: 0 },
      { progress: 0, preview: "First words" },
      { progress: 0, preview: "…" + "音".repeat(239) + "完" },
      {
        progress: 25 / 65,
        partialSegments: [
          { start: 0, end: 11000, text: "First completed passage" },
        ],
      },
      { progress: 25 / 65, preview: "Second window" },
      {
        progress: 45 / 65,
        etaSeconds: 8,
        partialSegments: [
          { start: 0, end: 11000, text: "First completed passage" },
          { start: 11000, end: 32000, text: "Second completed passage" },
        ],
      },
      { progress: 1 },
    ])
    expect(decodeAsr).toHaveBeenLastCalledWith(
      [
        { tokens: [1n, 2n], stride: [30, 0, 5] },
        { tokens: [3n, 4n], stride: [30, 5, 5] },
      ],
      expect.objectContaining({
        return_timestamps: true,
        force_full_sequences: false,
      })
    )
    expect(events.at(-1)).toEqual({
      type: "done",
      segments: [{ start: 62000, end: 64000, text: "Finished" }],
    })
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
