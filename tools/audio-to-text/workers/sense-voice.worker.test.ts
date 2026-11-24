import { afterEach, beforeEach, expect, it, vi } from "vitest"
import { SAMPLE_RATE } from "../worker-messages"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

const { loadRecognizer } = vi.hoisted(() => ({ loadRecognizer: vi.fn() }))
vi.mock("./sense-voice-runtime", () => ({
  loadRecognizer,
  WINDOW_SAMPLES: 512,
}))

const messages: TranscriptionResponse[] = []

function run(audio: Float32Array<ArrayBuffer>) {
  return self.onmessage!(
    new MessageEvent<TranscriptionRequest>("message", {
      data: { audio, model: "senseVoice", language: "yue", cpuOnly: false },
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

it("publishes stable timed passages and includes the speech flushed at the end", async () => {
  const samples = new Float32Array(SAMPLE_RATE / 2)
  const pending: { start: number; samples: Float32Array }[] = []
  let processed = 0
  const stream = { acceptWaveform: vi.fn(), free: vi.fn() }
  const recognizer = {
    createStream: vi.fn(() => stream),
    decode: vi.fn(),
    getResult: vi
      .fn()
      .mockReturnValueOnce({ text: "第一段", timestamps: [0.12] })
      .mockReturnValueOnce({ text: "第二段", timestamps: [0.06] }),
    free: vi.fn(),
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
    return { recognizer, vad }
  })

  await run(new Float32Array(3 * SAMPLE_RATE).fill(0.1))

  expect(loadRecognizer).toHaveBeenCalledWith("yue", expect.any(Function))
  expect(messages).toContainEqual({
    type: "loading",
    backend: "wasm",
    progress: 0.8,
  })
  const updates = messages.filter((message) => message.type === "transcribing")
  const expected = [
    { start: 370, end: 750, text: "第一段" },
    { start: 2560, end: 3000, text: "第二段" },
  ]
  expect(
    updates.find((update) => update.partialSegments)?.partialSegments
  ).toEqual(expected.slice(0, 1))
  expect(messages.at(-1)).toEqual({ type: "done", segments: expected })
  expect(stream.free).toHaveBeenCalledTimes(2)
  expect(recognizer.free).toHaveBeenCalledOnce()
  expect(vad.free).toHaveBeenCalledOnce()
})

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
