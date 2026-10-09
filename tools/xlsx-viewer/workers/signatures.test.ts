import { expect, test, vi } from "vitest"
import { zipSync, strToU8 } from "fflate"
import { assertSpreadsheet } from "./signatures"
vi.mock("@workspace/document-reader", () => ({
  officeLoadOptions: {
    resourceLimits: {
      maxArchiveEntries: 3,
      maxArchiveEntryBytes: 50,
      maxTotalInflatedBytes: 80,
    },
  },
}))
const bytes = (data: number[]) => Uint8Array.from(data).buffer
const text = (data: string) => strToU8(data).buffer as ArrayBuffer
const zip = (parts: Record<string, Uint8Array>) =>
  Uint8Array.from(zipSync(parts)).buffer

test("accepts supported document signatures without parsing plain-text fallbacks as binary files", () => {
  for (const [data, name] of [
    [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1], "file.xls"],
    [[9, 8], "file.xls"],
    [[0, 0, 2, 0], "file.wk1"],
    [[255, 0, 2, 0], "file.wks"],
    [[3, 0, 1, 1], "file.dbf"],
  ] as const)
    expect(() => assertSpreadsheet(bytes([...data]), name)).not.toThrow()
  for (const [data, name] of [
    ["TABLE\n0,1", "file.dif"],
    ["ID;P", "file.slk"],
    ["socialcalc:version:1.5", "file.eth"],
    ["<office:document/>", "file.fods"],
    ["a,b", "file.csv"],
    ["text", "file.prn"],
  ])
    expect(() => assertSpreadsheet(text(data!), name!)).not.toThrow()
  expect(() => assertSpreadsheet(text("random text"), "file.xls")).toThrow(
    "INVALID"
  )
  expect(() => assertSpreadsheet(bytes([]), "file.csv")).toThrow("INVALID")
})
test("requires spreadsheet entries in ZIP archives", () => {
  for (const entry of [
    "xl/workbook.bin",
    "xl/workbook.xml",
    "content.xml",
    "uof.xml",
    "Index/Document.iwa",
  ])
    expect(() =>
      assertSpreadsheet(zip({ [entry]: strToU8("x") }), "file.ods")
    ).not.toThrow()
  expect(() =>
    assertSpreadsheet(zip({ "unrelated.txt": strToU8("x") }), "file.xlsb")
  ).toThrow("INVALID")
})
test("checks archive expansion and entry budgets before inflation", () => {
  expect(() =>
    assertSpreadsheet(zip({ "content.xml": new Uint8Array(51) }), "file.ods")
  ).toThrow("TOO_LARGE")
  expect(() =>
    assertSpreadsheet(
      zip({ a: new Uint8Array(41), b: new Uint8Array(40) }),
      "file.ods"
    )
  ).toThrow("TOO_LARGE")
  expect(() =>
    assertSpreadsheet(
      zip({ a: strToU8(""), b: strToU8(""), c: strToU8(""), d: strToU8("") }),
      "file.ods"
    )
  ).toThrow("TOO_LARGE")
})
