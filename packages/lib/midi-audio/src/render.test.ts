// @vitest-environment node
import { readFile } from "node:fs/promises"
import { afterEach, describe, expect, it, vi } from "vitest"
import { SpessaSynthProcessor } from "spessasynth_core"
import { renderMidiToWav } from "./render"

const soundFont = Uint8Array.from(
  await readFile(new URL("../assets/GeneralUserGS.sf3", import.meta.url))
).buffer

const note = [0x00, 0x90, 60, 90]
const end = [0x00, 0xff, 0x2f, 0x00]
function midi(events: number[]) {
  return Uint8Array.of(
    0x4d,
    0x54,
    0x68,
    0x64,
    0,
    0,
    0,
    6,
    0,
    0,
    0,
    1,
    1,
    224,
    0x4d,
    0x54,
    0x72,
    0x6b,
    0,
    0,
    0,
    events.length,
    ...events
  ).buffer
}

const phrase = midi([...note, 0x83, 0x60, 0x80, 60, 0, ...end])

afterEach(() => vi.restoreAllMocks())

describe("renderMidiToWav", () => {
  it("synthesizes a MIDI note into audible stereo PCM and includes a tail", async () => {
    const progress = vi.fn()
    const result = await renderMidiToWav(phrase, soundFont, progress)
    expect(result.type).toBe("complete")
    if (result.type !== "complete") throw Error(result.key)
    const wav = new DataView(result.wav)
    expect(wav.getUint32(0)).toBe(0x52494646)
    expect(wav.getUint16(20, true)).toBe(1)
    expect(wav.getUint16(22, true)).toBe(2)
    expect(wav.getUint32(24, true)).toBe(44100)
    expect(wav.getUint16(34, true)).toBe(16)
    expect(wav.getUint32(40, true) / 4 / 44100).toBeCloseTo(2.5)
    const samples = new Int16Array(result.wav, 44)
    expect(samples.some((sample) => Math.abs(sample) > 100)).toBe(true)
    expect(progress.mock.calls.map(([value]) => value)).toEqual(
      Array.from({ length: 99 }, (_, index) => index + 1)
    )
  })

  it("preserves leading silence before the first note", async () => {
    const leadingRest = midi([
      0x87,
      0x40,
      ...note.slice(1),
      0x83,
      0x60,
      0x80,
      60,
      0,
      ...end,
    ])
    const result = await renderMidiToWav(leadingRest, soundFont, vi.fn())
    if (result.type !== "complete") throw Error(result.key)
    const samples = new Int16Array(result.wav, 44)
    const onset =
      samples.findIndex((sample) => Math.abs(sample) > 100) / 2 / 44100
    expect(onset).toBeGreaterThanOrEqual(1)
    expect(onset).toBeLessThan(1.05)
  })

  it("reports unsupported timecode and independent-format timing", async () => {
    const smpte = phrase.slice(0)
    new DataView(smpte).setUint16(12, 0xe728)
    const format2 = phrase.slice(0)
    new DataView(format2).setUint16(8, 2)
    const error = { type: "error", key: "unsupportedTiming" }
    await expect(renderMidiToWav(smpte, soundFont, vi.fn())).resolves.toEqual(
      error
    )
    await expect(renderMidiToWav(format2, soundFont, vi.fn())).resolves.toEqual(
      error
    )
  })

  it("reports malformed, note-less, too long MIDI, and a malformed SoundFont", async () => {
    const progress = vi.fn()
    const blank = new ArrayBuffer(0)
    await expect(renderMidiToWav(blank, blank, progress)).resolves.toEqual({
      type: "error",
      key: "invalidMidi",
    })
    await expect(renderMidiToWav(midi(end), blank, progress)).resolves.toEqual({
      type: "error",
      key: "invalidMidi",
    })
    const longPhrase = midi([...note, 0xa3, 0x94, 0x00, 0x80, 60, 0, ...end])
    await expect(renderMidiToWav(longPhrase, blank, progress)).resolves.toEqual(
      { type: "error", key: "tooLong" }
    )
    await expect(renderMidiToWav(phrase, blank, progress)).resolves.toEqual({
      type: "error",
      key: "invalidSoundFont",
    })
    expect(progress).not.toHaveBeenCalled()
  })

  it("reports a failed render", async () => {
    vi.spyOn(SpessaSynthProcessor.prototype, "process").mockImplementation(
      () => {
        throw Error("synthesis failed")
      }
    )
    await expect(renderMidiToWav(phrase, soundFont, vi.fn())).resolves.toEqual({
      type: "error",
      key: "renderFailed",
    })
  })
})
