import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, expect, test, vi } from "vitest"
import HexEditor from "./client"
import { hex } from "./core/bytes"
import messages from "./messages/en.json"

const button = (name: string) => screen.getByRole("button", { name })
const label = (offset: number) =>
  messages.byteValue.replace("{offset}", `0x${hex(offset, 8)}`)
const byte = (offset: number) =>
  screen.getByRole<HTMLInputElement>("textbox", { name: label(offset) })
const findByte = (offset: number) =>
  screen.findByRole<HTMLInputElement>("textbox", { name: label(offset) })
const edit = (offset: number, value: string) =>
  fireEvent.change(byte(offset), { target: { value } })

function setup() {
  const { container } = render(<HexEditor messages={messages} lang="en" />)
  return container.querySelector<HTMLInputElement>('input[type="file"]')!
}

function choose(input: HTMLInputElement, file: File) {
  fireEvent.change(input, { target: { files: [file] } })
}

function jump(value: string) {
  fireEvent.change(screen.getByLabelText(messages.jumpOffset), {
    target: { value },
  })
  fireEvent.click(button(messages.go))
}

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("opens the sample, jumps to the selected byte, and advances via keyboard and edits", async () => {
  const input = setup()
  const pick = vi.spyOn(input, "click").mockImplementation(() => {})
  fireEvent.click(button(messages.openFile))
  expect(pick).toHaveBeenCalledOnce()

  fireEvent.click(button(messages.trySample))
  expect(screen.getByText("hex-sample.bin")).toBeTruthy()
  await findByte(0)
  jump("0")
  expect(document.activeElement).toBe(byte(0))

  fireEvent.keyDown(byte(0), { key: "ArrowRight" })
  expect(document.activeElement).toBe(byte(1))
  edit(1, "f")
  expect(byte(1).value).toBe("F")
  fireEvent.keyDown(byte(1), { key: "Escape" })
  expect(byte(1).value).toBe("6E")
  edit(1, "GG")
  expect(byte(1).value).toBe("6E")
  edit(1, "5a")
  expect(byte(1).value).toBe("5A")
  expect(document.activeElement).toBe(byte(2))
  expect(screen.getByText("Z")).toBeTruthy()

  fireEvent.click(button(messages.undo))
  expect(byte(1).value).toBe("6E")
  fireEvent.click(button(messages.redo))
  expect(byte(1).value).toBe("5A")
  expect(document.activeElement).toBe(byte(1))
  jump("1000")
  expect(screen.getByText(messages.offsetError)).toBeTruthy()
  jump("0x02")
  expect(screen.queryByText(messages.offsetError)).toBeNull()
  expect(document.activeElement).toBe(byte(2))
})

test("keeps edits across pages and downloads them without changing the file", async () => {
  const input = setup()
  const file = new File([new Uint8Array(257)], "large.bin")
  choose(input, file)
  await findByte(0)
  jump("FF")
  edit(255, "41")
  await findByte(256)
  expect(document.activeElement).toBe(byte(256))
  edit(256, "42")

  fireEvent.click(button(messages.previousPage))
  expect((await findByte(255)).value).toBe("41")
  fireEvent.click(button(messages.nextPage))
  expect((await findByte(256)).value).toBe("42")
  fireEvent.click(button(messages.undo))
  expect(byte(256).value).toBe("00")
  fireEvent.click(button(messages.redo))

  const createUrl = vi
    .spyOn(URL, "createObjectURL")
    .mockReturnValue("blob:hex-editor")
  let filename: string | undefined
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement
  ) {
    filename = this.download
  })
  fireEvent.click(button(messages.download))
  expect(filename).toBe("large.bin")
  const blob = createUrl.mock.calls[0]?.[0]
  if (!(blob instanceof Blob)) throw new Error("Expected a binary file")
  const saved = new Uint8Array(await blob.arrayBuffer())
  expect(saved.length).toBe(257)
  expect([...saved.subarray(254)]).toEqual([0, 65, 66])
  expect(new Uint8Array(await file.arrayBuffer())[255]).toBe(0)

  choose(input, file)
  expect((await findByte(255)).value).toBe("00")
})

test("handles file drops, empty files, and read errors", async () => {
  const input = setup()
  const card = input.closest('[data-slot="card"]')!
  const dataTransfer = {
    types: ["Files"],
    files: [new File([], "empty.bin")],
    dropEffect: "none",
  }
  function drag(type: string) {
    fireEvent(
      card,
      Object.assign(new Event(type, { bubbles: true, cancelable: true }), {
        dataTransfer,
      })
    )
  }
  drag("dragover")
  expect(dataTransfer.dropEffect).toBe("copy")
  drag("drop")
  expect(screen.getByText(messages.emptyFile)).toBeTruthy()
  expect(screen.queryByLabelText(messages.jumpOffset)).toBeNull()

  const broken = new File(["not readable"], "broken.bin")
  const unreadable = new Blob()
  vi.spyOn(unreadable, "arrayBuffer").mockRejectedValue(new Error("read error"))
  vi.spyOn(broken, "slice").mockReturnValue(unreadable)
  choose(input, broken)
  await waitFor(() => expect(screen.getByText(messages.readError)).toBeTruthy())
})
