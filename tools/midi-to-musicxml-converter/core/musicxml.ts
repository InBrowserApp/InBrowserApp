import { divisions, readScore } from "./read-score"
import { groupVoices, makeBars, timelined } from "./score-layout"

import type { Grid, Key, Part, Score } from "./read-score"
import type { Bar, Chord } from "./score-layout"

const noteTypes = [
  [64, "whole"],
  [32, "half"],
  [16, "quarter"],
  [8, "eighth"],
  [4, "16th"],
  [2, "32nd"],
  [1, "64th"],
] as const
const durations = noteTypes.flatMap(([length, type]) =>
  length > 1
    ? [
        { length: length * 1.5, type, dotted: true },
        { length, type, dotted: false },
      ]
    : [{ length, type, dotted: false }]
)
const sharpSteps = [
  "C",
  "C#",
  "D",
  "D#",
  "E",
  "F",
  "F#",
  "G",
  "G#",
  "A",
  "A#",
  "B",
]
const flatSteps = [
  "C",
  "Db",
  "D",
  "Eb",
  "E",
  "F",
  "Gb",
  "G",
  "Ab",
  "A",
  "Bb",
  "B",
]
const drumDisplay: Record<number, string> = {
  35: "F4",
  36: "F4",
  37: "C5",
  38: "C5",
  40: "C5",
  41: "A4",
  42: "G5",
  43: "A4",
  44: "D4",
  45: "B4",
  46: "G5",
  47: "D5",
  48: "D5",
  49: "A5",
  50: "E5",
  51: "F5",
  53: "F5",
  57: "A5",
  59: "F5",
}

function escapeXml(value: string) {
  return value.replaceAll(/\p{Cc}/gu, "").replace(
    /[<>&"']/g,
    (character) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        '"': "&quot;",
        "'": "&apos;",
      })[character]!
  )
}

function writePitch(pitch: number, flats: boolean) {
  const name = (flats ? flatSteps : sharpSteps)[pitch % 12]!
  const alter =
    name[1] === "#"
      ? "<alter>1</alter>"
      : name[1] === "b"
        ? "<alter>-1</alter>"
        : ""
  return `<pitch><step>${name[0]}</step>${alter}<octave>${Math.floor(pitch / 12) - 1}</octave></pitch>`
}

function writeDrum(pitch: number) {
  const display = drumDisplay[pitch] ?? "C5"
  return `<unpitched><display-step>${display[0]}</display-step><display-octave>${display[1]}</display-octave></unpitched>`
}

type WrittenDuration = (typeof durations)[number]
type NoteDetails = {
  chord?: boolean
  tieIn?: boolean
  tieOut?: boolean
  instrument?: string
}

function writeNote(
  notation: string,
  duration: WrittenDuration,
  voice: number,
  { chord, tieIn, tieOut, instrument = "" }: NoteDetails = {}
) {
  const tied =
    (tieIn ? '<tied type="stop"/>' : "") +
    (tieOut ? '<tied type="start"/>' : "")
  return `<note>${chord ? "<chord/>" : ""}${notation}<duration>${duration.length}</duration>${tieIn ? '<tie type="stop"/>' : ""}${tieOut ? '<tie type="start"/>' : ""}${instrument}<voice>${voice}</voice><type>${duration.type}</type>${duration.dotted ? "<dot/>" : ""}${tied ? `<notations>${tied}</notations>` : ""}</note>`
}

function writeSpan(
  start: number,
  end: number,
  voice: number,
  flats: boolean,
  drumId: string,
  chord?: Chord
) {
  const bits: string[] = []
  for (let position = start; position < end;) {
    const duration = durations.find((value) => value.length <= end - position)!
    if (chord) {
      for (const [index, pitch] of chord.pitches.entries()) {
        const notation = drumId ? writeDrum(pitch) : writePitch(pitch, flats)
        bits.push(
          writeNote(notation, duration, voice, {
            chord: index > 0,
            tieIn: position > chord.start,
            tieOut: position + duration.length < chord.end,
            instrument: drumId ? `<instrument id="${drumId}-D${pitch}"/>` : "",
          })
        )
      }
    } else {
      bits.push(writeNote("<rest/>", duration, voice))
    }
    position += duration.length
  }
  return bits.join("")
}

function writePartHeader(part: Part, id: string) {
  const channel = part.channel + 1
  const name = escapeXml(part.name)
  const pitches = [...new Set(part.notes.map((note) => note.pitch))]
  const instruments =
    part.channel === 9
      ? pitches.map((pitch) => ({
          id: `${id}-D${pitch}`,
          name: `${name} (${pitch})`,
          sound: `<midi-unpitched>${pitch + 1}</midi-unpitched>`,
        }))
      : [
          {
            id: `${id}-I1`,
            name,
            sound: `<midi-program>${part.program + 1}</midi-program>`,
          },
        ]
  return `<score-part id="${id}"><part-name>${name}</part-name>${instruments
    .map(
      (instrument) =>
        `<score-instrument id="${instrument.id}"><instrument-name>${instrument.name}</instrument-name></score-instrument>`
    )
    .join("")}${instruments
    .map(
      (instrument) =>
        `<midi-instrument id="${instrument.id}"><midi-channel>${channel}</midi-channel>${instrument.sound}</midi-instrument>`
    )
    .join("")}</score-part>`
}

