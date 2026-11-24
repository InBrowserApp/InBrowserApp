import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Request, Response } from "./types"

class ConverterWorker {
  static current: ConverterWorker
  onmessage?: (event: MessageEvent<Response>) => void
  postMessage = vi.fn<(request: Request) => void>()
  terminate = vi.fn()

  constructor() {
    ConverterWorker.current = this
  }

  receive(data: Response) {
    act(() => this.onmessage?.(new MessageEvent("message", { data })))
  }
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("previews imported tables, retries conversion and opens the current output", () => {
  vi.stubGlobal("Worker", ConverterWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:test")
  const revoke = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  render(<Client messages={m} lang="de" />)
  const worker = ConverterWorker.current
  fireEvent.click(screen.getByRole("button", { name: m.sample }))
  expect(worker.postMessage).toHaveBeenCalledWith({
    kind: "read",
    sources: [
      { id: 0, file: expect.any(File) },
      { id: 1, file: expect.any(File) },
    ],
  })
  expect(screen.getByRole("status").textContent).toContain(m.reading)
  worker.receive({
    kind: "read",
    result: {
      id: 0,
      previews: [{ label: "data", width: 1, rows: [["city"], ["Osaka"]] }],
    },
  })
  worker.receive({ kind: "read", result: { id: 1, error: "unreadable" } })
  expect(screen.getByRole("alert").textContent).toContain(m.unreadable)
  fireEvent.click(screen.getByRole("button", { name: /Remove.*orders\.csv/ }))
  expect(worker.postMessage).toHaveBeenLastCalledWith({ kind: "remove", id: 1 })

  fireEvent.change(screen.getByRole("textbox", { name: m.tableName }), {
    target: { value: "locations" },
  })
  fireEvent.click(screen.getByRole("checkbox", { name: m.header }))
  expect(screen.getByRole("columnheader", { name: "column_1" })).toBeTruthy()
  expect(screen.getByRole("cell", { name: "city" })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.convert }))
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    kind: "create",
    tables: [{ id: 0, index: 0, name: "locations", header: false }],
  })
  worker.receive({ kind: "createError" })
  expect(screen.getByRole("alert").textContent).toContain(m.createError)
  fireEvent.click(screen.getByRole("button", { name: m.convert }))
  worker.receive({ kind: "created", bytes: new Uint8Array([1, 2, 3]) })
  expect(
    screen.getByRole("link", { name: m.download }).getAttribute("download")
  ).toBe("customers.sqlite")
  expect(
    screen.getByRole("link", { name: m.viewer }).getAttribute("href")
  ).toBe("/de/tools/sqlite-viewer/#database=blob%3Atest&name=customers.sqlite")

  fireEvent.click(screen.getByRole("checkbox", { name: m.header }))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(revoke).toHaveBeenCalledWith("blob:test")
})
