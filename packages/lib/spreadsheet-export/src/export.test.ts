import { expect, test } from "vitest"
import { readFileSync } from "node:fs"
import { utils, write } from "xlsx"
import type { WorkSheet } from "xlsx"
import { zipSync, unzipSync, strToU8, strFromU8 } from "fflate"
import Papa from "papaparse"
import { marked } from "marked"
import { readWorkbook } from "./read-workbook"
import { exportWorksheet } from "./export-worksheet"
import { cellValue, markdownCell } from "./values"
import { parseRange, rangeAddress } from "./range"
import { failure } from "./errors"
import type { Options } from "./types"

const defaults: Options = {
  sheet: 0,
  range: "",
  format: "json",
  values: "raw",
  firstRowHeader: true,
}
function fixture() {
  const sheet: WorkSheet = {
    A1: { t: "s", v: "ID" },
    B1: { t: "s", v: "ID" },
    C1: { t: "s", v: "" },
    A2: { t: "s", v: "00123" },
    B2: { t: "n", v: 123, z: "00000" },
    C2: { t: "n", v: 45292, z: "yyyy-mm-dd" },
    D2: { t: "n", f: "SUM(1,2)", v: 3 },
    E2: { t: "n", f: "SUM(2,3)" },
    F2: { t: "e", v: 7 },
    G2: { t: "b", v: false },
    A4: { t: "s", v: '中文, "quotes"\nnext\tcolumn' },
    B4: { t: "s", v: "=1+1" },
    C4: {
      t: "s",
      v: "<script>alert(1)</script> **bold** [x](https://example.com) a|b `code` www.example.com x@example.com",
    },
    D4: { t: "s", v: "  spaced  " },
    E4: { t: "s", v: "\r\nline\rnext" },
    "!ref": "A1:G10",
    "!rows": [{}, { hidden: true }],
    "!cols": [{ hidden: true }],
    "!merges": [utils.decode_range("A1:B1")],
  }
  const book = utils.book_new()
  utils.book_append_sheet(book, sheet, "Résumé 中文")
  utils.book_append_sheet(book, {}, "Empty")
  book.Workbook = {
    Sheets: [
      { name: "Résumé 中文", Hidden: 0 },
      { name: "Empty", Hidden: 2 },
    ],
  }
  return new Uint8Array(write(book, { type: "array", bookType: "xlsx" }))
}
async function load(bytes = fixture()) {
  return readWorkbook({
    file: new File([bytes as Uint8Array<ArrayBuffer>], "report.v2.xlsx"),
  })
}
const signal = () => new AbortController().signal

test("reads an independently authored workbook through its last saved row", async () => {
  const bytes = readFileSync(
    "tools/spreadsheet-data-export/fixtures/structured.xlsx"
  )
  const book = await load(bytes)
  expect(book.sheets.map((sheet) => [sheet.name, sheet.hidden])).toEqual([
    ["Résumé 中文", false],
    ["Hidden 空", true],
    ["Empty", false],
  ])
  const output = await exportWorksheet(book, defaults, signal())
  const rows = JSON.parse(output.text)
  expect(rows[1]).toEqual(["00123", 123, 45292, 3, null, "#DIV/0!", false])
  expect(rows[3][4]).toBe("\nline\rnext")
  expect(rows[3].slice(5)).toEqual(["Merged anchor", null])
  expect(rows[1000][0]).toBe("Last row 1001")
  expect(output.missingCached).toBe(1)
})

test("keeps 1904-system dates as serial numbers while formatting their display date", async () => {
  const book = utils.book_new()
  utils.book_append_sheet(
    book,
    { A1: { t: "n", v: 43830, z: "yyyy-mm-dd" }, "!ref": "A1" },
    "Dates"
  )
  book.Workbook = { WBProps: { date1904: true } }
  const loaded = await load(
    new Uint8Array(write(book, { type: "array", bookType: "xlsx" }))
  )
  expect(
    JSON.parse((await exportWorksheet(loaded, defaults, signal())).text)
  ).toEqual([[43830]])
  expect(
    JSON.parse(
      (
        await exportWorksheet(
          loaded,
          { ...defaults, values: "formatted" },
          signal()
        )
      ).text
    )
  ).toEqual([["2024-01-01"]])
})

