import { beforeAll, expect, test, vi } from "vitest"
import { readFileSync } from "node:fs"
import { createRequire } from "node:module"
import initSqlJs, { type SqlJsStatic } from "sql.js"
import { UnsupportedSchemaError } from "./dump"
import type { Request, Response } from "./types"

const controls = vi.hoisted(() => ({
  init: vi.fn(),
  dump: vi.fn(),
}))

vi.mock("sql.js/dist/sql-wasm-browser.js", () => ({ default: controls.init }))
vi.mock("./dump", async (load) => {
  const real = await load<typeof import("./dump")>()
  controls.dump.mockImplementation(real.createDump)
  return { ...real, createDump: controls.dump }
})

const require = createRequire(import.meta.url)
let SQLite: SqlJsStatic
beforeAll(async () => {
  SQLite = await initSqlJs({
    wasmBinary: Uint8Array.from(
      readFileSync(require.resolve("sql.js/dist/sql-wasm.wasm"))
    ).buffer,
  })
  controls.init.mockResolvedValue(SQLite)
  await import("./dump.worker")
})

async function deliver(data: Request) {
  const reply = vi.spyOn(self, "postMessage").mockImplementation(() => {})
  try {
    await self.onmessage?.call(self, { data } as MessageEvent<Request>)
    return reply.mock.lastCall?.[0] as Response
  } finally {
    reply.mockRestore()
  }
}

test("exports the built-in sample and a local database", async () => {
  const sample = await deliver({ source: "sample", schemaOnly: false })
  expect(sample).toMatchObject({
    dump: { preview: expect.stringContaining("Mary Shelley") },
  })
  const db = new SQLite.Database()
  db.run("CREATE TABLE records (id INTEGER); INSERT INTO records VALUES (98);")
  const file = new File([Uint8Array.from(db.export()).buffer], "records.db")
  db.close()
  const response = await deliver({ source: file, schemaOnly: true })
  expect(response).toMatchObject({
    dump: { preview: expect.stringContaining("CREATE TABLE records") },
  })
  expect("dump" in response && response.dump.preview).not.toContain("INSERT")
})

test("reports invalid input, unavailable virtual schemas and worker failure", async () => {
  for (const content of ["empty", "x".repeat(100)]) {
    expect(
      await deliver({
        source: new File([content], "invalid.db"),
        schemaOnly: false,
      })
    ).toEqual({ error: "invalid" })
  }
  controls.dump.mockImplementationOnce(() => {
    throw new UnsupportedSchemaError()
  })
  expect(await deliver({ source: "sample", schemaOnly: true })).toEqual({
    error: "unsupportedSchema",
  })
  controls.init.mockRejectedValueOnce(new Error("loading failed"))
  expect(await deliver({ source: "sample", schemaOnly: true })).toEqual({
    error: "failed",
  })
})
