import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { DataExport } from "./data-export"
import type { Reader } from "./types"
import type { Output } from "@workspace/spreadsheet-export/types"
import messages from "./messages/en.json"

const m = messages.dataExport
const convert = vi.fn(),
  open = vi.fn()
const reader = { exportSession: open } as unknown as Reader
const result: Output = {
  text: "[]",
  filename: "Book-Data.json",
  mime: "application/json;charset=utf-8",
  rows: 0,
  columns: 0,
  empty: true,
  missingCached: 2,
}
beforeEach(() => {
  vi.resetAllMocks()
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:export")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  convert.mockResolvedValue(result)
  open.mockResolvedValue({ export: convert })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})
async function select(label: string, value: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("option", { name: value }))
}
function mount() {
  const view = render(<DataExport reader={reader} sheet={2} messages={m} />)
  fireEvent.click(screen.getByText(m.title))
  return view
}
test("downloads the active sheet with selected options and clears obsolete exports", async () => {
  mount()
  await select(m.format, m.formats.json)
  await select(m.values, m.valueModes.raw)
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  const download = await screen.findByRole("link", { name: m.download })
  expect(download.getAttribute("download")).toBe(result.filename)
  expect(convert).toHaveBeenCalledWith(
    {
      sheet: 2,
      range: "",
      format: "json",
      values: "raw",
      firstRowHeader: true,
    },
    expect.anything()
  )
  expect(screen.getByText(m.empty)).toBeTruthy()
  expect(screen.getByText(m.missingCached.replace("{count}", "2"))).toBeTruthy()
  const blob = vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob
  expect(await blob.text()).toBe("[]")
  await select(m.format, m.formats.markdown)
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  fireEvent.click(screen.getByRole("checkbox", { name: m.firstRowHeader }))
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByRole("link", { name: m.download })
  expect(convert).toHaveBeenLastCalledWith(
    expect.objectContaining({ firstRowHeader: false }),
    expect.anything()
  )
})
test("cancels exports when options change or the sheet unmounts and ignores late results", async () => {
  let finish!: (value: Output) => void
  convert.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  const view = mount()
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await waitFor(() => expect(convert).toHaveBeenCalledOnce())
  const signal = convert.mock.calls[0]![1] as AbortSignal
  await select(m.format, m.formats.tsv)
  expect(signal.aborted).toBe(true)
  await act(async () => finish(result))
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  let fail!: (reason: Error) => void
  convert.mockImplementationOnce(
    () =>
      new Promise((_resolve, reject) => {
        fail = reject
      })
  )
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await waitFor(() => expect(convert).toHaveBeenCalledTimes(2))
  view.unmount()
  expect((convert.mock.calls[1]![1] as AbortSignal).aborted).toBe(true)
  await act(async () => fail(new Error("stale")))
})
test("reports memory and export failures and retries", async () => {
  mount()
  open.mockRejectedValueOnce(new RangeError("allocation"))
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByText(m.resource)
  convert.mockRejectedValueOnce(new Error("invalid"))
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByText(m.error)
  convert.mockResolvedValueOnce({ ...result, empty: false, missingCached: 0 })
  fireEvent.click(screen.getByRole("button", { name: m.action }))
  await screen.findByRole("link", { name: m.download })
  expect(screen.queryByRole("alert")).toBeNull()
})
