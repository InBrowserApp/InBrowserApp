import { SubtitleError, type Cue } from "./formats"
import { cleanMarkup, escapeXml } from "./text"
import { parseTime } from "./time"

export function parseFrameLines(
  text: string,
  format: "microdvd" | "mpl2" | "spruce",
  fps: number
): Cue[] {
  const cues: Cue[] = []
  for (const line of text.split("\n")) {
    if (format === "spruce") {
      const rate = /^\s*\/\/\s*\$SMPTEFormat\s*=\s*(\d+(?:\.\d+)?)/i.exec(line)
      if (rate) {
        fps = Number(rate[1])
        if (fps < 1 || fps > 120) throw new SubtitleError("invalidOptions")
      }
    }
    if (!line.trim() || (format === "spruce" && /^\s*(?:\$|\/\/)/.test(line)))
      continue
    if (format === "spruce") {
      const match =
        /^\s*(\d+:\d{2}:\d{2}:\d{2})\s*,\s*(\d+:\d{2}:\d{2}:\d{2})\s*,\s?(.*)$/.exec(
          line
        )
      if (!match) throw new SubtitleError("invalid")
      cues.push({
        start: parseTime(match[1]!, fps),
        end: parseTime(match[2]!, fps),
        text: cleanMarkup(escapeXml(match[3]!.replace(/\|/g, "\n"))),
      })
      continue
    }
    const match = (
      format === "microdvd"
        ? /^\{(\d+)\}\{(\d+)\}(.*)$/
        : /^\[(\d+)\]\[(\d+)\](.*)$/
    ).exec(line)
    if (!match) throw new SubtitleError("invalid")
    if (
      format === "microdvd" &&
      match[1]! === match[2]! &&
      ["0", "1"].includes(match[1]!) &&
      /^\d+(?:\.\d+)?$/.test(match[3]!)
    ) {
      fps = Number(match[3]!)
      if (fps < 1 || fps > 120) throw new SubtitleError("invalidOptions")
      continue
    }
    const scale = format === "microdvd" ? 1000 / fps : 100
    const body = match[3]!
      .replace(/\{[^}]*\}/g, "")
      .split("|")
      .map((part) =>
        format === "mpl2" && part.startsWith("/")
          ? `<i>${escapeXml(part.slice(1))}</i>`
          : escapeXml(part)
      )
      .join("\n")
    cues.push({
      start: Number(match[1]!) * scale,
      end: Number(match[2]!) * scale,
      text: cleanMarkup(body),
    })
  }
  return cues
}

export function parseLrc(text: string): Cue[] {
  const entries: { start: number; text: string }[] = []
  let offset = 0
  for (const line of text.split("\n")) {
    if (!line.trim()) continue
    const setting = /^\[offset:([+-]?\d+)\]$/i.exec(line)
    if (setting) {
      offset = Number(setting[1])
      continue
    }
    if (/^\[[a-z]+:.*\]$/i.test(line)) continue
    const matches = [...line.matchAll(/\[(\d+:\d{2}(?:\.\d{1,3})?)\]/g)]
    if (!matches.length) throw new SubtitleError("invalid")
    const body = cleanMarkup(
      escapeXml(
        line
          .replace(/\[\d+:\d{2}(?:\.\d{1,3})?\]/g, "")
          .replace(/<\d+:\d{2}(?:\.\d{1,3})?>/g, "")
      )
    )
    for (const match of matches)
      entries.push({ start: parseTime(match[1]!), text: body })
  }
  entries.sort((a, b) => a.start - b.start)
  const starts = [...new Set(entries.map((entry) => entry.start))]
  const ends = new Map(
    starts.map((start, index) => [start, starts[index + 1] ?? start + 2000])
  )
  return entries
    .map((entry) => ({
      ...entry,
      start: Math.max(0, entry.start + offset),
      end: Math.max(0, ends.get(entry.start)! + offset),
    }))
    .filter((cue) => cue.text)
}

export function parseQt(text: string): Cue[] {
  const matches = [
    ...text.matchAll(
      /^\[(\d+:\d{2}:\d{2}\.\d{1,3})\]\s*\n?([\s\S]*?)(?=^\[\d+:\d{2}:\d{2}\.\d{1,3}\]|$(?![\s\S]))/gm
    ),
  ]
  return matches.flatMap((match, index) => {
    const body = cleanMarkup(escapeXml(match[2]!.replace(/\{[^}]*\}/g, "")))
    const start = parseTime(match[1]!)
    return body
      ? [
          {
            start,
            end: matches[index + 1]
              ? parseTime(matches[index + 1]![1]!)
              : start + 2000,
            text: body,
          },
        ]
      : []
  })
}
