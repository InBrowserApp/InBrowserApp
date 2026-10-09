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
  openDocument: mock.open,
  failure: () => "invalid",
}))
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
const choose = (file = new File(["document"], "reading.ipynb")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
const preview = {
  html: "safe",
  title: "Report",
  outline: [{ id: "section", label: "A heading", level: 2 }],
  notes: { local: true, remote: true, active: true },
  empty: false,
  limited: false,
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
    outline: [],
    notes: { local: false, remote: false, active: false },
  })
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.documentBody)
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  expect(screen.getByText(m.noHeadings)).toBeTruthy()
  expect(screen.queryByText(m.localResources)).toBeNull()
})

test("distinguishes unsupported, empty, and failed files", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.ipynb"))
  await screen.findByText(m.emptyFile)
  choose(new File(["x"], "archive.mhtml"))
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
  choose(new File(["new"], "new.ipynb"))
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
