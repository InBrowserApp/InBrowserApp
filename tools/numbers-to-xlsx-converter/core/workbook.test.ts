import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { read, utils, write } from "xlsx"
import type { WorkBook } from "xlsx"
import { unzipSync, zipSync, strFromU8 } from "fflate"
import { preview, writeXlsx } from "@workspace/spreadsheet-conversion"
import { prepare, readNumbers, worksheetName } from "./workbook"

const fixture = (name = "typed") =>
  new Uint8Array(
    readFileSync(`tools/numbers-to-xlsx-converter/fixtures/${name}.numbers`)
  )
const simple = (): WorkBook => ({
  SheetNames: ["Data"],
  Sheets: {
    Data: {
      "!numbers": { sheet: "Sheet", table: "Data" },
      "!ref": "A1",
      A1: { t: "n", v: 1 },
    },
  },
})

test("maps all source tables to unique valid Excel names and retains typed values", () => {
  const book = readNumbers(fixture())
  const info = prepare(book)
  expect(info.sheets.map((s) => s.source)).toEqual([
    { sheet: "数据 / العربية: [2026]?", table: "Budget" },
    { sheet: "数据 / العربية: [2026]?", table: "Budget / Q4" },
    { sheet: "Empty", table: "No data" },
    {
      sheet: "A very long worksheet name that exceeds Excel limits",
      table: "Repeated",
    },
  ])
  expect(book.SheetNames).toHaveLength(4)
  expect(book.SheetNames[1]).toMatch(/ \(2\)$/)
  for (const name of book.SheetNames) {
    expect(name.length).toBeLessThanOrEqual(31)
    expect(name.trim()).toBe(name)
    expect(name).not.toMatch(/[\\/:*?[\]]/)
  }
  const out = read(writeXlsx(book), { cellDates: true })
  const cells = out.Sheets[out.SheetNames[0]!]!
  expect(cells.A1).toMatchObject({ t: "s", v: "00123" })
  expect(cells.B1).toMatchObject({ t: "n", v: 123.75 })
  expect(cells.A2).toMatchObject({ t: "b", v: true })
  expect(cells.B2.v.toISOString()).toBe("2026-10-10T12:30:00.000Z")
  expect(cells.B3.v).toBe("中文 🚀 العربية")
  expect(cells.A3).toMatchObject({ t: "s", v: "=literal" })
  expect(cells.A3.f).toBeUndefined()
  expect(cells.A4.v).toBeCloseTo(26.5 / 24)
  expect(cells["!merges"]).toEqual([{ s: { r: 4, c: 0 }, e: { r: 4, c: 1 } }])
  expect(out.Sheets[out.SheetNames[1]!]!.A1.v).toBe("second table")
  expect(out.Sheets[out.SheetNames[3]!]!.A1.v).toBe("last")
  expect(preview(book, 0, 1, 1).rows[0]!.cells[0]!.text).toBe(
    "2026-10-10 12:30:00"
  )
})

test("normalizes names without broken surrogate pairs or case-insensitive collisions", () => {
  const used = new Set<string>()
  expect(worksheetName(" 'Data' ", used)).toBe("Data")
  expect(worksheetName("data", used)).toBe("data (2)")
  expect(worksheetName("DATA", used)).toBe("DATA (3)")
  expect(worksheetName("x".repeat(30) + "'y", used)).toBe("x".repeat(30))
  expect(worksheetName("", used)).toBe("Table")
  expect(worksheetName("🚀".repeat(20), used)).toBe("🚀".repeat(15))
  expect(worksheetName("bad/:*?[]\\\u0000", used)).toBe("bad________")
})

test("keeps rows across tile boundaries and rejects an incomplete source index", () => {
  const book = readNumbers(fixture("multi-tile"))
  prepare(book)
  const sheet = book.Sheets[book.SheetNames[0]!]!
  expect(sheet.A256.v).toBe(255)
  expect(sheet.A257.v).toBe(256)
  expect(sheet.B300.v).toBe("行 299")
  const output = read(writeXlsx(book))
  expect(output.Sheets[output.SheetNames[0]!]!.A300.v).toBe(299)
  expect(() => readNumbers(fixture("partial-tile"))).toThrow(
    "incomplete row tile index"
  )
})

