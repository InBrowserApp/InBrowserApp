import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import Client from "./client"
import { FilePicker } from "./components/file-picker"
import { outputFilename } from "./components/output-preview"
import { convertInput } from "./core/convert"
import messages from "./messages/en.json"
import type { ConversionRequest, WorkerResponse } from "./types"

let fail = false
let hold = false
const workers: TestWorker[] = []
class TestWorker {
  onmessage: ((event: { data: WorkerResponse }) => void) | null = null
  terminate = vi.fn()
  constructor() {
    workers.push(this)
  }
  async postMessage(request: ConversionRequest) {
    if (hold) return
    const data: WorkerResponse = fail
      ? { failed: true }
      : {
          result: convertInput(
            typeof request.input === "string"
              ? request.input
              : new Uint8Array(await request.input.arrayBuffer()),
            request
          ),
        }
    this.onmessage?.({ data })
  }
}

beforeEach(() => {
  fail = false
  hold = false
  workers.length = 0
  vi.stubGlobal("Worker", TestWorker)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:converted")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

const open = (lang = "en") => render(<Client messages={messages} lang={lang} />)
const upload = (file: File) =>
  fireEvent.change(screen.getByLabelText(messages.chooseFile), {
    target: { files: [file] },
  })
const download = () => screen.findByRole("link", { name: messages.download })
async function choose(label: string, option: string) {
  fireEvent.click(screen.getByRole("combobox", { name: label }))
  fireEvent.click(await screen.findByRole("option", { name: option }))
}

describe("encoding converter interaction", () => {
  it("offers local file/text inputs and sensible output defaults", () => {
    open()
    expect(screen.getByText(messages.privacy)).toBeTruthy()
    expect(screen.getByText(messages.emptyTitle)).toBeTruthy()
    expect(
      screen.getByRole("combobox", { name: messages.targetLabel }).textContent
    ).toBe("UTF-8")
    expect(
      screen.getByRole("combobox", { name: messages.bomLabel }).textContent
    ).toBe(messages.bomRemove)
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  })
  it("reads original bytes, shows accurate line metadata, and preserves the extension", async () => {
    open()
    upload(new File(["Hello\r\nworld\n"], "example.csv"))
    expect((await download()).getAttribute("download")).toBe(
      "example-utf-8.csv"
    )
    expect(
      (
        screen.getByLabelText(
          messages.sourcePreviewLabel
        ) as HTMLTextAreaElement
      ).value
    ).toBe("Hello\r\nworld\n")
    expect(screen.getByText(/CRLF × 1/).textContent).toContain("LF × 1")
    expect(screen.getAllByText(messages.previewNotice)).toHaveLength(2)
  })
  it("blocks ambiguous input then recovers using an independent decoding preview", async () => {
    open()
    upload(new File([new Uint8Array([0xd6, 0xd0, 0xce, 0xc4])], "中文.txt"))
    expect(await screen.findByText(messages.sourceUnknown)).toBeTruthy()
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    fireEvent.click(screen.getByText(messages.compareLabel))
    fireEvent.click(screen.getByRole("button", { name: "Use GBK" }))
    expect(await download()).toBeTruthy()
    expect(
      (
        screen.getByLabelText(
          messages.sourcePreviewLabel
        ) as HTMLTextAreaElement
      ).value
    ).toBe("中文")
  })
  it("changes output encoding/BOM/newlines and invalidates old downloads immediately", async () => {
    open()
    fireEvent.mouseDown(screen.getByRole("tab", { name: messages.textTab }))
    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "中文\n" },
    })
    await download()
    await choose(messages.targetLabel, "Big5")
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect((await download()).getAttribute("download")).toBe("text-big5.txt")
    expect(
      (
        screen.getByRole("combobox", {
          name: messages.bomLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    expect(screen.getByText(messages.unicodeOnly)).toBeTruthy()
    await choose(messages.targetLabel, "UTF-16LE")
    await choose(messages.bomLabel, messages.bomAdd)
    await choose(messages.lineEndingsLabel, messages.crlfLabel)
    await download()
    expect(screen.getByText(/^ff fe /).textContent).toContain("0d 00 0a 00")
  })
  it("shows lossy output for diagnosis and recovers when selecting UTF-8", async () => {
    open()
    fireEvent.click(screen.getByRole("button", { name: messages.sample }))
    await download()
    await choose(messages.targetLabel, "GBK")
    expect(await screen.findByText(messages.unrepresentable)).toBeTruthy()
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(
      (
        screen.getByLabelText(
          messages.outputPreviewLabel
        ) as HTMLTextAreaElement
      ).value
    ).toContain("?")
    await choose(messages.targetLabel, "UTF-8")
    expect(await download()).toBeTruthy()
  })
  it("retains input in each tab, clears hidden input too, and revokes downloads", async () => {
    open("ar")
    upload(new File(["file text"], "a.txt"))
    await download()
    fireEvent.mouseDown(screen.getByRole("tab", { name: messages.textTab }))
    fireEvent.change(screen.getByLabelText(messages.textLabel), {
      target: { value: "pasted" },
    })
    await download()
    fireEvent.mouseDown(screen.getByRole("tab", { name: messages.fileTab }))
    await download()
    expect(
      (
        screen.getByLabelText(
          messages.sourcePreviewLabel
        ) as HTMLTextAreaElement
      ).value
    ).toBe("file text")
    fireEvent.click(screen.getByRole("button", { name: messages.clear }))
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(URL.revokeObjectURL).toHaveBeenCalled()
    fireEvent.mouseDown(screen.getByRole("tab", { name: messages.textTab }))
    expect(
      (screen.getByLabelText(messages.textLabel) as HTMLTextAreaElement).value
    ).toBe("")
  })
  it("accepts an empty file as a real zero-byte conversion", async () => {
    open()
    upload(new File([], "empty.txt"))
    expect(await download()).toBeTruthy()
    expect(screen.getByText("0 bytes")).toBeTruthy()
  })
  it("discards previous output on a failed replacement and allows a retry", async () => {
    open()
    upload(new File(["good"], "good.txt"))
    await download()
    fail = true
    upload(new File(["replacement"], "next.txt"))
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
    expect(await screen.findByText(messages.processingError)).toBeTruthy()
    fail = false
    upload(new File(["retry"], "retry.txt"))
    expect(await download()).toBeTruthy()
  })
  it("cancels processing and ignores a late response", async () => {
    hold = true
    open()
    upload(new File(["input"], "a.txt"))
    expect(screen.getByRole("status").textContent).toContain(
      messages.processing
    )
    await waitFor(() => expect(workers).toHaveLength(1))
    fireEvent.click(screen.getByRole("button", { name: messages.cancel }))
    expect(workers[0]!.terminate).toHaveBeenCalled()
    act(() =>
      workers[0]!.onmessage?.({
        data: {
          result: convertInput("stale", {
            source: "auto",
            target: "utf-8",
            bom: "remove",
            lineEnding: "preserve",
          }),
        },
      })
    )
    expect(screen.queryByRole("link", { name: messages.download })).toBeNull()
  })
  it("enables source selection after opening a file and resets it on replacement", async () => {
    open()
    expect(
      (
        screen.getByRole("combobox", {
          name: messages.sourceLabel,
        }) as HTMLButtonElement
      ).disabled
    ).toBe(true)
    upload(new File(["hello"], "first.txt"))
    await download()
    await choose(messages.sourceLabel, "Big5")
    upload(new File(["hello"], "new.txt"))
    await download()
    expect(
      screen.getByRole("combobox", { name: messages.sourceLabel }).textContent
    ).toBe(messages.autoLabel)
  })
})

it("preserves names with multiple dots and files with no extension", () => {
  expect(outputFilename("archive.data.csv", "gbk")).toBe("archive.data-gbk.csv")
  expect(outputFilename("LICENSE", "big5")).toBe("LICENSE-big5")
})

it("supports chooser cancellation, keyboard-triggered file picking and dropping files", () => {
  const onFile = vi.fn()
  const { container } = render(
    <FilePicker
      file={null}
      onFile={onFile}
      messages={messages}
      id="pick"
      lang="en"
    />
  )
  const input = screen.getByLabelText(messages.chooseFile)
  const click = vi.spyOn(input, "click")
  fireEvent.click(screen.getByRole("button", { name: messages.chooseFile }))
  expect(click).toHaveBeenCalledOnce()
  fireEvent.change(input, { target: { files: [] } })
  const dropzone = container.firstElementChild!
  fireEvent.dragOver(dropzone)
  fireEvent.drop(dropzone, { dataTransfer: { files: [] } })
  expect(onFile).not.toHaveBeenCalled()
  const file = new File(["drop"], "drop.txt")
  fireEvent.drop(dropzone, { dataTransfer: { files: [file] } })
  expect(onFile).toHaveBeenCalledWith(file)
})
