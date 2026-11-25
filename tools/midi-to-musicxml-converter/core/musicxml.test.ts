import { writeMidi } from "midi-file"
import { describe, expect, it } from "vitest"
import { midiToMusicXml } from "./musicxml"

import type { MidiEvent, MidiHeader } from "midi-file"
import type { Grid } from "./read-score"

function midi(tracks: MidiEvent[][], extra: Partial<MidiHeader> = {}) {
  return Uint8Array.from(
    writeMidi({
      header: {
        format: 1,
        numTracks: tracks.length,
        ticksPerBeat: 480,
        ...extra,
      },
      tracks: tracks.map((events) => [
        ...events,
        { type: "endOfTrack", deltaTime: 0 },
      ]),
    })
  )
}
function on(pitch: number, deltaTime = 0, channel = 0): MidiEvent {
  return { type: "noteOn", noteNumber: pitch, velocity: 95, channel, deltaTime }
}
function off(pitch: number, deltaTime = 0, channel = 0): MidiEvent {
  return { type: "noteOff", noteNumber: pitch, velocity: 0, channel, deltaTime }
}
function tempo(microsecondsPerBeat: number, deltaTime = 0): MidiEvent {
  return { type: "setTempo", deltaTime, microsecondsPerBeat }
}
function key(key: number, deltaTime = 0, scale = 0): MidiEvent {
  return { type: "keySignature", deltaTime, key, scale }
}
function meter(
  numerator: number,
  denominator: number,
  deltaTime = 0
): MidiEvent {
  return {
    type: "timeSignature",
    numerator,
    denominator,
    metronome: 24,
    thirtyseconds: 8,
    deltaTime,
  }
}
function xml(bytes: Uint8Array, grid: Grid = 16) {
  const result = midiToMusicXml(bytes, grid, 'A <B> & "C"\'s', "Part")
  if ("error" in result) throw Error(result.error)
  const parsed = new DOMParser().parseFromString(result.xml, "application/xml")
  expect(parsed.querySelector("parsererror")).toBeNull()
  return parsed
}
const simple = midi([[on(60), off(60, 480)]])

