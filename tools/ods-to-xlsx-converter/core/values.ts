import type { CellObject } from "xlsx"
import type { Element } from "./xml"
import { attribute, cellText, paragraphs } from "./xml"

function dateValue(value: string) {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}):(\d{2}(?:\.\d+)?))?(Z|[+-]\d{2}:\d{2})?$/.exec(
      value
    )
  if (!match) throw new Error("unsupported")
  const [
    ,
    year,
    month,
    day,
    hour = "0",
    minute = "0",
    second = "0",
    zone = "Z",
  ] = match
  const numbers = [year, month, day, hour, minute, second].map(Number)
  const [y, m, d, h, min, sec] = numbers as [
    number,
    number,
    number,
    number,
    number,
    number,
  ]
  if (y < 1900 || y > 9999) throw new Error("unsupported")
  const utc = new Date(Date.UTC(y, m - 1, d, h, min, sec))
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d ||
    h > 23 ||
    min > 59 ||
    sec >= 60
  )
    throw new Error("invalid")
  const timestamp = Date.parse(
    `${year}-${month}-${day}T${match[4] ?? "00"}:${match[5] ?? "00"}:${match[6] ?? "00"}${zone}`
  )
  if (!Number.isFinite(timestamp)) throw new Error("invalid")
  const days = (timestamp - Date.UTC(1899, 11, 30)) / 86400000
  if (days < 2 || days >= 2958466) throw new Error("unsupported")
  return days < 61 ? days - 1 : days
}

function duration(value: string) {
  const match =
    /^(-)?P(?:(\d+(?:\.\d+)?)D)?(?:T(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?)?$/.exec(
      value
    )
  if (!match || !match.slice(2).some(Boolean)) throw new Error("unsupported")
  return (
    (Number(match[2] ?? 0) +
      Number(match[3] ?? 0) / 24 +
      Number(match[4] ?? 0) / 1440 +
      Number(match[5] ?? 0) / 86400) *
    (match[1] ? -1 : 1)
  )
}

export function valueCell(node: Element): {
  cell?: CellObject
  missing: boolean
} {
  const type = attribute(node, "office:value-type")
  const formula = attribute(node, "table:formula") !== undefined
  const missing = () => {
    if (!formula) throw new Error("invalid")
    return { missing: true }
  }
  let cell: CellObject
  if (attribute(node, "calcext:value-type") === "error")
    return { cell: { t: "e", v: 15 }, missing: false }
  if (type === "string" || (!type && paragraphs(node).length)) {
    const value = attribute(node, "office:string-value") ?? cellText(node)
    if (
      formula &&
      !paragraphs(node).length &&
      attribute(node, "office:string-value") === undefined
    )
      return missing()
    if (value.length > 32767) throw new Error("unsupported")
    cell = { t: "s", v: value }
  } else if (type === "boolean") {
    const value = attribute(node, "office:boolean-value")
    if (value === undefined) return missing()
    if (!["true", "false", "1", "0"].includes(value)) throw new Error("invalid")
    cell = { t: "b", v: value === "true" || value === "1" }
  } else if (
    ["float", "percentage", "currency", "date", "time"].includes(type ?? "")
  ) {
    const value = attribute(
      node,
      type === "date"
        ? "office:date-value"
        : type === "time"
          ? "office:time-value"
          : "office:value"
    )
    if (value === undefined) return missing()
    if (
      !value.trim() ||
      (!["date", "time"].includes(type!) &&
        !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(value))
    )
      throw new Error("invalid")
    const v =
      type === "date"
        ? dateValue(value)
        : type === "time"
          ? duration(value)
          : Number(value)
    if (!Number.isFinite(v)) throw new Error("invalid")
    cell = { t: "n", v }
    if (type === "date") cell.z = "yyyy-mm-dd hh:mm:ss"
    else if (type === "percentage") cell.z = "0.00%"
    else if (type === "time") cell.z = "0.###############"
  } else if (type) throw new Error("unsupported")
  else return { missing: formula }
  return { cell, missing: false }
}
