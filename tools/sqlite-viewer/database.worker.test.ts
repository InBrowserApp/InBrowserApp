import { afterEach, beforeAll, expect, test, vi } from "vitest"
import type { Request } from "./types"

const state = vi.hoisted(() => ({
  init: vi.fn(),
  open: vi.fn(),
  query: vi.fn(),
  inspect: vi.fn(),
  close: vi.fn(),
  reply: vi.fn(),
}))
vi.mock("sql.js/dist/sql-wasm-browser.js", () => ({ default: state.init }))
vi.mock("./engine", () => ({
  openDatabase: state.open,
  queryDatabase: state.query,
  inspectDatabase: state.inspect,
}))
const metadata = { objects: [], version: "3.53" }
beforeAll(async () => {
  await import("./database.worker")
})
afterEach(() => vi.clearAllMocks())
const send = async (request: Request) => {
  const previous = self.postMessage
  self.postMessage = state.reply
  try {
    await self.onmessage?.call(self, { data: request } as MessageEvent)
  } finally {
    self.postMessage = previous
  }
}

test("reports an unopened connection, then handles open, query, structure and replacement", async () => {
  await send({ id: 1, kind: "query", sql: "SELECT 1", limit: 100 })
  expect(state.reply).toHaveBeenLastCalledWith({
    id: 1,
    kind: "error",
    error: "workerError",
    detail: "workerError",
  })
  state.init.mockResolvedValue({})
  state.open.mockResolvedValue({ db: { close: state.close }, metadata })
  const file = new File(["db"], "test.db")
  await send({ id: 2, kind: "open", file })
  expect(state.init).toHaveBeenCalledWith({
    locateFile: expect.any(Function),
    useOldExtensionFunctions: false,
  })
  expect(state.reply).toHaveBeenLastCalledWith({
    id: 2,
    kind: "open",
    metadata,
  })
  const result = { columns: ["x"], rows: [[1n]], truncated: false, elapsed: 1 }
  state.query.mockReturnValue(result)
  await send({ id: 3, kind: "query", sql: "SELECT 1", limit: 100 })
  expect(state.reply).toHaveBeenLastCalledWith({ id: 3, kind: "query", result })
  state.inspect.mockReturnValue({ name: "t" })
  await send({ id: 4, kind: "structure", name: "t" })
  expect(state.reply).toHaveBeenLastCalledWith({
    id: 4,
    kind: "structure",
    structure: { name: "t" },
  })
  await send({ id: 5, kind: "open", file })
  expect(state.close).toHaveBeenCalledOnce()
})

test("returns known failures and bounded SQL errors without leaking non-error objects", async () => {
  state.init.mockResolvedValue({})
  state.open.mockResolvedValue({ db: { close: state.close }, metadata })
  await send({ id: 0, kind: "open", file: new File(["db"], "test.db") })
  state.query.mockImplementationOnce(() => {
    throw new Error("readOnlyError")
  })
  await send({ id: 6, kind: "query", sql: "DELETE", limit: 100 })
  expect(state.reply).toHaveBeenLastCalledWith({
    id: 6,
    kind: "error",
    error: "readOnlyError",
    detail: undefined,
  })
  state.query.mockImplementationOnce(() => {
    throw new Error("x".repeat(2000))
  })
  await send({ id: 7, kind: "query", sql: "SELECT broken", limit: 100 })
  expect(state.reply.mock.lastCall![0].detail).toHaveLength(1000)
  state.query.mockImplementationOnce(() => {
    throw "arbitrary object"
  })
  await send({ id: 8, kind: "query", sql: "SELECT broken", limit: 100 })
  expect(state.reply.mock.lastCall![0].detail).toBe("workerError")
  state.open.mockRejectedValueOnce(new Error("file is not a database"))
  await send({ id: 9, kind: "open", file: new File(["bad"], "bad.db") })
  expect(state.reply).toHaveBeenLastCalledWith({
    id: 9,
    kind: "error",
    error: "invalid",
    detail: undefined,
  })
})
