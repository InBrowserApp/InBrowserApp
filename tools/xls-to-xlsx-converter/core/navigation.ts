import type { SheetInfo } from "../types"

export function cellPosition(value: string, sheet: SheetInfo) {
  const match = /^\$?([a-z]{1,3})\$?([1-9]\d{0,6})$/i.exec(value.trim())
  if (!match) return null
  let column = 0
  for (const letter of match[1]!.toUpperCase())
    column = column * 26 + letter.charCodeAt(0) - 64
  const row = Number(match[2]) - 1
  column--
  if (
    row < sheet.start.r ||
    row > sheet.end.r ||
    column < sheet.start.c ||
    column > sheet.end.c
  )
    return null
  return { row, column }
}

export function outputName(name: string) {
  return `${
    name
      .replace(/\.xls$/i, "")
      .replace(/[\\/:*?"<>|]/g, "_")
      .trim() || "workbook"
  }.xlsx`
}
