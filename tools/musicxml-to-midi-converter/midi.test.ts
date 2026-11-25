import { strToU8, zipSync } from "fflate"
import { parseMidi } from "midi-file"
import { expect, test } from "vitest"
import { convertMusicXmlToMidi } from "./midi"

import type { MidiEvent } from "midi-file"

function wholeNote(step: string, octave: number, chord = false) {
  return `<note>${chord ? "<chord/>" : ""}<pitch><step>${step}</step><octave>${octave}</octave></pitch><duration>4</duration><type>whole</type></note>`
}

function tempo(bpm: number) {
  return `<direction><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${bpm}</per-minute></metronome></direction-type><sound tempo="${bpm}"/></direction>`
}

function part(id: string, name: string, channel: number, program: number) {
  return `<score-part id="${id}">
    <part-name>${name}</part-name>
    <score-instrument id="${id}-I1"><instrument-name>${name}</instrument-name></score-instrument>
    <midi-instrument id="${id}-I1"><midi-channel>${channel}</midi-channel><midi-program>${program}</midi-program></midi-instrument>
  </score-part>`
}

const attributes = `<attributes>
  <divisions>1</divisions>
  <key><fifths>0</fifths></key>
  <time><beats>4</beats><beat-type>4</beat-type></time>
  <clef><sign>G</sign><line>2</line></clef>
</attributes>`

const score = `<?xml version="1.0" encoding="UTF-8"?>
<score-partwise version="4.0">
  <work><work-title>Étude</work-title></work>
  <part-list>${part("P1", "Piano", 1, 1)}${part("P2", "Flute", 2, 74)}</part-list>
  <part id="P1">
    <measure number="1">
      ${attributes}
      <barline location="left"><repeat direction="forward"/></barline>
      ${tempo(90)}${wholeNote("C", 4)}${wholeNote("E", 4, true)}
    </measure>
    <measure number="2">
      ${tempo(150)}${wholeNote("G", 4)}
      <barline location="right"><repeat direction="backward"/></barline>
    </measure>
  </part>
  <part id="P2">
    <measure number="1">${attributes}${wholeNote("G", 3)}</measure>
    <measure number="2">${wholeNote("A", 3)}</measure>
  </part>
</score-partwise>`

function compressedScore() {
  return new Uint8Array(
    zipSync({
      mimetype: [strToU8("application/vnd.recordare.musicxml"), { level: 0 }],
      "META-INF/container.xml": strToU8(`<?xml version="1.0" encoding="UTF-8"?>
        <container xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
          <rootfiles><rootfile full-path="scores/etude.musicxml" media-type="application/vnd.recordare.musicxml+xml"/></rootfiles>
        </container>`),
      "scores/etude.musicxml": strToU8(score),
    })
  )
}

function withTicks(track: MidiEvent[]) {
  let tick = 0
  return track.map((event) => {
    tick += event.deltaTime
    return { ...event, tick }
  })
}

test.each([
  ["musicxml", () => score],
  ["mxl", compressedScore],
] as const)(
  "converts .%s with chords, parts, repeats and tempo changes",
  async (extension, content) => {
    const midiFile = await convertMusicXmlToMidi(
      new File([content()], `Étude.${extension.toUpperCase()}`)
    )
    expect(midiFile.name).toBe("Étude.mid")
    expect(midiFile.type).toBe("audio/midi")

    const { header, tracks } = parseMidi(
      new Uint8Array(await midiFile.arrayBuffer())
    )
    expect(header).toEqual({ format: 1, numTracks: 3, ticksPerBeat: 120 })
    expect(
      withTicks(tracks[0]!)
        .filter((event) => event.type === "setTempo")
        .map(({ tick, microsecondsPerBeat }) => [tick, microsecondsPerBeat])
    ).toEqual([
      [0, 666_667],
      [480, 400_000],
      [960, 666_667],
      [1_440, 400_000],
    ])
    expect(
      tracks
        .flat()
        .filter((event) => event.type === "programChange")
        .map(({ channel, programNumber }) => [channel, programNumber])
    ).toEqual([
      [0, 0],
      [1, 73],
    ])

    expect(
      withTicks(tracks[1]!)
        .filter((event) => event.type === "noteOn")
        .map(({ tick, noteNumber, channel }) => [tick, noteNumber, channel])
    ).toEqual([
      [0, 60, 0],
      [0, 64, 0],
      [480, 67, 0],
      [960, 60, 0],
      [960, 64, 0],
      [1_440, 67, 0],
    ])
    expect(
      withTicks(tracks[2]!)
        .filter((event) => event.type === "noteOn")
        .map(({ tick, noteNumber, channel }) => [tick, noteNumber, channel])
    ).toEqual([
      [0, 55, 1],
      [480, 57, 1],
      [960, 55, 1],
      [1_440, 57, 1],
    ])
  }
)

test("rejects data that does not produce a MusicXML score", async () => {
  await expect(
    convertMusicXmlToMidi(new File(["<unrecognized/>"], "bad.musicxml"))
  ).rejects.toThrow("The score has no playable notes")
})

test("rejects a ZIP without an MXL score container", async () => {
  const archive = new Uint8Array(zipSync({ "other.xml": strToU8(score) }))
  await expect(
    convertMusicXmlToMidi(new File([archive], "bad.mxl"))
  ).rejects.toThrow("Could not load the MusicXML score")
})

test.each([
  ["UTF-16LE", true],
  ["UTF-16BE", false],
] as const)(
  "converts a file with a %s byte order mark",
  async (_, littleEndian) => {
    const xml = score.replace("UTF-8", "UTF-16")
    const buffer = new ArrayBuffer((xml.length + 1) * 2)
    const view = new DataView(buffer)
    view.setUint16(0, 0xfeff, littleEndian)
    for (let index = 0; index < xml.length; index++) {
      view.setUint16((index + 1) * 2, xml.charCodeAt(index), littleEndian)
    }

    const file = await convertMusicXmlToMidi(new File([buffer], "Étude.xml"))
    expect(file.name).toBe("Étude.mid")
    const { tracks } = parseMidi(new Uint8Array(await file.arrayBuffer()))
    expect(tracks[1]).toContainEqual(
      expect.objectContaining({ type: "noteOn", noteNumber: 60, channel: 0 })
    )
  }
)

test("rejects a score containing only rests", async () => {
  const rests = `<score-partwise version="4.0">
    <part-list>${part("P1", "Piano", 1, 1)}</part-list>
    <part id="P1"><measure number="1">
      ${attributes}
      <note><rest measure="yes"/><duration>4</duration><type>whole</type></note>
    </measure></part>
  </score-partwise>`
  await expect(
    convertMusicXmlToMidi(new File([rests], "rests.musicxml"))
  ).rejects.toThrow("The score has no playable notes")
})
