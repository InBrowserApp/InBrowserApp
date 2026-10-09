import { xml2js } from "xml-js"
import type { Element } from "xml-js"
import { unzipSync } from "fflate"
import { utils } from "xlsx"
import type { CellObject, WorkBook, WorkSheet } from "xlsx"

const localName = (name: string) => name.split(":").at(-1)!.split("_")[0]
const children = (node: Element) => node.elements ?? []
function named(node: Element, name: string): Element[] {
  const found: Element[] = []
  for (const child of children(node)) {
    if (child.name && localName(child.name) === name) found.push(child)
    else found.push(...named(child, name))
  }
  return found
}
function attribute(node: Element, name: string) {
  const entry = Object.entries(node.attributes ?? {}).find(
    ([key]) => localName(key) === name
  )
  return entry ? String(entry[1]) : undefined
}
function coordinate(value: string | undefined, fallback: number) {
  if (value === undefined) return fallback
  const parsed = Number(value)
  if (!Number.isSafeInteger(parsed) || parsed < 1) throw new Error("INVALID")
  return parsed - 1
}
function text(node: Element): string {
  return children(node)
    .map((child) =>
      child.type === "text" || child.type === "cdata"
        ? String(child.text ?? child.cdata ?? "")
        : text(child)
    )
    .join("")
}
function cellValue(cell: Element): CellObject | null {
  const content = named(cell, "数据")[0]
  if (!content) return null
  const type = attribute(content, "数据类型")
  const value = attribute(content, "数据数值")
  const display = named(content, "文本串").map(text).join("")
  const formula = attribute(cell, "公式") ?? attribute(content, "公式")
  let result: CellObject
  if (type === "number") {
    const saved = value ?? (display.trim() || undefined)
    if (saved === undefined) result = { t: "n" }
    else {
      const numeric = Number(saved)
      if (!Number.isFinite(numeric)) throw new Error("INVALID")
      result = { t: "n", v: numeric }
    }
  } else if (type === "boolean") {
    result = {
      t: "b",
      v: (value ?? display) === "true" || (value ?? display) === "1",
    }
  } else if (type === undefined || type === "text" || type === "string") {
    result = { t: "s", v: display }
  } else {
    // Keep the saved display of dates and format-specific cell types. Never
    // infer dates or evaluate formulas from their text representation.
    result = { t: "s", v: display || value || "" }
  }
  if (formula) result.f = formula.replace(/^=/, "")
  return result
}

export function readUos(data: ArrayBuffer): WorkBook {
  let bytes = new Uint8Array(data)
  if (bytes[0] === 0x50 && bytes[1] === 0x4b) {
    const archive = unzipSync(bytes, {
      filter: (entry) => entry.name === "content.xml",
    })
    bytes = archive["content.xml"]!
    if (!bytes) throw new Error("INVALID")
  }
  const xml = new TextDecoder().decode(bytes)
  const document = xml2js(xml, {
    compact: false,
    ignoreDoctype: true,
  }) as Element
  const tables = named(document, "工作表")
  if (!tables.length) throw new Error("INVALID")
  const book: WorkBook = {
    Sheets: {},
    SheetNames: [],
    Workbook: { Sheets: [] },
  }
  tables.forEach((table, index) => {
    const name = attribute(table, "名称") || `Sheet ${index + 1}`
    if (book.SheetNames.includes(name)) throw new Error("INVALID")
    const sheet: WorkSheet = { "!merges": [] }
    let nextRow = 0,
      lastRow = 0,
      lastCol = 0
    for (const row of named(table, "行")) {
      const r = coordinate(attribute(row, "行号"), nextRow)
      nextRow = r + 1
      let nextCol = 0
      for (const cell of named(row, "单元格")) {
        const c = coordinate(attribute(cell, "列号"), nextCol)
        nextCol = c + 1
        const value = cellValue(cell)
        if (value) sheet[utils.encode_cell({ r, c })] = value
        const rows = coordinate(attribute(cell, "合并行数"), 0) + 1
        const columns = coordinate(attribute(cell, "合并列数"), 0) + 1
        if (rows > 1 || columns > 1)
          sheet["!merges"]!.push({
            s: { r, c },
            e: { r: r + rows - 1, c: c + columns - 1 },
          })
        lastRow = Math.max(lastRow, r + rows - 1)
        lastCol = Math.max(lastCol, c + columns - 1)
      }
    }
    sheet["!ref"] = utils.encode_range({
      s: { r: 0, c: 0 },
      e: { r: lastRow, c: lastCol },
    })
    book.SheetNames.push(name)
    book.Sheets[name] = sheet
    book.Workbook!.Sheets!.push({
      name,
      Hidden: attribute(table, "隐藏") === "true" ? 1 : 0,
    })
  })
  return book
}
