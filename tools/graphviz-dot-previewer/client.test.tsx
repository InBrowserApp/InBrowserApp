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

const { createDiagramPdf } = vi.hoisted(() => ({ createDiagramPdf: vi.fn() }))
vi.mock("@workspace/svg-pdf", () => ({ createDiagramPdf }))

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" onload=""><text>A</text></svg>'

beforeEach(() => vi.stubGlobal("Worker", GraphWorker))
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
  createDiagramPdf.mockReset()
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
  expect(
    screen.getByRole<HTMLButtonElement>("button", { name: m.downloadPdf })
      .disabled
  ).toBe(true)
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

test("downloads the current sanitized SVG as PDF and allows retry without losing the preview", async () => {
  createDiagramPdf.mockRejectedValueOnce(new Error("conversion failed"))
  const pdf = new Blob(["%PDF"], { type: "application/pdf" })
  createDiagramPdf.mockResolvedValueOnce(pdf)
  const createObjectURL = vi.fn(() => "blob:graphviz-pdf")
  vi.stubGlobal("URL", Object.assign(class extends URL {}, { createObjectURL }))
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(function (this: HTMLAnchorElement) {
      expect(this.download).toBe("graphviz-graph.pdf")
      expect(this.href).toBe("blob:graphviz-pdf")
    })

  render(<Client language="zh-CN" messages={m} />)
  GraphWorker.latest.receive({ ...examples.dependencies, svg, notes: [] })
  fireEvent.click(screen.getByRole("button", { name: m.downloadPdf }))
  expect((await screen.findByRole("alert")).textContent).toBe(m.pdfError)
  expect(screen.getByRole("img", { name: m.preview })).toBeTruthy()

  fireEvent.click(screen.getByRole("button", { name: m.downloadPdf }))
  await waitFor(() => expect(click).toHaveBeenCalledOnce())
  expect(screen.queryByRole("alert")).toBeNull()
  expect(createDiagramPdf).toHaveBeenLastCalledWith(
    expect.stringContaining("<text>A</text>"),
    "original",
    "zh-CN"
  )
  expect(createDiagramPdf.mock.lastCall?.[0]).not.toContain("onload")
  expect(createObjectURL).toHaveBeenCalledWith(pdf)
})

test("discards a PDF that finishes after the graph changes", async () => {
  const pdf = new Blob(["%PDF"], { type: "application/pdf" })
  let finish: (pdf: Blob) => void = () => {}
  createDiagramPdf.mockImplementation(
    () =>
      new Promise<Blob>((resolve) => {
        finish = resolve
      })
  )
  const click = vi
    .spyOn(HTMLAnchorElement.prototype, "click")
    .mockImplementation(() => {})

  render(<Client messages={m} />)
  GraphWorker.latest.receive({ ...examples.dependencies, svg, notes: [] })
  fireEvent.click(screen.getByRole("button", { name: m.downloadPdf }))
  await waitFor(() => expect(createDiagramPdf).toHaveBeenCalledOnce())
  fireEvent.change(screen.getByLabelText(m.source), {
    target: { value: "digraph { B -> C }" },
  })
  await act(async () => finish(pdf))
  expect(click).not.toHaveBeenCalled()
})
