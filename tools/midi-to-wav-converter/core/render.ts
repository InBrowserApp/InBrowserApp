import { encodeWav } from "@workspace/pcm-audio"
import {
  BasicMIDI,
  SoundBankLoader,
  SpessaSynthProcessor,
  SpessaSynthSequencer,
} from "spessasynth_core"

type RenderError =
  | "invalidMidi"
  | "invalidSoundFont"
  | "tooLong"
  | "renderFailed"
type RenderResult =
  | { type: "complete"; wav: ArrayBuffer }
  | { type: "error"; key: RenderError }

const sampleRate = 44_100
const blockSize = 128

export async function renderMidiToWav(
  input: ArrayBuffer,
  soundFont: ArrayBuffer,
  reportProgress: (percent: number) => void
): Promise<RenderResult> {
  let midi: BasicMIDI
  try {
    midi = BasicMIDI.fromArrayBuffer(input)
  } catch {
    return { type: "error", key: "invalidMidi" }
  }
  const hasNotes = midi.tracks.some((track) =>
    track.events.some(
      (event) => (event.statusByte & 0xf0) === 0x90 && event.data[1]! > 0
    )
  )
  if (!hasNotes || !Number.isFinite(midi.duration)) {
    return { type: "error", key: "invalidMidi" }
  }
  if (midi.duration >= 600) return { type: "error", key: "tooLong" }

  const synth = new SpessaSynthProcessor(sampleRate, { eventsEnabled: false })
  try {
    synth.soundBankManager.addSoundBank(
      SoundBankLoader.fromArrayBuffer(soundFont),
      "selected"
    )
    await synth.ready
  } catch {
    return { type: "error", key: "invalidSoundFont" }
  }

  try {
    const sequencer = new SpessaSynthSequencer(synth)
    sequencer.loadNewSongList([midi])
    sequencer.loopCount = 0
    sequencer.skipToFirstNoteOn = false
    sequencer.play()

    const frames = Math.ceil((midi.duration + 2) * sampleRate)
    const left = new Float32Array(frames)
    const right = new Float32Array(frames)
    let progress = 0
    for (let offset = 0; offset < frames; offset += blockSize) {
      sequencer.processTick()
      synth.process(left, right, offset, Math.min(blockSize, frames - offset))
      const percent = Math.floor((offset / frames) * 100)
      if (percent > progress) {
        progress = percent
        reportProgress(percent)
      }
    }
    return { type: "complete", wav: encodeWav([left, right], sampleRate, 0) }
  } catch {
    return { type: "error", key: "renderFailed" }
  }
}
