type Point = { r: number; c: number }
export type Range = { s: Point; e: Point }

function point(text: string): Point {
  const match = /^\$?([A-Z]{1,3})\$?([1-9]\d{0,6})$/i.exec(text)
  if (!match) throw new Error("invalidRange")
  let column = 0
  for (const char of match[1]!.toUpperCase())
    column = column * 26 + char.charCodeAt(0) - 64
  const row = Number(match[2])
  if (column > 16384 || row > 1048576) throw new Error("invalidRange")
  return { r: row - 1, c: column - 1 }
}

export function parseRange(text: string): Range | null {
  if (!text.trim()) return null
  const parts = text.trim().split(":")
  if (parts.length > 2) throw new Error("invalidRange")
  const s = point(parts[0]!)
  const e = point(parts[1] ?? parts[0]!)
  if (s.r > e.r || s.c > e.c) throw new Error("invalidRange")
  return { s, e }
}

export function cellAddress(row: number, column: number): string {
  let name = ""
  for (let value = column + 1; value > 0; value = Math.floor((value - 1) / 26))
    name = String.fromCharCode(65 + ((value - 1) % 26)) + name
  return name + (row + 1)
}

export function rangeAddress(range: Range): string {
  return `${cellAddress(range.s.r, range.s.c)}:${cellAddress(range.e.r, range.e.c)}`
}
