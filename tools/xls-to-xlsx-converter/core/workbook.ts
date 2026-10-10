import { CFB, read, set_cptable, utils, write } from "xlsx"
import type { CellObject, WorkBook } from "xlsx"
import * as cptable from "xlsx/dist/cpexcel.full.mjs"
import type { Failure, Loaded } from "../types"

set_cptable(cptable)

export function failure(reason: unknown): Failure {
  const message = reason instanceof Error ? reason.message : String(reason)
  if (/password|encrypt|protected/i.test(message)) return "protected"
  if (/unsupported/i.test(message)) return "unsupported"
  if (/memory|allocation|array buffer|array length|too large/i.test(message))
    return "resource"
  return "invalid"
}

export function assertXls(bytes: Uint8Array) {
  const compound = [0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1].every(
    (value, index) => bytes[index] === value
  )
  if (compound) {
    const archive = CFB.read(bytes, { type: "buffer" })
    if (
      CFB.find(archive, "EncryptedPackage") ||
      CFB.find(archive, "EncryptionInfo")
    )
      throw new Error("protected")
    if (!CFB.find(archive, "Workbook") && !CFB.find(archive, "Book"))
      throw new Error("invalid")
    return
  }
  // Raw BIFF 2–8 starts with a BOF record; text and renamed OOXML do not.
  if (
    bytes.length < 8 ||
    bytes[0] !== 0x09 ||
    ![0, 2, 4, 8].includes(bytes[1]!)
  )
    throw new Error("invalid")
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

export function readXls(bytes: Uint8Array) {
  assertXls(bytes)
  return read(bytes, {
    type: "array",
    cellFormula: true,
    cellNF: true,
    cellText: true,
    cellDates: false,
    cellHTML: false,
    cellStyles: true,
    sheetStubs: true,
    bookVBA: false,
    WTF: true,
    xlfn: true,
  })
}

function writerBook(book: WorkBook): WorkBook {
  const sheets = Object.fromEntries(
    book.SheetNames.map((name) => {
      const sheet = book.Sheets[name]!
      const empty: CellObject[] = []
      // Numeric row lookup avoids millions of string-key lookups for sparse XLS.
      // Empty rows share an array; only rows with stored cells allocate entries.
      const rows: CellObject[][] = Array.from(
        { length: utils.decode_range(sheet["!ref"] ?? "A1").e.r + 1 },
        () => empty
      )
      for (const [address, cell] of Object.entries(sheet)) {
        if (address.startsWith("!")) continue
        const { r, c } = utils.decode_cell(address)
        if (rows[r] === empty) rows[r] = []
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
