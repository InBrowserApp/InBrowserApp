import Papa from "papaparse"
import type { Cue, Format } from "./formats"
import { clock, frameClock } from "./time"
import { escapeXml, plainText, toAss } from "./text"

function timeline(cues: Cue[]) {
  const events = cues
    .flatMap((cue, index) => [
      { time: cue.start, index, start: true },
      { time: cue.end, index, start: false },
    ])
    .sort((a, b) => a.time - b.time)
  const active = new Map<number, string>()
  const entries: { time: number; text: string }[] = []
  for (let index = 0; index < events.length; index++) {
    const event = events[index]!
    if (event.start) active.set(event.index, cues[event.index]!.text)
    else active.delete(event.index)
    if (events[index + 1]?.time === event.time) continue
    entries.push({
      time: event.time,
      text: [...active.entries()]
        .sort((a, b) => a[0] - b[0])
        .map((entry) => entry[1])
        .join("\n"),
    })
  }
  return entries
}

function ttmlMarkup(text: string) {
  const styles: Record<string, string> = {
    b: 'fontWeight="bold"',
    i: 'fontStyle="italic"',
    u: 'textDecoration="underline"',
  }
  return text
    .replace(/<(\/?)([biu])>/g, (_tag, end: string, name: string) =>
      end ? "</span>" : `<span tts:${styles[name]}>`
    )
    .replace(/\n/g, "<br/>")
}

