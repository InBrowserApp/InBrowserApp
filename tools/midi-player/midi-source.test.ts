import { parseMidi, writeMidi } from "midi-file"
import { expect, test } from "vitest"
import {
  MidiSourceError,
  midiExample,
  midiMix,
  readMidiSource,
} from "./midi-source"

import type { MidiEvent, MidiHeader } from "midi-file"

const end: MidiEvent = { type: "endOfTrack", deltaTime: 0 }

function bytes(tracks: MidiEvent[][], header: Partial<MidiHeader> = {}) {
  return Uint8Array.from(
    writeMidi({
      header: {
        format: 1,
        ticksPerBeat: 480,
        numTracks: tracks.length,
        ...header,
      },
      tracks,
    })
  ).buffer
}

function noteOn(deltaTime: number, noteNumber = 60): MidiEvent {
  return { type: "noteOn", channel: 0, noteNumber, deltaTime, velocity: 80 }
}

function noteOff(deltaTime: number, noteNumber = 60): MidiEvent {
  return { type: "noteOff", channel: 0, noteNumber, deltaTime, velocity: 0 }
}

function tempo(deltaTime: number, microsecondsPerBeat: number): MidiEvent {
  return { type: "setTempo", deltaTime, microsecondsPerBeat }
}

function positions(events: MidiEvent[]) {
  let tick = 0
  return events.map(({ deltaTime, ...event }) => {
    tick += deltaTime
    return { ...event, tick }
  })
}

test("lists note-bearing tracks by original index and integrates the tempo map", () => {
  const utf8Name = String.fromCharCode(...new TextEncoder().encode("Mélodie"))
  const source = readMidiSource(
    bytes([
      [tempo(0, 500_000), tempo(480, 1_000_000), end],
      [
        { type: "trackName", deltaTime: 0, text: utf8Name },
        noteOn(0),
        noteOff(1_440),
        end,
      ],
      [noteOn(0), noteOff(960), end],
    ])
  )
  expect(source.tracks).toEqual([
    { index: 1, name: "Mélodie" },
    { index: 2, name: "" },
  ])
  expect(source.duration).toBe(2.5)
})

test("keeps the default tempo and decodes a legacy track title", () => {
  const source = readMidiSource(
    bytes(
      [
        [
          { type: "trackName", deltaTime: 0, text: "  Mélodie\0  " },
          noteOn(0),
          noteOff(480),
          end,
        ],
      ],
      { format: 0 }
    )
  )
  expect(source.tracks).toEqual([{ index: 0, name: "Mélodie" }])
  expect(source.duration).toBe(0.5)
})

test("mutes only notes in selected tracks, even on the same channel and pitch", () => {
  const source = readMidiSource(
    bytes([
      [
        { type: "programChange", deltaTime: 0, channel: 0, programNumber: 24 },
        noteOn(120),
        {
          type: "controller",
          deltaTime: 120,
          channel: 0,
          controllerType: 64,
          value: 127,
        },
        noteOff(240),
        tempo(0, 400_000),
        end,
      ],
      [noteOn(240), noteOff(240), end],
    ])
  )
  const mixed = parseMidi(new Uint8Array(midiMix(source, new Set([0]))))
  expect(positions(mixed.tracks[0]!)).toMatchObject([
    { type: "programChange", programNumber: 24, tick: 0 },
    { type: "controller", controllerType: 64, value: 127, tick: 240 },
    { type: "setTempo", microsecondsPerBeat: 400_000, tick: 480 },
    { type: "endOfTrack", tick: 480 },
  ])
  expect(mixed.tracks[1]).toEqual(source.midi.tracks[1])
  expect(source.midi.tracks[0]!.some((event) => event.type === "noteOn")).toBe(
    true
  )
})