test("keeps original sheet names, hidden state, actual data bounds and typed cached values", async () => {
  const book = await load()
  expect(book.sheets).toEqual([
    { name: "Résumé 中文", hidden: false, range: "A1:G4" },
    { name: "Empty", hidden: true, range: "" },
  ])
  const result = await exportWorksheet(book, defaults, signal())
  expect(result).toMatchObject({
    rows: 4,
    columns: 7,
    missingCached: 1,
    empty: false,
    filename: "report.v2-Résumé 中文.json",
    mime: "application/json;charset=utf-8",
  })
  const rows = JSON.parse(result.text)
  expect(rows[0]).toEqual(["ID", "ID", "", null, null, null, null])
  expect(rows[1]).toEqual(["00123", 123, 45292, 3, null, "#DIV/0!", false])
  expect(rows[2]).toEqual(Array(7).fill(null))
  expect(rows[3][1]).toBe("=1+1")
})

test.each(["csv", "tsv"] as const)(
  "%s round-trips separators, quotes, line breaks, Unicode and internal blank rows with an independent parser",
  async (format) => {
    const book = await load()
    book.book.Sheets["Résumé 中文"]!.E4.v = "\r\nline\rnext"
    const result = await exportWorksheet(
      book,
      { ...defaults, format, values: "formatted" },
      signal()
    )
    const rows = Papa.parse<string[]>(result.text, {
      delimiter: format === "csv" ? "," : "\t",
      newline: "\r\n",
    }).data
    expect(rows[1]).toEqual([
      "00123",
      "00123",
      "2024-01-01",
      "3",
      "",
      "#DIV/0!",
      "FALSE",
    ])
    expect(rows[2]).toEqual(Array(7).fill(""))
    expect(rows[3]![0]).toBe('中文, "quotes"\nnext\tcolumn')
    expect(rows[3]![3]).toBe("  spaced  ")
    expect(rows[3]![4]).toBe("\r\nline\rnext")
    expect(rows.at(-1)).toEqual([""])
    expect(result.text.charCodeAt(0)).not.toBe(0xfeff)
  }
)

test("explicit ranges preserve blank borders; empty sheets have useful downloadable output", async () => {
  const book = await load()
  const result = await exportWorksheet(
    book,
    { ...defaults, range: "$b$2:$c$5" },
    signal()
  )
  expect(JSON.parse(result.text)).toEqual([
    [123, 45292],
    [null, null],
    ["=1+1", book.book.Sheets["Résumé 中文"]!.C4.v],
    [null, null],
  ])
  for (const format of ["csv", "tsv", "markdown", "json"] as const) {
    const empty = await exportWorksheet(
      book,
      { ...defaults, format, sheet: 1 },
      signal()
    )
    expect(empty).toMatchObject({
      text: format === "json" ? "[]" : "",
      rows: 0,
      columns: 0,
      empty: true,
    })
  }
  expect(
    JSON.parse(
      (
        await exportWorksheet(
          book,
          { ...defaults, sheet: 1, range: "B3:C4" },
          signal()
        )
      ).text
    )
  ).toEqual([
    [null, null],
    [null, null],
  ])
  await expect(
    exportWorksheet(book, { ...defaults, sheet: 2 }, signal())
  ).rejects.toThrow("invalid")
})

test.each([true, false])(
  "Markdown preserves literal cell content without scripts, markup or auto-links (header %s)",
  async (firstRowHeader) => {
    const result = await exportWorksheet(
      await load(),
      { ...defaults, format: "markdown", firstRowHeader },
      signal()
    )
    const element = document.createElement("div")
    element.innerHTML = await marked(result.text)
    expect(element.querySelector("script, a, strong, code")).toBeNull()
    expect(element.querySelectorAll("table")).toHaveLength(1)
    expect(element.querySelectorAll("tbody tr")).toHaveLength(
      firstRowHeader ? 3 : 4
    )
    expect(element.textContent).toContain(
      "<script>alert(1)</script> **bold** [x](https://example.com) a|b `code` www.example.com x@example.com"
    )
    expect(element.textContent).toContain("  spaced  ")
    expect(element.querySelectorAll("br").length).toBeGreaterThan(1)
    expect(markdownCell("_\\~ [ ] < > & @")).not.toContain("<")
  }
)

