import { act, cleanup, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Response } from "./types"

class TestWorker {
  static instances: TestWorker[] = []
  onmessage: ((event: MessageEvent<Response>) => void) | null = null
  onerror: ((event: ErrorEvent) => void) | null = null
  postMessage = vi.fn()
  terminate = vi.fn()
  constructor() {
    TestWorker.instances.push(this)
  }
  emit(message: Response) {
    act(() => this.onmessage?.({ data: message } as MessageEvent<Response>))
  }
}
const current = () => TestWorker.instances.at(-1)!
function upload(name = "数据.csv", text = "00123,=1+1") {
  fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
    target: { files: [new File([text], name)] },
  })
}
function ready(worker = current()) {
  worker.emit({
    type: "ready",
    info: {
      missingCaches: 0,
      sheets: [
        {
          name: "Sheet1",
          range: "A1:B1",
          start: { r: 0, c: 0 },
          end: { r: 0, c: 1 },
          hidden: 0,
        },
      ],
    },
    bytes: new Uint8Array([80, 75]).buffer,
  })
}
async function choose(label: string, option: string) {
  fireEvent.keyDown(screen.getByRole("combobox", { name: label }), {
    key: "ArrowDown",
  })
  fireEvent.click(await screen.findByRole("option", { name: option }))
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

test("supports CSV and TSV downloads with correct filename and MIME", () => {
  const view = render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  for (const name of ["数据.csv", "数据.TSV"]) {
    upload(name)
    expect(screen.getByText(m.working)).toBeTruthy()
    ready()
    expect(
      screen.getByRole("link", { name: m.download }).getAttribute("download")
    ).toBe("数据.xlsx")
    expect(
      (vi.mocked(URL.createObjectURL).mock.calls[0]![0] as Blob).type
    ).toBe("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
  }
  view.unmount()
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(2)
  expect(current().terminate).toHaveBeenCalled()
})

test("settings replace stale downloads, cancel prior work, and configure before opening", async () => {
  render(<Client messages={m} />)
  upload()
  ready()
  const old = current()
  for (const [label, choice, key, value] of [
    [m.delimiter, m.semicolon, "delimiter", ";"],
    [m.encoding, "Windows-1252", "encoding", "windows-1252"],
    [m.header, m.headerYes, "header", true],
  ] as const) {
    const prior = current()
    await choose(label, choice)
    expect(prior.terminate).toHaveBeenCalled()
    expect(screen.queryByRole("link", { name: m.download })).toBeNull()
    expect(current().postMessage.mock.calls[0]).toEqual([
      { type: "configure", options: expect.objectContaining({ [key]: value }) },
    ])
    expect(current().postMessage.mock.calls[1]?.[0]).toMatchObject({
      type: "open",
    })
    ready()
  }
  expect(URL.revokeObjectURL).toHaveBeenCalledTimes(3)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  ready(old)
  old.emit({ type: "error", error: "invalid" })
  expect(screen.queryByRole("link", { name: m.download })).toBeNull()
  expect(screen.queryByRole("alert")).toBeNull()
  expect(screen.getByText(m.drop)).toBeTruthy()
})

test("rejects unsupported extensions and empty input, cancels work and recovers from errors", () => {
  render(<Client messages={m} />)
  upload("book.xlsx")
  expect(screen.getByText(m.invalid)).toBeTruthy()
  upload("empty.csv", "")
  expect(TestWorker.instances).toHaveLength(0)
  upload()
  fireEvent.click(screen.getByRole("button", { name: m.cancel }))
  expect(current().terminate).toHaveBeenCalled()
  upload()
  current().emit({ type: "error", error: "unsupported" })
  expect(screen.getByText(m.unsupported)).toBeTruthy()
  upload()
  ready()
  expect(screen.getByRole("link", { name: m.download })).toBeTruthy()
})
