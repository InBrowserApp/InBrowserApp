import Papa from "papaparse"
import { utils } from "xlsx"
import { describe } from "@workspace/spreadsheet-conversion"
import type { ImportOptions } from "../options"

export function readDelimited(
  bytes: Uint8Array,
  name: string,
  options: ImportOptions
) {
  let encoding = options.encoding
  if (encoding === "auto") {
    encoding =
      bytes[0] === 0xff && bytes[1] === 0xfe
        ? "utf-16le"
        : bytes[0] === 0xfe && bytes[1] === 0xff
          ? "utf-16be"
          : "utf-8"
  }
  let text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  if (
    !text ||
    // Reject binary/XML-forbidden controls instead of exporting visible escape codes.
    // oxlint-disable-next-line no-control-regex
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\ufffe\uffff]/.test(text)
  )
    throw new Error("invalid")
  const separator = /^sep=([,;\t|])(?:\r\n|\r|\n)/i.exec(text)
  const directive =
    separator &&
    (options.delimiter === "auto" || options.delimiter === separator[1])
  const delimiter =
    options.delimiter === "auto"
      ? (separator?.[1] ?? (/\.tsv$/i.test(name) ? "\t" : ""))
      : options.delimiter
  if (directive) text = text.slice(separator[0].length)
  if (!text) throw new Error("invalid")
  const result = Papa.parse<string[]>(text, {
    delimiter,
    delimitersToGuess: [",", "\t", ";", "|"],
    header: false,
    dynamicTyping: false,
    skipEmptyLines: false,
  })
  if (result.errors.some((error) => error.type === "Quotes"))
    throw new Error("invalid")
  const rows = result.data
  // One final line ending terminates a record. Other blank records remain.
  if (
    /[\r\n]$/.test(text) &&
    rows.at(-1)?.length === 1 &&
    rows.at(-1)?.[0] === ""
  )
    rows.pop()
  if (rows.length > 1_048_576) throw new Error("unsupported")
  for (const row of rows) {
    if (row.length > 16_384 || row.some((cell) => cell.length > 32_767))
      throw new Error("unsupported")
  }
  const sheet = utils.aoa_to_sheet(rows)
  // CSV has no type information: preserve identifiers and formula-like text.
  for (const [address, cell] of Object.entries(sheet)) {
    if (!address.startsWith("!")) cell.z = "@"
  }
  if (options.header && sheet["!ref"])
    sheet["!autofilter"] = { ref: sheet["!ref"] }
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, "Sheet1")
  return { book, info: describe(book) }
}
