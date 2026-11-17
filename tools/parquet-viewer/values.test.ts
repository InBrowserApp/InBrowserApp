import { describe, expect, test } from "vitest"
import { cellText, csvHeader, exportPart, normalize } from "./values"

describe("value and export representations", () => {
  test("preserves integer precision, binary, nested values, nulls and special numbers", () => {
    expect(
      normalize({
        id: 9007199254740993n,
        bytes: new Uint8Array([0, 255]),
        date: new Date("2026-01-01Z"),
        values: [undefined, null, true, 1, "", Infinity, NaN],
        map: new Map([["key", 4n]]),
      })
    ).toEqual({
      id: "9007199254740993",
      bytes: "0x00ff",
      date: "2026-01-01T00:00:00.000Z",
      values: [null, null, true, 1, "", "Infinity", "NaN"],
      map: [["key", "4"]],
    })
    expect(cellText(undefined)).toBe("")
    expect(cellText({ a: [1, null] })).toBe('{"a":[1,null]}')
    expect(cellText(false)).toBe("false")
  })
  test("CSV quotes headers and values, preserving commas, quotes and newlines", () => {
    expect(csvHeader(['a,"b', "plain"])).toBe('"a,""b",plain\r\n')
    expect(
      exportPart(
        [
          { text: 'a,"b"\nnext', missing: null, nested: [1, 2] },
          { text: "", missing: null, nested: [] },
        ],
        ["text", "missing", "nested"],
        "csv"
      )
    ).toBe('"a,""b""\nnext",,"[1,2]"\r\n,,[]')
    expect(exportPart([{ text: "=1+1" }], ["text"], "csv")).toBe("=1+1")
  })
  test("JSON keeps named fields and nulls", () => {
    expect(
      JSON.parse(
        `[${exportPart([{ a: null }, { a: "9007199254740993" }], ["a"], "json")}]`
      )
    ).toEqual([{ a: null }, { a: "9007199254740993" }])
  })
})
