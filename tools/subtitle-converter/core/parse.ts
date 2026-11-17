import { SubtitleError, type InputFormat, type Format } from "./formats"
import { parseAss, parseBlocks } from "./blocks"
import { parseFrameLines, parseLrc, parseQt } from "./lines"
import { parseSami, parseXml } from "./xml"
import { parseData } from "./data"
import { plainText } from "./text"

export function detectFormat(text: string): Exclude<Format, "txt"> {
  if (/^WEBVTT(?:\s|$)/.test(text)) return "vtt"
  if (/^\[Script Info\]/im.test(text))
    return /ScriptType:\s*v4\.00\+/i.test(text) ? "ass" : "ssa"
  if (/<(?:\w+:)?tt\b/i.test(text)) return "ttml"
  if (/<timedtext\b/i.test(text)) return "srv3"
  if (/<transcript\b/i.test(text)) return "youtube"
  if (/<sami\b|<sync\b/i.test(text)) return "sami"
  if (/^\{\d+\}\{\d+\}/m.test(text)) return "microdvd"
  if (/^\[\d+\]\[\d+\]/m.test(text)) return "mpl2"
  if (/\[SUBTITLE\]/i.test(text)) return "subviewer"
  if (/^\{QTtext\}/i.test(text)) return "qt"
  if (/^\[\d+:\d{2}(?:\.\d+)?\]/m.test(text)) return "lrc"
  if (/^\s*\d+:\d{2}:\d{2}:\d{2}\s*,/m.test(text)) return "spruce"
  if (/^\d[^\n]*-->[^\n]*$/m.test(text))
    return /\d{2}:\d{2},\d{3}\s*-->/.test(text) ? "srt" : "vtt"
  if (/^\d+:\d{2}:\d{2}\.\d+,\d+:\d{2}:\d{2}\.\d+$/m.test(text)) return "sbv"
  if (/^[[{]/.test(text)) return "json"
  if (/^start,end,text\s*$/im.test(text)) return "csv"
  if (/^start\tend\ttext\s*$/im.test(text)) return "tsv"
  throw new SubtitleError("unsupported")
}

export function parseSubtitle(input: string, source: InputFormat, fps: number) {
  const text = input
    .replace(/^\uFEFF/, "")
    .replace(/\r\n?/g, "\n")
    .trim()
  if (!text) throw new SubtitleError("empty")
  const format = source === "auto" ? detectFormat(text) : source
  let cues
  switch (format) {
    case "srt":
    case "vtt":
    case "sbv":
    case "subviewer":
      cues = parseBlocks(text, format)
      break
    case "ass":
    case "ssa":
      cues = parseAss(text)
      break
    case "microdvd":
    case "mpl2":
    case "spruce":
      cues = parseFrameLines(text, format, fps)
      break
    case "lrc":
      cues = parseLrc(text)
      break
    case "qt":
      cues = parseQt(text)
      break
    case "sami":
      cues = parseSami(text)
      break
    case "ttml":
    case "dfxp":
    case "srv3":
    case "youtube":
      cues = parseXml(text, fps)
      break
    case "json":
    case "csv":
    case "tsv":
      cues = parseData(text, format)
      break
  }
  if (!cues.length) throw new SubtitleError("noCues")
  if (
    cues.some(
      (cue) =>
        !Number.isFinite(cue.start) ||
        !Number.isFinite(cue.end) ||
        cue.start < 0 ||
        cue.end <= cue.start
    )
  )
    throw new SubtitleError("timing")
  if (cues.some((cue) => !plainText(cue.text).trim()))
    throw new SubtitleError("invalid")
  return { format, cues }
}
