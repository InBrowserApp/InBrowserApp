import { describe, expect, it } from "vitest"
import { parseMidi, writeMidi } from "midi-file"
import { transposeMidi } from "./transpose"

import type { MidiData, MidiEvent, MidiHeader } from "midi-file"

const defaults = { semitones: 0, speed: 100, keepDrums: true }
const end: MidiEvent = { type: "endOfTrack", deltaTime: 0 }
function note(noteNumber: number, channel = 0): MidiEvent {
  return { type: "noteOn", deltaTime: 0, noteNumber, channel, velocity: 80 }
}
function tempo(microsecondsPerBeat: number, deltaTime = 0): MidiEvent {
  return { type: "setTempo", deltaTime, microsecondsPerBeat }
}
function encode(tracks: MidiEvent[][], header: Partial<MidiHeader> = {}) {
  return Uint8Array.from(
    writeMidi({
      header: {
        format: 1,
        numTracks: tracks.length,
        ticksPerBeat: 480,
        ...header,
      },
      tracks: tracks.map((track) => [...track, end]),
    })
  )
}
function edited(
  bytes: Uint8Array,
  options: Partial<typeof defaults>
): MidiData {
  const result = transposeMidi(bytes, { ...defaults, ...options })
  if ("error" in result) throw Error(result.error)
  return parseMidi(result.bytes)
}

describe("transposeMidi", () => {
  it("transposes notes and polyphonic aftertouch while preserving channel 10, controls, and instrument changes", () => {
    const controller: MidiEvent = {
      type: "controller",
      deltaTime: 2,
      channel: 0,
      controllerType: 64,
      value: 127,
    }
    const program: MidiEvent = {
      type: "programChange",
      deltaTime: 0,
      channel: 0,
      programNumber: 40,
    }
    const aftertouch: MidiEvent = {
      type: "noteAftertouch",
      deltaTime: 1,
      channel: 0,
      noteNumber: 60,
      amount: 80,
    }
    const release: MidiEvent = {
      type: "noteOff",
      deltaTime: 240,
      channel: 0,
      noteNumber: 60,
      velocity: 0,
    }
    const source = encode([
      [program, note(60), note(36, 9), aftertouch, controller, release],
    ])
    const result = edited(source, { semitones: 2 })
    expect(result.tracks[0]).toMatchObject([
      program,
      note(62),
      note(36, 9),
      { ...aftertouch, noteNumber: 62 },
      controller,
      { ...release, noteNumber: 62 },
      end,
    ])
    expect(
      edited(source, { semitones: -12, keepDrums: false }).tracks[0]?.[2]
    ).toMatchObject(note(24, 9))
  })

  it("moves key signatures by pitch class and keeps their mode", () => {
    const signature: MidiEvent = {
      type: "keySignature",
      deltaTime: 0,
      key: -3,
      scale: 1,
    }
    const source = encode([[signature]])
    expect(edited(source, { semitones: -2 }).tracks[0]?.[0]).toMatchObject({
      ...signature,
      key: -5,
    })
    expect(edited(source, { semitones: 12 }).tracks[0]?.[0]).toMatchObject(
      signature
    )
  })

  it("scales every tempo while keeping note ticks and initial tempo", () => {
    const source = encode([
      [
        { type: "trackName", deltaTime: 0, text: "Tempo" },
        tempo(500_000),
        tempo(1_000_000, 480),
      ],
      [note(64)],
    ])
    expect(edited(source, { speed: 200 }).tracks[0]?.slice(1, 3)).toMatchObject(
      [tempo(250_000), tempo(500_000, 480)]
    )
    expect(edited(source, { speed: 200 }).tracks[1]?.[0]).toMatchObject(
      note(64)
    )
    expect(edited(source, {}).tracks[0]?.[1]).toMatchObject(tempo(500_000))
  })

  it("inserts an initial tempo for delayed and absent tempo events", () => {
    const source = encode([[tempo(600_000, 480)], [note(60)]])
    const result = edited(source, { speed: 50 })
    expect(result.tracks[0]?.slice(0, 2)).toMatchObject([
      tempo(1_000_000),
      tempo(1_200_000, 480),
    ])
    expect(result.tracks[1]?.[0]).toMatchObject(note(60))
  })

  it("scales each independent format 2 sequence", () => {
    const source = encode([[tempo(400_000)], [note(60)]], { format: 2 })
    const result = edited(source, { speed: 50 })
    expect(result.tracks.map((track) => track[0])).toMatchObject([
      tempo(800_000),
      tempo(1_000_000),
    ])
  })

  it("scales SMPTE absolute timing without accumulating rounding errors", () => {
    const source = encode(
      [
        [
          tempo(500_000),
          ...Array.from({ length: 3 }, () => ({ ...note(60), deltaTime: 1 })),
        ],
      ],
      {
        timeDivision: 0xe728,
      }
    )
    const result = edited(source, { speed: 200 })
    expect(result.header).toMatchObject({
      framesPerSecond: 25,
      ticksPerFrame: 40,
    })
    expect(result.tracks[0]?.map((event) => event.deltaTime)).toEqual([
      0, 1, 0, 1, 0,
    ])
    expect(result.tracks[0]?.[0]).toMatchObject(tempo(500_000))
    expect(
      transposeMidi(
        encode([[{ ...note(60), deltaTime: 0x0fff_ffff }]], {
          timeDivision: 0xe728,
        }),
        { ...defaults, speed: 50 }
      )
    ).toEqual({ error: "tempoOutOfRange" })
  })

  it("reports invalid input and out-of-range pitches or tempos", () => {
    expect(transposeMidi(Uint8Array.of(0), defaults)).toEqual({
      error: "invalidFile",
    })
    expect(transposeMidi(encode([]), defaults)).toEqual({
      error: "invalidFile",
    })
    const malformed = encode([[note(60)]])
    expect(transposeMidi(malformed.subarray(0, -5), defaults)).toEqual({
      error: "invalidFile",
    })
    malformed[11] = 2
    expect(transposeMidi(malformed, defaults)).toEqual({ error: "invalidFile" })
    malformed[11] = 1
    malformed[9] = 3
    expect(transposeMidi(malformed, defaults)).toEqual({ error: "invalidFile" })
    malformed[9] = 1
    malformed.fill(0, 12, 14)
    expect(transposeMidi(malformed, defaults)).toEqual({ error: "invalidFile" })
    malformed[12] = 0xe7
    expect(transposeMidi(malformed, defaults)).toEqual({ error: "invalidFile" })
    expect(
      transposeMidi(encode([[note(127)]]), { ...defaults, semitones: 1 })
    ).toEqual({ error: "pitchOutOfRange" })
    expect(
      transposeMidi(encode([[note(0)]]), { ...defaults, semitones: -1 })
    ).toEqual({ error: "pitchOutOfRange" })
    expect(
      transposeMidi(encode([[tempo(0xff_ffff)]]), { ...defaults, speed: 50 })
    ).toEqual({ error: "tempoOutOfRange" })
    expect(
      transposeMidi(encode([[tempo(1)]]), { ...defaults, speed: 400 })
    ).toEqual({ error: "tempoOutOfRange" })
  })
})
