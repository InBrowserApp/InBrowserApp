import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Metadata, QueryResult, Structure } from "./types"

const state = vi.hoisted(() => ({
  metadata: null as Metadata | null,
  result: null as QueryResult | null,
  structure: null as Structure | null,
  busy: null as "open" | "query" | "structure" | null,
  error: null as { key: keyof typeof m; detail?: string } | null,
  request: vi.fn(),
  cancel: vi.fn(),
}))
vi.mock("./use-database", () => ({ useDatabase: () => state }))
const props = { messages: m, lang: "en" }
const file = new File(["test"], "local.db")
const result: QueryResult = {
  columns: ["id"],
  rows: [[1n]],
  truncated: false,
  elapsed: 1,
}
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  Element.prototype.scrollIntoView = vi.fn()
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.clearAllMocks()
  state.metadata = null
  state.result = null
  state.structure = null
  state.busy = null
  state.error = null
})

test("opens a local file, previews a table, edits SQL, inspects structure and closes", () => {
  const { rerender } = render(<Client {...props} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  state.busy = "open"
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
  expect(screen.getByText(m.opening)).toBeTruthy()
  state.busy = null
  state.metadata = {
    objects: [
      { name: 'a"table', type: "table", sql: 'CREATE TABLE "a""table"(id)' },
    ],
    version: "3.53",
  }
  rerender(<Client {...props} />)
  expect(state.request).toHaveBeenCalledWith({
    kind: "query",
    sql: 'SELECT * FROM "a""table";',
    limit: 1000,
  })
  const input = screen.getByRole("textbox", { name: m.sql })
  fireEvent.change(input, { target: { value: "SELECT id FROM tasks" } })
  fireEvent.click(screen.getByRole("button", { name: m.run }))
  expect(state.request).toHaveBeenLastCalledWith({
    kind: "query",
    sql: "SELECT id FROM tasks",
    limit: 1000,
  })
  state.result = result
  rerender(<Client {...props} />)
  expect(screen.getByRole("table")).toBeTruthy()
  state.structure = {
    name: 'a"table',
    columns: result,
    indexes: result,
    foreignKeys: result,
  }
  fireEvent.mouseDown(screen.getByRole("tab", { name: m.schemaTab }), {
    button: 0,
    ctrlKey: false,
  })
  expect(state.request).toHaveBeenLastCalledWith({
    kind: "structure",
    name: 'a"table',
  })
  expect(screen.getByText('CREATE TABLE "a""table"(id)')).toBeTruthy()
  fireEvent.mouseDown(screen.getByRole("tab", { name: m.queryTab }), {
    button: 0,
    ctrlKey: false,
  })
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("handles invalid files, query errors and empty database state", () => {
  const { rerender } = render(<Client {...props} />)
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
  state.error = { key: "invalid" }
  rerender(<Client {...props} />)
  expect(screen.getByRole("alert").textContent).toContain(m.invalid)
  state.metadata = { objects: [], version: "3.53" }
  state.error = { key: "workerError", detail: "no such column: missing" }
  rerender(<Client {...props} />)
  expect(screen.getByText(m.emptyDatabase)).toBeTruthy()
  expect(screen.getByRole("alert").textContent).toContain(
    "no such column: missing"
  )
  expect(screen.getByRole("alert").textContent).not.toContain(m.workerError)
  state.error = null
  state.busy = "query"
  rerender(<Client {...props} />)
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(state.cancel).toHaveBeenCalledOnce()
})

test("loads the local sample and recovers from failed sample downloads", async () => {
  const fetcher = vi
    .fn()
    .mockRejectedValueOnce(new Error("offline"))
    .mockResolvedValueOnce({ ok: false })
    .mockResolvedValue({ ok: true, blob: async () => new Blob(["sample"]) })
  vi.stubGlobal("fetch", fetcher)
  render(<Client {...props} lang="ar" />)
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: m.sample }))
  )
  expect(screen.getByRole("alert").textContent).toContain(m.workerError)
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: m.sample }))
  )
  expect(fetcher).toHaveBeenCalledTimes(2)
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: m.sample }))
  )
  expect(screen.getByText("sample.sqlite")).toBeTruthy()
  expect(screen.queryByText(m.drop)).toBeNull()
})

test("does not replace a chosen local file when an earlier sample finishes loading", async () => {
  let finish: (value: unknown) => void = () => {}
  vi.stubGlobal(
    "fetch",
    vi.fn(
      () =>
        new Promise((resolve) => {
          finish = resolve
        })
    )
  )
  render(<Client {...props} />)
  fireEvent.click(screen.getByRole("button", { name: m.sample }))
  expect(
    screen.getByRole("button", { name: m.opening }).hasAttribute("disabled")
  ).toBe(true)
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
  await act(async () =>
    finish({ ok: true, blob: async () => new Blob(["sample"]) })
  )
  expect(screen.getByText("local.db")).toBeTruthy()
  expect(screen.queryByText("sample.sqlite")).toBeNull()
})
