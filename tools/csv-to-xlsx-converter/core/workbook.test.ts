import { readFileSync } from "node:fs"
import { expect, test } from "vitest"
import { read } from "xlsx"
import { strFromU8, unzipSync } from "fflate"
import { writeXlsx } from "@workspace/spreadsheet-conversion"
import { readDelimited } from "./workbook"
import { defaultOptions } from "../options"
import type { ImportOptions } from "../options"

const parse = (
  text: string,
  options: Partial<ImportOptions> = {},
  name = "data.csv"
) =>
  readDelimited(new TextEncoder().encode(text), name, {
    ...defaultOptions,
    ...options,
  })
const fixture = (name: string, options: Partial<ImportOptions> = {}) =>
  readDelimited(
    readFileSync(`tools/csv-to-xlsx-converter/fixtures/${name}`),
    name,
    { ...defaultOptions, ...options }
  )

test("preserves owned CSV fields as text, without header renaming or formulas", () => {
  const { book, info } = fixture("typed.csv", { header: true })
  const sheet = book.Sheets.Sheet1!
  expect(info.sheets[0]?.range).toBe("A1:F7")
  expect(sheet.A1?.v).toBe("id")
  expect(sheet.B1?.v).toBe("id")
  expect(sheet.C1?.v).toBe("")
  expect(sheet.A2?.v).toBe("00123")
  expect(sheet.B2?.v).toBe("900719925474099312345")
  expect(sheet.D2?.v).toBe("你好 العربية 😀")
  expect(sheet.F2).toMatchObject({ t: "s", v: "=1+1", z: "@" })
  expect(sheet.F2?.f).toBeUndefined()
  expect(sheet.D4?.v).toBe("line1\r\nline2\nline3\rline4")
  expect(sheet.A5?.v).toBe("")
  expect(sheet.B6).toBeUndefined()
  expect(sheet.A7?.v).toBe("_x0041_")
  expect(sheet["!autofilter"]).toEqual({ ref: "A1:F7" })
  const output = read(writeXlsx(book), { cellNF: true }).Sheets.Sheet1!
  expect(output.A2).toMatchObject({ t: "s", v: "00123", z: "@" })
  expect(output.F2).toMatchObject({ t: "s", v: "=1+1" })
  // Inspect the exported XML: SheetJS normalizes CRLF and decodes escape-looking
  // text on read, while independent spreadsheet readers preserve these strings.
  const parts = unzipSync(new Uint8Array(writeXlsx(book)))
  const document = new DOMParser().parseFromString(
    strFromU8(parts["xl/worksheets/sheet1.xml"]!),
    "application/xml"
  )
  expect(document.querySelector('c[r="D4"] v')?.textContent).toBe(sheet.D4?.v)
  expect(document.querySelector('c[r="A7"] v')?.textContent).toBe("_x0041_")
  expect(output["!autofilter"]).toEqual({ ref: "A1:F7" })
})

test("detects BOMs and tabs, supports explicit encodings and separators", () => {
  expect(fixture("tabs.tsv").book.Sheets.Sheet1?.B2?.v).toBe("two\tparts")
  expect(
    fixture("legacy.csv", { encoding: "windows-1252", delimiter: ";" }).book
      .Sheets.Sheet1?.A2?.v
  ).toBe("café")
  expect(() => fixture("legacy.csv")).toThrow(Error)
  const le = Buffer.from("\ufeffA;B\n01;02", "utf16le")
  const be = Buffer.from(le).swap16()
  expect(
    readDelimited(be, "data.csv", defaultOptions).book.Sheets.Sheet1?.B2?.v
  ).toBe("02")
  expect(parse("a|b\n1|2").book.Sheets.Sheet1?.B2?.v).toBe("2")
  expect(parse("a\tb\n1\t2", {}, "DATA.TSV").book.Sheets.Sheet1?.B2?.v).toBe(
    "2"
  )
  expect(parse("a;b\n1;2", { delimiter: ";" }).book.Sheets.Sheet1?.B2?.v).toBe(
    "2"
  )
})

test("only strips matching delimiter directives and keeps literal mismatches", () => {
  for (const delimiter of ["auto", ";"]) {
    const { book } = fixture("directive.csv", { delimiter })
    expect(book.Sheets.Sheet1?.A1?.v).toBe("name")
    expect(book.Sheets.Sheet1?.B2?.v).toBe("0007")
  }
  expect(
    fixture("directive.csv", { delimiter: "," }).book.Sheets.Sheet1?.A1?.v
  ).toBe("sep=;")
  expect(parse("SEP=|\ra|b\r1|2").book.Sheets.Sheet1?.B2?.v).toBe("2")
  expect(() => parse("sep=;\n")).toThrow("invalid")
})

test("preserves whitespace, empty records and fields without an invented final row", () => {
  for (const newline of ["\r\n", "\n", "\r"]) {
    const { book } = parse(`a,b${newline}${newline}  ,${newline}`)
    expect(book.Sheets.Sheet1?.["!ref"]).toBe("A1:B3")
    expect(book.Sheets.Sheet1?.A2?.v).toBe("")
    expect(book.Sheets.Sheet1?.A3?.v).toBe("  ")
    expect(book.Sheets.Sheet1?.B3?.v).toBe("")
    expect(book.Sheets.Sheet1?.["!autofilter"]).toBeUndefined()
  }
  expect(parse('"quoted"').book.Sheets.Sheet1?.A1?.v).toBe("quoted")
  expect(parse('"a\n"').book.Sheets.Sheet1?.A1?.v).toBe("a\n")
  expect(parse("\n").book.Sheets.Sheet1?.A1?.v).toBe("")
  expect(parse("a,b\n,\n").book.Sheets.Sheet1?.["!ref"]).toBe("A1:B2")
})

test("rejects unreadable text and malformed quoting", () => {
  for (const text of [
    "",
    "\0binary",
    "\u0001",
    "\ufffe",
    'a,b\n"unclosed',
    '"quoted"oops,b',
  ])
    expect(() => parse(text)).toThrow(Error)
  expect(() => parse("a", { encoding: "not-an-encoding" })).toThrow(Error)
})

test("enforces actual XLSX limits without truncating, accepts edge cells and wide rows", () => {
  expect(parse("x".repeat(32767)).book.Sheets.Sheet1?.A1?.v).toHaveLength(32767)
  expect(() => parse("x".repeat(32768))).toThrow("unsupported")
  expect(
    parse(Array(16384).fill("x").join(",")).book.Sheets.Sheet1?.XFD1?.v
  ).toBe("x")
  expect(() => parse(Array(16385).fill("x").join(","))).toThrow("unsupported")
  expect(() => parse("\n".repeat(1_048_577))).toThrow("unsupported")
})
