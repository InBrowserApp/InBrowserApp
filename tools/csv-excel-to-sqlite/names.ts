import type { Rows } from "./types"

export function uniqueNames(names: string[], table = false) {
  const used = new Set<string>()
  return names.map((name, index) => {
    // SQLite matches identifiers case-insensitively for ASCII characters.
    const clean = name.replaceAll("\0", "").trim()
    const base = table
      ? /^(?:sqlite_|rowid$)/i.test(clean)
        ? `table_${clean}`
        : clean || "data"
      : clean || `column_${index + 1}`
    let candidate = base
    let suffix = 2
    while (used.has(foldIdentifier(candidate)))
      candidate = `${base}_${suffix++}`
    used.add(foldIdentifier(candidate))
    return candidate
  })
}

function foldIdentifier(name: string) {
  return name.replace(/[A-Z]/g, (character) => character.toLowerCase())
}

export function columnNames(rows: Rows, width: number, header: boolean) {
  return uniqueNames(
    Array.from({ length: width }, (_, index) =>
      String(header ? (rows[0]?.[index] ?? "") : "")
    )
  )
}
