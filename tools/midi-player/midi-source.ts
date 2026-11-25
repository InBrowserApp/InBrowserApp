import { parseMidi, writeMidi } from "midi-file"

import type { MidiData, MidiEvent } from "midi-file"

type ReadError = "invalidMidi" | "unsupportedTiming" | "noNotes"

export class MidiSourceError extends Error {
  constructor(readonly key: ReadError) {
    super(key)
  }
}

export type MidiSource = {
  midi: MidiData
  tracks: { index: number; name: string }[]
  duration: number
}

function isNote(event: MidiEvent) {
  return event.type === "noteOn" || event.type === "noteOff"
}

function isChannelVoice(event: MidiEvent) {
  return "channel" in event && event.type !== "channelPrefix"
}

function trackName(text: string) {
  const bytes = Uint8Array.from(text, (character) => character.charCodeAt(0))
  try {
    text = new TextDecoder("utf-8", { fatal: true }).decode(bytes)
  } catch {
    // Older MIDI files can store track names in a single-byte encoding.
  }
  return text.replaceAll("\0", "").trim()
}

export function readMidiSource(input: ArrayBuffer): MidiSource {
  let midi
  try {
    midi = parseMidi(new Uint8Array(input))
  } catch {
    throw new MidiSourceError("invalidMidi")
  }
  const { header, tracks } = midi
  if (
    !tracks.length ||
    tracks.length !== header.numTracks ||
    tracks.some((track) => track.at(-1)?.type !== "endOfTrack") ||
    ![0, 1, 2].includes(header.format) ||
    (header.format === 0 && tracks.length !== 1)
  ) {
    throw new MidiSourceError("invalidMidi")
  }
  if (header.format === 2 || !header.ticksPerBeat) {
    throw new MidiSourceError("unsupportedTiming")
  }

  const tempoMap = new Map<number, number>()
  const playable: MidiSource["tracks"] = []
  let end = 0

  for (const [index, events] of tracks.entries()) {
    let tick = 0
    let name = ""
    let hasNotes = false
    for (const event of events) {
      if (event.deltaTime < 0) throw new MidiSourceError("invalidMidi")
      tick += event.deltaTime
      if (event.type === "setTempo") {
        if (event.microsecondsPerBeat <= 0) {
          throw new MidiSourceError("invalidMidi")
        }
        tempoMap.set(tick, event.microsecondsPerBeat)
      }
      if (event.type === "trackName" && !name) name = trackName(event.text)
      if (event.type === "noteOn" && event.velocity > 0) hasNotes = true
    }
    end = Math.max(end, tick)
    if (hasNotes) playable.push({ index, name })
  }
  if (!playable.length) throw new MidiSourceError("noNotes")

  let previous = 0
  let microseconds = 0
  let tempo = 500_000
  for (const [tick, next] of [...tempoMap].sort(([a], [b]) => a - b)) {
    microseconds += (tick - previous) * tempo
    previous = tick
    tempo = next
  }
  microseconds += (end - previous) * tempo
  return {
    midi,
    tracks: playable,
    duration: microseconds / header.ticksPerBeat / 1_000_000,
  }
}

function mutedTrack(events: MidiEvent[]) {
  const remaining: MidiEvent[] = []
  let deltaTime = 0
  for (const event of events) {
    deltaTime += event.deltaTime
    if (isNote(event)) continue
    // A Standard MIDI File delta is at most four variable-length bytes.
    while (deltaTime > 0x0fffffff) {
      remaining.push({
        type: "sequencerSpecific",
        deltaTime: 0x0fffffff,
        data: [],
      })
      deltaTime -= 0x0fffffff
    }
    remaining.push({ ...event, deltaTime })
    deltaTime = 0
  }
  return remaining
}

function retainPlaybackDuration(tracks: MidiEvent[][]) {
  let finalTrack = 0
  let finalTick = 0
  let lastVoiceTick = -1
  for (const [index, events] of tracks.entries()) {
    let tick = 0
    for (const event of events) {
      tick += event.deltaTime
      if (isChannelVoice(event)) lastVoiceTick = Math.max(lastVoiceTick, tick)
    }
    if (tick > finalTick) {
      finalTrack = index
      finalTick = tick
    }
  }
  if (lastVoiceTick >= finalTick) return

  // The synth uses the last channel voice event to determine song length.
  // An undefined controller keeps the final tick audible as silence.
  const events = tracks[finalTrack]!
  const end = events.at(-1)!
  tracks[finalTrack] = [
    ...events.slice(0, -1),
    {
      type: "controller",
      channel: 0,
      controllerType: 3,
      value: 0,
      deltaTime: end.deltaTime,
    },
    { ...end, deltaTime: 0 },
  ]
}

export function midiMix(source: MidiSource, muted: ReadonlySet<number>) {
  const { midi } = source
  const tracks = midi.tracks.map((events, index) =>
    muted.has(index) ? mutedTrack(events) : events
  )
  retainPlaybackDuration(tracks)
  return Uint8Array.from(writeMidi({ ...midi, tracks })).buffer
}

function exampleTrack(
  name: string,
  channel: number,
  programNumber: number,
  notes: number[],
  duration: number
): MidiEvent[] {
  return [
    { type: "trackName", deltaTime: 0, text: name },
    { type: "programChange", deltaTime: 0, channel, programNumber },
    ...notes.flatMap((noteNumber): MidiEvent[] => [
      { type: "noteOn", deltaTime: 0, channel, noteNumber, velocity: 78 },
      {
        type: "noteOff",
        deltaTime: duration,
        channel,
        noteNumber,
        velocity: 0,
      },
    ]),
    { type: "endOfTrack", deltaTime: 0 },
  ]
}

export function midiExample() {
  const melody = exampleTrack(
    "Piano",
    0,
    0,
    [64, 67, 69, 67, 65, 69, 72, 69, 67, 71, 74, 71, 72, 67, 64, 60],
    240
  )
  const bass = exampleTrack(
    "Bass",
    1,
    32,
    [48, 55, 53, 48, 43, 50, 48, 48],
    480
  )
  melody.unshift({
    type: "setTempo",
    deltaTime: 0,
    microsecondsPerBeat: 600_000,
  })
  const midi = writeMidi({
    header: { format: 1, numTracks: 2, ticksPerBeat: 480 },
    tracks: [melody, bass],
  })
  return new File([Uint8Array.from(midi)], "Two-Part Study.mid", {
    type: "audio/midi",
  })
}
