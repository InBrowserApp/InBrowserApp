import { expect, test } from "vitest"
import { read, utils } from "xlsx"
import { unzipSync, strFromU8 } from "fflate"
import { workbookArchive } from "./workbook-archive"
import type { WorkBook } from "xlsx"

function sample(): WorkBook {
  return {
    SheetNames: ["Original"],
    Sheets: {
      Original: {
        A1: { t: "s", v: "<script>&\"' _x000A_\u0001" },
        B2: { t: "n", v: 45123, z: "yyyy-mm-dd" },
        C2: { t: "n", f: "1+2" },
        D2: { t: "s", v: "cached", f: '"cached"' },
        E2: { t: "b", v: true },
        F2: { t: "b", v: false },
        G2: { t: "e", v: 7 },
        XFD1048576: { t: "s", v: "Last cell" },
        "!ref": "A1:XFD1048576",
        "!merges": [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }],
        "!cols": [{ wch: 20 }, { wpx: 140 }, { width: 12, hidden: true }, {}],
        "!rows": [{}, { hpt: 30, hidden: true }],
      },
    },
    Workbook: { Sheets: [{ name: "Original", Hidden: 2 }] },
  }
}

test("serializes sparse boundary cells without visiting the empty rectangular area", () => {
  const buffer = workbookArchive(sample())
  expect(buffer.byteLength).toBeLessThan(10_000)
  const book = read(buffer, { type: "array", cellNF: true, sheetStubs: true })
  const sheet = book.Sheets.Sheet1!
  expect(sheet.XFD1048576).toMatchObject({ v: "Last cell" })
  expect(sheet.B2).toMatchObject({ v: 45123, w: "2023-07-16" })
  expect(sheet.C2).toMatchObject({ f: "1+2" })
  expect(sheet.C2.v).toBeUndefined()
  expect(sheet.D2).toMatchObject({ f: '"cached"', v: "cached" })
  expect(sheet.E2.v).toBe(true)
  expect(sheet.F2.v).toBe(false)
  expect(sheet.G2.w).toBe("#DIV/0!")
  expect(sheet.A1.v).toBe("<script>&\"' _x000A_\u0001")
  expect(sheet["!merges"]).toHaveLength(1)
  expect(book.Workbook!.Sheets![0]!.Hidden).toBe(2)
})

test("preserves the date system and blank sheets while excluding remote links and macros", () => {
  const book = utils.book_new()
  utils.book_append_sheet(book, {}, "Empty")
  book.Workbook = { WBProps: { date1904: true } }
  const archive = unzipSync(new Uint8Array(workbookArchive(book)))
  expect(strFromU8(archive["xl/workbook.xml"]!)).toContain('date1904="1"')
  expect(strFromU8(archive["xl/worksheets/sheet1.xml"]!)).toContain(
    "<sheetData></sheetData>"
  )
  expect(Object.keys(archive).some((path) => /vba|external/i.test(path))).toBe(
    false
  )
})

test("retains non-finite legacy numeric values as spreadsheet errors", () => {
  const book = sample()
  book.Sheets.Original!.B2 = { t: "n", v: Infinity }
  book.Sheets.Original!.C2 = { t: "n", v: NaN }
  const sheet = read(workbookArchive(book), { type: "array" }).Sheets.Sheet1!
  expect(sheet.B2).toMatchObject({ t: "e", w: "#DIV/0!" })
  expect(sheet.C2).toMatchObject({ t: "e", w: "#NUM!" })
})
