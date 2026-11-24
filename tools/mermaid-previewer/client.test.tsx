import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import { createDiagramPdf } from "@workspace/svg-pdf"
import { downloadBlob } from "@workspace/ui/lib/download-blob"
import Client from "./client"
import m from "./messages/en.json"
import { createPng } from "./render"

const converter = {
  openFile: "Open Mermaid file",
  sourcePlaceholder: "Paste Mermaid code or drop a .mmd file here.",
  fileError: "Could not read file.",
  pageSize: "PDF page size",
  original: "Fit to diagram",
  a4: "A4",
  letter: "US Letter",
}

vi.mock("@workspace/svg-pdf", () => ({
  createDiagramPdf: vi.fn(
    async () => new Blob([], { type: "application/pdf" })
  ),
}))

vi.mock("./render", () => ({
  renderDiagram: vi.fn(async (source: string) => {
    if (source === "invalid") throw new Error("Missing diagram type")
    return '<svg xmlns="http://www.w3.org/2000/svg" />'
  }),
  createPng: vi.fn(async () => new Blob([], { type: "image/png" })),
}))

vi.mock("@workspace/ui/lib/download-blob", () => ({
  downloadBlob: vi.fn(),
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
    expect(downloadBlob).toHaveBeenCalledWith(
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

test("loads a Mermaid file, applies the selected paper size, and keeps the file name", async () => {
  const { container } = render(
    <Client messages={m} converter={converter} language="zh-CN" />
  )
  const input = screen.getByLabelText<HTMLTextAreaElement>(m.source)
  const pdf = screen.getByRole<HTMLButtonElement>("button", {
    name: m.downloadPdf,
  })
  expect(pdf.disabled).toBe(true)
  expect(screen.queryByRole("button", { name: m.downloadPng })).toBeNull()
  const source = "```mermaid\nflowchart LR\n  草稿 --> 完成\n```"
  const file = new File([source], "工作流程.mmd", { type: "text/plain" })
  fireEvent.change(container.querySelector("input[type=file]")!, {
    target: { files: [file] },
  })
  await screen.findByRole("img", { name: m.preview })
  expect(input.value).toBe(source)
  fireEvent.change(screen.getByRole("combobox", { name: converter.pageSize }), {
    target: { value: "a4" },
  })
  fireEvent.click(pdf)
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(expect.any(Blob), "工作流程.pdf")
  )
  expect(createDiagramPdf).toHaveBeenCalledWith(
    expect.stringContaining("<svg"),
    "a4",
    "zh-CN"
  )
  expect(
    screen.getByRole("link", { name: m.downloadSvg }).getAttribute("download")
  ).toBe("工作流程.svg")
})

test("lets a failed PDF export be retried without losing the preview", async () => {
  vi.mocked(createDiagramPdf).mockRejectedValueOnce(new Error("PDF failure"))
  render(<Client messages={m} />)
  const pdf = screen.getByRole<HTMLButtonElement>("button", {
    name: m.downloadPdf,
  })
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(pdf)
  await screen.findByText(m.pdfError)
  expect(pdf.disabled).toBe(false)
  expect(screen.getByRole("link", { name: m.downloadSvg })).toBeTruthy()
  fireEvent.click(pdf)
  await waitFor(() =>
    expect(downloadBlob).toHaveBeenCalledWith(
      expect.any(Blob),
      "mermaid-diagram.pdf"
    )
  )
  expect(screen.queryByText(m.pdfError)).toBeNull()
})

test("discards an export when the user replaces its source", async () => {
  let complete!: (blob: Blob) => void
  const pending = new Promise<Blob>((resolve) => {
    complete = resolve
  })
  const generate = vi
    .mocked(createDiagramPdf)
    .mockImplementationOnce(() => pending)
  generate.mockClear()
  vi.mocked(downloadBlob).mockClear()
  render(<Client messages={m} />)
  const pdf = screen.getByRole<HTMLButtonElement>("button", {
    name: m.downloadPdf,
  })
  await screen.findByRole("img", { name: m.preview })
  fireEvent.click(pdf)
  await waitFor(() => expect(generate).toHaveBeenCalledOnce())
  fireEvent.change(screen.getByLabelText(m.source), {
    target: { value: "flowchart LR\n A --> B" },
  })
  await screen.findByRole("img", { name: m.preview })
  await act(async () => complete(new Blob([], { type: "application/pdf" })))
  expect(downloadBlob).not.toHaveBeenCalled()
  expect(pdf.disabled).toBe(false)
})
