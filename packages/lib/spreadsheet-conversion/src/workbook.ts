import { utils, write } from "xlsx"
import type { CellObject, WorkBook } from "xlsx"
import type { Failure, Loaded } from "./types"

export function failure(reason: unknown): Failure {
  const message = reason instanceof Error ? reason.message : String(reason)
  if (/password|encrypt|protected/i.test(message)) return "protected"
  if (/unsupported/i.test(message)) return "unsupported"
  if (/memory|allocation|array buffer|array length|too large/i.test(message))
    return "resource"
  return "invalid"
}

export function describe(book: WorkBook): Loaded {
  if (!book.SheetNames.length) throw new Error("invalid")
  let missingCaches = 0
  const sheets = book.SheetNames.map((name, index) => {
    const sheet = book.Sheets[name]!
    if (sheet["!type"] && sheet["!type"] !== "sheet")
      throw new Error("unsupported")
    for (const [address, cell] of Object.entries(sheet)) {
      if (address.startsWith("!")) continue
      if (
        cell.f &&
        (cell.v == null || (cell.t === "n" && Number.isNaN(cell.v)))
      ) {
        // A missing cached result is not zero or an invalid numeric <v>NaN</v>.
        cell.t = "n"
        delete cell.v
        delete cell.w
        missingCaches++
      }
    }
    const range = sheet["!ref"] ?? null
    const bounds = range
      ? utils.decode_range(range)
      : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } }
    return {
      name,
      range,
      start: bounds.s,
      end: bounds.e,
      hidden: book.Workbook?.Sheets?.[index]?.Hidden ?? 0,
    }
  })
  return { sheets, missingCaches }
}

function writerBook(book: WorkBook): WorkBook {
  const sheets = Object.fromEntries(
    book.SheetNames.map((name) => {
      const sheet = book.Sheets[name]!
      // Sparse numeric rows let the writer skip absent rows and trailing cells.
      const rows: CellObject[][] = []
      for (const [address, cell] of Object.entries(sheet)) {
        if (address.startsWith("!")) continue
        const { r, c } = utils.decode_cell(address)
        rows[r] ??= []
        rows[r]![c] = cell
      }
      return [name, { ...sheet, "!data": rows }]
    })
  )
  return { ...book, Sheets: sheets }
}

export function writeXlsx(book: WorkBook): ArrayBuffer {
  return Uint8Array.from(
    write(writerBook(book), {
      type: "buffer",
      bookType: "xlsx",
      compression: true,
      cellStyles: true,
    }) as Uint8Array
  ).buffer
}
