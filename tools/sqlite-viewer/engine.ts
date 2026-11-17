import type { Database, SqlJsStatic, Statement } from "sql.js"
import {
  MAX_RESULT_BYTES,
  validateFile,
  validateQuery,
  validateStatementTail,
} from "./core/query"
import type { Cell, DatabaseObject, QueryResult, Structure } from "./types"

// sql.js supports exact INTEGER reads; DefinitelyTyped predates this option.
type ExactStatement = Omit<Statement, "get"> & {
  get(params: undefined, config: { useBigInt: true }): Cell[]
}

export async function openDatabase(SQL: SqlJsStatic, file: File) {
  validateFile(file.size, new Uint8Array(await file.slice(0, 16).arrayBuffer()))
  const db = new SQL.Database(new Uint8Array(await file.arrayBuffer()))
  try {
    db.run(
      "PRAGMA trusted_schema=OFF; PRAGMA query_only=ON; PRAGMA cell_size_check=ON; PRAGMA hard_heap_limit=134217728;"
    )
    const objects = collect(
      db,
      "SELECT name, type, sql FROM sqlite_schema WHERE type IN ('table', 'view') AND name NOT GLOB 'sqlite_*' ORDER BY type, name",
      2001
    )
    if (objects.rows.length > 2000 || objects.truncated)
      throw new Error("schemaLimit")
    const metadata = {
      objects: objects.rows.map(([name, type, sql]) => ({
        name,
        type,
        sql,
      })) as DatabaseObject[],
      version: String(db.exec("SELECT sqlite_version()")[0]!.values[0]![0]),
    }
    return { db, metadata }
  } catch (reason) {
    db.close()
    throw reason
  }
}

function collect(db: Database, sql: string, limit: number, params?: string[]) {
  const start = performance.now()
  const stmt = db.prepare(sql) as ExactStatement
  try {
    if (params) stmt.bind(params)
    const columns = stmt.getColumnNames()
    const rows: Cell[][] = []
    let bytes = columns.reduce((total, name) => total + name.length * 2, 0)
    let truncated = false
    while (stmt.step()) {
      if (rows.length >= limit) {
        truncated = true
        break
      }
      const row = stmt.get(undefined, { useBigInt: true }) as Cell[]
      bytes += row.reduce<number>(
        (total, cell) =>
          total +
          (typeof cell === "string"
            ? cell.length * 2
            : cell instanceof Uint8Array
              ? cell.byteLength
              : 16),
        0
      )
      if (bytes > MAX_RESULT_BYTES) {
        truncated = true
        break
      }
      rows.push(row)
    }
    return { columns, rows, truncated, elapsed: performance.now() - start }
  } finally {
    stmt.free()
  }
}

export function queryDatabase(
  db: Database,
  sql: string,
  limit: number
): QueryResult {
  validateQuery(sql)
  const statements = db.iterateStatements(sql)
  // SQLite locates the first statement's end. Never prepare the tail: some
  // PRAGMAs have side effects during preparation, even without stepping.
  for (const _stmt of statements) {
    validateStatementTail(statements.getRemainingSQL())
    break
  }
  return collect(
    db,
    sql,
    Math.max(1, Math.min(10_000, Math.trunc(limit) || 1000))
  )
}

export function inspectDatabase(db: Database, name: string): Structure {
  return {
    name,
    columns: collect(db, "SELECT * FROM pragma_table_xinfo(?)", 2000, [name]),
    indexes: collect(db, "SELECT * FROM pragma_index_list(?)", 2000, [name]),
    foreignKeys: collect(db, "SELECT * FROM pragma_foreign_key_list(?)", 2000, [
      name,
    ]),
  }
}
