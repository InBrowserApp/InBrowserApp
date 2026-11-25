const stringNotes = {
  guitar: [40, 45, 50, 55, 59, 64],
  ukulele: [67, 60, 64, 69],
} as const

const chromaticNames = [
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

function noteName(midi: number) {
  return `${chromaticNames[midi % 12]}${Math.floor(midi / 12) - 1}`
}

function noteFrequency(midi: number, a4: number) {
  return a4 * 2 ** ((midi - 69) / 12)
}

function readTuning(frequency: number, a4: number, target: number | null) {
  const position = 69 + 12 * Math.log2(frequency / a4)
  const note = Math.round(position)
  const cents = Math.round((position - (target ?? note)) * 100)
  const state = Math.abs(cents) <= 5 ? "inTune" : cents < 0 ? "flat" : "sharp"
  return { note, cents, state } as const
}

export { noteName, noteFrequency, readTuning, stringNotes }
