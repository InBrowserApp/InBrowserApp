// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import { examples } from "./examples"
import m from "./messages/en.json"
import type { GraphResult } from "./graph-worker"

class GraphWorker extends EventTarget {
  static latest: GraphWorker
  postMessage = vi.fn()
  terminate = vi.fn()

  constructor() {
    super()
    GraphWorker.latest = this
  }

  receive(data: GraphResult) {
    act(() => this.dispatchEvent(new MessageEvent("message", { data })))
  }
}

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" onload=""><text>A</text></svg>'

beforeEach(() => vi.stubGlobal("Worker", GraphWorker))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("ignores obsolete previews and shows the parser error until the user corrects the source", async () => {
  const { unmount } = render(<Client messages={m} />)
  const worker = GraphWorker.latest
  await waitFor(() =>
    expect(worker.postMessage).toHaveBeenCalledWith(examples.dependencies)
  )
  const input = screen.getByLabelText<HTMLTextAreaElement>(m.source)
  fireEvent.change(input, { target: { value: "digraph {" } })
  worker.receive({ ...examples.dependencies, svg, notes: [] })
  expect(screen.queryByRole("img", { name: m.preview })).toBeNull()
  expect(screen.queryByRole("link", { name: m.downloadSvg })).toBeNull()
  worker.receive({
    source: "digraph {",
    engine: "dot",
    notes: ["syntax error"],
  })
  expect(screen.getByText(m.invalid)).toBeTruthy()
  expect(screen.getByText("syntax error")).toBeTruthy()
  expect(input.value).toBe("digraph {")
  fireEvent.change(input, { target: { value: "digraph { A -> B }" } })
  worker.receive({
    source: input.value,
    engine: "dot",
    svg,
    notes: ["layout note"],
  })
  expect(screen.getByRole("img", { name: m.preview })).toBeTruthy()
  expect(screen.getByText(m.warnings)).toBeTruthy()
  const download = screen.getByRole("link", { name: m.downloadSvg })
  expect(download.getAttribute("download")).toBe("graphviz-graph.svg")
  const renderedSvg = decodeURIComponent(download.getAttribute("href")!)
  expect(renderedSvg).toContain("<text>A</text>")
  expect(renderedSvg).not.toContain("onload")
  fireEvent.change(input, { target: { value: "" } })
  expect(screen.getByText(m.empty)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.downloadSvg })).toBeNull()
  unmount()
  expect(worker.terminate).toHaveBeenCalledOnce()
})
