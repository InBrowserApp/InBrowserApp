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
import type { Loaded, Preview, Request, Response } from "./types"

const info: Loaded = {
  missingCaches: 1,
  sheets: [
    {
      name: "Data",
      range: "A1:P40",
      start: { r: 0, c: 0 },
      end: { r: 39, c: 15 },
      hidden: 0,
    },
    {
      name: "Empty",
      range: null,
      start: { r: 0, c: 0 },
      end: { r: 0, c: 0 },
      hidden: 1,
    },
    {
      name: "Secret",
      range: "A1",
      start: { r: 0, c: 0 },
      end: { r: 0, c: 0 },
      hidden: 2,
    },
  ],
}
const preview: Preview = {
  sheet: 0,
  row: 0,
  column: 0,
  range: "A1:H20",
  columns: ["A", "B", "C"],
  rows: [
    {
      number: 1,
      cells: [
        {
          address: "A1",
          text: "<script>literal</script>",
          raw: "<script>literal</script>",
          missingCache: false,
        },
        {
          address: "B1",
          text: "",
          raw: "",
          formula: "A2+1",
          format: "0.00",
          missingCache: true,
        },
        { address: "C1", text: "", raw: "", missingCache: false },
      ],
    },
  ],
}
class TestWorker {
  static instances: TestWorker[] = []
  onmessage: ((event: MessageEvent<Response>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn<(message: Request) => void>()
  terminate = vi.fn()
  constructor() {
    TestWorker.instances.push(this)
  }
  emit(message: Response) {
    act(() => this.onmessage?.({ data: message } as MessageEvent<Response>))
  }
}
const current = () => TestWorker.instances.at(-1)!
function upload(name = "数据.xls", contents = "xls") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([contents], name)] },
  })
}
function ready(worker = current()) {
  worker.emit({ type: "ready", info, bytes: new Uint8Array([80, 75]).buffer })
}
function showPreview(value = preview) {
  const last = current().postMessage.mock.calls.at(-1)![0]
  if (last.type !== "preview") throw new Error("Expected a preview request")
  current().emit({ type: "preview", id: last.id, preview: value })
}
async function select(name: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: m.sheet }), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("option", { name }))
}
beforeEach(() => {
  TestWorker.instances = []
  vi.stubGlobal("Worker", TestWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:xlsx")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("offers a local workbook download and safe inspectable cell data", async () => {
  const view = render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  expect(screen.getByText(m.working)).toBeTruthy()
  ready()
  expect(
    screen.getByRole("link", { name: m.download }).getAttribute("download")
  ).toBe("数据.xlsx")
  expect(
    screen
      .getByRole("link", { name: m.download })
      .getAttribute("data-astro-prefetch")
  ).toBe("false")
  expect(
    (vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob).type
  ).toContain("spreadsheetml.sheet")
  expect(screen.getByText(m.missingCaches)).toBeTruthy()
  showPreview()
  fireEvent.click(
    screen.getByRole("button", { name: "A1: <script>literal</script>" })
  )
  expect(screen.getByRole("region", { name: m.details }).textContent).toContain(
    "<script>literal</script>"
  )
  expect(view.container.querySelector("script")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: `B1: ${m.noCache}` }))
  expect(screen.getByText("=A2+1")).toBeTruthy()
  expect(screen.getByText("0.00")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: `C1: ${m.blank}` }))
  expect(screen.getByRole("region", { name: m.details }).textContent).toContain(
    m.blank
  )
  await select("Empty")
  expect(screen.getByText(m.empty)).toBeTruthy()
  expect(screen.getByText(m.hidden)).toBeTruthy()
  await select("Secret")
  expect(screen.getByText(m.veryHidden)).toBeTruthy()
})

test("navigates windows, validates addresses, and discards superseded previews", () => {
  render(<Client messages={m} />)
  upload()
  ready()
  showPreview()
  expect(
    (screen.getByRole("button", { name: m.previousRows }) as HTMLButtonElement)
      .disabled
  ).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.nextRows }))
  expect(current().postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ row: 20, column: 0 })
  )
  showPreview({ ...preview, row: 20 })
  fireEvent.click(screen.getByRole("button", { name: m.previousRows }))
  expect(current().postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ row: 0 })
  )
  showPreview()
  fireEvent.click(screen.getByRole("button", { name: m.nextColumns }))
  showPreview({ ...preview, column: 8 })
  fireEvent.click(screen.getByRole("button", { name: m.previousColumns }))
  expect(current().postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ column: 0 })
  )
  showPreview()
  fireEvent.change(screen.getByLabelText(m.goTo), { target: { value: "Z100" } })
  fireEvent.click(screen.getByRole("button", { name: m.go }))
  expect(screen.getByText(m.invalidAddress)).toBeTruthy()
  fireEvent.change(screen.getByLabelText(m.goTo), { target: { value: "P40" } })
  fireEvent.click(screen.getByRole("button", { name: m.go }))
  expect(current().postMessage).toHaveBeenLastCalledWith(
    expect.objectContaining({ row: 39, column: 15 })
  )
  current().emit({ type: "preview", id: -1, preview })
  expect(screen.queryByText("Showing A1:H20")).toBeNull()
  showPreview({ ...preview, row: 39, column: 15, range: "P40" })
  expect(screen.getByText("Showing P40")).toBeTruthy()
})

test("terminates replaced and cancelled workers, revokes results, ignores late replies", () => {
  const view = render(<Client messages={m} />)
  upload()
  ready()
  showPreview()
  const first = current()
  upload("replacement.xls")
  expect(first.terminate).toHaveBeenCalled()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:xlsx")
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  ready(first)
  first.emit({ type: "error", error: "invalid" })
  expect(screen.queryByRole("alert")).toBeNull()
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(current().terminate).toHaveBeenCalled()
  expect(screen.getByText(m.drop)).toBeTruthy()
  upload()
  ready()
  view.unmount()
  expect(current().terminate).toHaveBeenCalled()
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
})

test("rejects invalid inputs, maps worker failures, and recovers on replacement", () => {
  render(<Client messages={m} />)
  upload("renamed.xlsx")
  expect(screen.getByText(m.invalid)).toBeTruthy()
  upload("empty.xls", "")
  expect(TestWorker.instances).toHaveLength(0)
  for (const error of [
    "protected",
    "invalid",
    "unsupported",
    "resource",
  ] as const) {
    upload()
    current().emit({ type: "error", error })
    expect(screen.getByText(m[error])).toBeTruthy()
    expect(current().terminate).toHaveBeenCalled()
  }
  upload()
  ready()
  current().emit({ type: "error", error: "resource" })
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:xlsx")
  upload()
  act(() => current().onerror?.(new ErrorEvent("error")))
  expect(screen.getByText(m.engineUnavailable)).toBeTruthy()
  vi.stubGlobal(
    "Worker",
    class {
      constructor() {
        throw new Error("blocked")
      }
    }
  )
  upload()
  expect(screen.getByText(m.engineUnavailable)).toBeTruthy()
})

test("handles download allocation failures and accepts files above 50 MB", async () => {
  render(<Client messages={m} />)
  const file = new File(["xls"], "large.xls")
  Object.defineProperty(file, "size", { value: 51 * 1024 * 1024 })
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [file] },
  })
  await waitFor(() =>
    expect(current().postMessage).toHaveBeenCalledWith({ type: "open", file })
  )
  vi.mocked(URL.createObjectURL).mockImplementationOnce(() => {
    throw new RangeError("allocation")
  })
  ready()
  expect(screen.getByText(m.resource)).toBeTruthy()
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
})
