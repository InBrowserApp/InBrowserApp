import { describe, expect, test } from "vitest"
import NUMBERS from "xlsx/dist/xlsx.zahl.mjs"
import { read, write, utils } from "xlsx"
import type { BookType } from "xlsx"
import { normalizeSpreadsheet } from "./normalize"
import { defaultImportOptions } from "../formats"

const data = (value: string) => new TextEncoder().encode(value).buffer
const open = (
  source: ArrayBuffer,
  name: string,
  options = defaultImportOptions
) => {
  const normalized = normalizeSpreadsheet(source, name, options)
  return {
    ...normalized,
    book: read(normalized.data, {
      type: "array",
      cellFormula: true,
      sheetStubs: true,
    }),
  }
}

test("preserves CSV identifiers, date-like text, quoting, empty cells, and multiline fields", () => {
  const result = open(
    data(
      'id,value,note\r\n000012,12345678901234567890,"A,B"\r\n03/04/05,,"two\nlines"\r\n'
    ),
    "accounts.csv"
  )
  expect(
    utils.sheet_to_json(result.book.Sheets.Sheet1!, { header: 1 })
  ).toEqual([
    ["id", "value", "note"],
    ["000012", "12345678901234567890", "A,B"],
    ["03/04/05", "", "two\nlines"],
  ])
  expect(result.book.Sheets.Sheet1!.A2.t).toBe("s")
  expect(result.notices).toEqual([])
})

test("treats formula-looking delimited values as literal text and retains uneven rows", () => {
  const result = open(data("=1+1\t@SUM(A1)\nextra\n\tlast\t"), "test.tsv")
  expect(result.book.Sheets.Sheet1!.A1).toMatchObject({ t: "s", v: "=1+1" })
  expect(result.book.Sheets.Sheet1!.A1.f).toBeUndefined()
  expect(result.book.Sheets.Sheet1!.C3.v).toBe("")
  expect(result.notices).toContain("unevenRows")
})

test("uses delimiter overrides and Excel separator hints without coercing values", () => {
  expect(
    open(data("sep=;\n001;002"), "data.csv").book.Sheets.Sheet1!.B1.v
  ).toBe("002")
  expect(
    open(data("001|002"), "data.csv", { delimiter: "|", encoding: "auto" }).book
      .Sheets.Sheet1!.B1.v
  ).toBe("002")
  expect(open(data("only text"), "data.csv").book.Sheets.Sheet1!.A1.v).toBe(
    "only text"
  )
})

test("decodes BOM-marked UTF-16 and supports correcting legacy encodings", () => {
  const le = Uint8Array.from([255, 254, 65, 0, 9, 0, 66, 0]).buffer
  const be = Uint8Array.from([254, 255, 0, 65, 0, 9, 0, 66]).buffer
  expect(open(le, "data.tsv").book.Sheets.Sheet1!.B1.v).toBe("B")
  expect(open(be, "data.tsv").book.Sheets.Sheet1!.B1.v).toBe("B")
  const legacy = Uint8Array.from([99, 97, 102, 233]).buffer
  const result = open(legacy, "cafe.csv")
  expect(result.book.Sheets.Sheet1!.A1.v).toBe("café")
  expect(result.notices).toContain("encodingFallback")
  expect(
    open(legacy, "cafe.csv", { encoding: "windows-1252", delimiter: "auto" })
      .notices
  ).toEqual([])
})

test("reports malformed quotes and rejects binary data disguised as text", () => {
  expect(() => open(data('a,"unterminated'), "bad.csv")).toThrow(
    "DELIMITED_INVALID"
  )
  expect(() => open(data("a\0b"), "bad.tsv")).toThrow("INVALID")
  expect(() => open(data("not a workbook"), "bad.xls")).toThrow("INVALID")
  expect(() => open(new ArrayBuffer(0), "empty.csv")).toThrow("INVALID")
})

describe("real serialized spreadsheet formats", () => {
  test.each<[BookType | "wk1" | "wk3", string]>([
    ["biff8", "xls"],
    ["xlsb", "xlsb"],
    ["ods", "ods"],
    ["fods", "fods"],
    ["dif", "dif"],
    ["sylk", "slk"],
    ["prn", "prn"],
    ["dbf", "dbf"],
    ["wk1", "wk1"],
    ["wk3", "wk3"],
    ["eth", "eth"],
  ])("reads %s file content", (bookType, extension) => {
    const book = utils.book_new()
    utils.book_append_sheet(
      book,
      utils.aoa_to_sheet([
        ["Name", "Amount"],
        ["Reading sample", 42],
      ]),
      "Sales"
    )
    const source = write(book, {
      type: "array",
      bookType: bookType as BookType,
    })
    const result = open(source, `sample.${extension}`)
    const rows = utils.sheet_to_json(result.book.Sheets.Sheet1!, { header: 1 })
    expect(rows.flat()).toContain("Amount")
    expect(rows.flat().some((value) => String(value).includes("42"))).toBe(true)
    expect(result.notices).toEqual(["dataOnly"])
  })
})

test("retains sheet order, original names, hidden flags, merges, dates, and saved formulas", () => {
  const book = utils.book_new()
  const sheet = utils.aoa_to_sheet([["Heading"], [45123, 4]])
  sheet.A2!.z = "yyyy-mm-dd"
  sheet.B2!.f = "2+2"
  sheet.C2 = { t: "n", f: "1+2" }
  sheet["!ref"] = "A1:C2"
  sheet["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 2 } }]
  utils.book_append_sheet(book, sheet, "Financial report")
  utils.book_append_sheet(book, utils.aoa_to_sheet([["Secret"]]), "Hidden")
  book.Workbook = {
    Sheets: [
      { name: "Financial report", Hidden: 0 },
      { name: "Hidden", Hidden: 1 },
    ],
  }
  const result = open(
    write(book, { bookType: "xlsx", type: "array" }),
    "report.xlsx"
  )
  expect(result.names).toEqual(["Financial report", "Hidden"])
  expect(result.book.Sheets.Sheet1!["!merges"]).toEqual(sheet["!merges"])
  expect(result.book.Sheets.Sheet1!.A2.w).toBe("2023-07-16")
  expect(result.book.Sheets.Sheet1!.B2).toMatchObject({ v: 4, f: "2+2" })
  expect(result.book.Workbook!.Sheets![1]!.Hidden).toBe(1)
  expect(result.book.Sheets.Sheet1!.C2).toMatchObject({ f: "1+2" })
  expect(result.book.Sheets.Sheet1!.C2.v).toBeUndefined()
})

test("opens a real serialized Numbers archive and retains its table values", () => {
  const book = utils.book_new()
  utils.book_append_sheet(
    book,
    utils.aoa_to_sheet([["First", "00123"]]),
    "Report"
  )
  utils.book_append_sheet(book, utils.aoa_to_sheet([["Second", 42]]), "More")
  const result = open(
    write(book, { type: "array", bookType: "numbers", numbers: NUMBERS }),
    "report.numbers"
  )
  expect(result.names).toEqual(["Report", "More"])
  expect(result.book.Sheets.Sheet1!.B1.v).toBe("00123")
  expect(result.book.Sheets.Sheet2!.B1.v).toBe(42)
  expect(result.notices).toEqual(["dataOnly", "numbersTables"])
})
