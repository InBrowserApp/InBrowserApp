import Papa from "papaparse"

export type CsvColumn = string | readonly [string, ...string[]]

export class CsvRowError extends Error {
  constructor(readonly row: number) {
    super(`Invalid CSV row ${row}`)
  }
}

const normalize = (header: string) =>
  header
    .trim()
    .toLowerCase()
    .replace(/[\s_–-]+/g, " ")

export function readCsv(
  source: string,
  columns: readonly CsvColumn[]
): { row: number; values: string[] }[] {
  const { data, errors } = Papa.parse<string[]>(source.trim(), {
    delimitersToGuess: [",", ";", "\t"],
  })
  const error = errors.find((issue) => issue.code !== "UndetectableDelimiter")
  if (error) throw new CsvRowError((error.row ?? 0) + 1)
  const [header = [], ...records] = data
  const headers = header.map(normalize)
  const indices = columns.map((column) =>
    (typeof column === "string" ? [column] : column)
      .map((alias) => headers.indexOf(normalize(alias)))
      .filter((index) => index >= 0)
  )
  if (!indices.some((matches) => matches.length)) return []
  return records.flatMap((record, index) => {
    const row = index + 2
    if (!record.some((value) => value.trim())) return []
    if (record.slice(header.length).some((value) => value.trim()))
      throw new CsvRowError(row)
    const values = indices.map(
      (matches) =>
        matches.map((match) => record[match]?.trim() ?? "").find(Boolean) ?? ""
    )
    return [{ row, values }]
  })
}

export function writeCsv(headers: string[], rows: string[][]): string {
  return (
    Papa.unparse([headers, ...rows], {
      escapeFormulae: /^(?:[=\t\r\n]|[+\-@](?![\d(). -]+$))/,
    }) + "\r\n"
  )
}
