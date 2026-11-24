import { expect, test, vi } from "vitest"
import { read, utils, write, writeFileXLSX } from "xlsx"
import { analyzeJson } from "./table"
import { downloadWorkbook } from "./workbook"

vi.mock("xlsx", { spy: true })

test("writes a complete workbook with typed cells, literal strings and empty rows", () => {
  const result = analyzeJson(
    `[{"id":"00123","active":true,"count":12,"note":"=1+2","_x0041_":"&gt;< _x0042_","details":{"city":"Oslo"}},{"id":9007199254740993},{}]`,
    true
  )
  if (result.state !== "ready") throw new Error("Expected a valid test table")

  vi.mocked(writeFileXLSX).mockImplementationOnce((book, filename, options) => {
    expect(filename).toBe("records.xlsx")
    const bytes = write(book, { ...options, type: "array", bookType: "xlsx" })
    const { SheetNames, Sheets } = read(bytes, { type: "array" })
    expect(SheetNames).toEqual(["Sheet1"])
    const sheet = Sheets.Sheet1!
    expect(sheet["!ref"]).toBe("A1:F4")
    expect(utils.sheet_to_json(sheet, { header: 1 })).toEqual([
      ["id", "active", "count", "note", "_x0041_", "details.city"],
      ["00123", true, 12, "=1+2", "&gt;< _x0042_", "Oslo"],
      ["9007199254740993"],
      [],
    ])
    expect(sheet.D2).toMatchObject({ t: "s", v: "=1+2" })
    expect(sheet.D2!.f).toBeUndefined()
  })
  downloadWorkbook(result.table, "records.xlsx")
  expect(writeFileXLSX).toHaveBeenCalledOnce()
})