function writeKey(key: Key) {
  return `<key><fifths>${key.key}</fifths><mode>${key.scale === 1 ? "minor" : "major"}</mode></key>`
}

function writePart(
  part: Part,
  id: string,
  score: Score,
  bars: Bar[],
  conductor: boolean
) {
  const voices = groupVoices(part.notes)
  const drum = part.channel === 9
  const averagePitch =
    part.notes.reduce((sum, note) => sum + note.pitch, 0) / part.notes.length
  const clef = drum
    ? "<sign>percussion</sign>"
    : averagePitch < 57
      ? "<sign>F</sign><line>4</line>"
      : "<sign>G</sign><line>2</line>"
  const tempos = timelined(score.tempos)
  const keys = timelined(score.keys)
  let tempoIndex = 0
  let keyIndex = 0
  let useFlats = false

  const measures = bars.map((bar, index) => {
    const length = bar.end - bar.start
    const xml: string[] = []
    let attributes = index === 0 ? `<divisions>${divisions}</divisions>` : ""
    if (keys[keyIndex]?.[0] === bar.start) {
      const [, key] = keys[keyIndex++]!
      useFlats = key.key < 0
      if (!drum) attributes += writeKey(key)
    }
    if (bar.meter)
      attributes += `<time><beats>${bar.meter.numerator}</beats><beat-type>${bar.meter.denominator}</beat-type></time>`
    if (index === 0) {
      attributes += `<clef>${clef}</clef>`
      if (part.transposeDownOctave) {
        attributes +=
          "<transpose><chromatic>0</chromatic><octave-change>-1</octave-change></transpose>"
      }
    }
    if (attributes) xml.push(`<attributes>${attributes}</attributes>`)
    const spellWithFlats = useFlats
    while (keyIndex < keys.length && keys[keyIndex]![0] < bar.end) {
      const [tick, key] = keys[keyIndex++]!
      const offset = `<duration>${tick - bar.start}</duration>`
      if (!drum)
        xml.push(
          `<forward>${offset}</forward><attributes>${writeKey(key)}</attributes><backup>${offset}</backup>`
        )
      useFlats = key.key < 0
    }
    if (conductor) {
      while (tempoIndex < tempos.length && tempos[tempoIndex]![0] < bar.end) {
        const [tick, bpm] = tempos[tempoIndex++]!
        const tempo = Math.round(bpm * 1000) / 1000
        xml.push(
          `<direction placement="above"><direction-type><metronome><beat-unit>quarter</beat-unit><per-minute>${tempo}</per-minute></metronome></direction-type><offset sound="yes">${tick - bar.start}</offset><sound tempo="${tempo}"/></direction>`
        )
      }
    }
    for (const [voiceIndex, voice] of voices.entries()) {
      const number = voiceIndex + 1
      if (voiceIndex > 0)
        xml.push(`<backup><duration>${length}</duration></backup>`)
      let position = bar.start
      for (; voice.index < voice.chords.length;) {
        const chord = voice.chords[voice.index]!
        if (chord.start >= bar.end) break
        const start = Math.max(position, chord.start)
        const end = Math.min(bar.end, chord.end)
        xml.push(
          writeSpan(position, start, number, spellWithFlats, ""),
          writeSpan(start, end, number, spellWithFlats, drum ? id : "", chord)
        )
        position = end
        if (chord.end > bar.end) break
        voice.index++
      }
      if (position === bar.start) {
        xml.push(
          `<note><rest measure="yes"/><duration>${length}</duration><voice>${number}</voice></note>`
        )
      } else {
        xml.push(writeSpan(position, bar.end, number, spellWithFlats, ""))
      }
    }
    return `<measure number="${index + 1}"${bar.partial ? ' implicit="yes"' : ""}>${xml.join("")}</measure>`
  })
  return `<part id="${id}">\n${measures.join("\n")}\n</part>`
}

export function midiToMusicXml(
  input: Uint8Array,
  grid: Grid,
  title: string,
  partLabel: string
) {
  const score = readScore(input, grid, title, partLabel)
  if ("error" in score) return score
  const bars = makeBars(score)
  if (!bars) return { error: "tooManyMeasures" } as const
  const ids = score.parts.map((_, index) => `P${index + 1}`)
  return {
    xml: `<?xml version="1.0" encoding="UTF-8"?>\n<score-partwise version="4.0">\n<work><work-title>${escapeXml(score.title)}</work-title></work>\n<part-list>${score.parts.map((part, index) => writePartHeader(part, ids[index]!)).join("")}</part-list>\n${score.parts.map((part, index) => writePart(part, ids[index]!, score, bars, index === 0)).join("\n")}\n</score-partwise>\n`,
  }
}
