import { expect, test } from "vitest"
import { CsvRowError, readCsv, writeCsv } from "./index"

test("reads quoted multiline cells, alternate headers and semicolon separators", () => {
  expect(
    readCsv('\uFEFFName;Notes\r\nTaylor;"first\nsecond"\r\n', [
      ["Full Name", "Name"],
      "Notes",
    ])
  ).toEqual([{ row: 2, values: ["Taylor", "first\nsecond"] }])
})

test("keeps the record number after blank rows and rejects extra data", () => {
  expect(
    readCsv("Name,Notes\n\nTaylor,Example", ["Name", "Notes"])[0]?.row
  ).toBe(3)
  expect(() =>
    readCsv("Name,Notes\n\nTaylor,one,two", ["Name", "Notes"])
  ).toThrow(new CsvRowError(3))
  expect(() =>
    readCsv('Name,Notes\nTaylor,"unclosed', ["Name", "Notes"])
  ).toThrow(CsvRowError)
})

test("keeps phone prefixes and neutralizes spreadsheet formulas", () => {
  expect(writeCsv(["Phone", "Notes"], [["+1 415 555 0102", "=1+2"]])).toBe(
    'Phone,Notes\r\n+1 415 555 0102,"\'=1+2"\r\n'
  )
})
