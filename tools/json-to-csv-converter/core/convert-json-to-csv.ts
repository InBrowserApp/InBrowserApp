import { unparse, type UnparseConfig, type UnparseObject } from "papaparse"

type JsonToCsvOptions = Readonly<{
  delimiter: string
  quoteChar: string
  includeHeaderRow: boolean
  escapeFormulae: boolean
}>

type JsonToCsvInput = unknown[] | UnparseObject<unknown>

type ConvertJsonToCsvResult =
  | {
      state: "idle"
      csv: string
    }
  | {
      state: "converted"
      csv: string
    }
  | {
      state: "error"
      csv: string
      message: string
    }

const DEFAULT_JSON_TO_CSV_OPTIONS: JsonToCsvOptions = {
  delimiter: ",",
  quoteChar: '"',
  includeHeaderRow: true,
  escapeFormulae: true,
}

const INVALID_JSON_TO_CSV_INPUT_MESSAGE =
  'Enter a JSON array or an object with "fields" and "data".'

function normalizeJsonToCsvOptions(
  options?: Partial<JsonToCsvOptions>
): JsonToCsvOptions {
  return {
    delimiter: normalizeDelimiter(options?.delimiter),
    quoteChar: normalizeQuoteChar(options?.quoteChar),
    includeHeaderRow:
      options?.includeHeaderRow ?? DEFAULT_JSON_TO_CSV_OPTIONS.includeHeaderRow,
    escapeFormulae:
      options?.escapeFormulae ?? DEFAULT_JSON_TO_CSV_OPTIONS.escapeFormulae,
  }
}

function normalizeDelimiter(delimiter: string | undefined) {
  return delimiter && delimiter.length > 0
    ? delimiter
    : DEFAULT_JSON_TO_CSV_OPTIONS.delimiter
}

function normalizeQuoteChar(quoteChar: string | undefined) {
  if (quoteChar === undefined) {
    return DEFAULT_JSON_TO_CSV_OPTIONS.quoteChar
  }

  return quoteChar === "" ? "" : quoteChar[0]!
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value)
}

function isUnparseObject(value: unknown): value is UnparseObject<unknown> {
  if (!isRecord(value)) {
    return false
  }

  return Array.isArray(value.fields) && Array.isArray(value.data)
}

function isJsonToCsvInput(value: unknown): value is JsonToCsvInput {
  return Array.isArray(value) || isUnparseObject(value)
}

function parseJsonToCsvInput(input: string) {
  const parsedValue = JSON.parse(input) as unknown

  if (!isJsonToCsvInput(parsedValue)) {
    throw new Error(INVALID_JSON_TO_CSV_INPUT_MESSAGE)
  }

  return parsedValue
}

function createUnparseConfig(options: JsonToCsvOptions): UnparseConfig {
  const quoteChar = options.quoteChar || DEFAULT_JSON_TO_CSV_OPTIONS.quoteChar

  return {
    delimiter: options.delimiter,
    quotes: false,
    quoteChar,
    header: options.includeHeaderRow,
    escapeFormulae: options.escapeFormulae,
  }
}

function getConvertJsonToCsvErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Unknown error"
}

function convertJsonToCsvText(
  input: string,
  options?: Partial<JsonToCsvOptions>
): ConvertJsonToCsvResult {
  if (input.trim() === "") {
    return {
      state: "idle",
      csv: "",
    }
  }

  try {
    const normalizedOptions = normalizeJsonToCsvOptions(options)
    const parsedValue = parseJsonToCsvInput(input)
    const csv = unparse(parsedValue, createUnparseConfig(normalizedOptions))

    return {
      state: "converted",
      csv,
    }
  } catch (error) {
    return {
      state: "error",
      csv: "",
      message: getConvertJsonToCsvErrorMessage(error),
    }
  }
}

export {
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
}
export type { JsonToCsvOptions }
