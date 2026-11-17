import { FORMATS, SubtitleError, type Options } from "./formats"
import { parseSubtitle } from "./parse"
import { serialize } from "./serialize"

export function convertSubtitle(input: string, options: Options) {
  if (
    !Number.isFinite(options.fps) ||
    options.fps < 1 ||
    options.fps > 120 ||
    !Number.isFinite(options.offset)
  )
    throw new SubtitleError("invalidOptions")
  const parsed = parseSubtitle(input, options.source, options.fps)
  const shifted =
    options.offset !== 0 &&
    parsed.cues.some((cue) => cue.start + options.offset < 0)
  const cues = parsed.cues
    .filter((cue) => cue.end + options.offset > 0)
    .map((cue) => ({
      ...cue,
      start: Math.max(0, cue.start + options.offset),
      end: cue.end + options.offset,
    }))
  if (!cues.length) throw new SubtitleError("noCues")
  const notes = ["fidelity"]
  if (options.target === "txt") notes.push("transcriptNote")
  if (
    [parsed.format, options.target].some((format) =>
      ["lrc", "qt"].includes(format)
    )
  )
    notes.push("estimatedNote")
  if (shifted) notes.push("shiftedNote")
  if (
    ["ass", "ssa", "lrc", "mpl2", "microdvd", "subviewer", "spruce"].includes(
      options.target
    )
  )
    notes.push("precisionNote")
  return {
    format: parsed.format,
    cues,
    output: serialize(cues, options.target, options.fps),
    mime:
      options.target === "vtt"
        ? "text/vtt;charset=utf-8"
        : options.target === "json"
          ? "application/json;charset=utf-8"
          : ["ttml", "dfxp", "youtube", "srv3"].includes(options.target)
            ? "application/xml;charset=utf-8"
            : options.target === "csv"
              ? "text/csv;charset=utf-8"
              : "text/plain;charset=utf-8",
    notes,
  }
}

export function outputFilename(name: string, target: Options["target"]) {
  const base = name
    .replace(/\.(?:qt\.)?[^.]+$/, "")
    .replace(/[\\/:*?"<>|]/g, "_")
    .split("")
    .map((char) => (char.charCodeAt(0) < 32 ? "_" : char))
    .join("")
  return `${base || "subtitles"}.${FORMATS.find((format) => format.id === target)!.extension}`
}

export function decodeFile(bytes: ArrayBuffer, encoding: string) {
  const data = new Uint8Array(bytes)
  const selected =
    encoding === "auto"
      ? data[0] === 0xff && data[1] === 0xfe
        ? "utf-16le"
        : data[0] === 0xfe && data[1] === 0xff
          ? "utf-16be"
          : "utf-8"
      : encoding
  try {
    return new TextDecoder(selected, { fatal: true }).decode(data)
  } catch {
    throw new SubtitleError("encodingError")
  }
}
