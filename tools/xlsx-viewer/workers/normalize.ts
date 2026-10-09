import { read, utils, set_cptable } from "xlsx"
import * as cptable from "xlsx/dist/cpexcel.full.mjs"
import type { WorkBook } from "xlsx"
import { extension, isDelimited } from "../formats"
import type { ImportOptions, ImportResult, ImportNotice } from "../formats"
import { workbookArchive } from "./workbook-archive"
import { readOpenDocument } from "./fods"
import { readUos } from "./uos"
import { readDelimited } from "./delimited"
import { assertSpreadsheet } from "./signatures"

set_cptable(cptable)

export function normalizeSpreadsheet(
  data: ArrayBuffer,
  name: string,
  options: ImportOptions
): ImportResult {
  assertSpreadsheet(data, name)
  const notices: ImportNotice[] = []
  let book: WorkBook
  if (isDelimited(name)) {
    const result = readDelimited(data, name, options)
    book = utils.book_new()
    utils.book_append_sheet(
      book,
      result.sheet,
      name
        .replace(/\.(csv|tsv)$/i, "")
        .slice(0, 31)
        .replace(/[\\/?*[\]:]/g, "_") || "Table"
    )
    notices.push(...result.notices)
  } else {
    const ext = extension(name)
    book =
      ext === "uos"
        ? readUos(data)
        : ext === "ods" || ext === "fods"
          ? readOpenDocument(data, ext === "fods")
          : read(data, {
              type: "array",
              raw: true,
              cellFormula: true,
              cellNF: true,
              cellHTML: false,
              cellStyles: false,
              bookVBA: false,
              PRN: ext === "prn",
              WTF: true,
            })
    notices.push("dataOnly")
    if (extension(name) === "numbers") notices.push("numbersTables")
  }
  if (!book.SheetNames.length) throw new Error("INVALID")
  const names = [...book.SheetNames]
  return { data: workbookArchive(book), names, notices }
}
