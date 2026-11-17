import { SubtitleError, type Cue } from "./formats"
import { assText, cleanMarkup } from "./text"
import { parseTime } from "./time"

export function parseBlocks(
  content: string,
  format: "srt" | "vtt" | "sbv" | "subviewer"
): Cue[] {
  const text =
    format === "subviewer"
      ? content
          .split(/\[SUBTITLE\]/i)
          .pop()!
          .replace(/\[END SUBTITLE\]/gi, "")
          .trim()
      : content
  const blocks = text.split(/\n\s*\n/)
  const cues: Cue[] = []
  for (const block of blocks) {
    if (
      format === "vtt" &&
      /^(?:WEBVTT|NOTE(?:\s|$)|STYLE(?:\s|$)|REGION(?:\s|$))/.test(block)
    )
      continue
    const lines = block.split("\n")
    const index = lines.findIndex((line) =>
      format === "srt" || format === "vtt"
        ? line.includes("-->")
        : /^\d[^\n]*,\d/.test(line)
    )
    if (index < 0) throw new SubtitleError("invalid")
    const times = lines[index]!.split(
      format === "srt" || format === "vtt" ? "-->" : ","
    ).map((time) => time.trim())
    if (times.length !== 2 || index > 1) throw new SubtitleError("invalid")
    const start = parseTime(times[0]!)
    const end = parseTime(times[1]!.trim().split(/\s+/)[0]!)
    const body = lines.slice(index + 1).join("\n")
    cues.push({
      start,
      end,
      text: cleanMarkup(
        format === "subviewer" ? body.replace(/\[br\]/gi, "\n") : body
      ),
    })
  }
  return cues
}

export function parseAss(content: string): Cue[] {
  let fields: string[] = []
  let events = false
  const cues: Cue[] = []
  for (const line of content.split("\n")) {
    if (line.startsWith("[")) events = /^\[Events\]/i.test(line)
    if (!events) continue
    if (/^Format:/i.test(line))
      fields = line
        .slice(7)
        .split(",")
        .map((part) => part.trim().toLowerCase())
    if (!/^Dialogue:/i.test(line)) continue
    const data = line.slice(9).trimStart().split(",")
    const textIndex = fields.indexOf("text")
    const startIndex = fields.indexOf("start")
    const endIndex = fields.indexOf("end")
    if (
      textIndex !== fields.length - 1 ||
      startIndex < 0 ||
      endIndex < 0 ||
      data.length < fields.length
    )
      throw new SubtitleError("invalid")
    cues.push({
      start: parseTime(data[startIndex]!),
      end: parseTime(data[endIndex]!),
      text: assText(data.slice(textIndex).join(",")),
    })
  }
  return cues
}
