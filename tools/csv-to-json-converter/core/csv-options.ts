type SkipEmptyLinesMode = "none" | "true" | "greedy"
type CsvNewline = "\r" | "\n" | "\r\n"

type CsvToJsonOptions = Readonly<{
  noHeader: boolean
  headersText: string
  delimiter: string
  quoteChar: string
  trim: boolean
  checkType: boolean
  skipEmptyLines: SkipEmptyLinesMode
  escapeChar: string
  newline: string
  preview: number
  comments: string
  fastMode: boolean
  skipFirstNLines: number
  delimitersToGuessText: string
  includeColumns: string
  ignoreColumns: string
  indentSize: number
}>

const DEFAULT_CSV_TO_JSON_OPTIONS: CsvToJsonOptions = {
  noHeader: false,
  headersText: "",
  delimiter: ",",
  quoteChar: '"',
  trim: true,
  checkType: false,
  skipEmptyLines: "none",
  escapeChar: '"',
  newline: "",
  preview: 0,
  comments: "",
  fastMode: false,
  skipFirstNLines: 0,
  delimitersToGuessText: "",
  includeColumns: "",
  ignoreColumns: "",
  indentSize: 2,
}

function clampIndentSize(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return DEFAULT_CSV_TO_JSON_OPTIONS.indentSize
  }

  return Math.min(8, Math.max(0, Math.round(value)))
}

function clampNonNegativeInteger(value: unknown) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0
  }

  return Math.max(0, Math.round(value))
}

function decodeEscapedCharacters(value: string) {
  return value
    .replaceAll("\\t", "\t")
    .replaceAll("\\r", "\r")
    .replaceAll("\\n", "\n")
}

function normalizeCsvToJsonOptions(
  options: Partial<CsvToJsonOptions> | undefined
): CsvToJsonOptions {
  return {
    noHeader:
      typeof options?.noHeader === "boolean"
        ? options.noHeader
        : DEFAULT_CSV_TO_JSON_OPTIONS.noHeader,
    headersText:
      typeof options?.headersText === "string"
        ? options.headersText
        : DEFAULT_CSV_TO_JSON_OPTIONS.headersText,
    delimiter:
      typeof options?.delimiter === "string"
        ? options.delimiter
        : DEFAULT_CSV_TO_JSON_OPTIONS.delimiter,
    quoteChar:
      typeof options?.quoteChar === "string"
        ? options.quoteChar
        : DEFAULT_CSV_TO_JSON_OPTIONS.quoteChar,
    trim:
      typeof options?.trim === "boolean"
        ? options.trim
        : DEFAULT_CSV_TO_JSON_OPTIONS.trim,
    checkType:
      typeof options?.checkType === "boolean"
        ? options.checkType
        : DEFAULT_CSV_TO_JSON_OPTIONS.checkType,
    skipEmptyLines:
      options?.skipEmptyLines === "true" || options?.skipEmptyLines === "greedy"
        ? options.skipEmptyLines
        : DEFAULT_CSV_TO_JSON_OPTIONS.skipEmptyLines,
    escapeChar:
      typeof options?.escapeChar === "string"
        ? options.escapeChar
        : DEFAULT_CSV_TO_JSON_OPTIONS.escapeChar,
    newline:
      typeof options?.newline === "string"
        ? options.newline
        : DEFAULT_CSV_TO_JSON_OPTIONS.newline,
    preview: clampNonNegativeInteger(options?.preview),
    comments:
      typeof options?.comments === "string"
        ? options.comments
        : DEFAULT_CSV_TO_JSON_OPTIONS.comments,
    fastMode:
      typeof options?.fastMode === "boolean"
        ? options.fastMode
        : DEFAULT_CSV_TO_JSON_OPTIONS.fastMode,
    skipFirstNLines: clampNonNegativeInteger(options?.skipFirstNLines),
    delimitersToGuessText:
      typeof options?.delimitersToGuessText === "string"
        ? options.delimitersToGuessText
        : DEFAULT_CSV_TO_JSON_OPTIONS.delimitersToGuessText,
    includeColumns:
      typeof options?.includeColumns === "string"
        ? options.includeColumns
        : DEFAULT_CSV_TO_JSON_OPTIONS.includeColumns,
    ignoreColumns:
      typeof options?.ignoreColumns === "string"
        ? options.ignoreColumns
        : DEFAULT_CSV_TO_JSON_OPTIONS.ignoreColumns,
    indentSize: clampIndentSize(options?.indentSize),
  }
}

function resolveDelimiter(rawDelimiter: string) {
  const trimmed = rawDelimiter.trim()

  if (trimmed === "" || trimmed.toLowerCase() === "auto") {
    return undefined
  }

  return decodeEscapedCharacters(trimmed)
}

function resolveNewline(rawNewline: string) {
  const trimmed = rawNewline.trim()

  if (trimmed === "" || trimmed.toLowerCase() === "auto") {
    return undefined
  }

  const newline = decodeEscapedCharacters(trimmed)

  if (newline === "\r" || newline === "\n" || newline === "\r\n") {
    return newline
  }

  return undefined
}

function resolveDelimitersToGuess(rawValue: string) {
  if (rawValue.trim() === "") {
    return undefined
  }

  const values: string[] = []
  const segments = rawValue.split(",")

  for (let index = 0; index < segments.length; index += 1) {
    const segment = segments[index]

    if (segment === undefined) {
      continue
    }

    if (segment === "") {
      values.push(",")

      while (segments[index + 1] === "") {
        index += 1
      }

      continue
    }

    values.push(decodeEscapedCharacters(segment))
  }

  return [...new Set(values.filter(Boolean))]
}

export {
  DEFAULT_CSV_TO_JSON_OPTIONS,
  clampIndentSize,
  clampNonNegativeInteger,
  decodeEscapedCharacters,
  normalizeCsvToJsonOptions,
  resolveDelimiter,
  resolveDelimitersToGuess,
  resolveNewline,
}
export type { CsvNewline, CsvToJsonOptions, SkipEmptyLinesMode }
