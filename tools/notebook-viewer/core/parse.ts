import { Marked } from "marked"
import { code } from "./highlight"
import { output } from "./outputs"
import { pre, record, text } from "./text"
import type { Cell, Notebook } from "../types"

export function parse(source: string): Notebook {
  const notebook = record(JSON.parse(source))
  if (!Number.isInteger(notebook.nbformat)) throw new Error("INVALID")
  if (notebook.nbformat !== 4) throw new Error("VERSION")
  if (
    !Number.isInteger(notebook.nbformat_minor) ||
    Number(notebook.nbformat_minor) < 0 ||
    !Array.isArray(notebook.cells)
  )
    throw new Error("INVALID")
  const metadata =
    notebook.metadata === undefined ? {} : record(notebook.metadata)
  const languageInfo =
    metadata.language_info === undefined ? {} : record(metadata.language_info)
  const language =
    typeof languageInfo.name === "string" ? languageInfo.name.toLowerCase() : ""
  const markdown = new Marked({
    renderer: {
      code: (token) => code(token.text, token.lang?.split(/\s/)[0] || language),
    },
  })
  const cells: Cell[] = notebook.cells.map((value) => {
    const cell = record(value)
    if (typeof cell.cell_type !== "string") throw new Error("INVALID")
    const source = text(cell.source)
    const kind =
      cell.cell_type === "markdown" ||
      cell.cell_type === "code" ||
      cell.cell_type === "raw"
        ? cell.cell_type
        : "unknownCell"
    const attachments =
      cell.attachments === undefined ? {} : record(cell.attachments)
    const bundles = Object.fromEntries(
      Object.entries(attachments).map(([name, bundle]) => [
        name,
        record(bundle),
      ])
    )
    const result: Cell = {
      kind,
      html:
        kind === "markdown"
          ? markdown.parse(source, { async: false })
          : kind === "code"
            ? code(source, language)
            : pre(source),
      attachments: bundles,
      count: null,
      outputs: [],
    }
    if (kind === "code") {
      if (
        cell.execution_count !== null &&
        (!Number.isInteger(cell.execution_count) ||
          Number(cell.execution_count) < 0)
      )
        throw new Error("INVALID")
      if (!Array.isArray(cell.outputs)) throw new Error("INVALID")
      result.count = cell.execution_count as number | null
      result.outputs = cell.outputs.map(output)
    }
    return result
  })
  return { cells }
}
