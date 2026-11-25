import { divisions } from "./read-score"

import type { Meter, Note, Score } from "./read-score"

export type Chord = { start: number; end: number; pitches: number[] }
type Voice = { end: number; chords: Chord[]; index: number }
export type Bar = {
  start: number
  end: number
  meter?: Meter
  partial: boolean
}

export function timelined<T>(map: Map<number, T>) {
  return [...map].sort(([a], [b]) => a - b)
}

export function makeBars(score: Score): Bar[] | undefined {
  const finalTick = score.parts.reduce(
    (end, part) =>
      part.notes.reduce((value, note) => Math.max(value, note.end), end),
    0
  )
  const meters = timelined(score.meters)
  const bars: Bar[] = []
  let index = 0
  let start = 0
  while (start < finalTick) {
    if (bars.length === 4096) return undefined
    const [meterStart, meter] = meters[index]!
    const naturalEnd =
      start + (divisions * 4 * meter.numerator) / meter.denominator
    const end = Math.min(naturalEnd, meters[index + 1]?.[0] ?? Infinity)
    bars.push({
      start,
      end,
      meter: start === meterStart ? meter : undefined,
      partial: end < naturalEnd,
    })
    start = end
    if (meters[index + 1]?.[0] === start) index++
  }
  return bars
}

export function groupVoices(notes: Note[]) {
  const bySpan = new Map<string, Chord>()
  for (const { start, end, pitch } of notes) {
    const key = `${start}:${end}`
    const chord = bySpan.get(key)
    if (chord) {
      if (!chord.pitches.includes(pitch)) chord.pitches.push(pitch)
    } else {
      bySpan.set(key, { start, end, pitches: [pitch] })
    }
  }
  const voices: Voice[] = []
  for (const chord of [...bySpan.values()].sort(
    (a, b) => a.start - b.start || a.end - b.end
  )) {
    const voice = voices.find((voice) => voice.end <= chord.start)
    if (voice) {
      voice.chords.push(chord)
      voice.end = chord.end
    } else {
      voices.push({ end: chord.end, chords: [chord], index: 0 })
    }
  }
  return voices
}
