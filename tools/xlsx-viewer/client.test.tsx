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
import type { openReader } from "./reader"
const mock = vi.hoisted(() => ({
  open: vi.fn(),
  sheet: vi.fn(),
  zoom: vi.fn(),
  go: vi.fn(),
  copy: vi.fn(),
  dispose: vi.fn(),
}))
vi.mock("./reader", () => ({ openReader: mock.open }))
const instance = {
  sheet: mock.sheet,
  zoom: mock.zoom,
  go: mock.go,
  copy: mock.copy,
  dispose: mock.dispose,
}
type Options = Parameters<typeof openReader>[0]
const file = (name = "read.xlsx") => new File(["zip"], name)
function choose(value = file()) {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [value] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  mock.open.mockImplementation(async ({ onChange }: Options) => {
    onChange({
      sheets: [
        { name: "Report", hidden: false },
        { name: "Secret", hidden: true },
      ],
      selection: {
        reference: "A1",
        value: "Item",
        formula: "",
        noCachedValue: false,
      },
    })
    return instance
  })
})
afterEach(cleanup)

test("opens, navigates cells, zooms, copies and closes a workbook", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  const picker = screen.getByLabelText(m.open),
    click = vi.spyOn(picker, "click")
  fireEvent.click(screen.getByRole("button", { name: m.open }))
  expect(click).toHaveBeenCalledOnce()
  choose()
  await screen.findByLabelText(m.range)
  expect(screen.getByLabelText(m.value)).toHaveProperty("value", "Item")
  fireEvent.change(screen.getByLabelText(m.zoom), { target: { value: "150" } })
  fireEvent.keyDown(screen.getByLabelText(m.zoom), { key: "Enter" })
  expect(mock.zoom).toHaveBeenCalledWith(150)
  fireEvent.change(screen.getByLabelText(m.zoom), { target: { value: "900" } })
  fireEvent.keyDown(screen.getByLabelText(m.zoom), { key: "Enter" })
  expect(mock.zoom).toHaveBeenCalledTimes(1)
  fireEvent.click(screen.getByRole("button", { name: m.fit }))
  expect(mock.zoom).toHaveBeenCalledWith("page-width")
  const reference = screen.getByLabelText(m.range)
  fireEvent.change(reference, { target: { value: "wrong" } })
  fireEvent.submit(reference.closest("form")!)
  expect(mock.go).not.toHaveBeenCalled()
  fireEvent.change(reference, { target: { value: "b2" } })
  fireEvent.submit(reference.closest("form")!)
  expect(mock.go).toHaveBeenCalledWith("B2")
  fireEvent.change(reference, { target: { value: "D4" } })
  fireEvent.keyDown(reference, { key: "Escape" })
  expect(reference).toHaveProperty("value", "A1")
  fireEvent.change(reference, { target: { value: "C3" } })
  fireEvent.blur(reference)
  expect(reference).toHaveProperty("value", "A1")
  fireEvent.click(screen.getByRole("button", { name: m.details }))
  expect(screen.getByLabelText(`${m.details}: ${m.value}`)).toHaveProperty(
    "value",
    "Item"
  )
  fireEvent.click(screen.getByRole("button", { name: m.details }))
  expect(screen.queryByLabelText(`${m.details}: ${m.value}`)).toBeNull()
  fireEvent.mouseDown(screen.getByRole("tab", { name: "Secret (Hidden)" }), {
    button: 0,
    ctrlKey: false,
  })
  expect(mock.sheet).toHaveBeenCalledWith(1)
  fireEvent.click(screen.getByRole("button", { name: m.copy }))
  expect(mock.copy).toHaveBeenCalledOnce()
  fireEvent.keyDown(screen.getByRole("combobox"), { key: "ArrowDown" })
  fireEvent.click(
    await screen.findByRole("option", { name: "Secret (Hidden)" })
  )
  expect(mock.sheet).toHaveBeenCalledWith(1)
  fireEvent.click(screen.getByLabelText(m.clear))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect((mock.open.mock.calls[0]![0] as Options).signal.aborted).toBe(true)
})

test("keeps the canonical address when repeated navigation emits no selection change", async () => {
  render(<Client messages={m} />)
  choose()
  const reference = await screen.findByLabelText(m.range)
  const options = mock.open.mock.calls[0]![0] as Options
  options.onChange({
    selection: {
      reference: "A8",
      value: "Merged text",
      formula: "",
      noCachedValue: false,
    },
  })
  await waitFor(() => expect(reference).toHaveProperty("value", "A8"))
  for (let attempt = 0; attempt < 2; attempt++) {
    fireEvent.change(reference, { target: { value: "B8" } })
    fireEvent.submit(reference.closest("form")!)
    expect(mock.go).toHaveBeenCalledWith("B8")
    expect(reference).toHaveProperty("value", "A8")
  }
})

test("shows formula cache, empty sheet, switching and clipboard feedback", async () => {
  render(<Client messages={m} />)
  choose()
  await screen.findByLabelText(m.range)
  const options = mock.open.mock.calls[0]![0] as Options
  options.onChange({
    selection: {
      reference: "B5",
      value: "",
      formula: "=SUM(B2:B3)",
      noCachedValue: true,
    },
  })
  await screen.findByText(m.noCachedValue)
  expect(screen.getByLabelText(m.formula)).toHaveProperty(
    "value",
    "=SUM(B2:B3)"
  )
  options.onChange({ copyStatus: "copied" })
  await screen.findByRole("button", { name: m.copied })
  options.onChange({ copyStatus: "failed" })
  await screen.findByText(m.copyFailed)
  options.onChange({ copyStatus: "", selection: null, empty: true })
  await screen.findByText(m.empty)
  options.onChange({ switching: true })
  await screen.findByText(m.loading)
  options.onError(new Error("render"))
  await screen.findByText(m.invalid)
})

test("validates inputs and maps engine failures", async () => {
  render(<Client messages={m} />)
  choose(file("text.txt"))
  await screen.findByText(m.invalid)
  choose(new File([], "empty.xlsx"))
  await screen.findByText(m.invalid)
  const large = file()
  Object.defineProperty(large, "size", { value: 50 * 1024 * 1024 + 1 })
  choose(large)
  await screen.findByText(m.tooLarge)
  expect(mock.open).not.toHaveBeenCalled()
  mock.open.mockRejectedValueOnce(new Error("failed"))
  choose()
  await screen.findByText(m.invalid)
  mock.open.mockRejectedValueOnce(new Error("TOO_LARGE"))
  choose(file("large.xlsx"))
  await screen.findByText(m.tooLarge)
})

test("ignores replaced files and releases a reader that resolves after cancellation", async () => {
  let finish!: (value: typeof instance) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose(file("old.xlsx"))
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const old = mock.open.mock.calls[0]![0] as Options
  const section = screen.getByText(m.loading).closest("section")!
  fireEvent.dragOver(section)
  fireEvent.drop(section, { dataTransfer: { files: [file("new.xlsx")] } })
  await screen.findByLabelText(m.range)
  old.onChange({ sheets: [] })
  old.onError(new Error("stale"))
  finish(instance)
  await waitFor(() => expect(mock.dispose).toHaveBeenCalledOnce())
  expect(screen.getByLabelText(m.value)).toHaveProperty("value", "Item")
})