export function serialize(cues: Cue[], format: Format, fps: number): string {
  const precision = ["ass", "ssa", "subviewer", "lrc"].includes(format)
    ? 10
    : format === "mpl2"
      ? 100
      : ["microdvd", "spruce"].includes(format)
        ? 1000 / fps
        : 1
  cues = cues.map((cue) => {
    const start = Math.round(cue.start / precision) * precision
    return {
      ...cue,
      start,
      end: Math.max(
        start + precision,
        Math.round(cue.end / precision) * precision
      ),
    }
  })
  switch (format) {
    case "srt":
      return cues
        .map(
          (cue, i) =>
            `${i + 1}\n${clock(cue.start, ",")} --> ${clock(cue.end, ",")}\n${cue.text}\n`
        )
        .join("\n")
    case "vtt":
      return `WEBVTT\n\n${cues.map((cue) => `${clock(cue.start)} --> ${clock(cue.end)}\n${cue.text}\n`).join("\n")}`
    case "sbv":
      return cues
        .map(
          (cue) =>
            `${clock(cue.start)},${clock(cue.end)}\n${plainText(cue.text)}\n`
        )
        .join("\n")
    case "subviewer":
      return `[INFORMATION]\n[TITLE]\n[END INFORMATION]\n[SUBTITLE]\n${cues.map((cue) => `${clock(cue.start, ".", 2)},${clock(cue.end, ".", 2)}\n${plainText(cue.text).replace(/\n/g, "[br]")}\n`).join("\n")}`
    case "ass":
    case "ssa": {
      const advanced = format === "ass"
      const style = advanced ? "V4+ Styles" : "V4 Styles"
      const fields = advanced
        ? "Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding"
        : "Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, TertiaryColour, BackColour, Bold, Italic, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, AlphaLevel, Encoding"
      const defaultStyle = advanced
        ? "Default,Arial,24,&H00FFFFFF,&H000000FF,&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,2,0,2,10,10,10,1"
        : "Default,Arial,24,16777215,255,0,0,0,0,1,2,0,2,10,10,10,0,1"
      return `[Script Info]\nScriptType: v4.00${advanced ? "+" : ""}\nPlayResX: 1280\nPlayResY: 720\n\n[${style}]\nFormat: ${fields}\nStyle: ${defaultStyle}\n\n[Events]\nFormat: ${advanced ? "Layer" : "Marked"}, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text\n${cues.map((cue) => `Dialogue: ${advanced ? "0" : "Marked=0"},${clock(cue.start, ".", 2)},${clock(cue.end, ".", 2)},Default,,0,0,0,,${toAss(cue.text)}`).join("\n")}\n`
    }
    case "microdvd":
      return `{1}{1}${fps}\n${cues.map((cue) => `{${Math.round((cue.start * fps) / 1000)}}{${Math.max(Math.round((cue.start * fps) / 1000) + 1, Math.round((cue.end * fps) / 1000))}}${plainText(cue.text).replace(/\n/g, "|")}`).join("\n")}\n`
    case "mpl2":
      return cues
        .map(
          (cue) =>
            `[${Math.round(cue.start / 100)}][${Math.max(Math.round(cue.start / 100) + 1, Math.round(cue.end / 100))}]${plainText(cue.text).replace(/\n/g, "|")}\n`
        )
        .join("")
    case "spruce":
      return (
        `//$SMPTEFormat = ${fps}\n` +
        cues
          .map(
            (cue) =>
              `${frameClock(cue.start, fps)},${frameClock(cue.end, fps)},${plainText(cue.text).replace(/\n/g, "|")}\n`
          )
          .join("")
      )
    case "lrc":
      return `${cues
        .map((cue) => {
          const time = clock(cue.start, ".", 2)
          const minutes = String(Math.floor(cue.start / 60000)).padStart(2, "0")
          return `[${minutes}:${time.slice(6)}]${plainText(cue.text).replace(/\n/g, " ")}`
        })
        .join("\n")}\n`
    case "sami":
      return `<SAMI>\n<HEAD><TITLE>Subtitles</TITLE></HEAD>\n<BODY>\n${timeline(
        cues
      )
        .map(
          (entry) =>
            `<SYNC Start=${Math.round(entry.time)}><P>${entry.text ? entry.text.replace(/\n/g, "<br>") : "&nbsp;"}</P>`
        )
        .join("\n")}\n</BODY>\n</SAMI>\n`
    case "qt":
      return `{QTtext}{timescale:1000}\n${timeline(cues)
        .map((entry) => `[${clock(entry.time)}]\n${plainText(entry.text)}`)
        .join("\n")}\n`
    case "ttml":
    case "dfxp":
      return `<?xml version="1.0" encoding="UTF-8"?>\n<tt xmlns="http://www.w3.org/ns/ttml" xmlns:tts="http://www.w3.org/ns/ttml#styling" xml:lang=""><body><div>\n${cues.map((cue) => `<p begin="${clock(cue.start)}" end="${clock(cue.end)}" xml:space="preserve">${ttmlMarkup(cue.text)}</p>`).join("\n")}\n</div></body></tt>\n`
    case "youtube":
      return `<?xml version="1.0" encoding="UTF-8"?>\n<transcript>\n${cues.map((cue) => `<text start="${cue.start / 1000}" dur="${(cue.end - cue.start) / 1000}">${escapeXml(plainText(cue.text))}</text>`).join("\n")}\n</transcript>\n`
    case "srv3":
      return `<?xml version="1.0" encoding="UTF-8"?>\n<timedtext format="3"><body>\n${cues.map((cue) => `<p t="${Math.round(cue.start)}" d="${Math.max(1, Math.round(cue.end - cue.start))}">${escapeXml(plainText(cue.text))}</p>`).join("\n")}\n</body></timedtext>\n`
    case "json":
      return `${JSON.stringify(
        cues.map((cue) => ({
          ...cue,
          start: Math.round(cue.start),
          end: Math.round(cue.end),
        })),
        null,
        2
      )}\n`
    case "csv":
    case "tsv":
      return `${Papa.unparse(
        cues.map((cue) => ({
          start: Math.round(cue.start),
          end: Math.round(cue.end),
          text: cue.text,
        })),
        { delimiter: format === "csv" ? "," : "\t", newline: "\r\n" }
      )}\r\n`
    case "txt":
      return `${cues.map((cue) => plainText(cue.text)).join("\n\n")}\n`
  }
}
