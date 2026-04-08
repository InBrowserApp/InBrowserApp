import { describe, expect, test } from "vitest"

import {
  DEFAULT_JSON_TO_CSV_OPTIONS,
  INVALID_JSON_TO_CSV_INPUT_MESSAGE,
  convertJsonToCsvText,
  createUnparseConfig,
  getConvertJsonToCsvErrorMessage,
  isJsonToCsvInput,
  isRecord,
  normalizeDelimiter,
  normalizeJsonToCsvOptions,
  normalizeQuoteChar,
  parseJsonToCsvInput,
} from "./convert-json-to-csv"

describe("convert-json-to-csv", () => {
  test("returns idle for blank input", () => {
    expect(convertJsonToCsvText("   ")).toEqual({
      state: "idle",
      csv: "",
    })
  })

  test("converts a JSON array of objects to CSV", () => {
    expect(
      convertJsonToCsvText(
        '[{"name":"Ada","age":36},{"name":"Linus","age":32}]'
      )
    ).toEqual({
      state: "converted",
      csv: "name,age\r\nAda,36\r\nLinus,32",
    })
  })

  test("converts a Papa unparse object to CSV", () => {
    expect(
      convertJsonToCsvText(
        '{"fields":["name","age"],"data":[["Ada",36],["Linus",32]]}'
      )
    ).toEqual({
      state: "converted",
      csv: "name,age\r\nAda,36\r\nLinus,32",
    })
  })

  test("supports custom delimiter and no header row", () => {
    expect(
      convertJsonToCsvText('[{"name":"Ada","age":36}]', {
        delimiter: ";",
        includeHeaderRow: false,
      })
    ).toEqual({
      state: "converted",
      csv: "Ada;36",
    })
  })

  test("supports disabling forced quotes", () => {
    expect(
      convertJsonToCsvText('[{"name":"Ada","note":"hello,world"}]', {
        quoteChar: "",
      })
    ).toEqual({
      state: "converted",
      csv: 'name,note\r\nAda,"hello,world"',
    })
  })

  test("escapes spreadsheet formulae by default", () => {
    expect(
      convertJsonToCsvText('[{"name":"Ada","value":"=SUM(A1:A2)"}]')
    ).toEqual({
      state: "converted",
      csv: 'name,value\r\nAda,"\'=SUM(A1:A2)"',
    })
  })

  test("returns a parse error for invalid JSON", () => {
    const result = convertJsonToCsvText('{"name":"Ada"')

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.csv).toBe("")
    expect(result.message).toContain("Expected")
  })

  test("rejects unsupported parsed JSON shapes", () => {
    expect(convertJsonToCsvText('{"name":"Ada"}')).toEqual({
      state: "error",
      csv: "",
      message: INVALID_JSON_TO_CSV_INPUT_MESSAGE,
    })
  })

  test("normalizes options", () => {
    expect(
      normalizeJsonToCsvOptions({
        delimiter: "",
        quoteChar: "[]",
        includeHeaderRow: false,
        escapeFormulae: false,
      })
    ).toEqual({
      delimiter: ",",
      quoteChar: "[",
      includeHeaderRow: false,
      escapeFormulae: false,
    })
  })

  test("normalizes delimiter and quote character helpers", () => {
    expect(normalizeDelimiter(undefined)).toBe(",")
    expect(normalizeDelimiter(";")).toBe(";")
    expect(normalizeQuoteChar(undefined)).toBe('"')
    expect(normalizeQuoteChar("")).toBe("")
    expect(normalizeQuoteChar("[]")).toBe("[")
  })

  test("parses supported JSON values", () => {
    expect(parseJsonToCsvInput('[["Ada",36]]')).toEqual([["Ada", 36]])
    expect(parseJsonToCsvInput('{"fields":["name"],"data":[["Ada"]]}')).toEqual(
      {
        fields: ["name"],
        data: [["Ada"]],
      }
    )
  })

  test("builds a Papa unparse config", () => {
    expect(createUnparseConfig(DEFAULT_JSON_TO_CSV_OPTIONS)).toEqual({
      delimiter: ",",
      quotes: false,
      quoteChar: '"',
      header: true,
      escapeFormulae: true,
    })
    expect(
      createUnparseConfig({
        delimiter: ";",
        quoteChar: "",
        includeHeaderRow: false,
        escapeFormulae: false,
      })
    ).toEqual({
      delimiter: ";",
      quotes: false,
      quoteChar: '"',
      header: false,
      escapeFormulae: false,
    })
  })

  test("guards record and input shapes", () => {
    expect(isRecord({ name: "Ada" })).toBe(true)
    expect(isRecord(["Ada"])).toBe(false)
    expect(isRecord(null)).toBe(false)

    expect(isJsonToCsvInput([{ name: "Ada" }])).toBe(true)
    expect(
      isJsonToCsvInput({
        fields: ["name"],
        data: [["Ada"]],
      })
    ).toBe(true)
    expect(isJsonToCsvInput({ name: "Ada" })).toBe(false)
  })

  test("normalizes unknown thrown values", () => {
    expect(getConvertJsonToCsvErrorMessage("boom")).toBe("Unknown error")
    expect(getConvertJsonToCsvErrorMessage(new Error("boom"))).toBe("boom")
  })
})
