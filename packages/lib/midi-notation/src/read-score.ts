import { parseMidi } from "midi-file"

import type { MidiKeySignatureEvent, MidiTimeSignatureEvent } from "midi-file"

export const divisions = 16
export type Grid = 8 | 16 | 32
export type Note = { start: number; end: number; pitch: number }
export type Part = {
  name: string
  channel: number
  program: number
  notes: Note[]
  transposeDownOctave?: true
}
export type Meter = Pick<MidiTimeSignatureEvent, "numerator" | "denominator">
export type Key = Pick<MidiKeySignatureEvent, "key" | "scale">
export type Score = {
  title: string
  parts: Part[]
  tempos: Map<number, number>
  meters: Map<number, Meter>
  keys: Map<number, Key>
}
export type ScoreReadError = "invalidMidi" | "unsupportedTiming" | "noNotes"

const utf8 = new TextDecoder("utf-8", { fatal: true })

function readTrackName(text: string) {
  try {
    return utf8
      .decode(Uint8Array.from(text, (character) => character.charCodeAt(0)))
      .trim()
  } catch {
    return text.trim()
  }
}

function musicXmlPitchRange(part: Part): Part[] {
  if (part.channel === 9 || !part.notes.some((note) => note.pitch < 12))
    return [part]
  // Written octaves in MusicXML run from 0 to 9. A MIDI pitch below 12
  // is written an octave higher and played with an octave transposition.
  const highNotes = part.notes.filter((note) => note.pitch >= 120)
  const shifted: Part = {
    ...part,
    transposeDownOctave: true,
    notes: part.notes
      .filter((note) => note.pitch < 120)
      .map((note) => ({ ...note, pitch: note.pitch + 12 })),
  }
  return highNotes.length ? [shifted, { ...part, notes: highNotes }] : [shifted]
}

export function readScore(
  input: Uint8Array,
  grid: Grid,
  title: string,
  partLabel: string
): Score | { error: ScoreReadError } {
  let midi
  try {
    midi = parseMidi(input)
  } catch {
    return { error: "invalidMidi" }
  }
  const { header, tracks } = midi
  if (
    tracks.length === 0 ||
    tracks.length !== header.numTracks ||
    tracks.some((track) => track.at(-1)?.type !== "endOfTrack") ||
    ![0, 1, 2].includes(header.format)
  ) {
    return { error: "invalidMidi" }
  }
  const beat = header.ticksPerBeat
  if (!beat || header.format === 2) return { error: "unsupportedTiming" }

  const parts: Part[] = []
  const tempos = new Map<number, number>()
  const meters = new Map<number, Meter>([[0, { numerator: 4, denominator: 4 }]])
  const keys = new Map<number, Key>([[0, { key: 0, scale: 0 }]])
  const quantum = (divisions * 4) / grid
  const scoreTick = (tick: number) => Math.round((tick * divisions) / beat)
  const quantize = (tick: number) =>
    Math.round((tick * divisions) / beat / quantum) * quantum

  for (const events of tracks) {
    const trackName = readTrackName(
      events.find((event) => event.type === "trackName")?.text ?? ""
    )
    const channels = new Map<number, Note[]>()
    const programs = new Map<number, number>()
    const initialPrograms = new Map<number, number>()
    const held = new Map<number, number[]>()
    let tick = 0

    function addNote(channel: number, pitch: number, startTick: number) {
      let notes = channels.get(channel)
      if (!notes) {
        notes = []
        channels.set(channel, notes)
      }
      const start = quantize(startTick)
      notes.push({
        start,
        end: Math.max(start + quantum, quantize(tick)),
        pitch,
      })
    }

    for (const event of events) {
      tick += event.deltaTime
      switch (event.type) {
        case "noteOn": {
          if (!initialPrograms.has(event.channel)) {
            initialPrograms.set(event.channel, programs.get(event.channel) ?? 0)
          }
          const id = event.channel * 128 + event.noteNumber
          const onsets = held.get(id) ?? []
          onsets.push(tick)
          held.set(id, onsets)
          break
        }
        case "noteOff": {
          const id = event.channel * 128 + event.noteNumber
          const onsets = held.get(id)
          const onset = onsets?.shift()
          if (onset !== undefined)
            addNote(event.channel, event.noteNumber, onset)
          break
        }
        case "programChange":
          programs.set(event.channel, event.programNumber)
          break
        case "setTempo":
          if (event.microsecondsPerBeat > 0) {
            tempos.set(scoreTick(tick), 60_000_000 / event.microsecondsPerBeat)
          }
          break
        case "timeSignature":
          if (event.numerator > 0 && event.denominator <= divisions * 4) {
            meters.set(scoreTick(tick), event)
          }
          break
        case "keySignature":
          keys.set(scoreTick(tick), event)
          break
      }
    }
    for (const [id, onsets] of held) {
      for (const onset of onsets) addNote(Math.floor(id / 128), id % 128, onset)
    }

    for (const [channel, notes] of channels) {
      parts.push({
        name: trackName || `${partLabel} ${parts.length + 1}`,
        channel,
        program: initialPrograms.get(channel)!,
        notes,
      })
    }
  }
  if (parts.length === 0) return { error: "noNotes" }
  return {
    title,
    parts: parts.flatMap(musicXmlPitchRange),
    tempos,
    meters,
    keys,
  }
}
