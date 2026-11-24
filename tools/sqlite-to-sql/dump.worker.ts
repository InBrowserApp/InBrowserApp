import initSqlJs from "sql.js/dist/sql-wasm-browser.js"
import wasmUrl from "sql.js/dist/sql-wasm-browser.wasm?url"
import { createDump, UnsupportedSchemaError } from "./dump"
import type { Request, Response } from "./types"

const signature = "SQLite format 3\0"
const sample = `
CREATE TABLE books (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  author TEXT NOT NULL
);
INSERT INTO books VALUES
  (1, 'The Time Machine', 'H. G. Wells'),
  (2, 'Frankenstein', 'Mary Shelley'),
  (3, 'A Room of One''s Own', 'Virginia Woolf');
CREATE INDEX books_by_author ON books (author);
`

async function generate({ source, schemaOnly }: Request): Promise<Response> {
  let bytes: Uint8Array | undefined
  if (source !== "sample") {
    const header = new Uint8Array(await source.slice(0, 16).arrayBuffer())
    if (source.size < 100 || String.fromCharCode(...header) !== signature) {
      return { error: "invalid" }
    }
    bytes = new Uint8Array(await source.arrayBuffer())
  }

  const config = {
    locateFile: () => wasmUrl,
    useOldExtensionFunctions: false,
  }
  const SQLite = await initSqlJs(config)
  const db = new SQLite.Database(bytes)
  try {
    if (!bytes) db.run(sample)
    db.run("PRAGMA query_only = ON; PRAGMA trusted_schema = OFF;")
    return { dump: createDump(db, schemaOnly) }
  } finally {
    db.close()
  }
}

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  try {
    self.postMessage(await generate(data))
  } catch (error) {
    self.postMessage({
      error:
        error instanceof UnsupportedSchemaError
          ? "unsupportedSchema"
          : "failed",
    } satisfies Response)
  }
}
