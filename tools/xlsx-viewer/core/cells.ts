import type { CellAddress, Worksheet, Cell } from "@silurus/ooxml/xlsx"

export type CellDetails = {
  reference: string
  value: string
  formula: string
  noCachedValue: boolean
}
export function cellReference({ row, col }: CellAddress): string {
  let letters = ""
  while (col > 0) {
    letters = String.fromCharCode(65 + ((col - 1) % 26)) + letters
    col = Math.floor((col - 1) / 26)
  }
  return `${letters}${row}`
}
export function isCellReference(value: string): boolean {
  const match = /^([A-Z]{1,3})([1-9]\d{0,6})$/i.exec(value)
  if (!match) return false
  let column = 0
  for (const letter of match[1]!.toUpperCase())
    column = column * 26 + letter.charCodeAt(0) - 64
  return column <= 16384 && Number(match[2]) <= 1048576
}
export function cellDetails(
  sheet: Pick<Worksheet, "rows" | "mergeCells">,
  address: CellAddress,
  display: (cell: Cell) => string
): CellDetails {
  const merged = sheet.mergeCells.find(
    (range) =>
      address.row >= range.top &&
      address.row <= range.bottom &&
      address.col >= range.left &&
      address.col <= range.right
  )
  if (merged) address = { row: merged.top, col: merged.left }
  const cell = sheet.rows
    .find((row) => row.index === address.row)
    ?.cells.find((cell) => cell.col === address.col)
  return {
    reference: cellReference(address),
    value: cell ? display(cell) : "",
    formula: cell?.formula ? `=${cell.formula}` : "",
    noCachedValue: Boolean(cell?.formula && cell.value.type === "empty"),
  }
}
