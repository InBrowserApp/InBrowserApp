import { utils } from "xlsx"
import type { WorkBook } from "xlsx"
import type { Cell, Preview } from "./types"

export function preview(
  book: WorkBook,
  sheet: number,
  row: number,
  column: number
): Preview {
  const name = book.SheetNames[sheet]
  if (name === undefined) throw new Error("invalid")
  const data = book.Sheets[name]!
  const bounds = utils.decode_range(data["!ref"] ?? "A1")
  const r = Math.max(bounds.s.r, Math.min(bounds.e.r, Math.trunc(row) || 0))
  const c = Math.max(bounds.s.c, Math.min(bounds.e.c, Math.trunc(column) || 0))
  const end = {
    r: Math.min(bounds.e.r, r + 19),
    c: Math.min(bounds.e.c, c + 7),
  }
  const rows: Preview["rows"] = []
  if (data["!ref"])
    for (let y = r; y <= end.r; y++) {
      const cells: Cell[] = []
      for (let x = c; x <= end.c; x++) {
        const address = utils.encode_cell({ r: y, c: x })
        const value = data[address]
        cells.push({
          address,
          text: value ? utils.format_cell(value) : "",
          raw: value?.v == null ? "" : String(value.v),
          formula: value?.f,
          format: value?.z === undefined ? undefined : String(value.z),
          missingCache: Boolean(value?.f && value.v == null),
        })
      }
      rows.push({ number: y + 1, cells })
    }
  return {
    sheet,
    row: r,
    column: c,
    range: utils.encode_range({ s: { r, c }, e: end }),
    columns: Array.from({ length: end.c - c + 1 }, (_, i) =>
      utils.encode_col(c + i)
    ),
    rows,
  }
}
