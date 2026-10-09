import { expect, test } from "vitest"
import { strToU8, zipSync } from "fflate"
import { readUos } from "./uos"

const bytes = (xml: string) => new TextEncoder().encode(xml).buffer
const book = (rows: string, attributes = '表:名称="Report"') =>
  `<?xml version="1.0"?><uof:UOF xmlns:uof="http://schemas.uof.org/cn/2003/uof" xmlns:表="http://schemas.uof.org/cn/2003/uof-spreadsheet" xmlns:字="http://schemas.uof.org/cn/2003/uof-wordproc"><表:工作表 ${attributes}>${rows}</表:工作表></uof:UOF>`
const cell = (value: string, attributes = "") =>
  `<表:单元格 ${attributes}><表:数据 表:数据类型="text"><字:句><字:文本串>${value}</字:文本串></字:句></表:数据></表:单元格>`

test("keeps empty and explicitly positioned cells in their original columns and rows", () => {
  const result = readUos(
    bytes(
      book(
        `<表:行 表:行号="3">${cell("0001")}<表:单元格/>${cell("third")}${cell("sixth", '表:列号="6"')}</表:行><表:行>${cell("next")}</表:行>`
      )
    )
  )
  expect(result.Sheets.Report!.A3).toMatchObject({ v: "0001", t: "s" })
  expect(result.Sheets.Report!.B3).toBeUndefined()
  expect(result.Sheets.Report!.C3).toMatchObject({ v: "third" })
  expect(result.Sheets.Report!.F3).toMatchObject({ v: "sixth" })
  expect(result.Sheets.Report!.A4).toMatchObject({ v: "next" })
})

test("keeps merges, sheet names, hidden state and saved numeric or formula values", () => {
  const xml = book(
    `<表:行>${cell("Merged", '表:合并列数="3" 表:合并行数="2"')}<表:单元格 表:公式="=1+2"><表:数据 表:数据类型="number" 表:数据数值="3"/></表:单元格><表:单元格><表:数据 表:数据类型="number" 表:公式="=2+2"/></表:单元格></表:行>`,
    '表:名称="Hidden" 表:隐藏="true"'
  )
  const result = readUos(bytes(xml))
  expect(result.Sheets.Hidden!["!merges"]).toEqual([
    { s: { r: 0, c: 0 }, e: { r: 1, c: 2 } },
  ])
  expect(result.Sheets.Hidden!.B1).toEqual({ t: "n", v: 3, f: "1+2" })
  expect(result.Sheets.Hidden!.C1).toEqual({ t: "n", f: "2+2" })
  expect(result.Workbook!.Sheets![0]).toEqual({ name: "Hidden", Hidden: 1 })
})

test("reads zipped content and retains textual display for dates and unusual cell types", () => {
  const xml = book(
    `<表:行><表:单元格><表:数据 表:数据类型="date"><字:文本串>2026-10-08</字:文本串></表:数据></表:单元格><表:单元格><表:数据 表:数据类型="boolean" 表:数据数值="true"/></表:单元格></表:行>`
  )
  const archive = zipSync({ "content.xml": strToU8(xml) })
  const result = readUos(Uint8Array.from(archive).buffer)
  expect(result.Sheets.Report!.A1).toEqual({ t: "s", v: "2026-10-08" })
  expect(result.Sheets.Report!.B1).toEqual({ t: "b", v: true })
})

test("reports malformed or unsupported structures rather than shifting coordinates", () => {
  expect(() => readUos(bytes("<invalid/>"))).toThrow("INVALID")
  expect(() =>
    readUos(bytes(book(`<表:行 表:行号="0">${cell("x")}</表:行>`)))
  ).toThrow("INVALID")
  expect(() =>
    readUos(
      bytes(
        book(
          '<表:行><表:单元格><表:数据 表:数据类型="number" 表:数据数值="bad"/></表:单元格></表:行>'
        )
      )
    )
  ).toThrow("INVALID")
  expect(() =>
    readUos(Uint8Array.from(zipSync({ "other.xml": strToU8("x") })).buffer)
  ).toThrow("INVALID")
})

test("reads numbers saved as text content and joins adjacent text runs without adding line breaks", () => {
  const result = readUos(
    bytes(
      book(
        '<表:行><表:单元格><表:数据 表:数据类型="number"><字:句><字:文本串>12</字:文本串></字:句></表:数据></表:单元格><表:单元格 表:公式="=5+7"><表:数据 表:数据类型="number"><字:句><字:文本串>12</字:文本串></字:句></表:数据></表:单元格><表:单元格><表:数据 表:数据类型="text"><字:句><字:文本串>Two,</字:文本串></字:句><字:句><字:文本串> separated</字:文本串></字:句></表:数据></表:单元格></表:行>'
      )
    )
  )
  expect(result.Sheets.Report!.A1).toEqual({ t: "n", v: 12 })
  expect(result.Sheets.Report!.B1).toEqual({ t: "n", v: 12, f: "5+7" })
  expect(result.Sheets.Report!.C1).toEqual({ t: "s", v: "Two, separated" })
})
