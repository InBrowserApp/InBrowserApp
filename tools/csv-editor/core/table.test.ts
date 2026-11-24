import { describe, expect, it } from "vitest"
import {
  columnLetter,
  editCell,
  filterRows,
  moveColumn,
  sortRows,
} from "./table"

describe("spreadsheet data", () => {
  it("labels columns beyond Z and moves columns in both directions", () => {
    expect([0, 25, 26, 701, 702].map(columnLetter)).toEqual([
      "A",
      "Z",
      "AA",
      "ZZ",
      "AAA",
    ])
    expect(moveColumn([0, 1, 2, 3], 0, 2)).toEqual([1, 2, 0, 3])
    expect(moveColumn([0, 1, 2, 3], 3, 1)).toEqual([0, 3, 1, 2])
  })

  it("retains text and extends ragged records only when edited", () => {
    const rows = [["001"], ["ID", "2"]]
    expect(editCell(rows, 0, 0, "001")).toBe(rows)
    expect(editCell(rows, 0, 2, "")).toBe(rows)
    expect(editCell(rows, 0, 2, "000")).toEqual([
      ["001", "", "000"],
      ["ID", "2"],
    ])
    expect(editCell(rows, 1, 1, "23")).toEqual([["001"], ["ID", "23"]])
  })

  it("sorts integers without changing values or sacrificing precision", () => {
    const rows = [
      ["Value"],
      ["9007199254740993"],
      ["9007199254740992"],
      ["-2"],
      ["+003"],
      [""],
      [" 3 "],
      [],
    ]
    expect(sortRows(rows, 1, null, "en")).toEqual([1, 2, 3, 4, 5, 6, 7])
    expect(
      sortRows(rows, 1, { column: 0, direction: "ascending" }, "en")
    ).toEqual([3, 4, 6, 2, 1, 5, 7])
    expect(
      sortRows(rows, 1, { column: 0, direction: "descending" }, "en")
    ).toEqual([1, 2, 4, 6, 3, 5, 7])
  })

  it("sorts finite decimals, scientific notation and alphanumeric values naturally", () => {
    const decimals = [["10.2"], ["-3.4"], [".7"], ["1e2"], [""], ["2.11"]]
    expect(
      sortRows(decimals, 0, { column: 0, direction: "ascending" }, "en")
    ).toEqual([1, 2, 5, 0, 3, 4])
    const codes = [["ID10"], ["id3"], ["ID2"]]
    expect(
      sortRows(codes, 0, { column: 0, direction: "ascending" }, "en")
    ).toEqual([2, 1, 0])
    const overflow = [
      ["x", "1e999"],
      ["x", "1e100"],
    ]
    expect(
      sortRows(overflow, 0, { column: 1, direction: "ascending" }, "en")
    ).toEqual([1, 0])
  })

  it("filters all columns or just the selected column, using locale-aware casing", () => {
    const rows = [["Title", "Type"], ["PIN", "Hardware"], ["wire", "Pın"], []]
    const order = [3, 2, 1]
    expect(
      filterRows(rows, order, { column: null, query: " pın " }, "tr")
    ).toEqual([2, 1])
    expect(filterRows(rows, order, { column: 0, query: "pın" }, "tr")).toEqual([
      1,
    ])
    expect(filterRows(rows, order, { column: 0, query: " " }, "tr")).toBe(order)
  })
})
