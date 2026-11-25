import { parseMidi, writeMidi } from "midi-file"

import type { MidiEvent } from "midi-file"

const defaultTempo = 500_000
const fifthsByPitchClass = [0, -5, 2, -3, 4, -1, 6, 1, -4, 3, -2, 5]

export type MidiEditError =
  | "invalidFile"
  | "pitchOutOfRange"
  | "tempoOutOfRange"

type Options = { semitones: number; speed: number; keepDrums: boolean }
type Result = { bytes: Uint8Array<ArrayBuffer> } | { error: MidiEditError }

function hasInitialTempo(track: MidiEvent[]) {
  for (const event of track) {
    if (event.deltaTime > 0) return false
    if (event.type === "setTempo") return true
  }
  return false
}

export function transposeMidi(input: Uint8Array, options: Options): Result {
  let midi
  try {
    midi = parseMidi(input)
  } catch {
    return { error: "invalidFile" }
  }
  const { header, tracks } = midi
  if (
    tracks.length === 0 ||
    tracks.length !== header.numTracks ||
    ![0, 1, 2].includes(header.format) ||
    tracks.some((track) => track.at(-1)?.type !== "endOfTrack") ||
    !(header.ticksPerBeat || (header.framesPerSecond && header.ticksPerFrame))
  ) {
    return { error: "invalidFile" }
  }

  const { semitones, speed, keepDrums } = options
  const multiplier = 100 / speed
  const scaleTempo = speed !== 100 && header.ticksPerBeat
  const scaleTicks = speed !== 100 && header.framesPerSecond
  const needsGlobalTempo =
    scaleTempo && header.format !== 2 && !tracks.some(hasInitialTempo)
  for (const [index, track] of tracks.entries()) {
    let tick = 0
    let outputTick = 0
    for (const event of track) {
      if (scaleTicks) {
        tick += event.deltaTime
        const nextTick = Math.round(tick * multiplier)
        event.deltaTime = nextTick - outputTick
        outputTick = nextTick
        if (event.deltaTime > 0x0fff_ffff) return { error: "tempoOutOfRange" }
      }
      switch (event.type) {
        case "noteOn":
        case "noteOff":
        case "noteAftertouch": {
          if (keepDrums && event.channel === 9) break
          event.noteNumber += semitones
          if (event.noteNumber < 0 || event.noteNumber > 127) {
            return { error: "pitchOutOfRange" }
          }
          break
        }
        case "keySignature": {
          if (semitones % 12 !== 0) {
            // Seven semitones per step around the circle of fifths.
            const pitchClass = (((event.key * 7 + semitones) % 12) + 12) % 12
            event.key = fifthsByPitchClass[pitchClass]!
          }
          break
        }
        case "setTempo": {
          if (!scaleTempo) break
          const value = Math.round(event.microsecondsPerBeat * multiplier)
          if (value < 1 || value > 0xff_ffff) {
            return { error: "tempoOutOfRange" }
          }
          event.microsecondsPerBeat = value
          break
        }
      }
    }
    if (
      (needsGlobalTempo && index === 0) ||
      (scaleTempo && header.format === 2 && !hasInitialTempo(track))
    ) {
      track.unshift({
        type: "setTempo",
        deltaTime: 0,
        microsecondsPerBeat: Math.round(defaultTempo * multiplier),
      })
    }
  }
  return { bytes: Uint8Array.from(writeMidi(midi)) }
}
