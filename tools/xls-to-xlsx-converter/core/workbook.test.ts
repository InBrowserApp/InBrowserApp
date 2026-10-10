import { readFileSync } from "node:fs"
import { describe as suite, expect, test } from "vitest"
import { CFB, utils, write } from "xlsx"
import type { WorkBook } from "xlsx"
import { strFromU8, unzipSync } from "fflate"
import { assertXls, describe, failure, readXls, writeXlsx } from "./workbook"
import { preview } from "./preview"
import { cellPosition, outputName } from "./navigation"

const fixture = (name: string) =>
  new Uint8Array(
    readFileSync(`tools/xls-to-xlsx-converter/fixtures/${name}.xls`)
  )
const xml = (bytes: ArrayBuffer, path: string) =>
  new DOMParser().parseFromString(
    strFromU8(unzipSync(new Uint8Array(bytes))[path]!),
    "application/xml"
  )
const simple = (): WorkBook => ({
  SheetNames: ["Data"],
  Sheets: { Data: { "!ref": "A1", A1: { t: "n", v: 1 } } },
})

suite("genuine legacy workbook conversion", () => {
  test("keeps names, formulas, cached values and dates in OOXML", () => {
    const book = readXls(fixture("legacy"))
    const info = describe(book)
    expect(info.sheets.map((sheet) => sheet.name)).toEqual([
      "Report",
      "Empty",
      "Hidden",
      "Sparse",
    ])
    expect(info.missingCaches).toBe(0)
    const bytes = writeXlsx(book)
    const workbook = xml(bytes, "xl/workbook.xml")
    expect(
      [...workbook.querySelectorAll("sheet")].map((sheet) =>
        sheet.getAttribute("name")
      )
    ).toEqual(book.SheetNames)
    expect(
      workbook.querySelector('sheet[name="Hidden"]')?.getAttribute("state")
    ).toBe("hidden")
    const sheet = xml(bytes, "xl/worksheets/sheet1.xml")
    expect(sheet.querySelector('c[r="B4"] f')?.textContent).toBe("SUM(B2:B3)")
    expect(sheet.querySelector('c[r="B4"] v')?.textContent).toBe("37.75")
    expect(sheet.querySelector('c[r="C2"] v')?.textContent).toBe("46303")
    expect(sheet.querySelectorAll("col[level]")).toHaveLength(0)
    expect(sheet.querySelectorAll("col[outlineLevel]").length).toBeGreaterThan(
      0
    )
  })

  test("preserves typed data, Unicode, 1904 dates, visibility, dimensions and groups", () => {
    const book = readXls(fixture("typed-1904"))
    const info = describe(book)
    expect(info.sheets.map((sheet) => sheet.hidden)).toEqual([0, 0, 1, 2])
    expect(info.sheets[1]?.range).toBeNull()
    const bytes = writeXlsx(book)
    const workbook = xml(bytes, "xl/workbook.xml")
    expect(workbook.querySelector("workbookPr")?.getAttribute("date1904")).toBe(
      "true"
    )
    expect(workbook.querySelector("sheet")?.getAttribute("name")).toBe(
      "数据 & العربية"
    )
    expect(
      workbook.querySelector('sheet[name="VeryHidden"]')?.getAttribute("state")
    ).toBe("veryHidden")
    const sheet = xml(bytes, "xl/worksheets/sheet1.xml")
    expect(sheet.querySelector('c[r="A1"]')?.textContent).toBe("00123")
    expect(sheet.querySelector('c[r="A1"]')?.getAttribute("t")).toBe("str")
    expect(sheet.querySelector('c[r="B1"]')?.getAttribute("t")).toBeNull()
    expect(sheet.querySelector('c[r="A2"]')?.getAttribute("t")).toBe("b")
    expect(sheet.querySelector('c[r="A3"]')?.textContent).toBe("=literal")
    expect(sheet.querySelector('c[r="A3"] f')).toBeNull()
    expect(
      sheet.querySelector('col[min="2"]')?.getAttribute("outlineLevel")
    ).toBe("2")
    expect(sheet.querySelector('col[min="2"]')?.getAttribute("hidden")).toBe(
      "true"
    )
    expect(sheet.querySelector('row[r="3"]')?.getAttribute("hidden")).toBe("1")
    expect(sheet.querySelector('row[r="4"]')?.getAttribute("ht")).toBe("30")
    expect(sheet.querySelector("mergeCell")?.getAttribute("ref")).toBe("A4:C4")
    const values = preview(book, 0, 0, 0)
    expect(values.rows[0]?.cells.map((cell) => cell.text)).toEqual([
      "00123",
      "123",
      "",
    ])
    expect(values.rows[1]?.cells[1]?.text).toBe("2026-10-10 12:30")
    expect(preview(book, 1, 0, 0).rows).toEqual([])
  })

  test("exports the sparse BIFF boundary and previews only the requested window", () => {
    const book = readXls(fixture("sparse"))
    expect(describe(book).sheets[0]?.range).toBe("A1:IV65536")
    const result = preview(book, 0, 65535, 255)
    expect(result.rows).toHaveLength(1)
    expect(result.rows[0]?.cells[0]?.text).toBe("end")
    const sheet = xml(writeXlsx(book), "xl/worksheets/sheet1.xml")
    expect(sheet.querySelector('c[r="IV65536"]')?.textContent).toBe("end")
    expect(sheet.querySelectorAll("c")).toHaveLength(2)
    expect(preview(book, 0, -10, -10).rows).toHaveLength(20)
    expect(preview(book, 0, 1e8, 1e8).range).toBe("IV65536")
  })
})

