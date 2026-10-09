import { strFromU8, strToU8, unzipSync, zipSync } from "fflate"
import { xml2js, js2xml } from "xml-js"
import type { Element } from "xml-js"
import { read } from "xlsx"
import { applyOdfMetadata } from "./odf-metadata"

// Flat ODF can embed complete chart documents inside worksheet cells. Their
// local data tables are chart resources, not additional workbook worksheets.
function spreadsheetDocument(source: string): Element {
  const document = xml2js(source, {
    compact: false,
    ignoreDoctype: true,
  }) as Element
  function prune(node: Element) {
    node.elements = node.elements?.filter((child) => {
      const name = child.name?.split(":").at(-1)
      if (name === "frame" || name === "object" || name === "object-ole")
        return false
      prune(child)
      return true
    })
  }
  prune(document)
  return document
}

export function readOpenDocument(data: ArrayBuffer, flat: boolean) {
  const documents: Element[] = []
  const prepare = (source: string) => {
    const document = spreadsheetDocument(source)
    documents.push(document)
    document.declaration ??= {
      attributes: { version: "1.0", encoding: "UTF-8" },
    }
    return js2xml(document, {
      compact: false,
      fullTagEmptyElementFn: (name) =>
        ["table", "table-row", "table-cell"].includes(name.split(":").at(-1)!),
    })
  }
  let source: string | ArrayBuffer
  if (flat) source = prepare(new TextDecoder().decode(data))
  else {
    const allowed = new Set([
      "content.xml",
      "styles.xml",
      "meta.xml",
      "mimetype",
      "META-INF/manifest.xml",
    ])
    const files = unzipSync(new Uint8Array(data), {
      filter: (entry) => allowed.has(entry.name),
    })
    const manifest = files["META-INF/manifest.xml"]
    if (
      manifest &&
      /<(?:[^:\s<>]+:)?encryption-data[\s/>]/.test(strFromU8(manifest))
    )
      throw new Error("Encrypted spreadsheet")
    if (!files["content.xml"]) throw new Error("INVALID")
    files["content.xml"] = strToU8(prepare(strFromU8(files["content.xml"])))
    if (files["styles.xml"])
      documents.unshift(spreadsheetDocument(strFromU8(files["styles.xml"])))
    source = Uint8Array.from(zipSync(files)).buffer
  }
  const book = read(source, {
    type: flat ? "string" : "array",
    raw: true,
    cellFormula: true,
    cellNF: true,
    cellHTML: false,
    cellStyles: false,
    bookVBA: false,
  })
  applyOdfMetadata(book, documents)
  return book
}
