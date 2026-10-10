import { strFromU8, unzipSync } from "fflate"
import { utils } from "xlsx"
import type { WorkBook, WorkSheet, Range } from "xlsx"
import type { Element } from "./xml"
import { describe } from "@workspace/spreadsheet-conversion"
import { attribute, children, parseXml, repeat } from "./xml"
import { valueCell } from "./values"

const mime = "application/vnd.oasis.opendocument.spreadsheet"
const allowed = new Set([
  "mimetype",
  "content.xml",
  "styles.xml",
  "META-INF/manifest.xml",
])

function rows(table: Element): Element[] {
  return table.elements.flatMap((node) => {
    if (node.name === "table:table-row") return [node]
    return [
      "table:table-row-group",
      "table:table-header-rows",
      "table:table-rows",
    ].includes(node.name ?? "")
      ? rows(node)
      : []
  })
}

function sheetData(table: Element) {
  const sheet: WorkSheet = Object.create(null)
  const merges: Range[] = []
  let range: Range | undefined
  let missingCaches = 0
  const include = (r: number, c: number, height: number, width: number) => {
    const end = { r: r + height - 1, c: c + width - 1 }
    if (end.r >= 1048576 || end.c >= 16384) throw new Error("unsupported")
    range ??= { s: { r, c }, e: end }
    range.s.r = Math.min(range.s.r, r)
    range.s.c = Math.min(range.s.c, c)
    range.e.r = Math.max(range.e.r, end.r)
    range.e.c = Math.max(range.e.c, end.c)
  }
  let r = 0
  for (const row of rows(table)) {
    const height = repeat(row, "table:number-rows-repeated")
    let c = 0
    for (const node of row.elements) {
      if (
        !["table:table-cell", "table:covered-table-cell"].includes(
          node.name ?? ""
        )
      )
        continue
      const width = repeat(node, "table:number-columns-repeated")
      const { cell, missing } = valueCell(node)
      if (node.name === "table:covered-table-cell" && (cell || missing))
        throw new Error("unsupported")
      if (node.name === "table:table-cell") {
        const spanRows = repeat(node, "table:number-rows-spanned")
        const spanCols = repeat(node, "table:number-columns-spanned")
        if ((spanRows > 1 || spanCols > 1) && (height > 1 || width > 1))
          throw new Error("unsupported")
        if (cell || missing) {
          include(r, c, height, width)
          if (cell)
            for (let y = r; y < r + height; y++)
              for (let x = c; x < c + width; x++)
                sheet[utils.encode_cell({ r: y, c: x })] = { ...cell }
          if (missing) missingCaches += height * width
        }
        if (spanRows > 1 || spanCols > 1) {
          include(r, c, spanRows, spanCols)
          merges.push({
            s: { r, c },
            e: { r: r + spanRows - 1, c: c + spanCols - 1 },
          })
        }
      }
      c += width
      if (!Number.isSafeInteger(c)) throw new Error("invalid")
    }
    r += height
    if (!Number.isSafeInteger(r)) throw new Error("invalid")
  }
  if (range) sheet["!ref"] = utils.encode_range(range)
  if (merges.length) sheet["!merges"] = merges
  return { sheet, missingCaches }
}

export function readOds(bytes: Uint8Array) {
  if (bytes[0] !== 80 || bytes[1] !== 75) throw new Error("unsupported")
  const files = unzipSync(bytes, { filter: (entry) => allowed.has(entry.name) })
  if (!files.mimetype || strFromU8(files.mimetype) !== mime)
    throw new Error("unsupported")
  const manifest = files["META-INF/manifest.xml"]
  if (manifest) {
    const root = children(parseXml(manifest), "manifest:manifest")[0]
    if (!root) throw new Error("invalid")
    if (
      children(root, "manifest:file-entry").some(
        (node) => children(node, "manifest:encryption-data").length
      )
    )
      throw new Error("protected")
  }
  if (!files["content.xml"]) throw new Error("invalid")
  const document = parseXml(files["content.xml"])
  const root = children(document, "office:document-content")[0]
  const body = root && children(root, "office:body")[0]
  const spreadsheet = body && children(body, "office:spreadsheet")[0]
  if (!spreadsheet) throw new Error("invalid")
  const styles = new Map<string, Element>()
  const documents = [document]
  if (files["styles.xml"]) {
    const stylesDocument = parseXml(files["styles.xml"])
    if (!children(stylesDocument, "office:document-styles").length)
      throw new Error("invalid")
    documents.unshift(stylesDocument)
  }
  for (const doc of documents)
    for (const root of doc.elements) {
      for (const group of [
        ...children(root, "office:automatic-styles"),
        ...children(root, "office:styles"),
      ]) {
        for (const style of children(group, "style:style"))
          if (attribute(style, "style:family") === "table")
            styles.set(attribute(style, "style:name") ?? "", style)
      }
    }
  function hidden(name: string, seen = new Set<string>()): boolean {
    const style = styles.get(name)
    if (!style) return false
    if (seen.has(name)) throw new Error("invalid")
    seen.add(name)
    const props = children(style, "style:table-properties")[0]
    const display = props && attribute(props, "table:display")
    return display === undefined
      ? hidden(attribute(style, "style:parent-style-name") ?? "", seen)
      : display === "false" || display === "0"
  }
  const book: WorkBook = {
    SheetNames: [],
    Sheets: Object.create(null),
    Workbook: { Sheets: [] },
  }
  const used = new Set<string>()
  let missingCaches = 0
  for (const table of children(spreadsheet, "table:table")) {
    const name = attribute(table, "table:name") ?? ""
    if (
      !name ||
      name.toLowerCase() === "history" ||
      name.length > 31 ||
      Array.from(name).some((c) => c < " " || "\\/:*?[]".includes(c)) ||
      name.startsWith("'") ||
      name.endsWith("'") ||
      used.has(name.toLowerCase())
    )
      throw new Error("unsupported")
    used.add(name.toLowerCase())
    const data = sheetData(table)
    book.SheetNames.push(name)
    book.Sheets[name] = data.sheet
    book.Workbook!.Sheets!.push({
      name,
      Hidden: hidden(attribute(table, "table:style-name") ?? "") ? 1 : 0,
    })
    missingCaches += data.missingCaches
  }
  const info = describe(book)
  if (info.sheets.every((sheet) => sheet.hidden)) throw new Error("unsupported")
  info.missingCaches = missingCaches
  return { book, info }
}
