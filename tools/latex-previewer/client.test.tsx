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
import m from "./messages/en.json"
const mock = vi.hoisted(() => ({ open: vi.fn() }))
vi.mock("./open-document", () => ({ openDocument: mock.open }))
vi.mock("./document-frame", () => ({
  DocumentFrame: ({
    title,
    zoom,
    target,
    onMissing,
  }: {
    title: string
    zoom: number
    target: { id: string } | null
    onMissing: () => void
  }) => (
    <div aria-label={title} data-zoom={zoom} data-target={target?.id}>
      <button onClick={onMissing}>Missing reference</button>
    </div>
  ),
}))
const result = {
  html: '<h1>A heading</h1><img src="figure.png">',
  css: "",
  diagnostics: [
    { line: 3, message: "Package unavailable" },
    { line: 4, code: "groupSyntax" },
  ],
}
const choose = (file = new File(["document"], "reading.tex")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
beforeEach(() => {
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  vi.clearAllMocks()
  mock.open.mockImplementation(async (_file, _signal, onSource) => {
    onSource("original source")
    return result
  })
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})
test("reads, navigates, zooms, inspects source and closes with clear limitations", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(screen.getByText(m.subset, { exact: false })).toBeTruthy()
  choose()
  await screen.findByLabelText(m.documentBody)
  expect(screen.getByText(m.incomplete)).toBeTruthy()
  expect(screen.getByText("Package unavailable")).toBeTruthy()
  expect(screen.getByText(m.groupSyntax)).toBeTruthy()
  expect(screen.getByText(m.images)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  fireEvent.click(screen.getByRole("button", { name: "A heading" }))
  expect(
    screen.getByLabelText(m.documentBody).getAttribute("data-target")
  ).toMatch(/^latex-heading-/)
  const outline = screen.getByRole("button", { name: m.outline })
  fireEvent.click(outline)
  fireEvent.keyDown(screen.getByRole("navigation"), { key: "ArrowDown" })
  fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" })
  expect(document.activeElement).toBe(outline)
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(screen.getByLabelText(m.documentBody).getAttribute("data-zoom")).toBe(
    "125"
  )
  fireEvent.click(screen.getByRole("button", { name: m.resetZoom }))
  expect(screen.getByLabelText(m.documentBody).getAttribute("data-zoom")).toBe(
    "100"
  )
  fireEvent.click(screen.getByText("Missing reference"))
  expect(screen.getByText(m.missingReference)).toBeTruthy()
  fireEvent.click(screen.getByRole("radio", { name: m.source }))
  expect(
    (screen.getByLabelText(m.sourceLabel) as HTMLTextAreaElement).readOnly
  ).toBe(true)
  expect(
    (screen.getByLabelText(m.sourceLabel) as HTMLTextAreaElement).value
  ).toBe("original source")
  fireEvent.click(screen.getByRole("radio", { name: m.preview }))
  fireEvent.click(screen.getByRole("radio", { name: m.preview }))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(mock.open.mock.calls[0]![1].aborted).toBe(true)
})
test("handles heading-free documents and unavailable previews with source intact", async () => {
  mock.open.mockImplementationOnce(async (_file, _signal, onSource) => {
    onSource("plain")
    return { html: "<p>plain</p>", css: "", diagnostics: [] }
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.documentBody)
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  expect(screen.getByText(m.noHeadings)).toBeTruthy()
  expect(screen.queryByText(m.incomplete)).toBeNull()
  mock.open.mockImplementationOnce(async (_file, _signal, onSource) => {
    onSource("still readable")
    throw new Error("resourceLimit")
  })
  choose(new File(["broken"], "broken.latex"))
  await screen.findByText(m.resourceLimit)
  expect(
    (screen.getByLabelText(m.sourceLabel) as HTMLTextAreaElement).value
  ).toBe("still readable")
})
test("distinguishes unsupported, empty, decoding and allocation failures", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.tex"))
  await screen.findByText(m.emptyFile)
  choose(new File(["x"], "report.pdf"))
  await screen.findByText(m.unsupported)
  expect(mock.open).not.toHaveBeenCalled()
  for (const [error, message] of [
    [new Error("bad"), m.invalid],
    [new Error("encoding"), m.encoding],
    [new RangeError(), m.resourceLimit],
  ] as const) {
    mock.open.mockRejectedValueOnce(error)
    choose()
    await screen.findByText(message)
  }
})
test("replacement and close discard stale source, result and failed reads", async () => {
  let done!: (value: typeof result) => void
  let lateSource!: (value: string) => void
  mock.open.mockImplementationOnce((_file, _signal, onSource) => {
    lateSource = onSource
    return new Promise((resolve) => {
      done = resolve
    })
  })
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  expect(screen.getByText(m.loading)).toBeTruthy()
  act(() => lateSource("decoded source waiting for the engine"))
  expect(screen.queryByLabelText(m.sourceLabel)).toBeNull()
  choose(new File(["new"], "new.tex"))
  await screen.findByLabelText(m.documentBody)
  lateSource("stale")
  done({ ...result, html: "old" })
  await waitFor(() => expect(mock.open.mock.calls[0]![1].aborted).toBe(true))
  let fail!: (reason: Error) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_, reject) => {
        fail = reject
      })
  )
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledTimes(3))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  fail(new Error("stale"))
  await waitFor(() => expect(screen.getByText(m.drop)).toBeTruthy())
  expect(screen.queryByText(m.invalid)).toBeNull()
})
