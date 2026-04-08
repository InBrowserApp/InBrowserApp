import { describe, expect, test } from "vitest"

import {
  DEFAULT_CSV_TO_JSON_OPTIONS,
  clampIndentSize,
  clampNonNegativeInteger,
  convertCsvToJsonText,
  decodeEscapedCharacters,
  getConvertCsvToJsonErrorMessage,
  getParseErrorMessage,
  normalizeCsvToJsonOptions,
  prepareCsvInput,
  resolveDelimiter,
  resolveDelimitersToGuess,
  resolveNewline,
} from "./convert-csv-to-json"

describe("clampIndentSize", () => {
  test("falls back to the default indent size for invalid values", () => {
    expect(clampIndentSize(undefined)).toBe(
      DEFAULT_CSV_TO_JSON_OPTIONS.indentSize
    )
    expect(clampIndentSize(Number.NaN)).toBe(
      DEFAULT_CSV_TO_JSON_OPTIONS.indentSize
    )
  })

  test("clamps values into the supported range", () => {
    expect(clampIndentSize(-1)).toBe(0)
    expect(clampIndentSize(2.6)).toBe(3)
    expect(clampIndentSize(20)).toBe(8)
  })
})

describe("clampNonNegativeInteger", () => {
  test("returns zero for invalid values", () => {
    expect(clampNonNegativeInteger(undefined)).toBe(0)
    expect(clampNonNegativeInteger(Number.NaN)).toBe(0)
  })

  test("rounds finite values and clamps to zero", () => {
    expect(clampNonNegativeInteger(-4)).toBe(0)
    expect(clampNonNegativeInteger(2.4)).toBe(2)
    expect(clampNonNegativeInteger(2.6)).toBe(3)
  })
})

describe("decodeEscapedCharacters", () => {
  test("decodes common escaped whitespace characters", () => {
    expect(decodeEscapedCharacters("\\t|\\n|\\r")).toBe("\t|\n|\r")
  })
})

describe("normalizeCsvToJsonOptions", () => {
  test("merges stored values with defaults", () => {
    expect(
      normalizeCsvToJsonOptions({
        noHeader: true,
        quoteChar: "'",
        skipEmptyLines: "greedy",
        escapeChar: "\\",
        preview: 4.4,
        indentSize: 0,
      })
    ).toEqual({
      noHeader: true,
      headersText: "",
      delimiter: ",",
      quoteChar: "'",
      trim: true,
      checkType: false,
      skipEmptyLines: "greedy",
      escapeChar: "\\",
      newline: "",
      preview: 4,
      comments: "",
      fastMode: false,
      skipFirstNLines: 0,
      delimitersToGuessText: "",
      includeColumns: "",
      ignoreColumns: "",
      indentSize: 0,
    })
  })

  test("falls back to defaults for unsupported enum values", () => {
    expect(
      normalizeCsvToJsonOptions({
        skipEmptyLines: "wat" as "none",
      })
    ).toMatchObject({
      skipEmptyLines: "none",
    })
  })

  test("falls back to defaults for invalid quote and escape values", () => {
    expect(
      normalizeCsvToJsonOptions({
        quoteChar: 1 as unknown as string,
        escapeChar: true as unknown as string,
      })
    ).toMatchObject({
      quoteChar: '"',
      escapeChar: '"',
    })
  })
})

describe("delimiter helpers", () => {
  test("resolve auto delimiter and newline modes", () => {
    expect(resolveDelimiter("")).toBeUndefined()
    expect(resolveDelimiter("auto")).toBeUndefined()
    expect(resolveDelimiter("\\t")).toBe("\t")
    expect(resolveNewline("")).toBeUndefined()
    expect(resolveNewline("auto")).toBeUndefined()
    expect(resolveNewline("\\r\\n")).toBe("\r\n")
    expect(resolveNewline("\\t")).toBeUndefined()
  })

  test("parses delimiter guesses into decoded values", () => {
    expect(resolveDelimitersToGuess("")).toBeUndefined()
    expect(resolveDelimitersToGuess(",,\\t,|")).toEqual([",", "\t", "|"])
  })
})

describe("prepareCsvInput", () => {
  test("returns the original input when headers are already in the first row", () => {
    expect(prepareCsvInput("a,b\n1,2", DEFAULT_CSV_TO_JSON_OPTIONS, ",")).toBe(
      "a,b\n1,2"
    )
  })

  test("returns the original input when there is no custom header text", () => {
    expect(
      prepareCsvInput(
        "1,2",
        {
          ...DEFAULT_CSV_TO_JSON_OPTIONS,
          noHeader: true,
        },
        ","
      )
    ).toBe("1,2")
  })

  test("prepends custom headers when provided", () => {
    expect(
      prepareCsvInput(
        "1;2",
        {
          ...DEFAULT_CSV_TO_JSON_OPTIONS,
          noHeader: true,
          headersText: "name,age",
        },
        ";"
      )
    ).toBe("name;age\n1;2")
  })

  test("throws when the custom headers contain no usable names", () => {
    expect(() =>
      prepareCsvInput(
        "1,2",
        {
          ...DEFAULT_CSV_TO_JSON_OPTIONS,
          noHeader: true,
          headersText: " , ",
        },
        ","
      )
    ).toThrow("Enter at least one custom header.")
  })

  test("throws when custom headers are used without an explicit delimiter", () => {
    expect(() =>
      prepareCsvInput(
        "1;2",
        {
          ...DEFAULT_CSV_TO_JSON_OPTIONS,
          noHeader: true,
          delimiter: "",
          headersText: "name,age",
        },
        undefined
      )
    ).toThrow("Choose a delimiter when using custom headers.")
  })
})

