import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import type { Output, Session } from "@workspace/spreadsheet-export/types"
import Client from "./client"
import m from "./messages/en.json"

const mock = vi.hoisted(() => ({
  open: vi.fn(),
  export: vi.fn(),
  copy: vi.fn(),
}))
vi.mock("@workspace/spreadsheet-export", () => ({ openWorkbook: mock.open }))
const result: Output = {
  text: 'ID,ID\r\n00123,"中文, value"\r\n',
  rows: 2,
  columns: 2,
  missingCached: 1,
  empty: false,
  filename: "book-Data.csv",
  mime: "text/csv;charset=utf-8",
}
const session: Session = {
  sheets: [
    { name: "Secret", hidden: true, range: "A1:C3" },
    { name: "Data", hidden: false, range: "A1:B2" },
  ],
  export: mock.export,
}
function upload(name = "book.xlsx", content = "bytes") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([content], name)] },
  })
}
async function select(label: string, value: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("option", { name: value }))
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.stubGlobal("navigator", {
    ...navigator,
    clipboard: { writeText: mock.copy },
  })
  mock.open.mockResolvedValue(session)
  mock.export.mockResolvedValue(result)
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("previews, copies and downloads the first visible sheet with named format and value controls", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload("BOOK.XLTM")
  expect(await screen.findByRole("textbox", { name: m.output })).toHaveProperty(
    "value",
    result.text
  )
  expect(
    screen.getByRole("link", { name: m.download }).getAttribute("download")
  ).toBe(result.filename)
  expect(mock.export.mock.calls[0]![0]).toMatchObject({
    sheet: 1,
    format: "csv",
    values: "formatted",
    range: "",
  })
  const blob = vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob
  expect(blob.type).toBe(result.mime)
  expect(await blob.text()).toBe(result.text)
  expect(screen.getByText(m.missingCached.replace("{count}", "1"))).toBeTruthy()
  await act(async () =>
    fireEvent.click(screen.getByRole("button", { name: m.copy }))
  )
  expect(mock.copy).toHaveBeenCalledWith(result.text)
  expect(screen.getByRole("button", { name: m.copied })).toBeTruthy()
  await select(m.format, m.formats.markdown)
  await screen.findByRole("link", { name: m.download })
  fireEvent.click(screen.getByRole("checkbox", { name: m.firstRowHeader }))
  await waitFor(() =>
    expect(mock.export).toHaveBeenLastCalledWith(
      expect.objectContaining({ format: "markdown", firstRowHeader: false }),
      expect.anything()
    )
  )
  await select(m.values, m.valueModes.raw)
  await waitFor(() =>
    expect(mock.export).toHaveBeenLastCalledWith(
      expect.objectContaining({ values: "raw" }),
      expect.anything()
    )
  )
  await select(m.sheet, "Secret (Hidden)")
  await waitFor(() =>
    expect(mock.export).toHaveBeenLastCalledWith(
      expect.objectContaining({ sheet: 0, range: "" }),
      expect.anything()
    )
  )
})

test("hides obsolete downloads while a range is edited and applies valid rectangles only", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  const range = screen.getByRole("textbox", { name: m.range })
  fireEvent.change(range, { target: { value: "A0" } })
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  fireEvent.submit(range.closest("form")!)
  expect(range.getAttribute("aria-invalid")).toBe("true")
  expect(screen.getByText(m.invalidRange)).toBeTruthy()
  expect(mock.export).toHaveBeenCalledOnce()
  fireEvent.change(range, { target: { value: "B3:C9" } })
  expect(screen.queryByRole("textbox", { name: m.output })).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.applyRange }))
  await waitFor(() =>
    expect(mock.export).toHaveBeenLastCalledWith(
      expect.objectContaining({ range: "B3:C9" }),
      expect.anything()
    )
  )
  await screen.findByRole("link", { name: m.download })
  await select(m.sheet, "Secret (Hidden)")
  expect(range).toHaveProperty("value", "")
})

test("exports empty results, maps errors, and recovers by changing options", async () => {
  mock.export.mockResolvedValueOnce({
    ...result,
    text: "",
    empty: true,
    missingCached: 0,
  })
  render(<Client messages={m} />)
  upload()
  await screen.findByText(m.empty)
  expect(screen.getByRole("link", { name: m.download })).toBeTruthy()
  mock.export.mockRejectedValueOnce(new RangeError("allocation"))
  await select(m.format, m.formats.json)
  await screen.findByText(m.resource)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  await select(m.format, m.formats.csv)
  await screen.findByRole("link", { name: m.download })
})

test("replaces and closes files, ignores late success and error, and removes stale downloads", async () => {
  render(<Client messages={m} />)
  upload()
  await screen.findByRole("link", { name: m.download })
  let finish!: (output: Output) => void
  mock.export.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  await select(m.format, m.formats.json)
  await waitFor(() => expect(mock.export).toHaveBeenCalledTimes(2))
  const previous = mock.export.mock.calls[1]![1] as AbortSignal
  upload("replacement.xlsx")
  expect(previous.aborted).toBe(true)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  await screen.findByRole("link", { name: m.download })
  await act(async () => finish({ ...result, text: "stale" }))
  expect(screen.getByRole("textbox", { name: m.output })).toHaveProperty(
    "value",
    result.text
  )
  let fail!: (reason: Error) => void
  mock.export.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  await select(m.format, m.formats.tsv)
  await waitFor(() => expect(mock.export).toHaveBeenCalledTimes(4))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => fail(new Error("stale")))
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect((mock.open.mock.calls[1]![1] as AbortSignal).aborted).toBe(true)
})

test("validates modern input and maps opening errors without a file-size quota", async () => {
  render(<Client messages={m} />)
  upload("legacy.xls")
  await screen.findByText(m.invalid)
  upload("empty.xlsx", "")
  await screen.findByText(m.invalid)
  expect(mock.open).not.toHaveBeenCalled()
  for (const reason of ["protected", "engineUnavailable", "resource"]) {
    mock.open.mockRejectedValueOnce(new Error(reason))
    upload()
    await screen.findByText(m[reason as "protected"])
  }
  const large = new File(["large"], "large.xlsm")
  Object.defineProperty(large, "size", { value: 51 * 1024 * 1024 })
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [large] },
  })
  await screen.findByRole("link", { name: m.download })
  expect(mock.open).toHaveBeenLastCalledWith({ file: large }, expect.anything())
})

test("ignores a workbook that finishes opening after closure", async () => {
  let finish!: (session: Session) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => finish(session))
  expect(screen.queryByRole("textbox", { name: m.range })).toBeNull()
  let fail!: (reason: Error) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  upload()
  await waitFor(() => expect(mock.open).toHaveBeenCalledTimes(2))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => fail(new Error("stale")))
  expect(screen.queryByRole("alert")).toBeNull()
})
