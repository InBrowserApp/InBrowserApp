import { beforeEach, expect, test, vi } from "vitest"
import { renderDiagram, unwrapSource } from "./render"

const mock = vi.hoisted(() => ({
  render: vi.fn(),
  getDiagramFromText: vi.fn(),
}))

vi.mock("mermaid", () => ({
  default: { initialize: vi.fn(), render: mock.render, mermaidAPI: mock },
}))

beforeEach(() => {
  vi.resetAllMocks()
  mock.render.mockResolvedValue({
    svg: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 161.4 90.1"/>',
  })
})

test("accepts raw Mermaid and a single Markdown code block", () => {
  const source = "flowchart LR\n  A --> B"
  expect(unwrapSource(source)).toBe(source)
  expect(unwrapSource("~~~mermaid\n" + source + "\n~~~")).toBe(source)
  expect(unwrapSource("~~~other\n" + source + "\n~~~")).toContain("~~~other")
})

test("sizes the standalone SVG and removes the render container", async () => {
  const svg = await renderDiagram("flowchart LR\n  A --> B")
  expect(svg).toContain('width="162"')
  expect(svg).toContain('height="91"')
  expect(mock.render.mock.calls[0]?.[2].isConnected).toBe(false)
})

test("checks image sources before rendering and recovers on the next edit", async () => {
  mock.getDiagramFromText.mockResolvedValueOnce({
    db: {
      getVertices: () =>
        new Map([["A", { img: "https://example.com/logo.png" }]]),
    },
  })
  await expect(
    renderDiagram('flowchart LR\n  A@{ img: "https://example.com/logo.png" }')
  ).rejects.toThrow("embedded raster")
  expect(mock.render).not.toHaveBeenCalled()
  await expect(renderDiagram("flowchart LR\n  A --> B")).resolves.toContain(
    "<svg"
  )
})

test("rejects broken renderer output and still removes temporary DOM", async () => {
  mock.render.mockResolvedValueOnce({ svg: "<html />" })
  await expect(renderDiagram("flowchart LR\n  A --> B")).rejects.toThrow(
    "Invalid Mermaid SVG"
  )
  expect(mock.render.mock.calls[0]?.[2].isConnected).toBe(false)
})
