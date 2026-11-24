type Segment = { start: number; end: number; text: string }
type Chunk = { timestamp: [number | null, number | null]; text: string }

const FORMATS = {
  txt: "text/plain;charset=utf-8",
  srt: "application/x-subrip;charset=utf-8",
  vtt: "text/vtt;charset=utf-8",
} as const
type Format = keyof typeof FORMATS

function toSegments(chunks: Chunk[], duration: number): Segment[] {
  let previousEnd = 0
  return chunks
    .flatMap(({ timestamp: [start, end], text }, index) => {
      const startMs = Math.round(Math.max(0, start ?? previousEnd) * 1000)
      const endMs = Math.round(
        Math.min(end ?? chunks[index + 1]?.timestamp[0] ?? duration, duration) *
          1000
      )
      previousEnd = endMs / 1000
      text = text.trim()
      return text && text !== "[BLANK_AUDIO]" && endMs > startMs
        ? [{ start: startMs, end: endMs, text }]
        : []
    })
    .sort((a, b) => a.start - b.start)
}

function timestamp(milliseconds: number, decimal = ".") {
  const seconds = Math.floor(milliseconds / 1000)
  const time = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((part) => String(part).padStart(2, "0"))
    .join(":")
  return time + decimal + String(milliseconds % 1000).padStart(3, "0")
}

function formatTranscript(segments: Segment[], format: Format) {
  const cues = segments
    .filter(({ text }) => text.trim())
    .map(({ start, end, text }, index) => {
      // Subtitle cue blocks are separated by blank lines.
      const content = text.trim().replace(/\s+/g, " ")
      if (format === "txt") return `[${timestamp(start)}] ${content}`
      if (format === "srt") {
        return `${index + 1}\n${timestamp(start, ",")} --> ${timestamp(end, ",")}\n${content}`
      }
      const escaped = content
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
      return `${timestamp(start)} --> ${timestamp(end)}\n${escaped}`
    })
  const body = cues.join(format === "txt" ? "\n" : "\n\n")
  return (format === "vtt" ? "WEBVTT\n\n" : "") + body + "\n"
}

export { FORMATS, formatTranscript, timestamp, toSegments }
export type { Format, Segment }
