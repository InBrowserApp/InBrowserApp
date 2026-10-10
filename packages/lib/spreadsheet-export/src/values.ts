import { utils } from "xlsx"
import type { CellObject } from "xlsx"
import type { ValueMode } from "./types"

const errors: Record<number, string> = {
  0: "#NULL!",
  7: "#DIV/0!",
  15: "#VALUE!",
  23: "#REF!",
  29: "#NAME?",
  36: "#NUM!",
  42: "#N/A",
  43: "#GETTING_DATA",
}

export function cellValue(
  cell: CellObject | undefined,
  mode: ValueMode
): string | number | boolean | null {
  if (!cell || cell.v == null || cell.t === "z") return null
  if (cell.t === "e") return cell.w ?? errors[Number(cell.v)] ?? String(cell.v)
  if (cell.t === "s") return String(cell.v)
  if (mode === "formatted") return cell.w ?? utils.format_cell(cell)
  if (typeof cell.v === "number")
    return Number.isFinite(cell.v) ? cell.v : String(cell.v)
  if (typeof cell.v === "boolean") return cell.v
  return String(cell.v)
}

export function markdownCell(value: string): string {
  return value
    .replace(/[&<>@]/g, (char) => `&#${char.charCodeAt(0)};`)
    .replace(/[\\`*_[\]~|]/g, (char) => `&#${char.charCodeAt(0)};`)
    .replace(/\b(https?|ftp):/gi, "$1&#58;")
    .replace(/\bwww\./gi, "www&#46;")
    .replace(/(^[ \t]+|[ \t]+$)/gm, (spaces) =>
      Array.from(spaces, (char) => `&#${char.charCodeAt(0)};`).join("")
    )
    .replace(/\r\n?|\n/g, "<br>")
}

export function delimitedCell(value: string, delimiter: string): string {
  return value.includes(delimiter) || /["\r\n]/.test(value)
    ? `"${value.replaceAll('"', '""')}"`
    : value
}
