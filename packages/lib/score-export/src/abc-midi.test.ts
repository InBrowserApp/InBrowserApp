import { unzipSync } from "fflate"
import { parseMidi } from "midi-file"
import { expect, test } from "vitest"
import { readAbcTunes } from "./abc"
import { compileAbcMidi, exportAbcMidi } from "./abc-midi"

function decodeMidiText(text: string | undefined) {
  return new TextDecoder("utf-8", { fatal: true }).decode(
    Uint8Array.from(text ?? "", (byte) => byte.charCodeAt(0))
  )
}

test("compiles tempo, key, meter, voices, programs, pitches and repeats", async () => {
  const voiceName = "低音🎵".repeat(45)
  const [tune] = readAbcTunes(`X:1
T:Duet / Path
M:3/4
L:1/4
Q:1/4=96
K:G
V:1 name="高音"
%%MIDI program 40
|: GAB :|
V:2 name="${voiceName}"
%%MIDI program 73
C,,,, D,,,, E,,,, =F,,,,|`)
  const file = compileAbcMidi(tune!)
  expect(file.name).toBe("Duet _ Path.mid")
  expect(file.type).toBe("audio/midi")

  const { header, tracks } = parseMidi(new Uint8Array(await file.arrayBuffer()))
  expect(header).toEqual({ format: 1, numTracks: 3, ticksPerBeat: 480 })
  const [metadata, firstVoice, secondVoice] = tracks
  expect(metadata).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        type: "setTempo",
        microsecondsPerBeat: 625_000,
      }),
      expect.objectContaining({ type: "keySignature", key: 1, scale: 0 }),
      expect.objectContaining({
        type: "timeSignature",
        numerator: 3,
        denominator: 4,
      }),
      expect.objectContaining({ type: "text", text: "Duet / Path" }),
    ])
  )
  expect(
    decodeMidiText(
      firstVoice!.find((event) => event.type === "trackName")?.text
    )
  ).toBe("高音")
  expect(
    decodeMidiText(
      secondVoice!.find((event) => event.type === "trackName")?.text
    )
  ).toBe(voiceName)
  expect(
    tracks
      .flat()
      .filter((event) => event.type === "programChange")
      .map(({ channel, programNumber }) => ({ channel, programNumber }))
  ).toEqual([
    { channel: 0, programNumber: 40 },
    { channel: 1, programNumber: 73 },
  ])
  expect(
    firstVoice!
      .filter((event) => event.type === "noteOn")
      .map(({ channel, noteNumber }) => [channel, noteNumber])
  ).toEqual([67, 69, 71, 67, 69, 71].map((pitch) => [0, pitch]))
  for (const type of ["noteOn", "noteOff"] as const) {
    expect(
      secondVoice!.flatMap((event) =>
        event.type === type ? [[event.channel, event.noteNumber]] : []
      )
    ).toEqual([12, 14, 16, 17].map((pitch) => [1, pitch]))
  }
})

test.each([
  ["channel 1", 0, 0],
  ["channel 10", 9, 0],
  ["channel 16", 15, 0],
  ["program 16 40", 15, 40],
])(
  "writes explicit MIDI %s with a valid channel status",
  async (directive, channel, programNumber) => {
    const [tune] = readAbcTunes(`X:1\n%%MIDI ${directive}\nK:C\nC|`)
    const file = compileAbcMidi(tune!)
    const { tracks } = parseMidi(new Uint8Array(await file.arrayBuffer()))
    expect(tracks[1]).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: "programChange",
          channel,
          programNumber,
        }),
        expect.objectContaining({ type: "noteOn", channel, noteNumber: 60 }),
        expect.objectContaining({ type: "noteOff", channel, noteNumber: 60 }),
      ])
    )
  }
)

test("exports a single MIDI and uses the selected file basename for an untitled tune", async () => {
  const tunes = readAbcTunes("X:1\nK:C\nC D E F|")
  const { blob, filename } = await exportAbcMidi(tunes, "My book")
  expect(filename).toBe("My book.mid")
  expect(blob.type).toBe("audio/midi")
  expect(
    parseMidi(new Uint8Array(await blob.arrayBuffer())).tracks
  ).toHaveLength(2)
})

test("orders selected duplicate titles in ZIP with intact UTF-8 names and metadata", async () => {
  const title = "A" + "曲".repeat(120)
  const tunes = readAbcTunes(
    `X:3\nT:${title}\nK:C\nC D E F|\n\nX:1\nT:${title}\nK:G\nG A B c|`
  )
  const { blob, filename } = await exportAbcMidi(tunes, title)
  const files = unzipSync(new Uint8Array(await blob.arrayBuffer()))
  const truncated = "A" + "曲".repeat(79)
  const names = [`1-${truncated}.mid`, `2-${truncated}.mid`]
  expect(Object.keys(files)).toEqual(names)
  expect(filename).toBe(`${truncated}-midi.zip`)
  expect(blob.type).toBe("application/zip")

  const tunesInArchive = names.map((name) => parseMidi(files[name]!))
  expect(
    tunesInArchive.map(({ tracks }) =>
      decodeMidiText(tracks[0]!.find((event) => event.type === "text")?.text)
    )
  ).toEqual([title, title])
  expect(
    tunesInArchive.map(
      ({ tracks }) =>
        tracks[1]!.find((event) => event.type === "noteOn")?.noteNumber
    )
  ).toEqual([60, 67])
})

test("reports an empty export or a tune without musical content", async () => {
  await expect(exportAbcMidi([], "Book")).rejects.toThrow("No ABC tunes")
  const [tune] = readAbcTunes("X:1\nT:Empty\nK:C\n|")
  expect(() => compileAbcMidi(tune!)).toThrow("No ABC music")
})
