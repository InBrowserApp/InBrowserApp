import { expect, test } from "vitest"
import { heldNotesAt } from "./held-notes"

import type { MidiData, MidiEvent } from "midi-file"

function score(...tracks: MidiEvent[][]): MidiData {
  return {
    header: {
      format: tracks.length === 1 ? 0 : 1,
      numTracks: tracks.length,
      ticksPerBeat: 480,
    },
    tracks,
  }
}

function attack(deltaTime: number, noteNumber = 60, velocity = 90): MidiEvent {
  return { type: "noteOn", deltaTime, channel: 0, noteNumber, velocity }
}

function release(deltaTime: number, noteNumber = 60): MidiEvent {
  return { type: "noteOff", deltaTime, channel: 0, noteNumber, velocity: 0 }
}

function end(deltaTime = 0): MidiEvent {
  return { type: "endOfTrack", deltaTime }
}

test("restores preceding attacks only until their release, never at an exact onset or release", () => {
  const midi = score([
    attack(240),
    release(480),
    attack(0, 62),
    release(240, 62),
    end(240),
  ])
  expect(heldNotesAt(midi, 0)).toEqual([])
  expect(heldNotesAt(midi, 0.25)).toEqual([])
  expect(heldNotesAt(midi, 0.5)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 90 },
  ])
  expect(heldNotesAt(midi, 0.75)).toEqual([])
  expect(heldNotesAt(midi, 0.8)).toEqual([
    { channel: 0, noteNumber: 62, velocity: 90 },
  ])
  expect(heldNotesAt(midi, 1)).toEqual([])
})

test("converts seek time to ticks using tempo changes and snaps exact boundaries", () => {
  const midi = score(
    [
      { type: "setTempo", deltaTime: 0, microsecondsPerBeat: 400_000 },
      { type: "setTempo", deltaTime: 480, microsecondsPerBeat: 800_000 },
      end(480),
    ],
    [attack(360), release(240), end(360)]
  )
  expect(heldNotesAt(midi, 0.3)).toEqual([])
  expect(heldNotesAt(midi, 0.55)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 90 },
  ])
  expect(heldNotesAt(midi, 0.4 + 0.2)).toEqual([])
})

test("pairs overlapping attacks and releases in song order across shared channels", () => {
  const midi = score(
    [attack(0, 60, 90), release(480), release(480), end()],
    [attack(240, 60, 64), end(720)]
  )
  expect(heldNotesAt(midi, 0.4)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 90 },
    { channel: 0, noteNumber: 60, velocity: 64 },
  ])
  expect(heldNotesAt(midi, 0.75)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 64 },
  ])
})

test.each([120, 123])(
  "clears held notes only on the addressed channel for controller %i",
  (controllerType) => {
    const midi = score(
      [attack(0), end(1920)],
      [
        {
          type: "noteOn",
          deltaTime: 0,
          channel: 1,
          noteNumber: 64,
          velocity: 80,
        },
        {
          type: "controller",
          deltaTime: 480,
          channel: 0,
          controllerType,
          value: 0,
        },
        end(1440),
      ]
    )
    expect(heldNotesAt(midi, 0.25)).toHaveLength(2)
    for (const time of [0.5, 1]) {
      expect(heldNotesAt(midi, time)).toEqual([
        { channel: 1, noteNumber: 64, velocity: 80 },
      ])
    }
  }
)

test("restores active notes on distinct MIDI port channels", () => {
  const midi = score(
    [
      { type: "portPrefix", deltaTime: 0, port: 7 },
      attack(0),
      release(960),
      end(),
    ],
    [
      { type: "portPrefix", deltaTime: 0, port: 3 },
      attack(0, 60, 71),
      release(240),
      end(),
    ]
  )
  expect(heldNotesAt(midi, 0.1)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 90 },
    { channel: 16, noteNumber: 60, velocity: 71 },
  ])
  expect(heldNotesAt(midi, 0.5)).toEqual([
    { channel: 0, noteNumber: 60, velocity: 90 },
  ])
  expect(heldNotesAt(midi, 2)).toEqual([])
})
