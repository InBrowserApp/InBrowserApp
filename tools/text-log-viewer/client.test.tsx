import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import { Reader } from "./reader"
import m from "./messages/en.json"
const state = vi.hoisted(() => ({
  view: null as unknown,
  busy: false,
  error: null as string | null,
  request: vi.fn(),
}))
vi.mock("./use-reader", () => ({ useReader: () => state }))
vi.mock("./reader-frame", () => ({
  ReaderFrame: ({ html }: { html: string }) => (
    <div data-testid="frame">{html}</div>
  ),
}))
afterEach(() => {
  cleanup()
  state.view = null
  state.busy = false
  state.error = null
  vi.clearAllMocks()
})
const section = {
  index: 1,
  start: 10,
  end: 30,
  rows: [{ line: 257, offset: 10, text: "text", continued: true }],
}
const view = {
  id: 1,
  section,
  metadata: { encoding: "utf-8", lines: 900, sections: 4 },
}

test("client exposes opening, encoding recovery, errors, empty and close states", () => {
  const { rerender } = render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  const input = screen.getByLabelText(m.open) as HTMLInputElement
  state.busy = true
  fireEvent.change(input, {
    target: { files: [new File(["text"], "text.log")] },
  })
  expect(screen.getByText(m.opening)).toBeTruthy()
  expect(screen.getByRole("combobox", { name: m.encoding })).toBeTruthy()
  state.busy = false
  state.error = "encodingError"
  rerender(<Client messages={m} />)
  expect(screen.getByRole("alert").textContent).toContain(m.encodingError)
  state.error = null
  state.view = view
  rerender(<Client messages={m} />)
  expect(screen.getByText("Decoded as utf-8")).toBeTruthy()
  expect(screen.getByText(m.scope)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("reader sends whole-file searches, line and section navigation, and maintains compact controls", () => {
  const request = vi.fn()
  const { rerender } = render(
    <Reader view={view} busy={false} request={request} m={m} />
  )
  const query = screen.getByRole("searchbox", { name: m.find })
  fireEvent.click(screen.getByRole("button", { name: m.wrap }))
  expect(
    screen.getByRole("button", { name: m.wrap }).getAttribute("aria-pressed")
  ).toBe("true")
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  fireEvent.click(screen.getByRole("button", { name: m.resetZoom }))
  const line = screen.getByRole("spinbutton", { name: m.line })
  fireEvent.change(line, { target: { value: "800" } })
  fireEvent.keyDown(line, { key: "Enter" })
  expect(request).toHaveBeenLastCalledWith({ kind: "line", line: 800 })
  for (const [label, command] of [
    [m.beginning, { kind: "section", index: 0 }],
    [m.previous, { kind: "section", index: 0 }],
    [m.next, { kind: "section", index: 2 }],
    [m.end, { kind: "end" }],
  ] as const) {
    fireEvent.click(screen.getByRole("button", { name: label }))
    expect(request).toHaveBeenLastCalledWith(command)
  }
  fireEvent.submit(query.closest("form")!)
  fireEvent.change(query, { target: { value: "text" } })
  fireEvent.submit(query.closest("form")!)
  expect(request).toHaveBeenLastCalledWith({
    kind: "search",
    query: "text",
    from: 10,
    direction: 1,
  })
  rerender(
    <Reader
      view={{
        ...view,
        match: { offset: 20, length: 4, line: 258, wrapped: true },
      }}
      busy={false}
      request={request}
      m={m}
    />
  )
  expect(screen.getByRole("status").textContent).toContain(m.wrapped)
  fireEvent.keyDown(query, { key: "Enter", shiftKey: true })
  expect(request).toHaveBeenLastCalledWith({
    kind: "search",
    query: "text",
    from: 19,
    direction: -1,
  })
  request.mockClear()
  fireEvent.click(screen.getByRole("button", { name: m.previousMatch }))
  expect(request).toHaveBeenCalledExactlyOnceWith({
    kind: "search",
    query: "text",
    from: 19,
    direction: -1,
  })
  request.mockClear()
  fireEvent.click(screen.getByRole("button", { name: m.nextMatch }))
  expect(request).toHaveBeenCalledExactlyOnceWith({
    kind: "search",
    query: "text",
    from: 21,
    direction: 1,
  })
  request.mockClear()
  fireEvent.keyDown(query, { key: "Enter" })
  expect(request).toHaveBeenCalledExactlyOnceWith({
    kind: "search",
    query: "text",
    from: 21,
    direction: 1,
  })
  fireEvent.keyDown(query, { key: "a" })
  rerender(
    <Reader
      view={{ ...view, match: null }}
      busy={false}
      request={request}
      m={m}
    />
  )
  expect(screen.getByText(m.noMatch)).toBeTruthy()
  rerender(<Reader view={view} busy={true} request={request} m={m} />)
  expect(screen.getByText(m.searching)).toBeTruthy()
  rerender(
    <Reader
      view={{
        ...view,
        metadata: { ...view.metadata, lines: 0 },
        section: { index: 0, start: 0, end: 0, rows: [] },
      }}
      busy={false}
      request={request}
      m={m}
    />
  )
  expect(screen.getByText(m.empty)).toBeTruthy()
})
