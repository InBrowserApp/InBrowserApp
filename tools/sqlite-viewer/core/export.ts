import type { Cell, QueryResult } from "../types"

function hex(value: Uint8Array) {
  const digits = "0123456789abcdef"
  const encoded = new Uint8Array(value.length * 2)
  for (let index = 0; index < value.length; index++) {
    const byte = value[index]!
    encoded[index * 2] = digits.charCodeAt(byte >> 4)
    encoded[index * 2 + 1] = digits.charCodeAt(byte & 15)
  }
  return new TextDecoder().decode(encoded)
}

function cellText(value: Cell) {
  if (value === null) return "NULL"
  if (value instanceof Uint8Array) return `X'${hex(value)}'`
  return String(value)
}

function csvField(value: Cell) {
  let text = value === null ? "" : cellText(value)
  // Guard text (including headers), while preserving negative numeric values.
  // oxlint-disable-next-line no-control-regex -- Spreadsheet parsers ignore leading controls before formulas.
  if (typeof value === "string" && /^[\s\u0000-\u001f]*[=+\-@]/.test(text)) {
    text = `'${text}`
  }
  return `"${text.replaceAll('"', '""')}"`
}

function exportResult(result: QueryResult, format: "csv" | "json") {
  if (format === "csv") {
    return (
      "\uFEFF" +
      [result.columns, ...result.rows]
        .map((row) => row.map(csvField).join(","))
        .join("\r\n") +
      "\r\n"
    )
  }
  return JSON.stringify(
    { columns: result.columns, rows: result.rows },
    (_, value) => {
      if (typeof value === "bigint") return value.toString()
      if (value instanceof Uint8Array) return { $blob: hex(value) }
      if (typeof value === "number" && !Number.isFinite(value))
        return String(value)
      return value
    },
    2
  )
}

export { cellText, exportResult }
