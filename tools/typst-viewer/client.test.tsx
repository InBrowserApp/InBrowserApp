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
import type { CompileResult } from "./types"

const mock = vi.hoisted(() => ({
  compile: vi.fn(),
  open: vi.fn(),
  page: vi.fn(),
  zoom: vi.fn(),
  find: vi.fn(),
  dispose: vi.fn(),
  signals: [] as AbortSignal[],
  progress: null as null | ((phase: "compiling") => void),
  change: null as null | ((state: object) => void),
  error: null as null | (() => void),
  password: null as null | (() => void),
}))
vi.mock("./compile-document", () => ({ compileDocument: mock.compile }))
vi.mock("@workspace/pdf-reader", () => ({ openReader: mock.open }))
const instance = {
  page: mock.page,
  zoom: mock.zoom,
  find: mock.find,
  dispose: mock.dispose,
}
const result = (): CompileResult => ({
  pdf: new ArrayBuffer(1),
  diagnostics: [],
})
function upload(name = "report.typ") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File(["report"], name)] },
  })
}
beforeEach(() => {
  vi.resetAllMocks()
  mock.signals = []
  mock.compile.mockImplementation(async (_file, signal, progress) => {
    mock.signals.push(signal)
    mock.progress = progress
    progress("compiling")
    return result()
  })
  mock.open.mockImplementation(
    async ({ signal, onChange, onError, onPassword }) => {
      mock.error = onError
      mock.password = onPassword
      mock.change = onChange
      signal.addEventListener("abort", mock.dispose, { once: true })
      onChange({ total: 1001, page: 1 })
      return instance
    }
  )
})
afterEach(cleanup)

test("navigates long documents, fits pages, and releases the reader on close", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  await screen.findByLabelText(m.page)
  expect(screen.getByText("of 1001")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  expect(mock.page).toHaveBeenCalledWith(2)
  fireEvent.click(screen.getByRole("button", { name: m.fitPage }))
  expect(mock.zoom).toHaveBeenCalledWith("page-fit")
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(mock.signals[0]?.aborted).toBe(true)
  expect(mock.dispose).toHaveBeenCalledOnce()
  expect(screen.queryByLabelText(m.page)).toBeNull()
})

test("keeps source locations and warnings readable as text", async () => {
  mock.compile.mockResolvedValue({
    ...result(),
    diagnostics: [
      {
        line: 2,
        column: 10,
        message: '<img src="https://example.test/x">',
        severity: "warning",
      },
      {
        line: null,
        column: null,
        message: "warning without a location",
        severity: "warning",
      },
    ],
  })
  const view = render(<Client messages={m} />)
  upload()
  await screen.findByText("Line 2, column 10:")
  expect(
    screen.getByText(' <img src="https://example.test/x">'.trim())
  ).toBeTruthy()
  expect(view.container.querySelector("img")).toBeNull()
  expect(view.container.querySelector("details")?.open).toBe(true)
})

test("rejects unsupported extensions and clears the old document on source errors", async () => {
  render(<Client messages={m} />)
  upload("report.pdf")
  await screen.findByText(m.invalid)
  expect(mock.compile).not.toHaveBeenCalled()
  upload()
  await screen.findByLabelText(m.page)
  mock.compile.mockResolvedValue({
    diagnostics: [
      { line: 2, column: 1, message: "unclosed delimiter", severity: "error" },
    ],
    error: "failed",
  })
  upload("broken.typ")
  await screen.findByText(m.failed)
  expect(screen.queryByLabelText(m.page)).toBeNull()
  expect(mock.dispose).toHaveBeenCalledOnce()
  expect(screen.getByText("Line 2, column 1:")).toBeTruthy()
})

test("ignores a cancelled compilation, its late progress, and late PDF state", async () => {
  let finish: (value: CompileResult) => void = () => {}
  mock.compile.mockImplementationOnce((_file, signal, progress) => {
    mock.signals.push(signal)
    mock.progress = progress
    return new Promise<CompileResult>((resolve) => {
      finish = resolve
    })
  })
  render(<Client messages={m} />)
  upload()
  await waitFor(() => expect(mock.compile).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  await act(async () => {
    mock.progress?.("compiling")
    finish(result())
  })
  expect(mock.open).not.toHaveBeenCalled()
  expect(screen.queryByText(m.compiling)).toBeNull()
  upload()
  await screen.findByLabelText(m.page)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  act(() => {
    mock.change?.({ total: 9 })
    mock.error?.()
  })
  expect(screen.queryByText(m.failed)).toBeNull()
})

test("disposes a reader that finishes after the file is closed", async () => {
  let finish: (value: typeof instance) => void = () => {}
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
  await act(async () => finish(instance))
  expect(mock.dispose).toHaveBeenCalledOnce()
})

test("reports memory, unexpected empty result, password and renderer failures", async () => {
  render(<Client messages={m} />)
  mock.compile.mockRejectedValueOnce(new Error("out of memory"))
  upload()
  await screen.findByText(m.resource)
  mock.compile.mockRejectedValueOnce(new Error("viewer module unavailable"))
  upload()
  await screen.findByText(m.engineUnavailable)
  mock.compile.mockResolvedValueOnce({ diagnostics: [] })
  upload("empty.typ")
  await screen.findByText(m.failed)
  upload()
  await screen.findByLabelText(m.page)
  act(() => mock.password?.())
  await screen.findByText(m.failed)
  upload()
  await screen.findByLabelText(m.page)
  act(() => mock.error?.())
  await screen.findByText(m.failed)
})
