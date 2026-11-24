import { describe, expect, test } from "vitest"
import { analyzeJson } from "./table"

describe("JSON spreadsheet conversion", () => {
  test("joins fields across records and keeps nested arrays and empty objects in one cell", () => {
    const input = `[
      {"name":"Maya","contact":{"address":{"city":"Oslo"},"zone":null},"tags":[{"id":9007199254740993}],"details":{}},
      {"name":"Leo","active":false,"contact":{"address":{"city":"Lisbon"}}},
      {}
    ]`
    expect(analyzeJson(input, true)).toEqual({
      state: "ready",
      table: {
        headings: [
          "name",
          "contact.address.city",
          "contact.zone",
          "tags",
          "details",
          "active",
        ],
        rows: [
          ["Maya", "Oslo", null, '[{"id":9007199254740993}]', "{}"],
          ["Leo", "Lisbon", undefined, undefined, undefined, false],
          [],
        ],
      },
    })
    expect(analyzeJson(input, false)).toEqual({
      state: "ready",
      table: {
        headings: ["name", "contact", "tags", "details", "active"],
        rows: [
          [
            "Maya",
            '{"address":{"city":"Oslo"},"zone":null}',
            '[{"id":9007199254740993}]',
            "{}",
          ],
          ["Leo", '{"address":{"city":"Lisbon"}}', undefined, undefined, false],
          [],
        ],
      },
    })
  })

  test("keeps literal keys distinct from dot paths and uses the last duplicate value", () => {
    const input = String.raw`[{"a.b":"literal","a":{"b":"nested"},"a\\b":"slash","__proto__":"field","":"empty key","a.b":"last"}]`
    expect(analyzeJson(input, true)).toEqual({
      state: "ready",
      table: {
        headings: ["a\\.b", "a.b", "a\\\\b", "__proto__", ""],
        rows: [["last", "nested", "slash", "field", "empty key"]],
      },
    })
  })

  test("keeps precise and out-of-range numbers as text", () => {
    expect(
      analyzeJson(
        `[{
        "normal":-12.125,"large":1e24,"small":2.5e-308,"zero":0e-999,
        "id":9007199254740993,"decimal":0.0001234567890123456,
        "overflow":1e309,"underflow":1e-400,"subnormal":-1e-310
      }]`,
        true
      )
    ).toEqual({
      state: "ready",
      table: {
        headings: [
          "normal",
          "large",
          "small",
          "zero",
          "id",
          "decimal",
          "overflow",
          "underflow",
          "subnormal",
        ],
        rows: [
          [
            -12.125,
            1e24,
            2.5e-308,
            0,
            "9007199254740993",
            "0.0001234567890123456",
            "1e309",
            "1e-400",
            "-1e-310",
          ],
        ],
      },
    })
  })

  test("distinguishes an empty editor from malformed JSON or non-object records", () => {
    expect(analyzeJson(" \n", true)).toEqual({ state: "empty" })
    expect(analyzeJson("[{", true)).toEqual({
      state: "error",
      error: "invalidJson",
    })
    for (const input of ["[]", "{}", "[null]", "[[]]", "[1]", '["value"]']) {
      expect(analyzeJson(input, true)).toEqual({
        state: "error",
        error: "invalidRecords",
      })
    }
    expect(analyzeJson("[{}, {}]", true)).toEqual({
      state: "error",
      error: "noColumns",
    })
  })

  test("reports Excel’s grid and cell text limits without truncating", () => {
    const value = "a".repeat(32_767)
    expect(analyzeJson(JSON.stringify([{ value }]), true).state).toBe("ready")
    for (const record of [{ value: value + "b" }, { [value + "b"]: true }]) {
      expect(analyzeJson(JSON.stringify([record]), true)).toEqual({
        state: "error",
        error: "cellLimit",
      })
    }
    const wide = Object.fromEntries(
      Array.from({ length: 16_384 }, (_, index) => [`col${index}`, null])
    )
    expect(analyzeJson(JSON.stringify([wide]), true).state).toBe("ready")
    expect(analyzeJson(JSON.stringify([wide, { extra: true }]), true)).toEqual({
      state: "error",
      error: "sheetLimit",
    })
    expect(analyzeJson(`[{}${",{}".repeat(1_048_575)}]`, true)).toEqual({
      state: "error",
      error: "sheetLimit",
    })
  })
})
