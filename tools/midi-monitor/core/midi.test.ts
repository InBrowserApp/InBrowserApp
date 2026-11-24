import { expect, test } from "vitest"
import { decodeMidi, hexBytes, noteName, pianoKeys, trackNotes } from "./midi"

const decode = (...bytes: number[]) => decodeMidi(Uint8Array.of(...bytes))

test("decodes note messages and normalizes zero velocity note on as a release", () => {
  expect(decode(0x92, 60, 100)).toEqual({
    kind: "noteOn",
    channel: 3,
    note: 60,
    velocity: 100,
  })
  expect(decode(0x82, 60, 64)).toEqual({
    kind: "noteOff",
    channel: 3,
    note: 60,
    velocity: 64,
  })
  expect(decode(0x90, 60, 0)).toEqual({
    kind: "noteOff",
    channel: 1,
    note: 60,
    velocity: 0,
  })
})

test("decodes controllers, 14-bit pitch bend, and timing clock", () => {
  expect(decode(0xb0, 64, 127)).toEqual({
    kind: "controlChange",
    channel: 1,
    control: 64,
    value: 127,
  })
  expect(decode(0xe1, 0, 64)).toEqual({
    kind: "pitchBend",
    channel: 2,
    value: 0,
  })
  expect(decode(0xe1, 127, 127)).toEqual({
    kind: "pitchBend",
    channel: 2,
    value: 8191,
  })
  expect(decode(0xe0, 0, 0)).toEqual({
    kind: "pitchBend",
    channel: 1,
    value: -8192,
  })
  expect(decode(0xf8)).toEqual({ kind: "clock" })
})

test("preserves unknown messages and identifies available channel information", () => {
  expect(decode()).toBeNull()
  expect(decode(0xfa)).toEqual({ kind: "other" })
  expect(decode(5)).toEqual({ kind: "other" })
  expect(decode(0x91, 64)).toEqual({ kind: "other", channel: 2 })
  expect(decode(0x91)).toEqual({ kind: "other", channel: 2 })
  expect(decode(0xa2, 64, 50)).toEqual({ kind: "other", channel: 3 })
})

test("tracks held notes independently by pitch and channel", () => {
  let notes = trackNotes([], decode(0x90, 60, 100)!)
  notes = trackNotes(notes, decode(0x91, 60, 30)!)
  notes = trackNotes(notes, decode(0x91, 61, 40)!)
  expect(notes).toHaveLength(3)
  expect(trackNotes(notes, decode(0xb0, 64, 127)!)).toBe(notes)
  expect(trackNotes(notes, decode(0xf8)!)).toBe(notes)
  notes = trackNotes(notes, decode(0x80, 60, 0)!)
  expect(notes.map((note) => note.channel)).toEqual([2, 2])
  expect(trackNotes(notes, decode(0xb1, 120, 0)!)).toEqual([])
  expect(trackNotes(notes, decode(0xb1, 123, 0)!)).toEqual([])
})

test("formats hex, assigns note names, and caps the displayed octave at MIDI note 127", () => {
  expect(hexBytes(Uint8Array.of(0x90, 5, 0))).toBe("90 05 00")
  expect(noteName(60)).toBe("C4")
  const keys = pianoKeys(3)
  expect(keys).toHaveLength(25)
  expect(keys[1]).toEqual({ note: 49, name: "C♯3", black: true })
  expect(pianoKeys(-1)[0]?.note).toBe(0)
  expect(pianoKeys(9).at(-1)?.note).toBe(127)
})
