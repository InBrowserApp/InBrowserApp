import { unzipSync } from "fflate"
import { read } from "xlsx"
import type { WorkBook, WorkSheet, CellObject } from "xlsx"
import { parseRange, rangeAddress } from "./range"
import type { Range } from "./range"
import type { Sheet, Source } from "./types"

export type Workbook = { book: WorkBook; sheets: Sheet[]; filename: string }

export function saved(cell: CellObject | undefined): boolean {
  return Boolean(
    cell && (typeof cell.f === "string" || (cell.t !== "z" && cell.v != null))
  )
}

function dataRange(sheet: WorkSheet): string {
  let range: Range | null = null
  for (const [address, cell] of Object.entries(sheet)) {
    if (address.startsWith("!") || !saved(cell)) continue
    const position = parseRange(address)!.s
    if (!range) range = { s: { ...position }, e: { ...position } }
    else {
      range.s.r = Math.min(range.s.r, position.r)
      range.s.c = Math.min(range.s.c, position.c)
      range.e.r = Math.max(range.e.r, position.r)
      range.e.c = Math.max(range.e.c, position.c)
    }
  }
  return range ? rangeAddress(range) : ""
}

export async function readWorkbook(source: Source): Promise<Workbook> {
  const data = new Uint8Array(await source.file.arrayBuffer())
  if (data[0] === 0xd0 && data[1] === 0xcf) throw new Error("protected")
  if (data[0] !== 0x50 || data[1] !== 0x4b) throw new Error("invalid")
  const entries = new Set<string>()
  unzipSync(data, {
    filter: (entry) => {
      entries.add(entry.name)
      return false
    },
  })
  if (!entries.has("[Content_Types].xml") || !entries.has("xl/workbook.xml"))
    throw new Error("invalid")
  const book = read(data, {
    type: "array",
    cellDates: false,
    cellNF: true,
    cellText: true,
    cellFormula: true,
    cellHTML: false,
    cellStyles: false,
    sheetStubs: true,
    bookVBA: false,
    WTF: true,
  })
  if (!book.SheetNames.length) throw new Error("invalid")
  const sheets = book.SheetNames.map((name, index) => {
    const sheet = book.Sheets[name]
    if (!sheet) throw new Error("invalid")
    return {
      name: source.names?.[index] ?? name,
      hidden: Boolean(book.Workbook?.Sheets?.[index]?.Hidden),
      range: dataRange(sheet),
    }
  })
  return { book, sheets, filename: source.file.name }
}
