import type { Database, SqlValue } from "sql.js"
import type { Dump } from "./types"

const previewLimit = 24_000
const chunkSize = 256 * 1024
const rtreeShadows = ["node", "parent", "rowid"]
const missingModuleShadows = new Map([
  ["fts5", ["config", "content", "data", "docsize", "idx"]],
  ["rtree", rtreeShadows],
  ["rtree_i32", rtreeShadows],
  ["geopoly", rtreeShadows],
])

export class UnsupportedSchemaError extends Error {}

function identifier(name: string) {
  return `"${name.replaceAll('"', '""')}"`
}

function textLiteral(value: string) {
  return `'${value.replaceAll("'", "''")}'`
}

function asSqlLiteral(value: SqlValue, decoder: TextDecoder) {
  if (!(value instanceof Uint8Array)) return String(value)
  try {
    const text = decoder.decode(value)
    if (!/[\0\r]/.test(text)) return textLiteral(text)
  } catch {
    // SQLite can store bytes that are invalid in the database text encoding.
  }
  let hex = ""
  for (const byte of value) hex += byte.toString(16).padStart(2, "0")
  return `CAST(X'${hex}' AS TEXT)`
}

function rows(db: Database, query: string, params?: SqlValue[]) {
  return db.exec(query, params)[0]?.values ?? []
}

function unrecognizedShadows(db: Database, tables: SqlValue[][]) {
  const shadows = new Set<string>()
  for (const [name, , , , ncol] of tables) {
    if (ncol !== 0) continue
    // sql.js does not ship every built-in module. SQLite can still identify
    // the module name, but table_list cannot mark its backing tables as shadows.
    try {
      rows(db, "SELECT name FROM pragma_table_xinfo(?, 'main')", [String(name)])
    } catch (error) {
      const module = (error as Error).message.match(
        /^no such module: (.+)$/
      )?.[1]
      const suffixes = module && missingModuleShadows.get(module.toLowerCase())
      if (!suffixes) throw new UnsupportedSchemaError()
      for (const suffix of suffixes) {
        shadows.add(`${name}_${suffix}`.toLowerCase())
      }
    }
  }
  return shadows
}

function schemaStatement(sql: string) {
  // A trailing line comment could otherwise swallow the terminator.
  return `${sql}${/--[^\n]*$/.test(sql) ? "\n" : ""};\n`
}

function createWriter() {
  const chunks: Blob[] = []
  let pending = ""
  let preview = ""
  let shortened = false

  function write(sql: string) {
    const remaining = previewLimit - preview.length
    preview += sql.slice(0, remaining)
    shortened ||= sql.length > remaining
    pending += sql
    if (pending.length >= chunkSize) {
      chunks.push(new Blob([pending]))
      pending = ""
    }
  }

  function finish(): Dump {
    return {
      blob: new Blob([...chunks, pending], { type: "text/sql;charset=utf-8" }),
      preview,
      shortened,
    }
  }

  return { write, finish }
}

function writeData(
  db: Database,
  table: string,
  withoutRowid: boolean,
  decoder: TextDecoder,
  write: (sql: string) => void
) {
  const columns = rows(
    db,
    "SELECT name, type, pk, hidden FROM pragma_table_xinfo(?, 'main') ORDER BY cid",
    [table]
  )
  const names = columns
    .filter(([, , , hidden]) => hidden === 0)
    .map(([name]) => String(name))
  const integerPrimaryKey =
    columns.some(
      ([, type, pk]) => String(type).toUpperCase() === "INTEGER" && pk === 1
    ) &&
    rows(db, "SELECT 1 FROM pragma_index_list(?, 'main') WHERE origin = 'pk'", [
      table,
    ]).length === 0
  // The SQLite build allows at most 2,000 columns in a result or INSERT.
  if (!withoutRowid && !integerPrimaryKey && names.length < 2000) {
    const rowid = ["rowid", "_rowid_", "oid"].find(
      (alias) => !columns.some(([name]) => String(name).toLowerCase() === alias)
    )
    if (rowid) names.unshift(rowid)
  }

  const escaped = names.map(identifier)
  // SQLite quotes numbers without converting them to JavaScript numbers.
  // Read text as bytes to preserve NUL and invalid UTF sequences.
  const values = escaped.map(
    (column) =>
      `CASE WHEN typeof(${column}) = 'text' THEN CAST(${column} AS BLOB)
        ELSE quote(${column}) END`
  )
  const statement = db.prepare(
    `SELECT ${values.join(", ")} FROM main.${identifier(table)}`
  )
  const insert = `INSERT INTO ${identifier(table)} (${escaped.join(", ")}) VALUES (`
  try {
    while (statement.step()) {
      const literals = statement
        .get()
        .map((value) => asSqlLiteral(value, decoder))
      write(`${insert}${literals.join(", ")});\n`)
    }
  } finally {
    statement.free()
  }
}

