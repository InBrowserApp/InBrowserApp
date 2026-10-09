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
const mock = vi.hoisted(() => ({ open: vi.fn(), prepare: vi.fn() }))
vi.mock("./open-document", () => ({ openDocument: mock.open }))
vi.mock("./preview", () => ({ preparePreview: mock.prepare }))
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
const choose = (file = new File(["document"], "reading.odt")) =>
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockResolvedValue({ html: "", parts: {}, template: true })
  mock.prepare.mockReturnValue({
    html: "safe",
    outline: [{ id: "section", label: "A heading", level: 2 }],
    limited: true,
  })
})
afterEach(cleanup)

test("opens, navigates the outline, changes exact zoom, resets and closes the document", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await screen.findByLabelText(m.documentBody)
  expect(screen.getByText(new RegExp(m.template))).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  fireEvent.click(screen.getByRole("button", { name: "A heading" }))
  expect(
    screen.getByLabelText(m.documentBody).getAttribute("data-target")
  ).toBe("section")
  expect(screen.queryByRole("navigation")).toBeNull()
  const outlineButton = screen.getByRole("button", { name: m.outline })
  fireEvent.click(outlineButton)
  const navigation = screen.getByRole("navigation")
  expect(outlineButton.getAttribute("aria-controls")).toBe(navigation.id)
  fireEvent.keyDown(navigation, { key: "ArrowDown" })
  expect(screen.getByRole("navigation")).toBe(navigation)
  fireEvent.keyDown(navigation, { key: "Escape" })
  expect(screen.queryByRole("navigation")).toBeNull()
  expect(document.activeElement).toBe(outlineButton)
  expect(outlineButton.getAttribute("aria-expanded")).toBe("false")
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

test("shows missing headings and normal document notes", async () => {
  mock.open.mockResolvedValue({ html: "", parts: {}, template: false })
  mock.prepare.mockReturnValue({ html: "safe", outline: [], limited: false })
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.documentBody)
  fireEvent.click(screen.getByRole("button", { name: m.outline }))
  expect(screen.getByText(m.noHeadings)).toBeTruthy()
  expect(screen.queryByText(m.limited)).toBeNull()
})

test("distinguishes empty, unsupported and parser failures", async () => {
  render(<Client messages={m} />)
  choose(new File([], "empty.odt"))
  expect(await screen.findByText(m.emptyFile)).toBeTruthy()
  choose(new File(["x"], "sheet.ods"))
  expect(await screen.findByText(m.unsupported)).toBeTruthy()
  expect(mock.open).not.toHaveBeenCalled()
  mock.open.mockRejectedValue(new Error("protected"))
  choose()
  expect(await screen.findByText(m.protected)).toBeTruthy()
})

test("replacement and close cancel stale work without resurrecting content or errors", async () => {
  let resolve!: (value: unknown) => void
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
  choose(new File(["new"], "new.ott"))
  await screen.findByLabelText(m.documentBody)
  resolve({ html: "stale" })
  await waitFor(() => expect(mock.prepare).toHaveBeenCalledOnce())
  expect(mock.open.mock.calls[0]![1].aborted).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.queryByLabelText(m.documentBody)).toBeNull()
})
