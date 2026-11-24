import type { SqlJsStatic } from "sql.js"
import { columnNames } from "./names"
import type { Cell, Rows, TableOptions } from "./types"

type ColumnType = "INTEGER" | "REAL" | "TEXT"

function numericValue(value: Cell, csv: boolean) {
  if (typeof value === "number") return value
  // CSV numbers must have an unambiguous representation. Preserve identifiers,
  // unsafe integers and lexemes that would lose significant digits as text.
  if (csv && value !== null && /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(value)) {
    const number = Number(value)
    if (Number.isSafeInteger(number) && !value.includes(".")) return number
    const digits = value.replace(/\D/g, "").replace(/^0+|0+$/g, "")
    if (
      value.includes(".") &&
      digits.length <= 15 &&
      Number.isFinite(number) &&
      (number !== 0 || !digits)
    )
      return number
  }
  return null
}

function columnTypes(rows: Rows, width: number, csv: boolean): ColumnType[] {
  const types: (ColumnType | undefined)[] = Array.from({ length: width })
  for (const row of rows) {
    row.forEach((value, index) => {
      const type = types[index]
      if (value === null || type === "TEXT") return
      const numeric = numericValue(value, csv)
      types[index] =
        numeric === null
          ? "TEXT"
          : type === "REAL" || !Number.isInteger(numeric)
            ? "REAL"
            : "INTEGER"
    })
  }
  return types.map((type) => type ?? "TEXT")
}

function identifier(name: string) {
  return `"${name.replaceAll('"', '""')}"`
}

type Table = TableOptions & { rows: Rows; width: number; csv: boolean }

export function createDatabase(SQL: SqlJsStatic, tables: Table[]) {
  const db = new SQL.Database()
  try {
    db.run("BEGIN")
    for (const { name, header, rows, width, csv } of tables) {
      const columns = columnNames(rows, width, header)
      const data = header ? rows.slice(1) : rows
      const types = columnTypes(data, width, csv)
      const schema = columns.map(
        (column, index) => `${identifier(column)} ${types[index]}`
      )
      db.run(`CREATE TABLE ${identifier(name)} (${schema.join(", ")})`)
      const statement = db.prepare(
        `INSERT INTO ${identifier(name)} VALUES (${columns.map(() => "?").join(", ")})`
      )
      try {
        for (const row of data) {
          statement.run(
            types.map((type, index) => {
              const value = row[index] ?? null
              return type === "TEXT"
                ? value === null
                  ? null
                  : String(value)
                : numericValue(value, csv)
            })
          )
        }
      } finally {
        statement.free()
      }
    }
    db.run("COMMIT")
    return db.export() as Uint8Array<ArrayBuffer>
  } finally {
    db.close()
  }
}