export function createDump(db: Database, schemaOnly: boolean): Dump {
  const { write, finish } = createWriter()
  const tables = rows(
    db,
    `SELECT s.name, s.sql, p.type, p.wr, p.ncol
       FROM main.sqlite_schema AS s
       JOIN pragma_table_list AS p ON p.schema = 'main' AND p.name = s.name
      WHERE s.type = 'table' AND s.name NOT GLOB 'sqlite_*'
      ORDER BY s.rowid`
  )
  const virtual = tables.filter(([, , type]) => type === "virtual")
  const shadows = schemaOnly ? unrecognizedShadows(db, virtual) : undefined
  const encoding = String(rows(db, "PRAGMA encoding")[0]![0])
  const decoder = new TextDecoder(encoding, { fatal: true, ignoreBOM: true })
  if (encoding !== "UTF-8") {
    write(`PRAGMA encoding = '${encoding}';\n`)
  }
  write("PRAGMA foreign_keys = OFF;\nBEGIN TRANSACTION;\n")

  for (const [name, sql, type, withoutRowid] of tables) {
    if (
      schemaOnly
        ? type === "shadow" || shadows?.has(String(name).toLowerCase())
        : type === "virtual"
    )
      continue
    write(schemaStatement(String(sql)))
    if (!schemaOnly)
      writeData(db, String(name), Boolean(withoutRowid), decoder, write)
  }

  if (
    !schemaOnly &&
    rows(db, "SELECT 1 FROM main.sqlite_schema WHERE name = 'sqlite_sequence'")
      .length &&
    rows(db, "SELECT 1 FROM main.sqlite_sequence LIMIT 1").length
  ) {
    write("DELETE FROM sqlite_sequence;\n")
    writeData(db, "sqlite_sequence", false, decoder, write)
  }

  for (const [sql] of rows(
    db,
    `SELECT sql FROM main.sqlite_schema
      WHERE type IN ('index', 'view', 'trigger') AND sql IS NOT NULL
        AND name NOT GLOB 'sqlite_*'
      ORDER BY CASE type WHEN 'index' THEN 0 WHEN 'view' THEN 1 ELSE 2 END, rowid`
  )) {
    write(schemaStatement(String(sql)))
  }

  if (!schemaOnly && virtual.length) {
    // Like sqlite3 .dump, preserve virtual tables through their backing
    // tables. Creating the virtual tables would create those tables twice.
    write("PRAGMA writable_schema = ON;\n")
    for (const [name, sql] of virtual) {
      const quoted = textLiteral(String(name))
      write(
        `INSERT INTO sqlite_schema (type, name, tbl_name, rootpage, sql) VALUES ('table', ${quoted}, ${quoted}, 0, ${textLiteral(String(sql))});\n`
      )
    }
    write("PRAGMA writable_schema = RESET;\n")
  }

  if (!schemaOnly) {
    for (const pragma of ["application_id", "user_version"]) {
      const value = rows(db, `PRAGMA ${pragma}`)[0]![0]
      if (value) write(`PRAGMA ${pragma} = ${value};\n`)
    }
  }
  write("COMMIT;\n")
  return finish()
}