describe("MIDI to MusicXML conversion", () => {
  it("exports titles, polyphony, chords, cross-bar ties, rests, programs, clefs, and drums", () => {
    const score = xml(
      midi([
        [
          tempo(500_000),
          key(-2),
          tempo(600_000, 600),
          key(2, 360, 1),
          meter(3, 4, 480),
        ],
        [
          { type: "trackName", deltaTime: 0, text: "Lead & notes" },
          { type: "programChange", deltaTime: 0, channel: 0, programNumber: 6 },
          {
            type: "programChange",
            deltaTime: 0,
            channel: 0,
            programNumber: 12,
          },
          on(61),
          on(65),
          on(61),
          on(67, 360),
          off(67, 240),
          off(61, 1200),
          off(65),
          off(61),
          on(61, 120),
          off(61, 720),
        ],
        [on(45), off(45, 2700), on(44)],
        [on(36, 0, 9), off(36, 480, 9), on(82, 0, 9), off(82, 120, 9)],
      ])
    )
    expect(score.documentElement.tagName).toBe("score-partwise")
    expect(score.querySelector("work-title")?.textContent).toBe(
      'A <B> & "C"\'s'
    )
    expect(
      [...score.querySelectorAll("part-name")].map((item) => item.textContent)
    ).toEqual(["Lead & notes", "Part 2", "Part 3"])
    expect(score.querySelector("midi-program")?.textContent).toBe("7")
    expect(score.querySelectorAll("chord").length).toBeGreaterThan(0)
    expect(score.querySelector("tie[type='start']")).toBeTruthy()
    expect(score.querySelector("tie[type='stop']")).toBeTruthy()
    expect(score.querySelector("note > voice")?.textContent).toBe("1")
    expect(
      [...score.querySelectorAll("voice")].some(
        (item) => item.textContent === "2"
      )
    ).toBe(true)
    expect(score.querySelector("backup")).toBeTruthy()
    expect(score.querySelector("forward")).toBeTruthy()
    expect(score.querySelector("measure[implicit='yes']")).toBeTruthy()
    expect(
      [...score.querySelectorAll("clef > sign")].map((item) => item.textContent)
    ).toEqual(["G", "F", "percussion"])
    expect(score.querySelector("unpitched > display-step")?.textContent).toBe(
      "F"
    )
    expect(score.querySelector("midi-unpitched")?.textContent).toBe("37")
    expect(score.querySelector("note > instrument")?.getAttribute("id")).toBe(
      "P3-D36"
    )
    expect(score.querySelector("rest[measure='yes']")).toBeTruthy()
    expect(score.querySelector("per-minute")?.textContent).toBe("120")
    expect(
      [...score.querySelectorAll("per-minute")].map((item) => item.textContent)
    ).toEqual(["120", "100"])
    expect(score.querySelector("pitch > alter")?.textContent).toBe("-1")
    expect(
      [...score.querySelectorAll("pitch > alter")].some(
        (item) => item.textContent === "1"
      )
    ).toBe(true)
    expect(score.querySelector("mode")?.textContent).toBe("major")
    expect(
      score.querySelector("mode")?.parentElement?.querySelector("fifths")
        ?.textContent
    ).toBe("-2")
  })

  it("uses the selected rhythm grid and handles missing metadata", () => {
    const source = midi([[off(62), on(60, 70), off(60, 100)]])
    const noteLengths = ([8, 16, 32] as const).map(
      (grid) =>
        xml(source, grid).querySelector("note:has(pitch) > duration")
          ?.textContent
    )
    expect(noteLengths).toEqual(["8", "4", "4"])
    expect(xml(simple).querySelector("time > beats")?.textContent).toBe("4")
  })

  it("writes exact meter, key, and tempo positions at bar boundaries", () => {
    const score = xml(
      midi([
        [tempo(0), meter(0, 4), meter(3, 128), meter(3, 4, 1920), key(1, 0, 1)],
        [on(60), off(60, 2400)],
      ])
    )
    const measures = score.querySelectorAll("measure")
    expect(measures).toHaveLength(2)
    expect(measures[0]?.querySelector("time > beats")?.textContent).toBe("4")
    expect(measures[1]?.querySelector("time > beats")?.textContent).toBe("3")
    expect(measures[1]?.querySelector("key > mode")?.textContent).toBe("minor")
    expect(score.querySelector("metronome")).toBeNull()
  })

  it("leaves quiet measures aligned and separates simultaneous notes with different lengths", () => {
    const score = xml(
      midi([[on(60, 3840), on(67), off(67, 240), off(60, 720)]])
    )
    const measures = score.querySelectorAll("measure")
    expect(measures).toHaveLength(3)
    expect(measures[1]?.querySelector("attributes")).toBeNull()
    expect(measures[1]?.querySelector("rest[measure='yes']")).toBeTruthy()
    expect(measures[2]?.querySelector("backup > duration")?.textContent).toBe(
      "64"
    )
    expect(measures[2]?.querySelectorAll("chord")).toHaveLength(0)
  })

  it("rejects invalid data or timing and unusually long scores", () => {
    const convert = (input: Uint8Array) => midiToMusicXml(input, 16, "", "Part")
    expect(convert(Uint8Array.of(0))).toEqual({ error: "invalidMidi" })
    expect(convert(midi([]))).toEqual({ error: "invalidMidi" })
    expect(convert(simple.subarray(0, -2))).toEqual({ error: "invalidMidi" })
    const invalid = simple.slice()
    invalid[11] = 2
    expect(convert(invalid)).toEqual({ error: "invalidMidi" })
    invalid[11] = 1
    invalid[9] = 3
    expect(convert(invalid)).toEqual({ error: "invalidMidi" })
    expect(convert(midi([[on(60), off(60, 480)]], { format: 2 }))).toEqual({
      error: "unsupportedTiming",
    })
    expect(
      convert(midi([[on(60), off(60, 480)]], { timeDivision: 0xe728 }))
    ).toEqual({ error: "unsupportedTiming" })
    expect(convert(midi([[tempo(500_000)]]))).toEqual({ error: "noNotes" })
    expect(convert(midi([[on(60, 9_000_000), off(60, 480)]]))).toEqual({
      error: "tooManyMeasures",
    })
  })
})
