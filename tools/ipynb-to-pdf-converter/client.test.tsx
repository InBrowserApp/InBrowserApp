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

const mock = vi.hoisted(() => ({ prepareNotebookPrint: vi.fn() }))
vi.mock("./print-document", () => mock)

function upload(name: string, text = "notebook") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([text], name)] },
  })
}

beforeEach(() => {
  mock.prepareNotebookPrint.mockReset().mockResolvedValue("<p>Report</p>")
  vi.spyOn(URL, "createObjectURL").mockReturnValue("about:blank")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("prints the ready preview with the selected paper and clears the file", async () => {
  render(<Client lang="en" messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload("report.IPYNB")
  const frame = await screen.findByTitle(m.preview)
  const print = vi.fn()
  const doc = document.implementation.createHTMLDocument()
  Object.defineProperties(frame, {
    contentDocument: { value: doc },
    contentWindow: { value: { print } },
  })
  const save = screen.getByRole("button", { name: m.save }) as HTMLButtonElement
  expect(save.disabled).toBe(true)
  fireEvent.load(frame)
  fireEvent.click(save)
  expect(doc.getElementById("notebook-paper")?.textContent).toContain(
    "size: A4"
  )
  fireEvent.change(screen.getByLabelText(m.paper), {
    target: { value: "letter" },
  })
  fireEvent.click(save)
  expect(doc.getElementById("notebook-paper")?.textContent).toContain(
    "size: letter"
  )
  expect(print).toHaveBeenCalledTimes(2)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.queryByTitle(m.preview)).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("about:blank")
})

test("validates files and recovers from a failed conversion", async () => {
  render(<Client lang="en" messages={m} />)
  upload("report.html")
  await screen.findByText(m.unsupported)
  upload("empty.ipynb", "")
  await screen.findByText(m.emptyFile)
  expect(mock.prepareNotebookPrint).not.toHaveBeenCalled()
  mock.prepareNotebookPrint.mockRejectedValueOnce(new Error("VERSION"))
  upload("old.ipynb")
  await screen.findByText(m.version)
  upload("fresh.ipynb")
  await screen.findByTitle(m.preview)
})

test("discards an export that finishes after replacement", async () => {
  let finish!: (html: string) => void
  mock.prepareNotebookPrint.mockImplementationOnce(
    () =>
      new Promise<string>((resolve) => {
        finish = resolve
      })
  )
  render(<Client lang="en" messages={m} />)
  upload("slow.ipynb")
  await waitFor(() =>
    expect(mock.prepareNotebookPrint).toHaveBeenCalledTimes(1)
  )
  const signal = mock.prepareNotebookPrint.mock.calls[0]![3] as AbortSignal
  upload("fresh.ipynb")
  await screen.findByTitle(m.preview)
  expect(signal.aborted).toBe(true)
  await act(async () => finish("<p>Outdated</p>"))
  expect(URL.createObjectURL).toHaveBeenCalledTimes(1)
})
