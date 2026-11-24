import { utils, writeFileXLSX } from "xlsx"
import type { Spreadsheet } from "./table"

export function downloadWorkbook(
  { headings, rows }: Spreadsheet,
  filename: string
) {
  const sheet = utils.aoa_to_sheet([headings, ...rows], { dense: true })
  // Empty objects and null fields still occupy a row or column in the sheet.
  sheet["!ref"] = utils.encode_range({
    s: { r: 0, c: 0 },
    e: { r: rows.length, c: headings.length - 1 },
  })
  const workbook = utils.book_new()
  utils.book_append_sheet(workbook, sheet, "Sheet1")
  writeFileXLSX(workbook, filename, { bookSST: true, compression: true })
}
