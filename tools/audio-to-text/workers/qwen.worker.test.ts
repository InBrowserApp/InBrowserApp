import { afterEach, beforeEach, expect, it, vi } from "vitest"
import type {
  TranscriptionRequest,
  TranscriptionResponse,
} from "../worker-messages"

const { loadQwenRecognizer, loadQwenTiming } = vi.hoisted(() => ({
  loadQwenRecognizer: vi.fn(),
  loadQwenTiming: vi.fn(),
}))

vi.mock("./qwen-runtime", () => ({ loadQwenRecognizer }))
vi.mock("./qwen-timing", () => ({ loadQwenTiming }))

const passages = [
  { start: 0, samples: Float32Array.of(0.1) },
  { start: 16_000, samples: Float32Array.of(0.2) },
]

vi.mock("./voice-activity", () => ({
  *speechUpdates() {
    yield { passages: passages.slice(0, 1), progress: 0.5 }
    yield { passages: passages.slice(1), progress: 1 }
  },
}))

const output: TranscriptionResponse[] = []
const stream = { acceptWaveform: vi.fn(), setOption: vi.fn(), free: vi.fn() }

async function run(model: "qwenPlain" | "qwenTimed") {
  await self.onmessage!(
    new MessageEvent<TranscriptionRequest>("message", {
      data: {
        audio: new Float32Array(32_000).fill(0.1),
        model,
        language: "zh",
        cpuOnly: false,
      },
    })
  )
}

beforeEach(async () => {
  vi.resetModules()
  vi.resetAllMocks()
  output.length = 0
  vi.stubGlobal("postMessage", (message: TranscriptionResponse) => {
    output.push(structuredClone(message))
  })
  loadQwenRecognizer.mockResolvedValue({
    download: vi.fn(),
    vad: { free: vi.fn() },
    recognizer: {
      createStream: () => stream,
      decode: vi.fn(),
      getResult: vi
        .fn()
        .mockReturnValueOnce({ text: "第一段。" })
        .mockReturnValueOnce({ text: "第二段。" }),
      free: vi.fn(),
    },
  })
  await import("./qwen.worker")
})

afterEach(() => {
  self.onmessage = null
  vi.unstubAllGlobals()
})

it("transcribes plain text progressively without loading the aligner", async () => {
  await run("qwenPlain")
  expect(loadQwenRecognizer).toHaveBeenCalledWith(false, expect.any(Function))
  expect(loadQwenTiming).not.toHaveBeenCalled()
  expect(stream.setOption).toHaveBeenCalledWith("language", "Chinese")
  expect(output).toContainEqual(
    expect.objectContaining({
      type: "transcribing",
      progress: 0.5,
      partialText: "第一段。",
    })
  )
  expect(output.at(-1)).toEqual(
    expect.objectContaining({ type: "done", plainText: "第一段。\n\n第二段。" })
  )
})

it("publishes passages with the aligner's original-audio times", async () => {
  const release = vi.fn()
  const first = { start: 100, end: 650, text: "第一段。" }
  const second = { start: 1100, end: 1650, text: "第二段。" }
  loadQwenTiming.mockResolvedValue({
    align: vi.fn().mockResolvedValueOnce(first).mockResolvedValueOnce(second),
    release,
  })
  await run("qwenTimed")
  expect(loadQwenRecognizer).toHaveBeenCalledWith(true, expect.any(Function))
  expect(output).toContainEqual(
    expect.objectContaining({ type: "transcribing", partialSegments: [first] })
  )
  expect(output.at(-1)).toEqual({ type: "done", segments: [first, second] })
  expect(release).toHaveBeenCalledOnce()
})

it("keeps the complete text if alignment fails after the first passage", async () => {
  const release = vi.fn()
  loadQwenTiming.mockResolvedValue({
    align: vi
      .fn()
      .mockResolvedValueOnce({ start: 200, end: 580, text: "第一段。" })
      .mockRejectedValueOnce(new Error("No usable timestamps")),
    release,
  })
  await run("qwenTimed")
  expect(output.at(-1)).toEqual({
    type: "done",
    plainText: "第一段。\n\n第二段。",
    alignmentFallback: true,
  })
  expect(release).toHaveBeenCalledOnce()
})
