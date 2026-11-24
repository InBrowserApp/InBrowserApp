import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import { afterEach, beforeAll, expect, test } from "vitest"
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js"
import { createDump, UnsupportedSchemaError } from "./dump"

const require = createRequire(import.meta.url)
const databases: Database[] = []
let SQLite: SqlJsStatic

beforeAll(async () => {
  SQLite = await initSqlJs({
    wasmBinary: Uint8Array.from(
      readFileSync(require.resolve("sql.js/dist/sql-wasm.wasm"))
    ).buffer,
  })
})
afterEach(() => {
  for (const db of databases.splice(0)) db.close()
})

function create(sql: string) {
  const db = new SQLite.Database()
  databases.push(db)
  db.run(sql)
  return db
}

test("restores exact values, database objects, rowids, sequences and metadata", async () => {
  const source = create(`
    PRAGMA application_id = 1234;
    PRAGMA user_version = 7;
    CREATE TABLE "order""items" (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      content BLOB,
      quantity REAL,
      label TEXT GENERATED ALWAYS AS (upper(title)) STORED
    );
    INSERT INTO "order""items"(id, title, content, quantity) VALUES
      (9007199254740993, 'L''été' || char(0) || 'fin', X'00ff', 1.2345678901234567),
      (9007199254740994, CAST(X'80' AS TEXT), NULL, 1e999),
      (9007199254740995, CAST(X'EFBBBF410D0A42' AS TEXT), X'', NULL);
    UPDATE sqlite_sequence SET seq=9007199254740999;
    CREATE TABLE logs (message TEXT);
    INSERT INTO logs(rowid, message) VALUES (42, 'kept');
    CREATE TABLE extra (rowid INTEGER AS (99), name TEXT, "oid" TEXT);
    INSERT INTO extra(_rowid_, name, oid) VALUES (50, 'generated', NULL);
    CREATE TABLE descending (id INTEGER PRIMARY KEY DESC);
    INSERT INTO descending(rowid, id) VALUES (4, 90);
    CREATE TABLE keyed (name TEXT PRIMARY KEY) WITHOUT ROWID;
    INSERT INTO keyed VALUES ('key');
    CREATE INDEX items_title ON "order""items"(title);
    CREATE VIEW item_ids AS SELECT id FROM "order""items";
    CREATE TRIGGER items_insert AFTER INSERT ON "order""items"
      BEGIN INSERT INTO logs(message) VALUES ('added'); END;
  `)
  const dump = createDump(source, false)
  const restored = create(await dump.blob.text())
  expect(dump.preview).toBe(await dump.blob.text())
  for (const query of [
    'SELECT quote(id), hex(title), hex(content), quote(quantity), typeof(content), hex(label) FROM "order""items"',
    "SELECT rowid, message FROM logs",
    "SELECT rowid, _rowid_, name, oid FROM extra",
    "SELECT rowid, id FROM descending",
    "SELECT * FROM keyed",
    "SELECT name, quote(seq) FROM sqlite_sequence",
    "SELECT quote(id) FROM item_ids",
    "PRAGMA application_id",
    "PRAGMA user_version",
  ]) {
    expect(restored.exec(query)).toEqual(source.exec(query))
  }
  restored.run('INSERT INTO "order""items"(title) VALUES (\'new\');')
  expect(
    restored.exec("SELECT message FROM logs ORDER BY rowid")[0]!.values
  ).toEqual([["kept"], ["added"]])
  expect(
    restored.exec("SELECT quote(max(id)) FROM item_ids")[0]!.values
  ).toEqual([["9007199254741000"]])
})

test("restores UTF-16 text with embedded NUL and keeps UTF-8 SQL", async () => {
  const source = create(`
    PRAGMA encoding = 'UTF-16be';
    CREATE TABLE phrases (text TEXT);
    INSERT INTO phrases VALUES ('한국어 😺'), ('a' || char(0) || 'b');
  `)
  const dump = await createDump(source, false).blob.text()
  expect(dump).toContain("한국어 😺")
  const restored = create(dump)
  expect(restored.exec("SELECT hex(text) FROM phrases")).toEqual(
    source.exec("SELECT hex(text) FROM phrases")
  )
})

