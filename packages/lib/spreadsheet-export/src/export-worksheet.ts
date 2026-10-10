import { parseRange, cellAddress } from "./range"
import { saved } from "./read-workbook"
import type { Workbook } from "./read-workbook"
import { cellValue, delimitedCell, markdownCell } from "./values"
import type { Options, Output } from "./types"

const formats = {
  csv: { extension: "csv", mime: "text/csv" },
  tsv: { extension: "tsv", mime: "text/tab-separated-values" },
  json: { extension: "json", mime: "application/json" },
  markdown: { extension: "md", mime: "text/markdown" },
}

export async function exportWorksheet(
  workbook: Workbook,
  options: Options,
  signal: AbortSignal
): Promise<Output> {
  signal.throwIfAborted()
  const info = workbook.sheets[options.sheet]
  const sheet = workbook.book.Sheets[workbook.book.SheetNames[options.sheet]!]
  if (!info || !sheet) throw new Error("invalid")
  const range = parseRange(options.range) ?? parseRange(info.range)
  const rows = range ? range.e.r - range.s.r + 1 : 0
  const columns = range ? range.e.c - range.s.c + 1 : 0
  const lines: string[] = []
  const markdownSeparator =
    options.format === "markdown" && columns
      ? `| ${Array(columns).fill("---").join(" | ")} |`
      : ""
  let missingCached = 0,
    visited = 0,
    empty = true
  for (let row = 0; row < rows; row++) {
    const values = []
    for (let column = 0; column < columns; column++) {
      const cell = sheet[cellAddress(range!.s.r + row, range!.s.c + column)]
      if (saved(cell)) empty = false
      if (
        cell &&
        typeof cell.f === "string" &&
        (cell.t === "z" || cell.v == null)
      )
        missingCached++
      values.push(cellValue(cell, options.values))
      if (++visited % 4096 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0))
        signal.throwIfAborted()
      }
    }
    if (options.format === "json") lines.push(JSON.stringify(values))
    else if (options.format === "markdown") {
      if (row === 0 && !options.firstRowHeader) {
        lines.push(
          `| ${Array(columns).fill("").join(" | ")} |`,
          markdownSeparator
        )
      }
      lines.push(
        `| ${values.map((value) => markdownCell(String(value ?? ""))).join(" | ")} |`
      )
      if (row === 0 && options.firstRowHeader) lines.push(markdownSeparator)
    } else {
      const delimiter = options.format === "csv" ? "," : "\t"
      lines.push(
        values
          .map((value) => delimitedCell(String(value ?? ""), delimiter))
          .join(delimiter)
      )
    }
  }
  signal.throwIfAborted()
  const format = formats[options.format]
  const base = workbook.filename.replace(/\.[^.]+$/, "")
  const filename = `${base}-${info.name}.${format.extension}`.replace(
    /[<>:"/\\|?*\p{Cc}]/gu,
    "_"
  )
  const lineBreak = options.format === "markdown" ? "\n" : "\r\n"
  return {
    text:
      options.format === "json"
        ? `[${lines.length ? "\n" + lines.join(",\n") + "\n" : ""}]`
        : lines.join(lineBreak) + (lines.length ? lineBreak : ""),
    mime: `${format.mime};charset=utf-8`,
    filename,
    rows,
    columns,
    empty,
    missingCached,
  }
}
