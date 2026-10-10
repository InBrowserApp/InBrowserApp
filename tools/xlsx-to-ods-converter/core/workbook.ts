import { CFB, read, utils } from "xlsx"
import type { WorkBook } from "xlsx"
import { strToU8, unzipSync, zipSync } from "fflate"
import { SaxesParser } from "saxes"
import { describe } from "@workspace/spreadsheet-conversion"
import { cellXml } from "./values"
import { xml } from "./xml"

const mime = "application/vnd.oasis.opendocument.spreadsheet"
const sheetNamespaces = new Set([
  "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
  "http://purl.oclc.org/ooxml/spreadsheetml/main",
])
const xlsxMime =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"

export function readXlsx(bytes: Uint8Array) {
  if (bytes[0] === 0xd0 && bytes[1] === 0xcf) {
    const cfb = CFB.read(bytes, { type: "buffer" })
    if (CFB.find(cfb, "EncryptedPackage") || CFB.find(cfb, "EncryptionInfo"))
      throw new Error("protected")
    throw new Error("unsupported")
  }
  if (bytes[0] !== 80 || bytes[1] !== 75) throw new Error("invalid")
  const entries = new Set<string>()
  const files = unzipSync(bytes, {
    filter(entry) {
      entries.add(entry.name)
      return (
        entry.name === "[Content_Types].xml" ||
        /^xl\/.*(?:\.xml|\/workbook\.xml\.rels)$/.test(entry.name)
      )
    },
  })
  if (!files["[Content_Types].xml"] || !files["xl/workbook.xml"])
    throw new Error("unsupported")
  if (entries.has("xl/vbaProject.bin")) throw new Error("unsupported")
  let workbookType = ""
  const sheetIds = new Map<string, string>()
  const targets = new Map<string, string>()
  const missing = new Map<string, Set<string>>()
  for (const [name, bytes] of Object.entries(files)) {
    const parser = new SaxesParser({ xmlns: true })
    const empty = new Set<string>()
    let cell:
      | { address: string; type: string; value: string; present: boolean }
      | undefined
    let inValue = false
    parser.on("doctype", () => {
      throw new Error("unsupported")
    })
    parser.on("opentag", (tag) => {
      if (name === "[Content_Types].xml") {
        if (
          tag.uri ===
            "http://schemas.openxmlformats.org/package/2006/content-types" &&
          tag.local === "Override" &&
          tag.attributes.PartName?.value === "/xl/workbook.xml"
        )
          workbookType = tag.attributes.ContentType?.value ?? ""
      }
      if (name === "xl/workbook.xml" && tag.local === "sheet") {
        const id = Object.values(tag.attributes).find(
          (attr) => attr.local === "id"
        )
        if (!tag.attributes.name || !id) throw new Error("invalid")
        sheetIds.set(tag.attributes.name.value, id.value)
      }
      if (
        name === "xl/_rels/workbook.xml.rels" &&
        tag.local === "Relationship"
      ) {
        const { Id, Target, TargetMode } = tag.attributes
        if (!Id || !Target) throw new Error("invalid")
        const url = new URL(
          Target.value,
          "https://workbook.invalid/xl/workbook.xml"
        )
        targets.set(
          Id.value,
          TargetMode?.value === "External" ||
            url.origin !== "https://workbook.invalid"
            ? ""
            : url.pathname.slice(1)
        )
      }
      if (!sheetNamespaces.has(tag.uri)) return
      if (tag.local === "c") {
        if (cell) throw new Error("invalid")
        if (!tag.attributes.r) throw new Error("unsupported")
        cell = {
          address: tag.attributes.r.value,
          type: tag.attributes.t?.value ?? "n",
          value: "",
          present: false,
        }
      } else if (tag.local === "v" && cell) {
        inValue = true
        cell.present = true
      }
    })
    parser.on("text", (text) => {
      if (inValue) cell!.value += text
    })
    parser.on("cdata", () => {
      throw new Error("unsupported")
    })
    parser.on("closetag", (tag) => {
      if (!sheetNamespaces.has(tag.uri)) return
      if (tag.local === "v") inValue = false
      if (tag.local !== "c") return
      const current = cell!
      if (current.type === "d") throw new Error("unsupported")
      if (current.type !== "inlineStr") {
        const value = current.value.trim()
        if (!current.present || (current.type !== "str" && !value))
          empty.add(current.address)
        else if (
          current.type === "b" &&
          !/^(0|1|true|false)$/.test(current.value)
        )
          throw new Error("invalid")
        else if (
          current.type === "n" &&
          (!/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?$/i.test(value) ||
            !Number.isFinite(Number(value)))
        )
          throw new Error("invalid")
      }
      cell = undefined
    })
    // The XLSX engine does not reliably read UTF-16 OOXML parts.
    if (bytes[0] === 255 || bytes[0] === 254) throw new Error("unsupported")
    parser
      .write(new TextDecoder("utf-8", { fatal: true }).decode(bytes))
      .close()
    missing.set(name, empty)
  }
  if (workbookType !== xlsxMime) throw new Error("unsupported")
  const book = read(bytes, {
    type: "array",
    cellFormula: true,
    cellNF: true,
    cellText: true,
    cellDates: false,
    cellHTML: false,
    sheetStubs: true,
    bookVBA: false,
    WTF: true,
    xlfn: true,
  })
  let missingArrayCaches = 0
  for (const name of book.SheetNames) {
    const sheet = book.Sheets[name]!
    const target = targets.get(sheetIds.get(name)!)
    if (!target || !missing.has(target)) throw new Error("unsupported")
    for (const address of missing.get(target)!) {
      const cell = sheet[address]
      if (!cell) continue
      if (cell.F && !cell.f) missingArrayCaches++
      delete cell.v
      delete cell.w
    }
    // New Excel errors may have display text without a legacy numeric error
    // code. Preserve that saved text before describe checks for missing caches.
    for (const [address, cell] of Object.entries(sheet))
      if (!address.startsWith("!") && cell.t === "e" && cell.w !== undefined) {
        cell.t = "s"
        cell.v = cell.w
      }
    if (!Object.keys(sheet).some((address) => !address.startsWith("!")))
      delete sheet["!ref"]
  }
  const info = describe(book)
  info.missingCaches += missingArrayCaches
  if (new Set(book.SheetNames).size !== book.SheetNames.length)
    throw new Error("invalid")
  if (info.sheets.every((sheet) => sheet.hidden)) throw new Error("unsupported")
  return { book, info }
}

