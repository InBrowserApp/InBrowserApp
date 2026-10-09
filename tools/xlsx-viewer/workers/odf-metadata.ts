import { utils } from "xlsx"
import type { WorkBook } from "xlsx"
import type { Element } from "xml-js"

const localName = (name?: string) => name?.split(":").at(-1)
function attribute(node: Element, name: string) {
  return Object.entries(node.attributes ?? {}).find(
    ([key]) => localName(key) === name
  )?.[1]
}
function descendants(node: Element, name: string): Element[] {
  return (node.elements ?? []).flatMap((child) => {
    // Cell notes are separate content, not part of the saved cell display.
    if (localName(child.name) === "annotation") return []
    return localName(child.name) === name ? [child] : descendants(child, name)
  })
}
function repeat(node: Element, name: string) {
  const value = Number(attribute(node, name) ?? 1)
  if (!Number.isSafeInteger(value) || value < 1) throw new Error("INVALID")
  return value
}
function displayText(node: Element): string {
  return (node.elements ?? [])
    .map((child) => {
      if (localName(child.name) === "annotation") return ""
      if (child.type === "text" || child.type === "cdata")
        return String(child.text ?? child.cdata ?? "")
      if (localName(child.name) === "s") return " ".repeat(repeat(child, "c"))
      if (localName(child.name) === "tab") return "\t"
      if (localName(child.name) === "line-break") return "\n"
      return displayText(child)
    })
    .join("")
}

// The data parser omits table visibility and misreads some ODF date/currency
// formats. In a reader, the saved display is authoritative; a literal number
// format preserves it without changing the numeric value or running formulas.
export function applyOdfMetadata(book: WorkBook, documents: Element[]) {
  const hiddenStyles = new Set<string>()
  for (const document of documents) {
    for (const style of descendants(document, "style")) {
      const properties = descendants(style, "table-properties")[0]
      if (properties && attribute(properties, "display") === "false")
        hiddenStyles.add(String(attribute(style, "name")))
    }
  }
  book.Workbook ??= {}
  book.Workbook.Sheets ??= book.SheetNames.map((name) => ({ name }))
  for (const document of documents) {
    for (const table of descendants(document, "table")) {
      const name = String(attribute(table, "name"))
      const index = book.SheetNames.indexOf(name)
      const sheet = book.Sheets[name]
      if (index < 0 || !sheet) continue
      if (hiddenStyles.has(String(attribute(table, "style-name"))))
        book.Workbook.Sheets[index]!.Hidden = 1
      let r = 0
      for (const row of descendants(table, "table-row")) {
        const rowCount = repeat(row, "number-rows-repeated")
        let c = 0
        for (const node of row.elements ?? []) {
          if (
            !["table-cell", "covered-table-cell"].includes(
              localName(node.name) ?? ""
            )
          )
            continue
          const columnCount = repeat(node, "number-columns-repeated")
          const paragraphs = descendants(node, "p")
          if (
            paragraphs.length &&
            ["float", "percentage", "currency", "date", "time"].includes(
              String(attribute(node, "value-type"))
            )
          ) {
            const saved = paragraphs.map(displayText).join("\n")
            for (let y = r; y < r + rowCount; y++) {
              for (let x = c; x < c + columnCount; x++) {
                const cell = sheet[utils.encode_cell({ r: y, c: x })]
                if (
                  saved &&
                  cell?.t === "n" &&
                  utils.format_cell({ ...cell, w: undefined }) !== saved
                ) {
                  cell.z = saved
                    .split('"')
                    .map((part) => `"${part}"`)
                    .join('\\"')
                  cell.w = saved
                }
              }
            }
          }
          c += columnCount
        }
        r += rowCount
      }
    }
  }
}
