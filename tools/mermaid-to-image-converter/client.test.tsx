import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, it, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"

const mocks = vi.hoisted(() => ({
  renderDiagram: vi.fn(),
  createRaster: vi.fn(),
  downloadBlob: vi.fn(),
}))
vi.mock("@tool/mermaid-previewer/render", () => mocks)
vi.mock("@workspace/ui/lib/download-blob", () => ({
  downloadBlob: mocks.downloadBlob,
}))

const svg =
  '<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><text>Diagram</text></svg>'

function select(label: string, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } })
}

beforeEach(() => {
  vi.resetAllMocks()
  mocks.renderDiagram.mockResolvedValue(svg)
  mocks.createRaster.mockImplementation(
    async (_url, options) => new Blob(["image"], { type: options.type })
  )
})

afterEach(cleanup)

it("downloads SVG without raster options and JPG with the selected scale", async () => {
  render(<Client messages={m} />)
  await screen.findByRole("img", { name: m.preview })
  const zoom = screen.getByRole("button", { name: m.actualSize })
  fireEvent.click(zoom)
  expect(zoom.getAttribute("aria-pressed")).toBe("true")
  select(m.format, "svg")
  expect(screen.queryByLabelText(m.scale)).toBeNull()
  expect(screen.queryByLabelText(m.background)).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  expect(mocks.downloadBlob).toHaveBeenCalledWith(
    expect.objectContaining({ type: "image/svg+xml" }),
    "mermaid-diagram.svg"
  )
  expect(mocks.createRaster).not.toHaveBeenCalled()
  select(m.format, "jpg")
  expect(screen.queryByLabelText(m.background)).toBeNull()
  select(m.scale, "1")
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  await waitFor(() =>
    expect(mocks.createRaster).toHaveBeenCalledWith(
      expect.stringContaining("data:image/svg+xml,"),
      { type: "image/jpeg", scale: 1, white: true }
    )
  )
  expect(mocks.downloadBlob).toHaveBeenLastCalledWith(
    expect.objectContaining({ type: "image/jpeg" }),
    "mermaid-diagram.jpg"
  )
})

it("clears stale previews and recovers from a syntax error", async () => {
  render(<Client messages={m} />)
  await screen.findByRole("img", { name: m.preview })
  const editor = screen.getByRole("textbox", { name: m.source })
  fireEvent.change(editor, { target: { value: "" } })
  expect(screen.getByText(m.empty)).toBeTruthy()
  mocks.renderDiagram.mockRejectedValueOnce(new Error("syntax"))
  fireEvent.change(editor, { target: { value: "broken" } })
  await screen.findByText(m.invalid)
  expect(
    (screen.getByRole("button", { name: m.download }) as HTMLButtonElement)
      .disabled
  ).toBe(true)
  fireEvent.change(editor, { target: { value: "flowchart LR\n A --> B" } })
  await screen.findByRole("img", { name: m.preview })
  expect(
    (screen.getByRole("button", { name: m.download }) as HTMLButtonElement)
      .disabled
  ).toBe(false)
})

it("uses the chosen WebP background and does not download a stale export", async () => {
  const { container } = render(<Client messages={m} />)
  await screen.findByRole("img", { name: m.preview })
  select(m.format, "webp")
  select(m.background, "white")
  mocks.createRaster.mockRejectedValueOnce(new Error("encode"))
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  await screen.findByText(m.downloadError)
  let finish!: (blob: Blob) => void
  mocks.createRaster.mockImplementationOnce(
    () =>
      new Promise<Blob>((resolve) => {
        finish = resolve
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  await waitFor(() => expect(finish).toBeTypeOf("function"))
  fireEvent.change(container.querySelector("input[type=file]")!, {
    target: {
      files: [new File(["flowchart LR\n A --> B"], "release-flow.mmd")],
    },
  })
  await waitFor(() =>
    expect(screen.getByRole("textbox", { name: m.source })).toHaveProperty(
      "value",
      "flowchart LR\n A --> B"
    )
  )
  await act(async () => finish(new Blob(["stale"], { type: "image/webp" })))
  expect(mocks.downloadBlob).not.toHaveBeenCalled()
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(screen.getByRole("button", { name: m.download }))
  await waitFor(() =>
    expect(mocks.downloadBlob).toHaveBeenCalledWith(
      expect.objectContaining({ type: "image/webp" }),
      "release-flow.webp"
    )
  )
  expect(mocks.createRaster).toHaveBeenLastCalledWith(
    expect.stringContaining("data:image/svg+xml,"),
    { type: "image/webp", scale: 2, white: true }
  )
})