test("exports FTS shadow data in full dumps and just the visible schema in schema-only mode", async () => {
  const source = create(`
    CREATE VIRTUAL TABLE docs USING fts4(title);
    INSERT INTO docs(docid, title) VALUES (25, 'searchable');
    CREATE TABLE notes (id INTEGER PRIMARY KEY AUTOINCREMENT, note TEXT);
    INSERT INTO notes(note) VALUES ('one');
    CREATE VIEW note_list AS SELECT * FROM notes;
  `)
  const full = create(await createDump(source, false).blob.text())
  expect(
    full.exec("SELECT docid, title FROM docs WHERE docs MATCH 'searchable'")[0]!
      .values
  ).toEqual([[25, "searchable"]])
  const schema = await createDump(source, true).blob.text()
  expect(schema).not.toMatch(/INSERT INTO|CREATE TABLE .*docs_/)
  const empty = create(schema)
  expect(empty.exec("SELECT count(*) FROM docs")[0]!.values).toEqual([[0]])
  expect(empty.exec("SELECT count(*) FROM note_list")[0]!.values).toEqual([[0]])
})

test("omits FTS5 and R-Tree backing tables from schema-only exports", async () => {
  const source = create(`
    CREATE TABLE docs_data (id INTEGER PRIMARY KEY, block BLOB);
    CREATE TABLE docs_config (k PRIMARY KEY, v) WITHOUT ROWID;
    CREATE TABLE docs_owner (id INTEGER);
    CREATE TABLE boxes_node (nodeno INTEGER PRIMARY KEY, data);
    PRAGMA writable_schema = ON;
    INSERT INTO sqlite_schema (type,name,tbl_name,rootpage,sql) VALUES
      ('table','docs','docs',0,'CREATE VIRTUAL TABLE docs USING fts5(body)'),
      ('table','boxes','boxes',0,'CREATE VIRTUAL TABLE boxes USING rtree(id,x,y)');
    PRAGMA writable_schema = RESET;
  `)
  const schema = await createDump(source, true).blob.text()
  expect(schema).toContain("CREATE VIRTUAL TABLE docs USING fts5(body);")
  expect(schema).toContain("CREATE VIRTUAL TABLE boxes USING rtree(id,x,y);")
  expect(schema).toContain("CREATE TABLE docs_owner")
  expect(schema).not.toMatch(/docs_data|docs_config|boxes_node/)
})

test("reports unavailable custom modules only for the schema-only mode", () => {
  const source = create(`
    PRAGMA writable_schema = ON;
    INSERT INTO sqlite_schema (type,name,tbl_name,rootpage,sql) VALUES
      ('table','docs','docs',0,'CREATE VIRTUAL TABLE docs USING custom(body)');
    PRAGMA writable_schema = RESET;
  `)
  expect(() => createDump(source, true)).toThrow(UnsupportedSchemaError)
  expect(createDump(source, false).preview).toContain("USING custom(body)")
})

test("limits the preview while retaining every row in the download", async () => {
  const source = create(`
    CREATE TABLE payload (data BLOB);
    INSERT INTO payload VALUES (zeroblob(300000)), (X'FF');
  `)
  const dump = createDump(source, false)
  expect(dump.shortened).toBe(true)
  expect(dump.preview).toHaveLength(24_000)
  const restored = create(await dump.blob.text())
  expect(
    restored.exec("SELECT length(data), hex(substr(data, -1)) FROM payload")[0]!
      .values
  ).toEqual([
    [300000, "00"],
    [1, "FF"],
  ])
})

test("exports all values in a table at SQLite's maximum column count", async () => {
  const columns = Array.from({ length: 2000 }, (_, index) => `c${index}`)
  const source = create(`
    CREATE TABLE wide (${columns.join(",")});
    INSERT INTO wide (c1999) VALUES ('last');
  `)
  const restored = create(await createDump(source, false).blob.text())
  expect(restored.exec("SELECT c1999 FROM wide")[0]!.values).toEqual([["last"]])
})
