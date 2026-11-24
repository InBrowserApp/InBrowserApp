import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import messages from "./messages/en.json"
import type { Response } from "./types"

const workers: TestWorker[] = []
class TestWorker {
  onmessage: ((event: MessageEvent<Response>) => void) | null = null
  onerror: (() => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    workers.push(this)
  }

  reply(data: Response) {
    act(() => this.onmessage?.(new MessageEvent("message", { data })))
  }
}

function lastWorker() {
  return workers.at(-1)!
}

function preview(text: string, shortened = false): Response {
  return {
    dump: { blob: new Blob([text]), preview: text, shortened },
  }
}

beforeEach(() => vi.stubGlobal("Worker", TestWorker))
afterEach(() => {
  cleanup()
  workers.length = 0
  vi.unstubAllGlobals()
})

test("exports the sample, updates schema mode, and returns focus after closing", () => {
  render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.sample }))
  expect(lastWorker().postMessage).toHaveBeenCalledWith({
    source: "sample",
    schemaOnly: false,
  })
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: messages.replace })
  )
  expect(screen.getByRole("status").textContent).toBe(messages.working)

  lastWorker().reply(preview("INSERT INTO example VALUES (1);"))
  const link = screen.getByRole("link", { name: messages.download })
  expect(link.getAttribute("download")).toBe("sample.sql")
  expect(screen.getByRole("button", { name: messages.copy })).toBeDefined()

  fireEvent.click(screen.getByRole("switch", { name: messages.schemaOnly }))
  expect(screen.queryByRole("link")).toBeNull()
  expect(lastWorker().postMessage).toHaveBeenCalledWith({
    source: "sample",
    schemaOnly: true,
  })
  lastWorker().reply(preview("CREATE TABLE example(id);"))
  expect(screen.getByRole("link").getAttribute("download")).toBe(
    "sample.schema.sql"
  )
  fireEvent.click(screen.getByRole("button", { name: messages.clear }))
  expect(lastWorker().terminate).toHaveBeenCalled()
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: messages.open })
  )
})

test("accepts picked and dropped files, cancels stale work, and gives error feedback", () => {
  const { container } = render(<Client messages={messages} />)
  const input = container.querySelector<HTMLInputElement>("input[type=file]")!
  const file = new File(["data"], "backup.2026.sqlite")
  const replacement = new File(["other"], "second.db")
  const click = vi.spyOn(input, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.open }))
  expect(click).toHaveBeenCalled()
  fireEvent.change(input, { target: { files: [file] } })
  const previous = lastWorker()
  fireEvent.click(screen.getByRole("button", { name: messages.replace }))
  expect(click).toHaveBeenCalledTimes(2)

  const section = screen.getByRole("region", { name: messages.reader })
  const drag = { types: ["Files"], files: [replacement] }
  fireEvent.dragOver(section, { dataTransfer: drag })
  expect(screen.getByText(messages.releaseFile)).toBeDefined()
  fireEvent.dragLeave(section)
  expect(screen.queryByText(messages.releaseFile)).toBeNull()
  fireEvent.drop(section, { dataTransfer: drag })
  expect(previous.onmessage).toBeNull()
  expect(previous.terminate).toHaveBeenCalledOnce()
  expect(lastWorker().postMessage).toHaveBeenCalledWith({
    source: replacement,
    schemaOnly: false,
  })
  lastWorker().reply({ error: "invalid" })
  expect(screen.getByRole("alert").textContent).toBe(messages.invalid)

  fireEvent.change(input, { target: { files: [file] } })
  lastWorker().reply(preview("CREATE TABLE…", true))
  expect(screen.getByRole("link").getAttribute("download")).toBe(
    "backup.2026.sql"
  )
  expect(screen.getByText(messages.previewLimit)).toBeDefined()
  expect(screen.queryByRole("button", { name: messages.copy })).toBeNull()
})

test("handles worker errors and an unavailable Worker constructor", () => {
  const rendered = render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.sample }))
  act(() => lastWorker().onerror?.())
  expect(screen.getByRole("alert").textContent).toBe(messages.failed)
  rendered.unmount()

  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("worker unavailable")
      }
    }
  )
  render(<Client messages={messages} />)
  fireEvent.click(screen.getByRole("button", { name: messages.sample }))
  expect(screen.getByRole("alert").textContent).toBe(messages.failed)
})
