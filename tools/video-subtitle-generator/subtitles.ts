import { timestamp } from "@workspace/local-speech/transcript"
import type { Segment } from "@workspace/local-speech/transcript"
import type { SubtitleRow } from "./types"

function parseTime(value: string) {
  const [hours, minutes, seconds, ms] = value.split(/[:,.]/).map(Number)
  return ((hours! * 60 + minutes!) * 60 + seconds!) * 1000 + ms!
}

export function parseSrt(source: string): Segment[] {
  const text = source
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .trim()
  if (!text) return []
  return text.split(/\n[ \t]*\n/).map((block) => {
    const lines = block.split("\n")
    if (/^\d+$/.test(lines[0]?.trim() ?? "")) lines.shift()
    const timing =
      /^\s*(\d{2,}:[0-5]\d:[0-5]\d[,.]\d{3})\s+-->\s+(\d{2,}:[0-5]\d:[0-5]\d[,.]\d{3})(?:\s.*)?$/.exec(
        lines.shift() ?? ""
      )
    const content = lines.join("\n").trim()
    if (!timing || !content) throw new Error("Invalid SRT cue")
    const start = parseTime(timing[1]!)
    const end = parseTime(timing[2]!)
    if (!Number.isSafeInteger(end) || end <= start)
      throw new Error("Invalid SRT timing")
    return { start, end, text: content }
  })
}

export function readSubtitles(rows: SubtitleRow[]) {
  const segments = rows
    .flatMap(({ start, end, text }) =>
      text.trim()
        ? [
            {
              start: start === "" ? NaN : Math.round(Number(start) * 1000),
              end: end === "" ? NaN : Math.round(Number(end) * 1000),
              text: text.trim(),
            },
          ]
        : []
    )
    .sort((a, b) => a.start - b.start)

  const invalid = segments.some(
    ({ start, end }) =>
      !Number.isSafeInteger(start) ||
      !Number.isSafeInteger(end) ||
      start < 0 ||
      end <= start
  )
  return { segments, invalid }
}

export function subtitleFile(segments: Segment[], format: "srt" | "vtt") {
  return (
    (format === "vtt" ? "WEBVTT\n\n" : "") +
    segments
      .map(({ start, end, text }, index) => {
        const content = text.replace(/\n(?:[ \t]*\n)+/g, "\n")
        if (format === "srt") {
          return `${index + 1}\n${timestamp(start, ",")} --> ${timestamp(end, ",")}\n${content}\n`
        }
        const escaped = content
          .replaceAll("&", "&amp;")
          .replaceAll("<", "&lt;")
          .replaceAll(">", "&gt;")
        return `${timestamp(start)} --> ${timestamp(end)}\n${escaped}\n`
      })
      .join("\n")
  )
}

// MP4 timed text stores one cue at a time. Split at each change in active text.
export function mergeOverlaps(segments: Segment[]): Segment[] {
  const points = segments
    .flatMap((segment) => [
      { at: segment.start, start: true, segment },
      { at: segment.end, start: false, segment },
    ])
    .sort((a, b) => a.at - b.at)

  const active = new Set<Segment>()
  const result: Segment[] = []
  let previous = 0
  for (const point of points) {
    if (active.size && point.at > previous) {
      result.push({
        start: previous,
        end: point.at,
        text: Array.from(active, ({ text }) => text).join("\n"),
      })
    }
    if (point.start) active.add(point.segment)
    else active.delete(point.segment)
    previous = point.at
  }
  return result
}
