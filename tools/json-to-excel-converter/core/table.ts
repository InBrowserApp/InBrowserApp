import { LosslessNumber, parse, splitNumber, stringify } from "lossless-json"

const MAX_ROWS = 1_048_576
const MAX_COLUMNS = 16_384
const MAX_CELL_LENGTH = 32_767

type Cell = string | number | boolean | null
export type Spreadsheet = {
  headings: string[]
  rows: Cell[][]
}

type TableError =
  | "invalidJson"
  | "invalidRecords"
  | "noColumns"
  | "sheetLimit"
  | "cellLimit"
type Result =
  | { state: "empty" }
  | { state: "error"; error: TableError }
  | { state: "ready"; table: Spreadsheet }

function isRecord(value: unknown): value is Record<string, unknown> {
  return (
    value !== null &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    !(value instanceof LosslessNumber)
  )
}

function excelNumber(value: LosslessNumber): number | string {
  const source = value.toString()
  const { digits } = splitNumber(source)
  const number = Number(source)
  const magnitude = Math.abs(number)

  // Excel stores 15 significant digits and does not support subnormal numbers.
  return digits.length > 15 ||
    magnitude > 9.99999999999999e307 ||
    (digits !== "0" && magnitude < 2.2250738585072014e-308)
    ? source
    : number
}

function toCell(value: unknown): Cell {
  if (value instanceof LosslessNumber) return excelNumber(value)
  if (typeof value === "object" && value !== null) return stringify(value)!
  return value as string | boolean | null
}

function* fields(
  record: Record<string, unknown>,
  expand: boolean,
  prefix?: string
): Generator<[string, Cell]> {
  for (const [key, value] of Object.entries(record)) {
    // Escape literal separators so "a.b" and { a: { b: ... } } keep separate columns.
    const segment = expand ? key.replace(/[.\\]/g, "\\$&") : key
    const heading = prefix === undefined ? segment : `${prefix}.${segment}`
    if (expand && isRecord(value) && Object.keys(value).length) {
      yield* fields(value, expand, heading)
    } else {
      yield [heading, toCell(value)]
    }
  }
}

export function analyzeJson(text: string, expand: boolean): Result {
  const source = text.trim()
  if (!source) return { state: "empty" }

  let input: unknown
  try {
    input = parse(source, undefined, {
      onDuplicateKey: ({ newValue }) => newValue,
    })
  } catch {
    return { state: "error", error: "invalidJson" }
  }
  if (!Array.isArray(input) || !input.length || !input.every(isRecord)) {
    return { state: "error", error: "invalidRecords" }
  }
  if (input.length >= MAX_ROWS) return { state: "error", error: "sheetLimit" }

  const columns = new Map<string, number>()
  const rows: Spreadsheet["rows"] = []
  for (const record of input) {
    const row: Cell[] = []
    for (const [heading, cell] of fields(record, expand)) {
      if (
        heading.length > MAX_CELL_LENGTH ||
        (typeof cell === "string" && cell.length > MAX_CELL_LENGTH)
      ) {
        return { state: "error", error: "cellLimit" }
      }
      let column = columns.get(heading)
      if (column === undefined) {
        if (columns.size === MAX_COLUMNS)
          return { state: "error", error: "sheetLimit" }
        column = columns.size
        columns.set(heading, column)
      }
      row[column] = cell
    }
    rows.push(row)
  }
  if (!columns.size) return { state: "error", error: "noColumns" }
  return { state: "ready", table: { headings: [...columns.keys()], rows } }
}
