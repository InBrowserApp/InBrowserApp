import Papa from "papaparse"
import { utils } from "xlsx"
import type { ImportOptions, ImportNotice } from "../formats"

export function readDelimited(
  data: ArrayBuffer,
  name: string,
  options: ImportOptions
) {
  const bytes = new Uint8Array(data)
  const notices: ImportNotice[] = []
  let encoding = options.encoding
  if (encoding === "auto") {
    encoding =
      bytes[0] === 0xff && bytes[1] === 0xfe
        ? "utf-16le"
        : bytes[0] === 0xfe && bytes[1] === 0xff
          ? "utf-16be"
          : "utf-8"
    if (encoding === "utf-8") {
      try {
        new TextDecoder("utf-8", { fatal: true }).decode(bytes)
      } catch {
        encoding = "windows-1252"
        notices.push("encodingFallback")
      }
    }
  }
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  if (text.includes("\0")) throw new Error("INVALID")
  const separator = /^sep=(.)\r?\n/i.exec(text)
  const delimiter =
    options.delimiter === "auto"
      ? (separator?.[1] ?? (/\.tsv$/i.test(name) ? "\t" : ""))
      : options.delimiter
  const result = Papa.parse<string[]>(
    separator ? text.slice(separator[0].length) : text,
    {
      delimiter,
      dynamicTyping: false,
      skipEmptyLines: false,
    }
  )
  if (result.errors.some((error) => error.type === "Quotes"))
    throw new Error("DELIMITED_INVALID")
  const rows = result.data
  // A final line ending terminates the last record rather than creating a row.
  if (
    /(\r\n|\r|\n)$/.test(text) &&
    rows.at(-1)?.length === 1 &&
    rows.at(-1)?.[0] === ""
  )
    rows.pop()
  if (rows.some((row) => row.length !== rows[0]!.length))
    notices.push("unevenRows")
  const sheet = utils.aoa_to_sheet(rows)
  const widths: number[] = []
  for (const row of rows) {
    row.forEach((value, index) => {
      // This only bounds visual column width; all text remains inspectable.
      const longest = value
        .split(/\r?\n/)
        .reduce((max, line) => Math.max(max, line.length), 0)
      widths[index] = Math.max(widths[index] ?? 8, Math.min(48, longest + 2))
    })
  }
  sheet["!cols"] = widths.map((wch) => ({ wch }))
  return { sheet, notices }
}
