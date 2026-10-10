import { SSF, utils } from "xlsx"
import type { CellObject } from "xlsx"
import { paragraph, xml } from "./xml"

function temporal(value: number, format: string, date1904: boolean) {
  // Complex conditional sections can change a number's meaning. Reject them
  // rather than deciding a date from a section that does not apply to this value.
  const tokens = format.replace(/"[^"]*"|\\.|_.|\*./g, "")
  if (tokens.includes(";")) throw new Error("unsupported")
  const plain = tokens.replace(/\[(?![hms]+\])[^\]]*\]/gi, "")
  if (/[geb]/i.test(plain)) throw new Error("unsupported")
  const duration =
    /\[[hms]+\]/i.test(plain) ||
    (/[hs]/i.test(plain) && !/[yd]|m{3}/i.test(plain))
  if (duration) {
    const milliseconds = Math.round(Math.abs(value) * 86400000)
    if (!Number.isSafeInteger(milliseconds)) throw new Error("unsupported")
    const seconds = milliseconds / 1000
    const iso = `${value < 0 ? "-" : ""}PT${seconds}S`
    return `office:value-type="time" office:time-value="${iso}" table:style-name="time"`
  }
  if (value < 0 || (!date1904 && (value < 1 || Math.floor(value) === 60)))
    throw new Error("unsupported")
  const epoch = date1904 ? Date.UTC(1904, 0, 1) : Date.UTC(1899, 11, 31)
  const leapBug = !date1904 && value >= 61 ? 86400000 : 0
  const stamp = new Date(epoch + Math.round(value * 86400000) - leapBug)
  if (!Number.isFinite(stamp.getTime()) || stamp.getUTCFullYear() > 9999)
    throw new Error("unsupported")
  const iso = stamp.toISOString().slice(0, -1)
  return `office:value-type="date" office:date-value="${iso}" table:style-name="date"`
}

export function cellXml(cell: CellObject, date1904: boolean): string {
  if (cell.v == null || cell.t === "z") return "<table:table-cell/>"
  let attributes: string
  if (cell.t === "n") {
    if (typeof cell.v !== "number" || !Number.isFinite(cell.v))
      throw new Error("unsupported")
    const format = String(cell.z ?? "General")
    attributes = SSF.is_date(format)
      ? temporal(cell.v, format, date1904)
      : `office:value-type="float" office:value="${cell.v}"`
  } else if (cell.t === "b") {
    attributes = `office:value-type="boolean" office:boolean-value="${Boolean(cell.v)}" table:style-name="boolean"`
  } else if (cell.t === "s" || cell.t === "e") {
    const value = cell.t === "e" ? utils.format_cell(cell) : String(cell.v)
    return `<table:table-cell office:value-type="string" office:string-value="${xml(value)}">${paragraph(value)}</table:table-cell>`
  } else {
    throw new Error("unsupported")
  }
  return `<table:table-cell ${attributes}/>`
}
