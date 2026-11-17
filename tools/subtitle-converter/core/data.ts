import Papa from "papaparse"
import { SubtitleError, type Cue } from "./formats"
import { cleanMarkup } from "./text"
import { parseTime } from "./time"

function dataTime(value: unknown) {
  if (typeof value === "number") return value
  if (typeof value !== "string" || !value.trim())
    throw new SubtitleError("invalid")
  return /^\d+(?:\.\d+)?$/.test(value.trim()) ? Number(value) : parseTime(value)
}

export function parseData(text: string, format: "json" | "csv" | "tsv"): Cue[] {
  let rows: unknown
  let scale = 1
  if (format === "json") {
    try {
      rows = JSON.parse(text)
    } catch {
      throw new SubtitleError("invalid")
    }
    if (rows && typeof rows === "object" && "segments" in rows) {
      rows = rows.segments
      scale = 1000
    }
  } else {
    const result = Papa.parse(text, {
      header: true,
      delimiter: format === "csv" ? "," : "\t",
      skipEmptyLines: "greedy",
      transformHeader: (header) => header.trim().toLowerCase(),
    })
    if (
      result.errors.length ||
      !["start", "end", "text"].every((field) =>
        result.meta.fields!.includes(field)
      )
    )
      throw new SubtitleError("invalid")
    rows = result.data
  }
  if (!Array.isArray(rows)) throw new SubtitleError("invalid")
  return rows.map((row: unknown) => {
    if (
      !row ||
      typeof row !== "object" ||
      !("start" in row) ||
      !("end" in row) ||
      !("text" in row) ||
      typeof row.text !== "string"
    )
      throw new SubtitleError("invalid")
    return {
      start: dataTime(row.start) * scale,
      end: dataTime(row.end) * scale,
      text: cleanMarkup(row.text),
    }
  })
}
