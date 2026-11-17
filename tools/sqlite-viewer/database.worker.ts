import initSqlJs from "sql.js/dist/sql-wasm-browser.js"
import wasmUrl from "sql.js/dist/sql-wasm-browser.wasm?url"
import type { Database } from "sql.js"
import { inspectDatabase, openDatabase, queryDatabase } from "./engine"
import type { Failure, Request, ResponsePayload } from "./types"

let database: Database | null = null
const failures = new Set<Failure>([
  "invalid",
  "tooLarge",
  "readOnlyError",
  "singleStatement",
  "emptyQuery",
  "queryTooLarge",
  "schemaLimit",
])

self.onmessage = async (event: MessageEvent<Request>) => {
  const request = event.data
  const reply = (message: ResponsePayload) =>
    self.postMessage({ ...message, id: request.id })
  let initializing = false
  try {
    if (request.kind === "open") {
      database?.close()
      database = null
      initializing = true
      const SQL = await initSqlJs({ locateFile: () => wasmUrl })
      initializing = false
      const { db, metadata } = await openDatabase(SQL, request.file)
      database = db
      reply({ kind: "open", metadata })
    } else {
      if (!database) throw new Error("workerError")
      if (request.kind === "query")
        reply({
          kind: "query",
          result: queryDatabase(database, request.sql, request.limit),
        })
      else
        reply({
          kind: "structure",
          structure: inspectDatabase(database, request.name),
        })
    }
  } catch (reason) {
    const detail = reason instanceof Error ? reason.message : "workerError"
    const error: Failure = failures.has(detail as Failure)
      ? (detail as Failure)
      : request.kind === "open" && !initializing
        ? "invalid"
        : "workerError"
    reply({
      kind: "error",
      error,
      detail: error === "workerError" ? detail.slice(0, 1000) : undefined,
    })
  }
}