test("keeps formulas without caches as formulas, never fabricated zeroes", () => {
  const book = simple()
  book.Sheets.Data = {
    "!ref": "A1:D2",
    A1: { t: "n", f: "SUM(A2:B2)" },
    B1: { t: "n", v: NaN, f: "A2" },
    C1: { t: "z", f: "B2" },
    D1: { t: "e", v: 7, f: "1/0" },
    A2: { t: "n", v: 3, z: "0.00" },
    B2: { t: "n", v: 0 },
  }
  expect(describe(book).missingCaches).toBe(3)
  const sheet = xml(writeXlsx(book), "xl/worksheets/sheet1.xml")
  expect(sheet.querySelector('c[r="A1"] f')?.textContent).toBe("SUM(A2:B2)")
  expect(sheet.querySelector('c[r="A1"] v')).toBeNull()
  expect(sheet.querySelector('c[r="B1"] v')).toBeNull()
  expect(sheet.querySelector('c[r="C1"] f')?.textContent).toBe("B2")
  const result = preview(book, 0, NaN, NaN)
  expect(result.rows[0]?.cells[0]?.missingCache).toBe(true)
  expect(result.rows[0]?.cells[3]?.text).toBe("#DIV/0!")
  expect(result.rows[1]?.cells[0]).toMatchObject({
    text: "3.00",
    raw: "3",
    format: "0.00",
  })
  expect(result.rows[1]?.cells[1]?.text).toBe("0")
})

test("rejects empty workbooks and unsupported sheet types explicitly", () => {
  expect(() => describe({ SheetNames: [], Sheets: {} })).toThrow("invalid")
  for (const type of ["macro", "chart"] as const) {
    const book = simple()
    Object.assign(book.Sheets.Data!, { "!type": type })
    expect(() => describe(book)).toThrow("unsupported")
  }
  const book = simple()
  book.Sheets.Data!["!type"] = "sheet"
  expect(describe(book).sheets[0]?.hidden).toBe(0)
  expect(() => preview(book, 4, 0, 0)).toThrow("invalid")
})

test("validates actual XLS content, including legacy raw BIFF and compound streams", () => {
  for (const bytes of [
    new Uint8Array(),
    new TextEncoder().encode("<html><table>renamed.xls</table>"),
    new Uint8Array([80, 75, 3, 4]),
    new Uint8Array([9, 3, 0, 0, 0, 0, 0, 0]),
  ])
    expect(() => assertXls(bytes)).toThrow("invalid")
  const book = utils.book_new()
  utils.book_append_sheet(book, utils.aoa_to_sheet([["raw BIFF"]]), "Data")
  const raw = new Uint8Array(write(book, { type: "array", bookType: "biff2" }))
  expect(readXls(raw).SheetNames).toHaveLength(1)
  expect(() => assertXls(fixture("legacy"))).not.toThrow()
  for (const name of [
    "EncryptionInfo",
    "EncryptedPackage",
    "WordDocument",
    "Book",
  ]) {
    const archive = CFB.utils.cfb_new()
    CFB.utils.cfb_add(archive, name, new Uint8Array([1, 2, 3, 4]))
    const bytes = new Uint8Array(CFB.write(archive, { type: "buffer" }))
    if (name === "Book") expect(() => assertXls(bytes)).not.toThrow()
    else
      expect(() => assertXls(bytes)).toThrow(
        name === "WordDocument" ? "invalid" : "protected"
      )
  }
})

