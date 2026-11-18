import { plugins, type CSL } from "@citation-js/core"
import "@citation-js/plugin-ris"

type RisRecord = Record<string, string | string[]>

const tagPattern = /^([A-Z][A-Z0-9])[ \t]+-[ \t]+(.*)$/

export function parseRis(text: string): CSL[] {
  const records: RisRecord[] = []
  let record: RisRecord | undefined
  let tag = ""
  for (const rawLine of text.split(/\r\n?|\n/)) {
    const line = rawLine.trim()
    if (!line) continue
    const field = line.match(tagPattern)
    if (/^ER[ \t]+-$/.test(line)) {
      if (!record) throw new Error("Unexpected RIS record end")
      records.push(record)
      record = undefined
    } else if (field?.[1] === "TY") {
      if (record) throw new Error("Missing RIS record end")
      const type = field[2]!.toUpperCase()
      record = { TY: type === "JOURN" ? "JOUR" : type }
      tag = "TY"
    } else {
      if (!record) throw new Error("Missing RIS record start")
      if (field) {
        tag = field[1]!
        const previous = record[tag]
        const value = field[2]!
        if (Array.isArray(previous)) previous.push(value)
        else record[tag] = previous ? [previous, value] : value
      } else if (!/^[A-Z][A-Z0-9][ \t]+-$/.test(line)) {
        const previous = record[tag]!
        if (Array.isArray(previous)) previous[previous.length - 1] += " " + line
        else record[tag] = previous + " " + line
      }
    }
  }
  if (record) throw new Error("Missing RIS record end")
  return records.map((fields, index) => {
    const entry = plugins.input.data(fields, "@ris/record")
    const reference = entry.type
      ? entry
      : plugins.input.data({ ...fields, TY: "GEN" }, "@ris/record")
    return { ...reference, id: reference.id ?? `ris-${index + 1}` }
  })
}

export function formatRis(entries: CSL[]) {
  // Use the plugin's field mapping without its fixed-width wrapping, which can split URLs.
  const records = plugins.output.format("ris", entries, { format: "object" })
  return (
    records
      .map(({ TY, ...fields }) =>
        [
          `TY  - ${TY ?? "GEN"}`,
          ...Object.entries(fields).flatMap(([key, values]) =>
            [values]
              .flat()
              .map((value) => `${key}  - ${value.replace(/\r\n?|\n/g, " ")}`)
          ),
          "ER  -",
        ].join("\r\n")
      )
      .join("\r\n\r\n") + "\r\n"
  )
}
