import { cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => {
  const outer = { x: 0, y: 0, width: 900, height: 400 }
  const inner = { x: 50, y: 80, width: 500, height: 240 }
  return {
    importXML: vi.fn(),
    destroy: vi.fn(),
    canvas: {
      viewbox: vi.fn(() => ({ outer, inner })),
      zoom: vi.fn(() => 1),
      resized: vi.fn(),
      scroll: vi.fn(),
    },
  }
})

vi.mock("bpmn-js/lib/NavigatedViewer", () => ({
  default: class {
    importXML = mock.importXML
    destroy = mock.destroy
    get = () => mock.canvas
  },
}))

beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

function choose(file: File) {
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
}

test("opens the built-in process, supports navigation, and releases the viewer", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.example }))
  await screen.findByRole("region", { name: m.diagram })
  expect(mock.importXML).toHaveBeenCalledWith(
    expect.stringContaining("ApprovalDiagram")
  )
  mock.canvas.viewbox.mockClear()
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  fireEvent.click(screen.getByRole("button", { name: m.zoomOut }))
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  expect(mock.canvas.zoom).toHaveBeenCalledWith(1.25)
  expect(mock.canvas.zoom).toHaveBeenCalledWith(0.8)
  expect(mock.canvas.viewbox).toHaveBeenCalled()
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(mock.destroy).toHaveBeenCalledOnce()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("distinguishes a missing layout from an invalid file and accepts a replacement", async () => {
  mock.importXML
    .mockRejectedValueOnce(new Error("no diagram to display"))
    .mockRejectedValueOnce(new Error("malformed XML"))
  render(<Client messages={m} />)
  choose(new File(["model"], "process.bpmn"))
  await screen.findByText(m.noLayout)
  choose(new File(["other"], "other.xml"))
  await screen.findByText(m.invalid)
  choose(new File(["diagram"], "replacement.bpmn"))
  await screen.findByRole("region", { name: m.diagram })
  expect(mock.importXML).toHaveBeenLastCalledWith("diagram")
})

test("a BPMN plane with no drawable elements shows the missing layout guidance", async () => {
  const { outer } = mock.canvas.viewbox()
  mock.canvas.viewbox.mockReturnValueOnce({
    outer,
    inner: { x: 0, y: 0, width: 0, height: 0 },
  })
  render(<Client messages={m} />)
  choose(new File(["empty plane"], "empty.bpmn"))
  await screen.findByText(m.noLayout)
  expect(screen.queryByRole("region", { name: m.diagram })).toBeNull()
})