test("uses actual saved cells outside an understated dimension and ignores formatting-only cells", async () => {
  const parts = unzipSync(fixture())
  parts["xl/worksheets/sheet1.xml"] = strToU8(
    strFromU8(parts["xl/worksheets/sheet1.xml"]!)
      .replace('ref="A1:G10"', 'ref="A1:A1"')
      .replace(
        "</sheetData>",
        '<row r="20"><c r="Z20" s="1"/></row></sheetData>'
      )
  )
  const book = await load(zipSync(parts))
  expect(book.sheets[0]!.range).toBe("A1:G4")
  expect(
    JSON.parse((await exportWorksheet(book, defaults, signal())).text)[3][1]
  ).toBe("=1+1")
})

test("validates archives and rejects unsupported, encrypted and damaged input", async () => {
  for (const bytes of [
    strToU8("not a workbook"),
    strToU8("PKbad"),
    zipSync({ "[Content_Types].xml": strToU8("x") }),
    zipSync({
      "[Content_Types].xml": strToU8("bad"),
      "xl/workbook.xml": strToU8("bad"),
    }),
  ])
    await expect(load(bytes)).rejects.toThrow(/./)
  await expect(load(new Uint8Array([0xd0, 0xcf, 0, 0]))).rejects.toThrow(
    "protected"
  )
})

test("supports imported original names and safe Unicode download names", async () => {
  const book = await readWorkbook({
    file: new File([fixture() as Uint8Array<ArrayBuffer>], "source.csv"),
    names: ["Data/中文:2026\n"],
  })
  expect(book.sheets[0]!.name).toBe("Data/中文:2026\n")
  expect((await exportWorksheet(book, defaults, signal())).filename).toBe(
    "source-Data_中文_2026_.json"
  )
})

test("cancels expensive ranges cooperatively without imposing row or file quotas", async () => {
  const book = await load()
  const controller = new AbortController()
  const pending = exportWorksheet(
    book,
    { ...defaults, range: "A1:A1048576" },
    controller.signal
  )
  controller.abort()
  await expect(pending).rejects.toThrow("aborted")
  const rows = await exportWorksheet(
    book,
    { ...defaults, range: "A1:A1001" },
    signal()
  )
  expect(JSON.parse(rows.text)).toHaveLength(1001)
  await expect(
    exportWorksheet(book, defaults, controller.signal)
  ).rejects.toThrow("aborted")
})

test("validates Excel coordinate bounds, not arbitrary product quotas", () => {
  expect(parseRange(" ")).toBeNull()
  expect(rangeAddress(parseRange("$xfd$1048576")!)).toBe(
    "XFD1048576:XFD1048576"
  )
  for (const value of [
    "A0",
    "XFE1",
    "A1048577",
    "A1:B2:C3",
    "B2:A1",
    "A2:A1",
    "A",
    "A01",
    "A1: ",
    "Sheet!A1",
  ])
    expect(() => parseRange(value)).toThrow("invalidRange")
})

test("preserves cell errors and typed values, and classifies real failures", () => {
  expect(cellValue(undefined, "raw")).toBeNull()
  expect(cellValue({ t: "z", v: "" }, "raw")).toBeNull()
  expect(cellValue({ t: "e", v: 7 }, "raw")).toBe("#DIV/0!")
  expect(cellValue({ t: "e", v: 99 }, "raw")).toBe("99")
  expect(cellValue({ t: "n", v: 3 }, "formatted")).toBe("3")
  expect(cellValue({ t: "n", v: Infinity }, "raw")).toBe("Infinity")
  expect(cellValue({ t: "s", v: "text" }, "raw")).toBe("text")
  expect(cellValue({ t: "d", v: "date" }, "raw")).toBe("date")
  for (const [reason, expected] of [
    [null, "invalid"],
    [new RangeError(), "resource"],
    [new Error("array buffer allocation"), "resource"],
    [new Error("password"), "protected"],
    [new Error("fetch worker"), "engineUnavailable"],
    [new Error("other"), "invalid"],
    [new Error("invalidRange"), "invalidRange"],
  ])
    expect(failure(reason)).toBe(expected)
})
