import type {
  MidiData,
  MidiNoteOffEvent,
  MidiNoteOnEvent,
  MidiPortPrefixEvent,
} from "midi-file"

type HeldNote = { channel: number; noteNumber: number; velocity: number }

type TimedEvent = {
  tick: number
  track: number
  event: MidiNoteOnEvent | MidiNoteOffEvent | MidiPortPrefixEvent
}

function seekTick(
  seconds: number,
  ticksPerBeat: number,
  tempos: Map<number, number>
) {
  let remaining = seconds * ticksPerBeat * 1_000_000
  let tempo = 500_000
  let previous = 0
  for (const [tick, next] of [...tempos].sort(([a], [b]) => a - b)) {
    const span = (tick - previous) * tempo
    if (remaining < span) break
    remaining -= span
    previous = tick
    tempo = next
  }
  const tick = previous + remaining / tempo
  const nearest = Math.round(tick)
  // Snap floating-point rounding at an exact MIDI event boundary.
  const roundingError = Number.EPSILON * Math.max(1, tick) * 8
  return Math.abs(tick - nearest) <= roundingError ? nearest : tick
}

export function heldNotesAt(midi: MidiData, seconds: number): HeldNote[] {
  const { ticksPerBeat, format } = midi.header
  if (
    !ticksPerBeat ||
    format === 2 ||
    !Number.isFinite(seconds) ||
    seconds <= 0
  ) {
    return []
  }

  const tempos = new Map<number, number>()
  const events: TimedEvent[] = []
  const tracks: { active: boolean; port?: number }[] = []
  let defaultPort = Infinity
  let end = 0
  for (const [index, track] of midi.tracks.entries()) {
    let tick = 0
    let active = false
    let port: number | undefined
    for (const event of track) {
      tick += event.deltaTime
      if ("channel" in event && event.type !== "channelPrefix") active = true
      if (event.type === "setTempo" && event.microsecondsPerBeat > 0) {
        tempos.set(tick, event.microsecondsPerBeat)
      }
      if (event.type === "portPrefix") port = event.port
      if (
        event.type === "noteOn" ||
        event.type === "noteOff" ||
        event.type === "portPrefix"
      ) {
        events.push({ tick, track: index, event })
      }
    }
    if (active && port !== undefined) defaultPort = Math.min(defaultPort, port)
    tracks.push({ active, port })
    end = Math.max(end, tick)
  }
  const target = seekTick(seconds, ticksPerBeat, tempos)
  if (target >= end) return []

  // The sequencer assigns one block of 16 channels per port, in track order.
  const offsets = new Map<number, number>()
  function assignPort(port: number) {
    if (!offsets.has(port)) offsets.set(port, offsets.size * 16)
  }
  for (const track of tracks) {
    track.port ??= Number.isFinite(defaultPort) ? defaultPort : 0
    if (track.active) assignPort(track.port)
  }

  const held = new Map<number, HeldNote[]>()
  for (const { event, tick, track } of events.sort((a, b) => a.tick - b.tick)) {
    if (tick > target) break
    const route = tracks[track]!
    if (event.type === "portPrefix") {
      if (route.active) {
        route.port = event.port
        assignPort(event.port)
      }
      continue
    }
    const channel = event.channel + offsets.get(route.port!)!
    const key = channel * 128 + event.noteNumber
    const attacks = held.get(key)
    if (event.type === "noteOn" && event.velocity > 0) {
      // The sequencer will play attacks that start exactly at the seek point.
      if (tick === target) continue
      const note = {
        channel,
        noteNumber: event.noteNumber,
        velocity: event.velocity,
      }
      if (attacks) attacks.push(note)
      else held.set(key, [note])
    } else if (attacks) {
      // A release at the seek point already ends the preceding attack.
      attacks.shift()
      if (!attacks.length) held.delete(key)
    }
  }
  return [...held.values()].flat()
}