test("classifies failures without exposing document contents", () => {
  expect(failure(new Error("File is password-protected"))).toBe("protected")
  expect(failure("unsupported")).toBe("unsupported")
  expect(failure(new RangeError("Invalid array length"))).toBe("resource")
  expect(failure(new Error("out of memory"))).toBe("resource")
  expect(failure({ private: "content" })).toBe("invalid")
})

test("validates preview navigation and safe output names without changing Unicode", () => {
  const sheet = describe(readXls(fixture("sparse"))).sheets[0]!
  expect(cellPosition(" $iv$65536 ", sheet)).toEqual({
    row: 65535,
    column: 255,
  })
  expect(cellPosition("A0", sheet)).toBeNull()
  expect(cellPosition("IW1", sheet)).toBeNull()
  expect(cellPosition("A65537", sheet)).toBeNull()
  expect(cellPosition("A1", { ...sheet, start: { r: 1, c: 1 } })).toBeNull()
  expect(cellPosition("B1", { ...sheet, start: { r: 1, c: 1 } })).toBeNull()
  expect(cellPosition("A2", { ...sheet, start: { r: 1, c: 1 } })).toBeNull()
  expect(outputName("数据.v2.XLS")).toBe("数据.v2.xlsx")
  expect(outputName("bad/:name.xls")).toBe("bad__name.xlsx")
  expect(outputName(".xls")).toBe("workbook.xlsx")
})

function alteredLegacy(mode: "missing" | "macro" | "chart" | "vba") {
  const archive = CFB.read(fixture("legacy"), { type: "buffer" })
  const entry = CFB.find(archive, "Workbook")
  const bytes = Uint8Array.from(entry.content as Uint8Array)
  const data = new DataView(bytes.buffer)
  if (mode === "vba") {
    CFB.utils.cfb_add(
      archive,
      "_VBA_PROJECT_CUR/VBA/Module1",
      new TextEncoder().encode("owned fixture, no code")
    )
  } else
    for (let offset = 0; offset + 4 <= bytes.length; ) {
      const type = data.getUint16(offset, true)
      const length = data.getUint16(offset + 2, true)
      if (mode === "missing" && type === 6) {
        data.setFloat64(offset + 10, NaN, true)
        break
      }
      if (
        mode !== "missing" &&
        type === 0x809 &&
        data.getUint16(offset + 6, true) === 0x10
      ) {
        data.setUint16(offset + 6, mode === "macro" ? 0x40 : 0x20, true)
        break
      }
      offset += 4 + length
    }
  entry.content = bytes
  return new Uint8Array(CFB.write(archive, { type: "buffer" }))
}

test("reads a missing BIFF formula cache and writes a formula without a made-up value", () => {
  const book = readXls(alteredLegacy("missing"))
  expect(describe(book).missingCaches).toBe(1)
  expect(preview(book, 0, 3, 1).rows[0]?.cells[0]).toMatchObject({
    formula: "SUM(B2:B3)",
    missingCache: true,
    text: "",
  })
  const sheet = xml(writeXlsx(book), "xl/worksheets/sheet1.xml")
  expect(sheet.querySelector('c[r="B4"] f')?.textContent).toBe("SUM(B2:B3)")
  expect(sheet.querySelector('c[r="B4"] v')).toBeNull()
})

test("rejects parsed BIFF macro/chart sheets and excludes a VBA storage stream", () => {
  for (const mode of ["macro", "chart"] as const) {
    expect(() => describe(readXls(alteredLegacy(mode)))).toThrow("unsupported")
  }
  const book = readXls(alteredLegacy("vba"))
  expect(book.vbaraw).toBeUndefined()
  describe(book)
  expect(
    Object.keys(unzipSync(new Uint8Array(writeXlsx(book)))).some((path) =>
      /vba|macro/i.test(path)
    )
  ).toBe(false)
})

test("reads long mixed-width strings across many BIFF continuation records", () => {
  const book = readXls(fixture("continuations"))
  describe(book)
  const sheet = xml(writeXlsx(book), "xl/worksheets/sheet1.xml")
  for (let i = 0; i < 8; i++) {
    const expected = `${i}:${"A".repeat(8000)}${"中🚀".repeat(2000)}`
    expect(book.Sheets.Continuations![`A${i + 1}`].v).toBe(expected)
    expect(sheet.querySelector(`c[r="A${i + 1}"]`)?.textContent).toBe(expected)
  }
})

test("the OOXML column fix leaves legacy XLS writer grouping intact", () => {
  const book = readXls(fixture("typed-1904"))
  const result = readXls(
    new Uint8Array(write(book, { type: "array", bookType: "biff8" }))
  )
  expect(result.Sheets["数据 & العربية"]!["!cols"]?.[1]?.level).toBe(2)
})
