import { strToU8, zipSync } from "fflate"
import { utils } from "xlsx"
import type { CellObject, WorkBook, WorkSheet } from "xlsx"

const spreadsheet = "http://schemas.openxmlformats.org/spreadsheetml/2006/main"
const relationships =
  "http://schemas.openxmlformats.org/package/2006/relationships"
const office =
  "http://schemas.openxmlformats.org/officeDocument/2006/relationships"
const escape = (value: unknown) =>
  String(value).replace(
    /[&<>"'\t\r\n]/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&apos;",
        "\t": "&#9;",
        "\r": "&#13;",
        "\n": "&#10;",
      })[character]!
  )
function text(value: unknown) {
  return escape(
    String(value)
      .replace(/_x[0-9a-f]{4}_/gi, (match) => `_x005F_${match.slice(1)}`)
      .replace(
        // oxlint-disable-next-line no-control-regex -- OOXML encodes XML-invalid control characters.
        /[\x00-\x08\x0b\x0c\x0e-\x1f]/g,
        (character) =>
          `_x${character.charCodeAt(0).toString(16).padStart(4, "0")}_`
      )
  )
}
function cellXml(address: string, cell: CellObject, style: number) {
  const formula = cell.f ? `<f>${escape(cell.f)}</f>` : ""
  const attrs = `r="${address}" s="${style}"`
  if (
    cell.v === undefined ||
    cell.v === null ||
    (cell.f && cell.t === "n" && Number.isNaN(cell.v))
  )
    return `<c ${attrs} t="e">${formula}</c>`
  if (cell.t === "n") {
    if (!Number.isFinite(Number(cell.v)))
      return `<c ${attrs} t="e">${formula}<v>${Number.isNaN(Number(cell.v)) ? "#NUM!" : "#DIV/0!"}</v></c>`
    return `<c ${attrs}>${formula}<v>${Number(cell.v)}</v></c>`
  }
  if (cell.t === "b")
    return `<c ${attrs} t="b">${formula}<v>${cell.v ? 1 : 0}</v></c>`
  if (cell.t === "e")
    return `<c ${attrs} t="e">${formula}<v>${escape(utils.format_cell(cell))}</v></c>`
  const value = cell.t === "d" ? utils.format_cell(cell) : String(cell.v)
  return formula
    ? `<c ${attrs} t="str">${formula}<v>${text(value)}</v></c>`
    : `<c ${attrs} t="inlineStr"><is><t xml:space="preserve">${text(value)}</t></is></c>`
}
function worksheetXml(sheet: WorkSheet, formats: Map<string, number>) {
  const cells = Object.entries(sheet)
    .filter(
      ([address, cell]) =>
        /^[A-Z]+[1-9]\d*$/.test(address) && (cell.v !== undefined || cell.f)
    )
    .map(([address, cell]) => ({
      address,
      cell: cell as CellObject,
      ...utils.decode_cell(address),
    }))
    .sort((a, b) => a.r - b.r || a.c - b.c)
  const rows: string[] = []
  let row = -1
  for (const entry of cells) {
    if (entry.r !== row) {
      if (row !== -1) rows.push("</row>")
      row = entry.r
      const meta = sheet["!rows"]?.[row]
      rows.push(
        `<row r="${row + 1}"${meta?.hpt ? ` ht="${meta.hpt}" customHeight="1"` : ""}${meta?.hidden ? ' hidden="1"' : ""}>`
      )
    }
    const format = entry.cell.z ? String(entry.cell.z) : "General"
    if (!formats.has(format)) formats.set(format, formats.size)
    rows.push(cellXml(entry.address, entry.cell, formats.get(format)!))
  }
  if (row !== -1) rows.push("</row>")
  const columns = (sheet["!cols"] ?? [])
    .map((column, i) => {
      if (!column) return ""
      const width =
        column.width ?? column.wch ?? (column.wpx ? column.wpx / 7 : 8.43)
      return `<col min="${i + 1}" max="${i + 1}" width="${width}" customWidth="1"${column.hidden ? ' hidden="1"' : ""}/>`
    })
    .join("")
  const merges = (sheet["!merges"] ?? [])
    .map((range) => `<mergeCell ref="${utils.encode_range(range)}"/>`)
    .join("")
  return `<worksheet xmlns="${spreadsheet}"><sheetFormatPr defaultRowHeight="15"/>${columns ? `<cols>${columns}</cols>` : ""}<sheetData>${rows.join("")}</sheetData>${merges ? `<mergeCells>${merges}</mergeCells>` : ""}</worksheet>`
}

// Iterate stored cells, never the rectangular !ref area: a valid sheet can
// contain only A1 and XFD1048576. A rectangle-based writer visits 17 billion cells.
export function workbookArchive(book: WorkBook): ArrayBuffer {
  const formats = new Map([["General", 0]])
  const files: Record<string, Uint8Array> = {}
  const put = (path: string, xml: string) => {
    files[path] = strToU8(xml)
  }
  const sheets: string[] = [],
    links: string[] = [],
    content: string[] = []
  book.SheetNames.forEach((name, index) => {
    const id = index + 1
    const visibility = book.Workbook?.Sheets?.[index]?.Hidden
    sheets.push(
      `<sheet name="Sheet${id}" sheetId="${id}" r:id="rId${id}"${visibility ? ` state="${visibility === 2 ? "veryHidden" : "hidden"}"` : ""}/>`
    )
    links.push(
      `<Relationship Id="rId${id}" Type="${office}/worksheet" Target="worksheets/sheet${id}.xml"/>`
    )
    content.push(
      `<Override PartName="/xl/worksheets/sheet${id}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
    )
    put(
      `xl/worksheets/sheet${id}.xml`,
      worksheetXml(book.Sheets[name]!, formats)
    )
  })
  const formatList = [...formats]
  put(
    "xl/styles.xml",
    `<styleSheet xmlns="${spreadsheet}"><numFmts count="${formatList.length}">${formatList.map(([format, index]) => `<numFmt numFmtId="${164 + index}" formatCode="${escape(format)}"/>`).join("")}</numFmts><fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts><fills count="1"><fill><patternFill patternType="none"/></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs><cellXfs count="${formatList.length}">${formatList.map(([, index]) => `<xf numFmtId="${164 + index}" fontId="0" fillId="0" borderId="0" xfId="0" applyNumberFormat="1"/>`).join("")}</cellXfs></styleSheet>`
  )
  put(
    "xl/workbook.xml",
    `<workbook xmlns="${spreadsheet}" xmlns:r="${office}"><workbookPr date1904="${book.Workbook?.WBProps?.date1904 ? 1 : 0}"/><sheets>${sheets.join("")}</sheets></workbook>`
  )
  put(
    "xl/_rels/workbook.xml.rels",
    `<Relationships xmlns="${relationships}">${links.join("")}<Relationship Id="styles" Type="${office}/styles" Target="styles.xml"/></Relationships>`
  )
  put(
    "_rels/.rels",
    `<Relationships xmlns="${relationships}"><Relationship Id="workbook" Type="${office}/officeDocument" Target="xl/workbook.xml"/></Relationships>`
  )
  put(
    "[Content_Types].xml",
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/><Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>${content.join("")}</Types>`
  )
  return Uint8Array.from(zipSync(files)).buffer
}
