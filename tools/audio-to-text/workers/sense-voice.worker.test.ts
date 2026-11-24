import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { SAMPLE_RATE } from "../worker-messages"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

const { loadRecognizer, findSenseVoiceGpu } = vi.hoisted(() => ({
  loadRecognizer: vi.fn(),
  findSenseVoiceGpu: vi.fn(),
}))
vi.mock("./sense-voice-runtime", () => ({ loadRecognizer }))
vi.mock("./sense-voice-webgpu", () => ({ findSenseVoiceGpu }))

const messages: TranscriptionResponse[] = []

function run(
  audio: Float32Array<ArrayBuffer>,
  model: TranscriptionRequest["model"] = "senseVoice",
  cpuOnly = false
) {
  return self.onmessage!(
    new MessageEvent<TranscriptionRequest>("message", {
      data: { audio, model, language: "yue", cpuOnly },
    })
  )
}

beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  messages.length = 0
  vi.stubGlobal("postMessage", (message: TranscriptionResponse) => {
    messages.push(structuredClone(message))
  })
  await import("./sense-voice.worker")
})

afterEach(() => {
  self.onmessage = null
  vi.unstubAllGlobals()
})

it.each(["senseVoice", "senseVoiceGpu"] as const)(
  "publishes stable timed passages on %s and includes speech flushed at the end",
  async (model) => {
    const gpu =
      model === "senseVoiceGpu" ? { assets: [], load: vi.fn() } : undefined
    const backend = gpu ? "webgpu" : "wasm"
    vi.stubGlobal("navigator", { gpu: {} })
    findSenseVoiceGpu.mockResolvedValueOnce(gpu)
    const samples = new Float32Array(SAMPLE_RATE / 2)
    const pending: { start: number; samples: Float32Array }[] = []
    let processed = 0
    const engine = {
      recognize: vi
        .fn()
        .mockResolvedValueOnce({ text: "第一段", startSeconds: 0.12 })
        .mockResolvedValueOnce({ text: "第二段", startSeconds: 0.06 }),
      release: vi.fn(),
    }
    const vad = {
      acceptWaveform(block: Float32Array) {
        processed += block.length
        if (processed === 16_384) pending.push({ start: 4000, samples })
      },
      isDetected: () => false,
      isEmpty: () => pending.length === 0,
      front: () => pending[0]!,
      pop: () => pending.shift(),
      flush: () => pending.push({ start: 40_000, samples }),
      free: vi.fn(),
    }
    loadRecognizer.mockImplementationOnce((_, progress) => {
      progress(0.8)
      return { engine, vad }
    })

    await run(new Float32Array(3 * SAMPLE_RATE).fill(0.1), model)

    expect(loadRecognizer).toHaveBeenCalledWith(
      "yue",
      expect.any(Function),
      gpu
    )
    expect(messages).toContainEqual({
      type: "loading",
      backend,
      progress: 0.8,
    })
    const updates = messages.filter(
      (message) => message.type === "transcribing"
    )
    const expected = [
      { start: 370, end: 750, text: "第一段" },
      { start: 2560, end: 3000, text: "第二段" },
    ]
    expect(
      updates.find((update) => update.partialSegments)?.partialSegments
    ).toEqual(expected.slice(0, 1))
    expect(messages.at(-1)).toEqual({ type: "done", segments: expected })
    expect(engine.recognize).toHaveBeenCalledTimes(2)
    expect(engine.release).toHaveBeenCalledOnce()
    expect(vad.free).toHaveBeenCalledOnce()
  }
)

it("returns an empty result for silence without loading models", async () => {
  await run(new Float32Array(SAMPLE_RATE))

  expect(loadRecognizer).not.toHaveBeenCalled()
  expect(messages).toEqual([{ type: "done", segments: [] }])
})

it("reports a failed model download", async () => {
  loadRecognizer.mockRejectedValueOnce(new Error("Unavailable"))
  await run(Float32Array.of(0.1))

  expect(messages.at(-1)).toEqual({ type: "error", stage: "modelError" })
})

it("retries with the original audio when WebGPU is unavailable or its model fails to load", async () => {
  const audio = Float32Array.of(0.1)
  vi.stubGlobal("navigator", {})
  await run(audio, "senseVoiceGpu")
  expect(loadRecognizer).not.toHaveBeenCalled()
  expect(messages).toEqual([{ type: "retry", audio }])

  vi.stubGlobal("navigator", { gpu: {} })
  findSenseVoiceGpu.mockResolvedValueOnce({ assets: [], load: vi.fn() })
  loadRecognizer.mockRejectedValueOnce(new Error("GPU model unavailable"))
  await run(audio, "senseVoiceGpu")
  expect(messages.at(-1)).toEqual({ type: "retry", audio })

  loadRecognizer.mockRejectedValueOnce(new Error("CPU model unavailable"))
  await run(audio, "senseVoiceGpu", true)
  expect(findSenseVoiceGpu).toHaveBeenCalledOnce()
  expect(loadRecognizer).toHaveBeenLastCalledWith(
    "yue",
    expect.any(Function),
    undefined
  )
  expect(messages.at(-1)).toEqual({ type: "error", stage: "modelError" })
})
