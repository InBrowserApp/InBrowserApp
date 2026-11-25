import initSqlJs from "sql.js/dist/sql-wasm-browser.js"
import wasmUrl from "sql.js/dist/sql-wasm-browser.wasm?url"
import type { Database } from "sql.js"
import { entriesOf, previewLayer } from "./read"
import type { Entry } from "./read"

type Request =
  | { kind: "open"; file: File | "example" }
  | { kind: "entry"; index: number }

let database: Database | undefined
let entries: Entry[] = []

async function open(file: File | "example") {
  const config = { locateFile: () => wasmUrl, useOldExtensionFunctions: false }
  const SQL = await initSqlJs(config)
  let bytes: ArrayBuffer
  if (file === "example") {
    const response = await fetch(new URL("./bay-example.gpkg", import.meta.url))
    if (!response.ok) throw new Error("Sample is unavailable")
    bytes = await response.arrayBuffer()
  } else bytes = await file.arrayBuffer()
  database = new SQL.Database(new Uint8Array(bytes))
  database.run(
    "PRAGMA trusted_schema=OFF; PRAGMA query_only=ON; PRAGMA cell_size_check=ON;"
  )
  entries = entriesOf(database)
}

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  try {
    if (data.kind === "open") {
      await open(data.file)
      self.postMessage({ kind: "open", entries })
    } else {
      const entry = entries[data.index]!
      self.postMessage({
        kind: "entry",
        index: data.index,
        layer: previewLayer(database!, entry),
      })
    }
  } catch {
    if (data.kind === "open") {
      database?.close()
      database = undefined
    }
    self.postMessage(
      data.kind === "entry"
        ? { kind: "entry", index: data.index, layer: null }
        : { kind: "open", entries: null }
    )
  }
}