test("all-muted output keeps the Standard MIDI file and its timeline without sounding notes", () => {
  const source = readMidiSource(
    bytes([
      [tempo(0, 500_000), noteOn(0), noteOff(480), { ...end, deltaTime: 480 }],
      [noteOn(240), noteOff(240), end],
    ])
  )
  const mixed = parseMidi(new Uint8Array(midiMix(source, new Set([0, 1]))))
  expect(source.duration).toBe(1)
  expect(mixed.header).toEqual(source.midi.header)
  expect(mixed.tracks.map(positions)).toMatchObject([
    [
      { type: "setTempo", tick: 0 },
      { type: "controller", controllerType: 3, value: 0, tick: 960 },
      { type: "endOfTrack", tick: 960 },
    ],
    [{ type: "endOfTrack", tick: 480 }],
  ])
})

test("keeps a padded 4/4 bar in an unmuted mix", () => {
  const source = readMidiSource(
    bytes([[noteOn(0), noteOff(480), { ...end, deltaTime: 1_440 }]], {
      format: 0,
    })
  )
  expect(source.duration).toBe(2)
  const mixed = parseMidi(new Uint8Array(midiMix(source, new Set())))
  expect(positions(mixed.tracks[0]!)).toMatchObject([
    { type: "noteOn", tick: 0 },
    { type: "noteOff", tick: 480 },
    { type: "controller", controllerType: 3, value: 0, tick: 1_920 },
    { type: "endOfTrack", tick: 1_920 },
  ])
  expect(source.midi.tracks[0]).toHaveLength(3)
})

test("takes the final tick from the longest track and keeps later tempo changes", () => {
  const source = readMidiSource(
    bytes([
      [noteOn(0), noteOff(480), end],
      [tempo(960, 1_000_000), { ...end, deltaTime: 960 }],
    ])
  )
  expect(source.duration).toBe(3)
  const mixed = parseMidi(new Uint8Array(midiMix(source, new Set())))
  expect(mixed.tracks[0]).toEqual(source.midi.tracks[0])
  expect(positions(mixed.tracks[1]!)).toMatchObject([
    { type: "setTempo", tick: 960 },
    { type: "controller", controllerType: 3, tick: 1_920 },
    { type: "endOfTrack", tick: 1_920 },
  ])
})

test("a muted mix keeps collapsed delta times within the MIDI limit", () => {
  const maximumDelta = 0x0fffffff
  const source = readMidiSource(
    bytes([[noteOn(maximumDelta), noteOff(maximumDelta), end]])
  )
  const mixed = parseMidi(new Uint8Array(midiMix(source, new Set([0]))))
  expect(positions(mixed.tracks[0]!)).toMatchObject([
    { type: "sequencerSpecific", tick: maximumDelta },
    { type: "controller", controllerType: 3, tick: maximumDelta * 2 },
    { type: "endOfTrack", tick: maximumDelta * 2 },
  ])
})

test("distinguishes malformed MIDI, unsupported timing, and note-less tracks", () => {
  expect(() => readMidiSource(new ArrayBuffer(0))).toThrow(
    new MidiSourceError("invalidMidi")
  )
  expect(() => readMidiSource(bytes([[noteOn(0)]]))).toThrow(
    new MidiSourceError("invalidMidi")
  )
  expect(() => readMidiSource(bytes([[tempo(0, 0), noteOn(0), end]]))).toThrow(
    new MidiSourceError("invalidMidi")
  )
  expect(() =>
    readMidiSource(bytes([[noteOn(0), end]], { format: 2 }))
  ).toThrow(new MidiSourceError("unsupportedTiming"))
  expect(() =>
    readMidiSource(bytes([[noteOn(0), end]], { timeDivision: 0xe728 }))
  ).toThrow(new MidiSourceError("unsupportedTiming"))
  expect(() => readMidiSource(bytes([[noteOff(480), end]]))).toThrow(
    new MidiSourceError("noNotes")
  )
})

test("the built-in example has two playable tracks", async () => {
  const example = midiExample()
  expect(example.name.endsWith(".mid")).toBe(true)
  const source = readMidiSource(await example.arrayBuffer())
  expect(source.tracks).toEqual([
    { index: 0, name: "Piano" },
    { index: 1, name: "Bass" },
  ])
  expect(source.duration).toBeCloseTo(4.8)
})