test("exports more than a thousand tables without a product count limit", () => {
  const book: WorkBook = { SheetNames: [], Sheets: {} }
  for (let i = 0; i < 1001; i++) {
    const name = `Table${i}`
    book.SheetNames.push(name)
    book.Sheets[name] = {
      "!numbers": { sheet: "All", table: name },
      "!ref": "A1",
      A1: { t: "n", v: i },
    }
  }
  prepare(book)
  const out = read(writeXlsx(book))
  expect(out.SheetNames).toHaveLength(1001)
  expect(out.Sheets[out.SheetNames[1000]!]!.A1.v).toBe(1000)
}, 20000)

test("writes saved values, generic errors and blanks without formulas or active links", () => {
  const book = simple(),
    sheet = book.Sheets.Data!
  sheet["!ref"] = "A1:C1"
  sheet.A1 = {
    t: "n",
    v: 3,
    f: "1+2",
    F: "A1",
    l: { Target: "https://example.test/track" },
    c: [{ a: "A", t: "note" }],
  }
  sheet.B1 = { t: "e", v: 0 }
  sheet.C1 = { t: "z", f: "UNKNOWN()" }
  prepare(book)
  const xml = strFromU8(
    unzipSync(new Uint8Array(writeXlsx(book)))["xl/worksheets/sheet1.xml"]!
  )
  expect(xml).not.toMatch(/<f>|hyperlink|UNKNOWN|example\.test/)
  expect(xml).toContain("#VALUE!")
  expect(xml).toContain("<v>3</v>")
})

test("rejects non-Numbers, protected, damaged and partially readable archives", () => {
  expect(() => readNumbers(new Uint8Array())).toThrow("unsupported")
  expect(() => readNumbers(new Uint8Array([0x50, 0x4b, 0]))).toThrow(Error)
  expect(() => readNumbers(fixture("protected"))).toThrow("protected")
  const zip = unzipSync(fixture())
  const modern = utils.book_new()
  utils.book_append_sheet(modern, utils.aoa_to_sheet([[1]]), "Data")
  const disguised = {
    ...unzipSync(
      new Uint8Array(write(modern, { type: "array", bookType: "ods" }))
    ),
    "Index/Document.iwa": zip["Index/Document.iwa"]!,
  }
  expect(() => readNumbers(zipSync(disguised))).toThrow("unsupported")
  for (const contents of [
    new Uint8Array([1]),
    new Uint8Array([0, 2, 0, 0, 255, 255]),
    new Uint8Array([0, 3, 0, 0, 1, 0, 255]),
  ]) {
    const damaged = zipSync({ ...zip, "Index/Extra.iwa": contents })
    expect(() => readNumbers(damaged)).toThrow(Error)
  }
  const wrong = { ...zip }
  delete wrong["Index/Document.iwa"]
  expect(() => readNumbers(zipSync(wrong))).toThrow("unsupported")
})

test("rejects absent mapping metadata and genuine XLSX format overflows", () => {
  for (const kind of [
    "metadata",
    "rows",
    "columns",
    "text",
    "number",
  ] as const) {
    const book = simple(),
      sheet = book.Sheets.Data!
    if (kind === "metadata") delete sheet["!numbers"]
    if (kind === "rows") sheet["!ref"] = "A1048577"
    if (kind === "columns") sheet["!ref"] = "XFE1"
    if (kind === "text") sheet.A1 = { t: "s", v: "x".repeat(32768) }
    if (kind === "number") sheet.A1 = { t: "n", v: NaN }
    expect(() => prepare(book)).toThrow("unsupported")
  }
  const empty = simple()
  delete empty.Sheets.Data!["!ref"]
  prepare(empty)
})
