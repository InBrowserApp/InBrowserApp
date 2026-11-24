import initSqlJs from "sql.js/dist/sql-wasm-browser.js"
import wasmUrl from "sql.js/dist/sql-wasm-browser.wasm?url"
import { createDatabase } from "./database"
import { readSpreadsheet } from "./spreadsheet"
import type { Request, Response } from "./types"

const parsed = new Map<number, ReturnType<typeof readTables>>()
let sql: Awaited<ReturnType<typeof initSqlJs>> | undefined

function readTables(bytes: Uint8Array, name: string) {
  return readSpreadsheet(bytes, name).flatMap((table) => {
    const width = table.rows.reduce((max, row) => Math.max(max, row.length), 0)
    return table.rows.some((row) => row.some((value) => value != null))
      ? [{ ...table, width }]
      : []
  })
}

function send(message: Response, transfer: Transferable[] = []) {
  self.postMessage(message, { transfer })
}

self.onmessage = async ({ data }: MessageEvent<Request>) => {
  if (data.kind === "read") {
    for (const { id, file } of data.sources) {
      try {
        const tables = readTables(
          new Uint8Array(await file.arrayBuffer()),
          file.name
        )
        if (tables.length === 0) {
          send({ kind: "read", result: { id, error: "emptyFile" } })
          continue
        }
        parsed.set(id, tables)
        const previews = tables.map(({ label, width, rows }) => ({
          label,
          width,
          rows: rows.slice(0, 7).map((row, index) =>
            // Keep all possible column names and limit data sent to the preview.
            index === 0
              ? row
              : row
                  .slice(0, 12)
                  .map((cell) =>
                    typeof cell === "string" && cell.length > 200
                      ? `${cell.slice(0, 200)}…`
                      : cell
                  )
          ),
        }))
        send({ kind: "read", result: { id, previews } })
      } catch {
        send({ kind: "read", result: { id, error: "unreadable" } })
      }
    }
  } else if (data.kind === "remove") {
    parsed.delete(data.id)
  } else {
    try {
      const config = {
        locateFile: () => wasmUrl,
        useOldExtensionFunctions: false,
      }
      sql ??= await initSqlJs(config)
      const bytes = createDatabase(
        sql,
        data.tables.map(({ id, index, name, header }) => ({
          ...parsed.get(id)![index]!,
          name,
          header,
        }))
      )
      send({ kind: "created", bytes }, [bytes.buffer])
    } catch {
      send({ kind: "createError" })
    }
  }
}
