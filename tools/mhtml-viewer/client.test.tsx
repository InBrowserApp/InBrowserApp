import {
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
vi.mock("./open-document", () => ({
  openArchive: mock.open,
  failure: () => "invalid",
}))
vi.mock("./document-frame", () => ({
  DocumentFrame: ({
    title,
    zoom,
    target,
    onMissing,
    onResourceError,
  }: {
    title: string
    zoom: number
    target: { id: string } | null
    onMissing: () => void
    onResourceError: () => void
  }) => (
    <div aria-label={title} data-zoom={zoom} data-target={target?.id}>
      <button onClick={onMissing}>Missing reference</button>
      <button onClick={onResourceError}>Broken image</button>
    </div>
  ),
}))
const choose = (file = new File(["document"], "reading.mht")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
const preview = {
  html: "safe",
  title: "Report",
  outline: [{ id: "section", label: "A heading", level: 2 }],
  notes: { local: true, remote: true, active: true },
  empty: false,
  location: "https://example.org/report",
  archiveNotes: { truncated: true, nested: true, encoding: true },
}
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockResolvedValue(preview)
})
afterEach(cleanup)

test("opens, navigates, changes zoom and closes while exposing resource notes", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await screen.findByLabelText(m.documentBody)
  expect(screen.getByText("Report")).toBeTruthy()
  expect(screen.getByText(m.truncated)).toBeTruthy()
  expect(screen.getByText(m.nested)).toBeTruthy()
  expect(screen.getByText(m.encoding)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.wide }))
  fireEvent.click(screen.getByRole("button", { name: m.narrow }))
  expect(screen.getByText(m.localResources)).toBeTruthy()
  expect(screen.getByText(m.remoteResources)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  fireEvent.click(screen.getByRole("button", { name: "A heading" }))
  expect(
    screen.getByLabelText(m.documentBody).getAttribute("data-target")
  ).toBe("section")
  const button = screen.getByRole("button", { name: m.outline })
  fireEvent.click(button)
  fireEvent.keyDown(screen.getByRole("navigation"), { key: "ArrowDown" })
  expect(screen.getByRole("navigation")).toBeTruthy()
  fireEvent.keyDown(screen.getByRole("navigation"), { key: "Escape" })
  expect(screen.queryByRole("navigation")).toBeNull()
  expect(document.activeElement).toBe(button)
  fireEvent.click(screen.getByRole("button", { name: m.zoomIn }))
  expect(screen.getByLabelText(m.documentBody).getAttribute("data-zoom")).toBe(
    "125"
  )
  fireEvent.click(screen.getByRole("button", { name: m.resetZoom }))
  expect(screen.getByLabelText(m.documentBody).getAttribute("data-zoom")).toBe(
    "100"
  )
  fireEvent.click(screen.getByText("Missing reference"))
  expect(screen.getByRole("status").textContent).toBe(m.missingReference)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(mock.open.mock.calls[0]![1].aborted).toBe(true)
})

test("shows no headings and minimal notes for a plain document", async () => {
  mock.open.mockResolvedValue({
    ...preview,
    title: "",
    location: "",
    archiveNotes: { truncated: false, nested: false, encoding: false },
    outline: [],
    notes: { local: false, remote: false, active: false },
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.documentBody)
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  expect(screen.getByText(m.noHeadings)).toBeTruthy()
  expect(screen.queryByText(m.localResources)).toBeNull()
  fireEvent.click(screen.getByText("Broken image"))
  expect(screen.getByText(m.localResources)).toBeTruthy()
})

test("distinguishes unsupported, empty, and failed files", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.mhtml"))
  await screen.findByText(m.emptyFile)
  choose(new File(["x"], "report.html"))
  await screen.findByText(m.unsupported)
  expect(mock.open).not.toHaveBeenCalled()
  mock.open.mockRejectedValue(new Error("bad"))
  choose()
  await screen.findByText(m.invalid)
})

test("replacement and close discard stale successful and failed reads", async () => {
  let resolve!: (value: typeof preview) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  expect(screen.getByText(m.loading)).toBeTruthy()
  choose(new File(["new"], "new.mhtml"))
  await screen.findByLabelText(m.documentBody)
  resolve({ ...preview, title: "Old result" })
  await waitFor(() => expect(mock.open.mock.calls[0]![1].aborted).toBe(true))
  expect(screen.queryByText("Old result")).toBeNull()
  let reject!: (value: Error) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  choose()
  await waitFor(() => expect(mock.open).toHaveBeenCalledTimes(3))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  reject(new Error("stale"))
  await waitFor(() => expect(screen.getByText(m.drop)).toBeTruthy())
  expect(screen.queryByText(m.invalid)).toBeNull()
})
