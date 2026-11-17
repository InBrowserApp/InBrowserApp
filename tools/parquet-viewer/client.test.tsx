import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Info, Request, Response } from "./types"

const info: Info = {
  rows: 125,
  columns: ["id", "name", "nested", "blank"],
  groups: 3,
  codecs: ["SNAPPY"],
  createdBy: "test writer",
  fields: [
    {
      name: "id",
      path: "id",
      depth: 0,
      physical: "INT64",
      logical: "",
      repetition: "REQUIRED",
    },
    {
      name: "name",
      path: "name",
      depth: 0,
      physical: "BYTE_ARRAY",
      logical: "STRING",
      repetition: "OPTIONAL",
    },
    {
      name: "nested",
      path: "nested",
      depth: 0,
      physical: "",
      logical: "LIST",
      repetition: "REPEATED",
    },
    {
      name: "blank",
      path: "blank",
      depth: 0,
      physical: "",
      logical: "",
      repetition: undefined,
    },
  ],
}
class WorkerStub {
  static instances: WorkerStub[] = []
  onmessage: ((event: MessageEvent<Response>) => void) | null = null
  onerror = null
  onmessageerror = null
  file: File | null = null
  stopped = false
  terminate = vi.fn(() => {
    this.stopped = true
  })
  constructor() {
    WorkerStub.instances.push(this)
  }
  postMessage(data: Request) {
    if (data.type === "open") this.file = data.file
    if (this.file?.name === "slow" && data.type === "export") return
    if (this.file?.name === "delayed") return
    queueMicrotask(() => {
      if (this.stopped) return
      const name = this.file?.name
      if (
        name === "bad" ||
        (name === "page-error" && data.type === "page") ||
        (name === "export-error" && data.type === "export")
      )
        return this.reply({ id: data.id, error: true })
      if (data.type === "open")
        this.reply({
          id: data.id,
          result: {
            ...info,
            ...(name === "empty"
              ? { rows: 0, groups: 0, codecs: [], createdBy: "" }
              : {}),
          },
        })
      else if (data.type === "page")
        this.reply({
          id: data.id,
          result: Array.from({ length: data.end - data.start }, (_, i) => ({
            id: String(9007199254740993n + BigInt(data.start + i)),
            name: `row ${data.start + i + 1}`,
            nested: [true, null],
            blank: i % 2 ? null : "",
          })),
        })
      else {
        this.reply({ id: data.id, progress: data.end - data.start })
        this.reply({
          id: data.id,
          result: { blob: new Blob(["export"]), rows: data.end - data.start },
        })
      }
    })
  }
  reply(data: Response) {
    this.onmessage?.(new MessageEvent("message", { data }))
  }
}
let createObjectURL: ReturnType<typeof vi.fn>
beforeEach(() => {
  WorkerStub.instances = []
  vi.stubGlobal("Worker", WorkerStub)
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  createObjectURL = vi.fn(() => "blob:export")
  vi.stubGlobal(
    "URL",
    Object.assign(URL, { createObjectURL, revokeObjectURL: vi.fn() })
  )
  vi.spyOn(HTMLDialogElement.prototype, "show").mockImplementation(function (
    this: HTMLDialogElement
  ) {
    this.open = true
  })
  vi.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(
    function (this: HTMLDialogElement) {
      this.open = true
    }
  )
  vi.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(function (
    this: HTMLDialogElement
  ) {
    this.open = false
  })
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
function open(name = "file.parquet", lang = "en") {
  const rendered = render(<Client messages={m} lang={lang} />)
  const picker = screen.getByLabelText(m.open, { selector: "input" })
  fireEvent.change(picker, { target: { files: [new File(["parquet"], name)] } })
  return { ...rendered, picker }
}
function switchTab(name: string) {
  fireEvent.mouseDown(screen.getByRole("tab", { name }), {
    button: 0,
    ctrlKey: false,
  })
}

describe("Parquet Viewer interactions", () => {
  test("sample, data, full cell values, schema, focus and file cleanup", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValue({ ok: true, blob: async () => new Blob(["sample"]) })
    )
    render(<Client messages={m} lang="en" />)
    fireEvent.click(screen.getByText(m.sample))
    await screen.findByText("row 1")
    expect(screen.getByText("9007199254740993")).toBeTruthy()
    const cell = screen.getByRole("button", { name: "name: row 1" })
    fireEvent.click(cell)
    expect(
      screen.getByRole("region", { name: m.cellDetails }).textContent
    ).toContain("row 1")
    const close = screen.getByRole("button", { name: m.closeDetails })
    close.focus()
    fireEvent.click(close)
    expect(screen.queryByRole("region", { name: m.cellDetails })).toBeNull()
    expect(document.activeElement).toBe(cell)
    switchTab(m.schema)
    await screen.findByText("INT64")
    expect(screen.getByText(m.required)).toBeTruthy()
    expect(screen.getByText(m.repeated)).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: m.focus }))
    fireEvent.click(screen.getByRole("button", { name: m.exitFocus }))
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    expect(screen.getByText(m.drop)).toBeTruthy()
    expect(WorkerStub.instances.every((worker) => worker.stopped)).toBe(true)
  })
  test("pagination reads the last page, page size resets and invalid jump values recover", async () => {
    open()
    await screen.findByText("row 1")
    fireEvent.click(screen.getByRole("button", { name: m.next }))
    await screen.findByText("row 51")
    fireEvent.click(screen.getByRole("button", { name: m.previous }))
    await screen.findByText("row 1")
    let input = screen.getByLabelText(m.page)
    fireEvent.change(input, { target: { value: "3" } })
    fireEvent.blur(input)
    await screen.findByText("row 125")
    expect(
      (screen.getByRole("button", { name: m.next }) as HTMLButtonElement)
        .disabled
    ).toBe(true)
    input = screen.getByLabelText(m.page)
    fireEvent.change(input, { target: { value: "999" } })
    fireEvent.blur(input)
    expect((input as HTMLInputElement).value).toBe("3")
    fireEvent.keyDown(input, { key: "Enter" })
    fireEvent.keyDown(input, { key: "Escape" })
    fireEvent.change(screen.getByLabelText(m.rowsPerPage), {
      target: { value: "25" },
    })
    await screen.findByText("row 1")
    expect(screen.queryByText("row 26")).toBeNull()
  })
  test("exports the page or all rows, changes format, and releases old download URLs", async () => {
    open()
    await screen.findByText("row 1")
    fireEvent.click(screen.getByText(m.exportTitle))
    fireEvent.click(screen.getByText(m.prepare))
    const csv = await screen.findByRole("link", { name: "Download CSV" })
    expect(csv.getAttribute("download")).toBe("file.csv")
    expect(screen.getByText("Export ready · 50 rows")).toBeTruthy()
    fireEvent.change(screen.getByLabelText(m.format), {
      target: { value: "json" },
    })
    fireEvent.change(screen.getByLabelText(m.scope), {
      target: { value: "all" },
    })
    fireEvent.click(screen.getByText(m.prepare))
    const json = await screen.findByRole("link", { name: "Download JSON" })
    expect(json.getAttribute("download")).toBe("file.json")
    expect(screen.getByText("Export ready · 125 rows")).toBeTruthy()
    fireEvent.click(screen.getByRole("button", { name: m.clear }))
    expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:export")
  })
  test("cancels a running export and cleans up on file replacement", async () => {
    const { picker } = open("slow")
    await screen.findByText("row 1")
    fireEvent.click(screen.getByText(m.exportTitle))
    fireEvent.click(screen.getByText(m.prepare))
    fireEvent.click(await screen.findByRole("button", { name: m.cancel }))
    expect(screen.getByText(m.prepare)).toBeTruthy()
    fireEvent.click(screen.getByText(m.prepare))
    await screen.findByRole("button", { name: m.cancel })
    fireEvent.change(picker, { target: { files: [new File([], "empty")] } })
    await screen.findByText(m.empty)
    expect(screen.queryByRole("link")).toBeNull()
    expect(
      WorkerStub.instances.slice(0, 3).every((worker) => worker.stopped)
    ).toBe(true)
  })
  test.each(["bad", "page-error", "export-error"])(
    "shows useful %s errors",
    async (name) => {
      open(name)
      if (name === "export-error") {
        await screen.findByText("row 1")
        fireEvent.click(screen.getByText(m.exportTitle))
        fireEvent.click(screen.getByText(m.prepare))
        expect((await screen.findByRole("alert")).textContent).toBe(
          m.exportError
        )
      } else {
        expect((await screen.findByRole("alert")).textContent).toBe(
          name === "bad" ? m.error : m.pageError
        )
        if (name === "page-error") {
          switchTab(m.schema)
          await screen.findByText("INT64")
        }
      }
    }
  )
  test("empty files keep the schema, and RTL tabs use the requested direction", async () => {
    open("empty", "ar")
    await screen.findByText(m.empty)
    expect(
      screen
        .getByRole("tablist")
        .closest("[data-slot=tabs]")
        ?.getAttribute("dir")
    ).toBe("rtl")
    switchTab(m.schema)
    await screen.findByText("INT64")
    expect(
      within(screen.getByRole("region", { name: m.schema })).getByText("name")
    ).toBeTruthy()
  })
  test("a stale sample response cannot replace a file selected meanwhile", async () => {
    let finish!: (value: unknown) => void
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            finish = resolve
          })
      )
    )
    render(<Client messages={m} lang="en" />)
    fireEvent.click(screen.getByText(m.sample))
    fireEvent.change(screen.getByLabelText(m.open, { selector: "input" }), {
      target: { files: [new File([], "empty")] },
    })
    await screen.findByText(m.empty)
    finish({ ok: true, blob: async () => new Blob(["sample"]) })
    await waitFor(() => expect(screen.getByText("empty")).toBeTruthy())
    expect(screen.queryByText("sample.parquet")).toBeNull()
  })
  test("sample fetch failure is recoverable", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false })
        .mockRejectedValueOnce(new Error("offline"))
    )
    render(<Client messages={m} lang="en" />)
    for (let i = 0; i < 2; i++) {
      fireEvent.click(screen.getByText(m.sample))
      expect((await screen.findByRole("alert")).textContent).toBe(m.error)
    }
  })
  test("ignores rows and metadata arriving after the file has closed", async () => {
    const { picker } = open("delayed")
    const old = WorkerStub.instances[0]!
    fireEvent.change(picker, { target: { files: [new File([], "empty")] } })
    await screen.findByText(m.empty)
    old.reply({ id: 1, result: info })
    expect(screen.queryByText("row 1")).toBeNull()
  })
})