const namespaces = ["office", "table", "text", "style", "number"]
  .map(
    (name) =>
      `xmlns:${name}="urn:oasis:names:tc:opendocument:xmlns:${name === "number" ? "datastyle" : name}:1.0"`
  )
  .join(" ")
const styles = `<office:automatic-styles>
<style:style style:name="visible" style:family="table"><style:table-properties table:display="true"/></style:style>
<style:style style:name="hidden" style:family="table"><style:table-properties table:display="false"/></style:style>
<number:boolean-style style:name="boolean-format"><number:boolean/></number:boolean-style>
<style:style style:name="boolean" style:family="table-cell" style:data-style-name="boolean-format"/>
<number:date-style style:name="date-format"><number:year number:style="long"/><number:text>-</number:text><number:month number:style="long"/><number:text>-</number:text><number:day number:style="long"/><number:text> </number:text><number:hours number:style="long"/><number:text>:</number:text><number:minutes number:style="long"/><number:text>:</number:text><number:seconds number:style="long" number:decimal-places="3"/></number:date-style>
<number:time-style style:name="time-format" number:truncate-on-overflow="false"><number:hours number:style="long"/><number:text>:</number:text><number:minutes number:style="long"/><number:text>:</number:text><number:seconds number:style="long" number:decimal-places="3"/></number:time-style>
<style:style style:name="date" style:family="table-cell" style:data-style-name="date-format"/>
<style:style style:name="time" style:family="table-cell" style:data-style-name="time-format"/>
</office:automatic-styles>`

export function writeOds(book: WorkBook): ArrayBuffer {
  const tables = book.SheetNames.map((name, index) => {
    const sheet = book.Sheets[name]!
    const cells = Object.entries(sheet)
      .filter(([address]) => !address.startsWith("!"))
      .map(([address, cell]) => {
        if (!/^[A-Z]{1,3}[1-9]\d{0,6}$/.test(address))
          throw new Error("invalid")
        const position = utils.decode_cell(address)
        if (position.r >= 1048576 || position.c >= 16384)
          throw new Error("unsupported")
        return { ...position, cell }
      })
      .sort((a, b) => a.r - b.r || a.c - b.c)
    const rows: string[] = []
    let row = -1,
      column = 0
    for (const entry of cells) {
      if (entry.r !== row) {
        if (row !== -1) rows.push("</table:table-row>")
        const gap = entry.r - row - 1
        if (gap)
          rows.push(
            `<table:table-row table:number-rows-repeated="${gap}"><table:table-cell/></table:table-row>`
          )
        rows.push("<table:table-row>")
        row = entry.r
        column = 0
      }
      if (entry.c > column)
        rows.push(
          `<table:table-cell table:number-columns-repeated="${entry.c - column}"/>`
        )
      rows.push(cellXml(entry.cell, Boolean(book.Workbook?.WBProps?.date1904)))
      column = entry.c + 1
    }
    if (row !== -1) rows.push("</table:table-row>")
    if (!rows.length)
      rows.push("<table:table-row><table:table-cell/></table:table-row>")
    const hidden = book.Workbook?.Sheets?.[index]?.Hidden
    const columns = cells.reduce(
      (count, cell) => Math.max(count, cell.c + 1),
      1
    )
    return `<table:table table:name="${xml(name)}" table:style-name="${hidden ? "hidden" : "visible"}"><table:table-column table:number-columns-repeated="${columns}"/>${rows.join("")}</table:table>`
  })
  const content = `<?xml version="1.0" encoding="UTF-8"?><office:document-content ${namespaces} office:version="1.3">${styles}<office:body><office:spreadsheet>${tables.join("")}</office:spreadsheet></office:body></office:document-content>`
  const manifest = `<?xml version="1.0" encoding="UTF-8"?><manifest:manifest xmlns:manifest="urn:oasis:names:tc:opendocument:xmlns:manifest:1.0" manifest:version="1.3"><manifest:file-entry manifest:full-path="/" manifest:media-type="${mime}" manifest:version="1.3"/><manifest:file-entry manifest:full-path="content.xml" manifest:media-type="text/xml"/></manifest:manifest>`
  return Uint8Array.from(
    zipSync({
      mimetype: [strToU8(mime), { level: 0 }],
      "content.xml": strToU8(content),
      "META-INF/manifest.xml": strToU8(manifest),
    })
  ).buffer
}
