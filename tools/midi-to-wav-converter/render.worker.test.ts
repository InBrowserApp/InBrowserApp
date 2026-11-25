// @vitest-environment node
import {
  beforeAll,
  beforeEach,
  afterAll,
  describe,
  expect,
  it,
  vi,
} from "vitest"
import { renderMidiToWav } from "./core/render"

import type { Request } from "./render.worker"

vi.mock("./core/render", () => ({ renderMidiToWav: vi.fn() }))

const host = {
  onmessage: undefined as
    | undefined
    | ((event: { data: Request }) => Promise<void>),
  postMessage: vi.fn(),
}
const fetchSoundFont = vi.fn()
const file = new File(["midi"], "song.mid")
const soundFont = new File(["samples"], "piano.sf2")
const wav = new ArrayBuffer(44)

beforeAll(async () => {
  vi.stubGlobal("self", host)
  vi.stubGlobal("fetch", fetchSoundFont)
  await import("./render.worker")
})
beforeEach(() => {
  vi.resetAllMocks()
  vi.mocked(renderMidiToWav).mockImplementation(
    async (_midi, _bank, progress) => {
      progress(25)
      return { type: "complete", wav }
    }
  )
})
afterAll(() => vi.unstubAllGlobals())

describe("MIDI rendering worker", () => {
  it("loads the built-in bank, updates progress, and transfers the WAV", async () => {
    fetchSoundFont.mockResolvedValue(new Response(soundFont))
    await host.onmessage!({ data: { file } })
    expect(fetchSoundFont).toHaveBeenCalledOnce()
    expect(host.postMessage).toHaveBeenCalledWith({
      type: "progress",
      percent: 25,
    })
    expect(host.postMessage).toHaveBeenCalledWith(
      { type: "complete", wav },
      { transfer: [wav] }
    )
  })

  it("reads a custom bank directly and returns renderer errors", async () => {
    vi.mocked(renderMidiToWav).mockResolvedValue({
      type: "error",
      key: "invalidSoundFont",
    })
    await host.onmessage!({ data: { file, soundFont } })
    expect(fetchSoundFont).not.toHaveBeenCalled()
    expect(renderMidiToWav).toHaveBeenCalledOnce()
    expect(host.postMessage).toHaveBeenCalledWith({
      type: "error",
      key: "invalidSoundFont",
    })
  })

  it("finishes when renderer initialization throws", async () => {
    vi.mocked(renderMidiToWav).mockRejectedValue(
      new Error("initialization failed")
    )
    await host.onmessage!({ data: { file, soundFont } })
    expect(host.postMessage).toHaveBeenCalledWith({
      type: "error",
      key: "renderFailed",
    })
  })

  it("reports file read and bank download failures", async () => {
    const badFile = new File([], "missing.mid")
    vi.spyOn(badFile, "arrayBuffer").mockRejectedValue(new Error("unreadable"))
    await host.onmessage!({ data: { file: badFile } })
    expect(host.postMessage).toHaveBeenLastCalledWith({
      type: "error",
      key: "invalidMidi",
    })
    await host.onmessage!({ data: { file, soundFont: badFile } })
    expect(host.postMessage).toHaveBeenLastCalledWith({
      type: "error",
      key: "invalidSoundFont",
    })
    fetchSoundFont.mockResolvedValue(new Response(null, { status: 503 }))
    await host.onmessage!({ data: { file } })
    expect(host.postMessage).toHaveBeenLastCalledWith({
      type: "error",
      key: "soundFontUnavailable",
    })
    expect(renderMidiToWav).not.toHaveBeenCalled()
  })
})
