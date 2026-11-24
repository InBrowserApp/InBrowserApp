export type Message =
  | {
      kind: "noteOn" | "noteOff"
      channel: number
      note: number
      velocity: number
    }
  | { kind: "controlChange"; channel: number; control: number; value: number }
  | { kind: "pitchBend"; channel: number; value: number }
  | { kind: "clock" }
  | { kind: "other"; channel?: number }

export type HeldNote = { channel: number; note: number; velocity: number }

const pitches = [
  "C",
  "C♯",
  "D",
  "D♯",
  "E",
  "F",
  "F♯",
  "G",
  "G♯",
  "A",
  "A♯",
  "B",
]

export function noteName(note: number) {
  return `${pitches[note % 12]}${Math.floor(note / 12) - 1}`
}

export function pianoKeys(octave: number) {
  const first = (octave + 1) * 12
  return Array.from({ length: Math.min(25, 128 - first) }, (_, index) => {
    const note = first + index
    const name = noteName(note)
    return { note, name, black: name.includes("♯") }
  })
}

export function decodeMidi(data: Uint8Array): Message | null {
  const [status, first, second] = data
  if (status === undefined) return null
  if (status === 0xf8) return { kind: "clock" }
  if (status < 0x80 || status >= 0xf0) return { kind: "other" }

  const channel = (status & 0x0f) + 1
  if (first === undefined || second === undefined)
    return { kind: "other", channel }

  switch (status >> 4) {
    case 0x8:
      return { kind: "noteOff", channel, note: first, velocity: second }
    case 0x9:
      return {
        kind: second ? "noteOn" : "noteOff",
        channel,
        note: first,
        velocity: second,
      }
    case 0xb:
      return { kind: "controlChange", channel, control: first, value: second }
    case 0xe:
      return {
        kind: "pitchBend",
        channel,
        value: ((second << 7) | first) - 8192,
      }
    default:
      return { kind: "other", channel }
  }
}

export function trackNotes(notes: HeldNote[], message: Message) {
  if (message.kind === "noteOn" || message.kind === "noteOff") {
    const remaining = notes.filter(
      (note) => note.channel !== message.channel || note.note !== message.note
    )
    if (message.kind === "noteOn") {
      return [
        ...remaining,
        {
          channel: message.channel,
          note: message.note,
          velocity: message.velocity,
        },
      ]
    }
    return remaining
  }
  if (
    message.kind === "controlChange" &&
    (message.control === 120 || message.control === 123)
  ) {
    return notes.filter((note) => note.channel !== message.channel)
  }
  return notes
}

export function hexBytes(data: Uint8Array) {
  return Array.from(data, (byte) =>
    byte.toString(16).toUpperCase().padStart(2, "0")
  ).join(" ")
}
