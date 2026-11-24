import Papa from "papaparse"

const delimiters = [",", "\t", ";", "|"]

type Linebreak = "\n" | "\r\n" | "\r"

type Encoding = "utf-8" | "utf-16le" | "utf-16be"

export type CsvFormat = {
  delimiter: string
  linebreak: Linebreak
  finalLinebreak: boolean
  directive: string
  encoding: Encoding
  bom: boolean
  extension: "csv" | "tsv"
}

export type CsvDocument = {
  rows: string[][]
  format: CsvFormat
}

export function readCsv(bytes: Uint8Array, fileName: string): CsvDocument {
  const encoding =
    bytes[0] === 0xff && bytes[1] === 0xfe
      ? "utf-16le"
      : bytes[0] === 0xfe && bytes[1] === 0xff
        ? "utf-16be"
        : "utf-8"
  const text = new TextDecoder(encoding, {
    fatal: true,
    ignoreBOM: true,
  }).decode(bytes)
  return parseCsv(text, fileName, encoding)
}

// Normalize record endings independently of line breaks inside quoted fields.
function recordEndings(text: string, separators: string[]) {
  let linebreak: Linebreak | undefined
  let quoted = false
  let fieldStart = true
  let start = 0
  const chunks: string[] = []
  for (let index = 0; index < text.length; index++) {
    const char = text.charAt(index)
    if (quoted) {
      if (char === '"') {
        if (text[index + 1] === '"') index++
        else quoted = false
      }
    } else if (char === '"' && fieldStart) {
      quoted = true
      fieldStart = false
    } else if (char === "\r" || char === "\n") {
      const ending =
        char === "\n" ? "\n" : text[index + 1] === "\n" ? "\r\n" : "\r"
      const end = index + ending.length
      linebreak ||= ending
      if (ending !== linebreak) {
        chunks.push(text.slice(start, index), linebreak)
        start = end
      }
      index = end - 1
      fieldStart = true
    } else {
      fieldStart = separators.includes(char)
    }
  }
  return {
    text: chunks.length ? chunks.join("") + text.slice(start) : text,
    linebreak: linebreak || "\n",
  }
}

function detectDelimiter(body: string) {
  const { text, linebreak } = recordEndings(body, delimiters)
  let detected = ","
  let best = 0
  let bestWidth = 1
  for (const delimiter of delimiters) {
    const { data } = Papa.parse<string[]>(text, {
      delimiter,
      newline: linebreak,
      preview: 20,
      skipEmptyLines: true,
    })
    const widths = new Map<number, number>()
    for (const row of data) {
      if (row.length > 1)
        widths.set(row.length, (widths.get(row.length) ?? 0) + 1)
    }
    // Prefer a repeated column count. In a tie, keep the wider table.
    for (const [width, count] of widths) {
      const score = count / data.length
      if (score > best || (score === best && width > bestWidth)) {
        best = score
        bestWidth = width
        detected = delimiter
      }
    }
  }
  return detected
}

export function parseCsv(
  text: string,
  fileName = "",
  encoding: Encoding = "utf-8"
): CsvDocument {
  const bom = text.startsWith("\uFEFF")
  if (bom) text = text.slice(1)
  const directive = /^sep=([,;\t|])(?:\r\n|\r|\n)/i.exec(text)
  const body = text.slice(directive?.[0].length ?? 0)
  if (!body) throw new Error("empty")
  if (body.includes("\0")) throw new Error("invalid")

  const namedTsv = /\.tsv$/i.test(fileName)
  const delimiter = directive?.[1] ?? (namedTsv ? "\t" : detectDelimiter(body))
  const normalized = recordEndings(body, [delimiter])
  const { linebreak } = normalized
  const result = Papa.parse<string[]>(normalized.text, {
    delimiter,
    newline: linebreak,
  })
  if (result.errors.some((error) => error.type === "Quotes"))
    throw new Error("invalid")

  const finalLinebreak = normalized.text.endsWith(linebreak)
  if (finalLinebreak) result.data.pop()

  return {
    rows: result.data,
    format: {
      delimiter,
      linebreak,
      finalLinebreak,
      directive: directive?.[0] ?? "",
      encoding,
      bom,
      extension:
        namedTsv || (!/\.csv$/i.test(fileName) && delimiter === "\t")
          ? "tsv"
          : "csv",
    },
  }
}

export function serializeCsv(
  rows: string[][],
  columns: number[],
  format: CsvFormat
) {
  const { delimiter, linebreak, directive, finalLinebreak } = format
  const records = rows.map((row) => {
    const fields = columns.map((column) => row[column])
    while (fields.at(-1) === undefined && fields.length > 1) fields.pop()
    return fields
      .map((field = "") => {
        // Quoting other common separators also keeps dialect detection stable on reimport.
        const quote =
          (fields.length === 1 && field === "") ||
          /[,;|\t"\r\n]/.test(field) ||
          field !== field.trim()
        return quote ? `"${field.replaceAll('"', '""')}"` : field
      })
      .join(delimiter)
  })
  return (
    directive +
    records.join(linebreak) +
    (finalLinebreak && records.length ? linebreak : "")
  )
}

export function encodeCsv(text: string, { encoding, bom }: CsvFormat) {
  const content = bom ? "\uFEFF" + text : text
  if (encoding === "utf-8") return new TextEncoder().encode(content)

  const bytes = new Uint8Array(content.length * 2)
  const view = new DataView(bytes.buffer)
  for (let index = 0; index < content.length; index++) {
    view.setUint16(
      index * 2,
      content.charCodeAt(index),
      encoding === "utf-16le"
    )
  }
  return bytes
}