describe("error message helpers", () => {
  test("formats parse errors with row information when available", () => {
    expect(
      getParseErrorMessage({
        code: "MissingQuotes",
        message: "Quoted field unterminated",
        row: 2,
        type: "Quotes",
      })
    ).toBe("Row 3: Quoted field unterminated")
  })

  test("formats parse errors without a row number", () => {
    expect(
      getParseErrorMessage({
        code: "UndetectableDelimiter",
        message: "Unable to auto-detect delimiting character.",
        row: undefined,
        type: "Delimiter",
      })
    ).toBe("Unable to auto-detect delimiting character.")
  })

  test("returns the error message for Error instances", () => {
    expect(
      getConvertCsvToJsonErrorMessage(new Error("Invalid CSV payload"))
    ).toBe("Invalid CSV payload")
  })

  test("returns a fallback for unknown values", () => {
    expect(getConvertCsvToJsonErrorMessage("boom")).toBe("Unknown error")
  })
})

describe("convertCsvToJsonText", () => {
  test("returns an idle result for empty input", () => {
    expect(convertCsvToJsonText("   ")).toEqual({
      state: "idle",
      json: "",
    })
  })

  test("converts CSV rows with a header row into JSON objects", () => {
    const result = convertCsvToJsonText("name,age\nAda,36\nLinus,32")

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toBe(
      '[\n  {\n    "name": "Ada",\n    "age": "36"\n  },\n  {\n    "name": "Linus",\n    "age": "32"\n  }\n]'
    )
  })

  test("supports custom headers, dynamic typing, trimming, regex filters, preview, and compact output", () => {
    const result = convertCsvToJsonText(
      " Ada ; 36 ; keep \n Linus ; 32 ; drop ",
      {
        noHeader: true,
        headersText: "name,age,tag",
        delimiter: ";",
        trim: true,
        checkType: true,
        includeColumns: "name|age",
        preview: 1,
        indentSize: 0,
      }
    )

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toBe('[{"name":"Ada","age":36}]')
  })

  test("falls back to the default quote handling and keeps whitespace when trim is disabled", () => {
    const result = convertCsvToJsonText('" name "|" age "\n" Ada "|" 36 "', {
      delimiter: "|",
      trim: false,
      quoteChar: "",
      escapeChar: "",
      indentSize: 0,
    })

    expect(result).toEqual({
      state: "converted",
      json: '[{" name ":" Ada "," age ":" 36 "}]',
    })
  })

  test("supports raw rows, skip options, comments, newline, delimiter guesses, and fast mode", () => {
    const result = convertCsvToJsonText(
      "# comment\r\nskip-me\r\n1\t2\r\n\r\n3\t4",
      {
        noHeader: true,
        delimiter: "\\t",
        newline: "\\r\\n",
        skipEmptyLines: "greedy",
        comments: "#",
        skipFirstNLines: 1,
        delimitersToGuessText: ",,\\t,|",
        fastMode: true,
      }
    )

    expect(result.state).toBe("converted")

    if (result.state !== "converted") {
      throw new Error("Expected a converted result")
    }

    expect(result.json).toBe(
      '[\n  [\n    "skip-me"\n  ],\n  [\n    "1",\n    "2"\n  ],\n  [\n    "3",\n    "4"\n  ]\n]'
    )
  })

  test("supports the boolean skip-empty-lines mode", () => {
    const result = convertCsvToJsonText("1\n\n2", {
      noHeader: true,
      skipEmptyLines: "true",
      indentSize: 0,
    })

    expect(result).toEqual({
      state: "converted",
      json: '[["1"],["2"]]',
    })
  })

  test("supports ignore-column filters without include filters", () => {
    const result = convertCsvToJsonText("name,age,city\nAda,36,Paris", {
      ignoreColumns: "age",
      indentSize: 0,
    })

    expect(result).toEqual({
      state: "converted",
      json: '[{"name":"Ada","city":"Paris"}]',
    })
  })

  test("keeps raw array rows when column filters are set without headers", () => {
    const result = convertCsvToJsonText("1,2", {
      noHeader: true,
      includeColumns: "value",
      indentSize: 0,
    })

    expect(result).toEqual({
      state: "converted",
      json: '[["1","2"]]',
    })
  })

  test("returns a parse error when the CSV content is malformed", () => {
    const result = convertCsvToJsonText('name,quote\nAda,"unterminated')

    expect(result.state).toBe("error")

    if (result.state !== "error") {
      throw new Error("Expected an error result")
    }

    expect(result.json).toBe("")
    expect(result.message).toContain("Quoted field unterminated")
  })

  test("returns an error when include or ignore regex patterns are invalid", () => {
    const result = convertCsvToJsonText("name,age\nAda,36", {
      includeColumns: "[",
    })

    expect(result).toEqual({
      state: "error",
      json: "",
      message: "Invalid regular expression: /[/: Unterminated character class",
    })
  })

  test("returns an error when custom headers are requested without usable names", () => {
    const result = convertCsvToJsonText("1,2", {
      noHeader: true,
      headersText: " , ",
    })

    expect(result).toEqual({
      state: "error",
      json: "",
      message: "Enter at least one custom header.",
    })
  })

  test("returns an error when custom headers are used with auto delimiter detection", () => {
    const result = convertCsvToJsonText("Ada;36", {
      noHeader: true,
      delimiter: "",
      headersText: "name,age",
    })

    expect(result).toEqual({
      state: "error",
      json: "",
      message: "Choose a delimiter when using custom headers.",
    })
  })
})
