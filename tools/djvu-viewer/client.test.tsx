import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Reply } from "./types"

class LocalWorker extends EventTarget {
  static instances: LocalWorker[] = []
  onmessage?: (event: MessageEvent<Reply>) => void
  onerror?: () => void
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    super()
    LocalWorker.instances.push(this)
  }

  send(data: Reply) {
    act(() => {
      const event = new MessageEvent("message", { data })
      this.onmessage?.(event)
      this.dispatchEvent(event)
    })
  }
}

function open(name: string) {
  const file = new File(["test"], name)
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [file] },
  })
  const worker = LocalWorker.instances.at(-1)!
  expect(worker.postMessage).toHaveBeenLastCalledWith({ type: "open", file })
  return worker
}

function showPage(worker: LocalWorker, page: number) {
  worker.send({
    type: "page",
    page,
    width: 1,
    height: 1,
    cssWidth: 256,
    pixels: new Uint8ClampedArray([0, 0, 0, 255]),
  })
}

function button(name: string) {
  return screen.getByRole("button", { name })
}

beforeEach(() => {
  LocalWorker.instances = []
  vi.stubGlobal("Worker", LocalWorker)
  vi.stubGlobal("ImageData", class {})
  vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(null)
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("skips obsolete page requests and keeps reading after an unreadable page", () => {
  render(<Client messages={m} />)
  const worker = open("book.djvu")
  worker.send({ type: "opened", total: 4 })
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    type: "render",
    page: 1,
  })

  fireEvent.click(button(m.next))
  fireEvent.click(button(m.next))
  expect(worker.postMessage).toHaveBeenCalledTimes(2)
  showPage(worker, 1)
  expect(screen.queryByRole("img")).toBeNull()
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    type: "render",
    page: 3,
  })

  worker.send({ type: "pageError", page: 3 })
  expect(screen.getByRole("alert").textContent).toContain(m.pageError)
  const readingArea = screen.getByRole("region", { name: m.reader })
  fireEvent.keyDown(readingArea, { key: "End" })
  showPage(worker, 4)
  expect(screen.getByRole("img", { name: "Page 4 of 4" })).toBeTruthy()
  expect(button(m.next).hasAttribute("disabled")).toBe(true)
  fireEvent.keyDown(readingArea, { key: "PageUp" })
  expect(worker.postMessage).toHaveBeenLastCalledWith({
    type: "render",
    page: 3,
  })
})

test("recovers from an invalid file and replaces or closes the current document", () => {
  render(<Client messages={m} />)
  const bad = open("broken.djv")
  bad.send({ type: "invalid" })
  expect(screen.getByRole("alert").textContent).toContain(m.invalid)
  expect(bad.terminate).toHaveBeenCalled()

  const first = open("book.djvu")
  first.send({ type: "opened", total: 2 })
  const next = open("scan.djv")
  expect(first.terminate).toHaveBeenCalled()
  next.send({ type: "opened", total: 1 })
  showPage(next, 1)

  fireEvent.click(button(m.fitWidth))
  expect(button(m.fitWidth).getAttribute("aria-pressed")).toBe("true")
  const zoom = screen.getByRole("spinbutton", { name: m.zoom })
  fireEvent.change(zoom, { target: { value: "80" } })
  fireEvent.keyDown(zoom, { key: "Enter" })
  fireEvent.click(button(m.zoomIn))
  expect((zoom as HTMLInputElement).value).toBe("100")
  fireEvent.click(button(m.zoomOut))
  expect((zoom as HTMLInputElement).value).toBe("80")
  fireEvent.click(button(m.fitPage))
  expect(button(m.fitPage).getAttribute("aria-pressed")).toBe("true")

  fireEvent.click(button(m.clear))
  expect(next.terminate).toHaveBeenCalled()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("reports when the worker fails to load", () => {
  render(<Client messages={m} />)
  const worker = open("book.djvu")
  act(() => worker.onerror?.())
  expect(screen.getByRole("alert").textContent).toContain(m.engineError)
  expect(worker.terminate).toHaveBeenCalled()
})
