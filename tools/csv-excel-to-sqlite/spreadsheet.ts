import Papa from "papaparse"
import { read, utils } from "xlsx"
import type { Cell, Rows } from "./types"

const excelName = /\.(xlsx|xls)$/i

export function readSpreadsheet(bytes: Uint8Array, name: string) {
  if (excelName.test(name)) {
    // SheetJS otherwise treats arbitrary text as a valid one-cell workbook.
    const signature = new DataView(
      bytes.buffer,
      bytes.byteOffset,
      bytes.byteLength
    )
    const biff = bytes[0] === 0x09 && bytes[1]! <= 8
    if (
      bytes.length < 4 ||
      (!biff && ![0x504b0304, 0xd0cf11e0].includes(signature.getUint32(0)))
    ) {
      throw new Error("Invalid Excel workbook")
    }
    const book = read(bytes, {
      dense: true,
      cellDates: true,
      sheetStubs: true,
      UTC: true,
    })
    return book.SheetNames.map((label) => {
      const sheet = book.Sheets[label]!
      const startColumn = utils.decode_range(sheet["!ref"] ?? "A1").s.c
      const rows: Rows = []
      sheet["!data"]?.forEach((source) => {
        const row: Cell[] = []
        source.forEach((cell, index) => {
          if (cell.t === "z" && !cell.f) return
          row[index - startColumn] =
            cell.t === "e"
              ? utils.format_cell(cell)
              : normalizeCell(cell.v ?? null)
        })
        if (row.length) rows.push(row)
      })
      return { label, csv: false, rows }
    })
  }

  if (!/\.csv$/i.test(name)) throw new Error("Unsupported file")
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  const text = new TextDecoder(encoding, { fatal: true }).decode(bytes)
  const directive = /^sep=([,;\t|])(?:\r\n|\r|\n)/i.exec(text)
  const parsed = Papa.parse<string[]>(
    directive ? text.slice(directive[0].length) : text,
    {
      delimiter: directive?.[1] ?? "",
      delimitersToGuess: [",", ";", "\t", "|"],
      skipEmptyLines: true,
    }
  )
  if (
    text.includes("\0") ||
    parsed.errors.some((error) => error.type === "Quotes")
  ) {
    throw new Error("Invalid CSV")
  }
  const rows: Rows = parsed.data.map((row) => row.map(normalizeCell))
  return [{ label: name.slice(0, -4), csv: true, rows }]
}

function normalizeCell(value: Cell | boolean | Date): Cell {
  if (value === "") return null
  if (typeof value === "boolean") return Number(value)
  if (value instanceof Date) return value.toJSON()
  return value
}
