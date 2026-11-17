import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { ObjectBrowser } from "./object-browser"
import { QueryEditor } from "./query-editor"
import { ResultTable } from "./result-table"
import { Structure } from "./structure"
import m from "../messages/en.json"
import type { QueryResult } from "../types"

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
  Element.prototype.hasPointerCapture = vi.fn(() => false)
  Element.prototype.setPointerCapture = vi.fn()
  Element.prototype.releasePointerCapture = vi.fn()
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  vi.useRealTimers()
})
const props = { messages: m, lang: "en" }
const result: QueryResult = {
  columns: ["id", "nullable", "blob", "text"],
  rows: Array.from({ length: 55 }, (_, i) => [
    BigInt(i),
    null,
    new Uint8Array([0, 255]),
    i === 0 ? "" : "hello",
  ]),
  elapsed: 2,
  truncated: true,
}

test("finds and paginates objects without rendering an unbounded list", () => {
  const onSelect = vi.fn()
  const objects = Array.from({ length: 61 }, (_, i) => ({
    name: `table_${i}`,
    type: "table" as const,
    sql: "CREATE TABLE...",
  }))
  render(
    <ObjectBrowser
      objects={objects}
      selected="table_0"
      onSelect={onSelect}
      disabled={false}
      {...props}
    />
  )
  expect(screen.getAllByRole("button", { name: /table_\d/ })).toHaveLength(30)
  expect(
    screen.getByRole("button", { name: /table_0/ }).getAttribute("aria-pressed")
  ).toBe("true")
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(screen.getByText("Page 2 of 3")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  fireEvent.change(screen.getByLabelText(m.search), {
    target: { value: "TABLE_60" },
  })
  fireEvent.click(screen.getByRole("button", { name: /table_60/ }))
  expect(onSelect).toHaveBeenCalledWith(objects[60])
  fireEvent.change(screen.getByLabelText(m.search), {
    target: { value: "missing" },
  })
  expect(screen.getByText(m.noObjects)).toBeTruthy()
})

test("runs SQL by button or keyboard and keeps cancellation available while busy", async () => {
  const onSql = vi.fn(),
    onRun = vi.fn(),
    onCancel = vi.fn(),
    onLimit = vi.fn()
  const editor = {
    sql: "SELECT 1",
    onSql,
    onRun,
    onCancel,
    limit: 1000,
    onLimit,
    busy: false,
    invalid: false,
    ...props,
  }
  const { rerender } = render(<QueryEditor {...editor} />)
  const input = screen.getByRole("textbox", { name: m.sql })
  fireEvent.change(input, { target: { value: "SELECT 2" } })
  expect(onSql).toHaveBeenCalledWith("SELECT 2")
  fireEvent.keyDown(input, { key: "Enter", ctrlKey: true })
  fireEvent.keyDown(input, { key: "Enter", metaKey: true })
  fireEvent.keyDown(input, { key: "a" })
  fireEvent.click(screen.getByRole("button", { name: m.run }))
  expect(onRun).toHaveBeenCalledTimes(3)
  fireEvent.click(screen.getByRole("combobox"))
  fireEvent.click(await screen.findByRole("option", { name: "100" }))
  expect(onLimit).toHaveBeenCalledWith(100)
  rerender(<QueryEditor {...editor} busy />)
  fireEvent.keyDown(input, { key: "Enter", ctrlKey: true })
  fireEvent.submit(input.closest("form")!)
  expect(onRun).toHaveBeenCalledTimes(3)
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(onCancel).toHaveBeenCalledOnce()
})

test("paginates results, inspects exact values and exports all loaded rows", async () => {
  vi.useFakeTimers()
  const blobs: Blob[] = []
  const revoke = vi.fn()
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn((blob: Blob) => {
        blobs.push(blob)
        return "blob:export"
      }),
      revokeObjectURL: revoke,
    })
  )
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})
  render(
    <dialog open aria-label={m.reader}>
      <ResultTable
        result={result}
        title={m.results}
        filename="test.db"
        {...props}
      />
    </dialog>
  )
  const workspace = screen.getByRole("dialog", { name: m.reader })
  expect(screen.getAllByRole("row")).toHaveLength(51)
  expect(screen.getByText(m.truncated)).toBeTruthy()
  expect(screen.getByRole("button", { name: "0" })).toBeTruthy()
  expect(screen.getByRole("button", { name: "1" })).toBeTruthy()
  expect(screen.getByRole("button", { name: m.inspectValue })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(screen.getAllByRole("row")).toHaveLength(6)
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  const cell = screen.getAllByRole("button", {
    name: m.blob.replace("{bytes}", "2"),
    description: m.inspectValue,
  })[0]!
  cell.focus()
  fireEvent.click(cell)
  const dialog = within(workspace).getByRole("dialog", { name: m.value })
  expect(
    (within(dialog).getByRole("textbox") as HTMLTextAreaElement).value
  ).toBe("X'00ff'")
  fireEvent.click(within(dialog).getByRole("button", { name: m.close }))
  expect(screen.queryByRole("dialog", { name: m.value })).toBeNull()
  act(() => vi.advanceTimersByTime(0))
  expect(document.activeElement).toBe(cell)
  fireEvent.click(screen.getByRole("button", { name: m.json }))
  fireEvent.click(screen.getByRole("button", { name: m.csv }))
  expect(JSON.parse(await blobs[0]!.text()).rows).toHaveLength(55)
  expect(await blobs[1]!.text()).toContain("54")
  expect(click).toHaveBeenCalledTimes(2)
  act(() => vi.advanceTimersByTime(1000))
  expect(revoke).toHaveBeenCalledTimes(2)
})

test("shows empty results, download errors and structure without a selection", () => {
  vi.stubGlobal(
    "URL",
    Object.assign(URL, {
      createObjectURL: vi.fn(() => {
        throw new Error("no memory")
      }),
    })
  )
  const { rerender } = render(
    <ResultTable
      result={{ ...result, rows: [], truncated: false }}
      title={m.results}
      filename="test.db"
      {...props}
    />
  )
  expect(screen.getByText(m.noResults)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.csv }))
  expect(screen.getByRole("alert").textContent).toBe(m.exportError)
  rerender(<Structure object={undefined} structure={null} {...props} />)
  expect(screen.getByText(m.chooseTable)).toBeTruthy()
  rerender(
    <Structure
      object={{ name: "t", type: "table", sql: "CREATE TABLE t (x)" }}
      structure={{
        name: "t",
        columns: result,
        indexes: { ...result, rows: [] },
        foreignKeys: { ...result, rows: [] },
      }}
      {...props}
    />
  )
  expect(screen.getByText("CREATE TABLE t (x)")).toBeTruthy()
  expect(screen.getByText(m.columns)).toBeTruthy()
  expect(screen.getByText(`${m.indexes} (0)`)).toBeTruthy()
})
