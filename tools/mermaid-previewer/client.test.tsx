import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import { createPng, download } from "./render"

vi.mock("./render", () => ({
  renderDiagram: vi.fn(async (source: string) => {
    if (source === "invalid") throw new Error("Missing diagram type")
    return '<svg xmlns="http://www.w3.org/2000/svg" />'
  }),
  createPng: vi.fn(async () => new Blob([], { type: "image/png" })),
  download: vi.fn(),
}))

afterEach(cleanup)

test("previews the example, keeps invalid source, and exports the corrected result", async () => {
  render(<Client messages={m} />)
  const input = screen.getByLabelText<HTMLTextAreaElement>(m.source)
  await screen.findByRole("img", { name: m.preview })
  expect(
    screen.getByRole("link", { name: m.downloadSvg }).getAttribute("download")
  ).toBe("mermaid-diagram.svg")
  fireEvent.change(input, { target: { value: "invalid" } })
  await screen.findByText(m.invalid)
  expect(input.value).toBe("invalid")
  expect(screen.queryByRole("link", { name: m.downloadSvg })).toBeNull()
  fireEvent.change(input, { target: { value: "flowchart TB\n  X --> Y" } })
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(screen.getByRole("button", { name: m.downloadPng }))
  await waitFor(() =>
    expect(download).toHaveBeenCalledWith(
      expect.any(Blob),
      "mermaid-diagram.png"
    )
  )
  fireEvent.change(input, { target: { value: "" } })
  expect(screen.getByText(m.empty)).toBeTruthy()
})

test("keeps the SVG available if PNG conversion fails", async () => {
  vi.mocked(createPng).mockRejectedValueOnce(new Error("Canvas unavailable"))
  render(<Client messages={m} />)
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(screen.getByRole("button", { name: m.downloadPng }))
  await screen.findByText(m.exportError)
  expect(screen.getByRole("link", { name: m.downloadSvg })).toBeTruthy()
})
