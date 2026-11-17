import { describe, expect, it } from "vitest"
import { cellText, exportResult } from "./export"
import type { QueryResult } from "../types"

describe("SQLite exports", () => {
  const result: QueryResult = {
    columns: ["same", "same", "data", "nullable"],
    rows: [
      [9223372036854775807n, -1.5, new Uint8Array([0, 255]), null],
      ["", '=HYPERLINK("bad")', "line\nwith, comma", "text"],
    ],
    truncated: false,
    elapsed: 0,
  }
  it("preserves duplicate names, exact integers, blobs, empty text and NULL in JSON", () => {
    expect(JSON.parse(exportResult(result, "json"))).toEqual({
      columns: result.columns,
      rows: [
        ["9223372036854775807", -1.5, { $blob: "00ff" }, null],
        ["", '=HYPERLINK("bad")', "line\nwith, comma", "text"],
      ],
    })
  })
  it("quotes CSV, guards text formulas and preserves numeric negatives", () => {
    const csv = exportResult(result, "csv")
    expect(csv).toBe(
      '\uFEFF"same","same","data","nullable"\r\n"9223372036854775807","-1.5","X\'00ff\'",""\r\n"","\'=HYPERLINK(""bad"")","line\nwith, comma","text"\r\n'
    )
  })
  it("also guards headers and whitespace-prefixed formula strings", () => {
    const data = {
      ...result,
      columns: ["@formula"],
      rows: [[" \t+cmd"], ["-123"], ["ordinary"], [-123n]],
    }
    expect(exportResult(data, "csv")).toBe(
      '\uFEFF"\'@formula"\r\n"\' \t+cmd"\r\n"\'-123"\r\n"ordinary"\r\n"-123"\r\n'
    )
  })
  it("handles non-finite real values explicitly and empty results", () => {
    expect(
      JSON.parse(
        exportResult({ ...result, rows: [[Infinity, -Infinity, NaN]] }, "json")
      ).rows
    ).toEqual([["Infinity", "-Infinity", "NaN"]])
    expect(
      JSON.parse(exportResult({ ...result, rows: [] }, "json")).rows
    ).toEqual([])
  })
  it("shows readable values without changing their data", () => {
    expect(cellText(null)).toBe("NULL")
    expect(cellText(new Uint8Array([1, 16, 255]))).toBe("X'0110ff'")
    expect(cellText(9007199254740993n)).toBe("9007199254740993")
    expect(cellText(0)).toBe("0")
    expect(cellText("")).toBe("")
  })
})
