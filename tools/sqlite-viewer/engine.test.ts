import { afterEach, beforeAll, describe, expect, it } from "vitest"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js"
import { inspectDatabase, openDatabase, queryDatabase } from "./engine"

const require = createRequire(import.meta.url)
let SQL: SqlJsStatic
let db: Database | undefined
beforeAll(async () => {
  const config = {
    useOldExtensionFunctions: false,
    wasmBinary: Uint8Array.from(
      readFileSync(require.resolve("sql.js/dist/sql-wasm.wasm"))
    ).buffer,
  }
  SQL = await initSqlJs(config)
})
afterEach(() => {
  db?.close()
  db = undefined
})
const sample = () =>
  new File(
    [readFileSync("tools/sqlite-viewer/fixtures/sample.sqlite")],
    "example.db"
  )

describe("SQLite engine with real WASM", () => {
  async function open() {
    const opened = await openDatabase(SQL, sample())
    db = opened.db
    return opened
  }
  it("opens tables and views and inspects columns, indexes and foreign keys", async () => {
    const { metadata } = await open()
    expect(
      metadata.objects.map((object) => [object.name, object.type])
    ).toEqual([
      ["projects", "table"],
      ["tasks", "table"],
      ["project_summary", "view"],
    ])
    expect(metadata.version).toMatch(/^3\./)
    const structure = inspectDatabase(db!, "tasks")
    expect(structure.columns.rows).toHaveLength(6)
    expect(structure.indexes.rows[0]![1]).toBe("tasks_project")
    expect(structure.foreignKeys.rows[0]![2]).toBe("projects")
    expect(
      queryDatabase(db!, "SELECT * FROM project_summary", 100).rows
    ).toHaveLength(3)
  })
  it("opens generated math columns and uses native math functions in views", async () => {
    const source = new SQL.Database()
    source.run(`
      CREATE TABLE measurements (
        value REAL,
        root REAL GENERATED ALWAYS AS (sqrt(value)) STORED
      );
      INSERT INTO measurements(value) VALUES (100);
      CREATE VIEW calculations AS
        SELECT sqrt(value) AS root, log(value) AS logarithm FROM measurements;
    `)
    const bytes = source.export()
    source.close()
    const opened = await openDatabase(
      SQL,
      new File([bytes as Uint8Array<ArrayBuffer>], "math.sqlite")
    )
    db = opened.db
    expect(
      queryDatabase(db, "SELECT root FROM measurements", 100).rows
    ).toEqual([[10]])
    expect(queryDatabase(db, "SELECT * FROM calculations", 100).rows).toEqual([
      [10, 2],
    ])
    expect(
      inspectDatabase(db, "calculations").columns.rows.map((row) => row[1])
    ).toEqual(["root", "logarithm"])
  })
  it("retains 64-bit integers, BLOB, NULL, duplicate columns and floating point", async () => {
    await open()
    const result = queryDatabase(
      db!,
      "SELECT id, id, estimate, notes, attachment FROM tasks ORDER BY id DESC",
      100
    )
    expect(result.columns).toEqual([
      "id",
      "id",
      "estimate",
      "notes",
      "attachment",
    ])
    expect(result.rows[0]).toEqual([
      9007199254740993n,
      9007199254740993n,
      0.5,
      "Exact 64-bit integer example",
      null,
    ])
    expect(result.rows[3]![3]).toBe(null)
    expect(result.rows[3]![4]).toEqual(
      new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10])
    )
  })
  it("bounds results and reports zero-row result columns", async () => {
    await open()
    expect(queryDatabase(db!, "SELECT * FROM tasks", 2)).toMatchObject({
      rows: expect.any(Array),
      truncated: true,
    })
    expect(queryDatabase(db!, "SELECT * FROM tasks", 2).rows).toHaveLength(2)
    expect(
      queryDatabase(db!, "SELECT * FROM tasks WHERE 0", 100)
    ).toMatchObject({
      columns: ["id", "project_id", "title", "estimate", "notes", "attachment"],
      rows: [],
      truncated: false,
    })
    expect(queryDatabase(db!, "SELECT * FROM tasks", NaN).rows).toHaveLength(4)
    expect(queryDatabase(db!, "SELECT * FROM tasks", 0).rows).toHaveLength(4)
  })
  it("rejects multiple statements without ever preparing a PRAGMA setter", async () => {
    await open()
    expect(() =>
      queryDatabase(db!, "SELECT 1; PRAGMA query_only=OFF", 100)
    ).toThrow("singleStatement")
    expect(() =>
      queryDatabase(db!, "WITH a AS (SELECT 1) DELETE FROM tasks", 100)
    ).toThrow(/readonly/)
    expect(queryDatabase(db!, "SELECT COUNT(*) FROM tasks", 100).rows).toEqual([
      [4n],
    ])
    expect(() => queryDatabase(db!, "PRAGMA query_only=OFF", 100)).toThrow(
      "readOnlyError"
    )
    expect(
      queryDatabase(
        db!,
        "SELECT ';PRAGMA query_only=OFF' AS example; -- trailing comment",
        100
      ).rows
    ).toEqual([[";PRAGMA query_only=OFF"]])
    expect(() =>
      queryDatabase(db!, "EXPLAIN PRAGMA query_only=OFF", 100)
    ).toThrow("readOnlyError")
    expect(() =>
      queryDatabase(db!, "WITH a AS (SELECT 1) DELETE FROM tasks", 100)
    ).toThrow(/readonly/)
    expect(
      queryDatabase(db!, "EXPLAIN SELECT 1", 100).rows.length
    ).toBeGreaterThan(0)
  })
  it("frees statements after SQL errors and can run another query", async () => {
    await open()
    expect(() => queryDatabase(db!, "SELECT missing FROM tasks", 100)).toThrow(
      /no such column/
    )
    expect(queryDatabase(db!, "SELECT 42", 100).rows).toEqual([[42n]])
    expect(() => queryDatabase(db!, "SELECT 1; SELECT 2", 100)).toThrow(
      "singleStatement"
    )
  })
  it("stops at the byte budget and the hard row limit", async () => {
    await open()
    const large = queryDatabase(db!, "SELECT zeroblob(6000000)", 100)
    expect(large).toMatchObject({ rows: [], truncated: true })
    const recursive =
      "WITH RECURSIVE n(x) AS (VALUES(1) UNION ALL SELECT x+1 FROM n WHERE x<10001) SELECT x FROM n"
    expect(queryDatabase(db!, recursive, 100000)).toMatchObject({
      rows: expect.any(Array),
      truncated: true,
    })
    expect(queryDatabase(db!, recursive, 100000).rows).toHaveLength(10000)
  })
  it("rejects invalid and corrupt files without retaining a database", async () => {
    await expect(
      openDatabase(SQL, new File(["text"], "bad.db"))
    ).rejects.toThrow("invalid")
    const bytes = new Uint8Array(1024)
    bytes.set(new TextEncoder().encode("SQLite format 3\0"))
    await expect(
      openDatabase(SQL, new File([bytes], "corrupt.db"))
    ).rejects.toThrow(/file is not a database/)
  })
  it("queries identifiers safely and supports empty databases", async () => {
    const source = new SQL.Database()
    source.run('CREATE TABLE "a""b" (x); INSERT INTO "a""b" VALUES (7);')
    const bytes = source.export()
    source.close()
    const opened = await openDatabase(
      SQL,
      new File([bytes as Uint8Array<ArrayBuffer>], "quoted.sqlite")
    )
    db = opened.db
    expect(inspectDatabase(db, 'a"b').columns.rows[0]![1]).toBe("x")
    db.close()
    db = undefined
    const empty = new SQL.Database()
    const blank = empty.export()
    empty.close()
    const next = await openDatabase(
      SQL,
      new File([blank as Uint8Array<ArrayBuffer>], "empty.sqlite")
    )
    db = next.db
    expect(next.metadata.objects).toEqual([])
  })
})
