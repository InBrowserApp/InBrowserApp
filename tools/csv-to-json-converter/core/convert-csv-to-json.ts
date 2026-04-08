import { parse, type ParseError, type ParseResult } from "papaparse"

import {
  DEFAULT_CSV_TO_JSON_OPTIONS,
  clampIndentSize,
  clampNonNegativeInteger,
  decodeEscapedCharacters,
  normalizeCsvToJsonOptions,
  type CsvNewline,
  resolveDelimiter,
  resolveDelimitersToGuess,
  resolveNewline,
  type CsvToJsonOptions,
  type SkipEmptyLinesMode,
} from "./csv-options"

type ConvertCsvToJsonResult =
  | {
      state: "idle"
      json: string
    }
  | {
      state: "converted"
      json: string
    }
  | {
      state: "error"
      json: string
      message: string
    }

function getConvertCsvToJsonErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function getParseErrorMessage(error: ParseError) {
  const rowPrefix =
    typeof error.row === "number" && error.row >= 0
      ? `Row ${error.row + 1}: `
      : ""

  return `${rowPrefix}${error.message}`
}

function createRegex(pattern: string) {
  if (pattern.trim() === "") {
    return undefined
  }

  return new RegExp(pattern)
}

function prepareCsvInput(
  csvText: string,
  options: CsvToJsonOptions,
  delimiter: string | undefined
) {
  if (!options.noHeader || options.headersText.trim() === "") {
    return csvText
  }

  if (!delimiter) {
    throw new Error("Choose a delimiter when using custom headers.")
  }

  const headers = options.headersText
    .split(",")
    .map((header) => header.trim())
    .filter(Boolean)

  if (headers.length === 0) {
    throw new Error("Enter at least one custom header.")
  }

  return `${headers.join(delimiter)}\n${csvText}`
}

function filterColumns(
  data: unknown[],
  includePattern: RegExp | undefined,
  ignorePattern: RegExp | undefined
) {
  if (!includePattern && !ignorePattern) {
    return data
  }

  return data.map((row) => {
    if (!row || typeof row !== "object" || Array.isArray(row)) {
      return row
    }

    const nextRow: Record<string, unknown> = {}

    for (const [key, value] of Object.entries(row)) {
      if (includePattern && !includePattern.test(key)) {
        continue
      }

      if (ignorePattern && ignorePattern.test(key)) {
        continue
      }

      nextRow[key] = value
    }

    return nextRow
  })
}

function parseCsv(
  input: string,
  options: CsvToJsonOptions,
  delimiter: string | undefined,
  newline: CsvNewline | undefined
): ParseResult<unknown> {
  const skipEmptyLines =
    options.skipEmptyLines === "none"
      ? false
      : options.skipEmptyLines === "true"
        ? true
        : "greedy"

  return parse<unknown>(input, {
    delimiter,
    newline,
    quoteChar: options.quoteChar || '"',
    escapeChar: options.escapeChar || options.quoteChar || '"',
    header: !options.noHeader || options.headersText.trim() !== "",
    dynamicTyping: options.checkType,
    fastMode: options.fastMode || undefined,
    skipEmptyLines,
    preview: options.preview,
    comments: options.comments.trim() === "" ? false : options.comments,
    delimitersToGuess: resolveDelimitersToGuess(options.delimitersToGuessText),
    skipFirstNLines: options.skipFirstNLines,
    transformHeader: options.trim
      ? (value) => (typeof value === "string" ? value.trim() : value)
      : undefined,
    transform: options.trim
      ? (value) => (typeof value === "string" ? value.trim() : value)
      : undefined,
  })
}

function convertCsvToJsonText(
  input: string,
  options?: Partial<CsvToJsonOptions>
): ConvertCsvToJsonResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      json: "",
    }
  }

  try {
    const normalizedOptions = normalizeCsvToJsonOptions(options)
    const delimiter = resolveDelimiter(normalizedOptions.delimiter)
    const newline = resolveNewline(normalizedOptions.newline)
    const inputWithHeaders = prepareCsvInput(
      input,
      normalizedOptions,
      delimiter
    )
    const result = parseCsv(
      inputWithHeaders,
      normalizedOptions,
      delimiter,
      newline
    )
    const [parseError] = result.errors

    if (parseError) {
      return {
        state: "error",
        json: "",
        message: getParseErrorMessage(parseError),
      }
    }

    const includePattern = createRegex(normalizedOptions.includeColumns)
    const ignorePattern = createRegex(normalizedOptions.ignoreColumns)
    const data = filterColumns(
      result.data as unknown[],
      includePattern,
      ignorePattern
    )

    return {
      state: "converted",
      json: JSON.stringify(data, null, normalizedOptions.indentSize),
    }
  } catch (error) {
    return {
      state: "error",
      json: "",
      message: getConvertCsvToJsonErrorMessage(error),
    }
  }
}

export {
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
}
export type { CsvToJsonOptions, SkipEmptyLinesMode }
