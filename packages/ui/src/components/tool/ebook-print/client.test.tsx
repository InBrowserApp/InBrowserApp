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

const mock = vi.hoisted(() => ({ prepareBook: vi.fn() }))
vi.mock("./prepare-book", () => mock)
const book = { html: "<!doctype html><p>Book text</p>", missing: false }

function setup(format: "epub" | "fb2" = "epub") {
  const { container } = render(
    <Client lang="en" format={format} messages={m} />
  )
  const input = container.querySelector("input")!
  function select(name = "reading.epub") {
    fireEvent.change(input, { target: { files: [new File(["book"], name)] } })
  }
  return { container, input, select }
}

beforeEach(() => {
  vi.resetAllMocks()
  mock.prepareBook.mockResolvedValue(book)
  vi.spyOn(URL, "createObjectURL").mockReturnValue("about:blank")
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
})

afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
})

test("opens the book with one stable picker and prints the selected paper size", async () => {
  const { input, select } = setup()
  const picker = screen.getByRole("button", { name: m.open })
  const open = vi.spyOn(input, "click")
  fireEvent.click(picker)
  expect(open).toHaveBeenCalledOnce()
  select("reading.EPUB")
  expect(screen.getByRole("button", { name: m.replace })).toBe(picker)
  const frame = await screen.findByTitle(m.preview)
  const print = vi.fn()
  const doc = document.implementation.createHTMLDocument("")
  doc.head.innerHTML = '<style id="paper-size"></style>'
  Object.defineProperties(frame, {
    contentDocument: { value: doc },
    contentWindow: { value: { print } },
  })
  const save = screen.getByRole("button", { name: m.save })
  expect(save.hasAttribute("disabled")).toBe(true)
  fireEvent.load(frame)
  fireEvent.change(screen.getByLabelText(m.pageSize), {
    target: { value: "A5" },
  })
  fireEvent.click(save)
  expect(print).toHaveBeenCalledOnce()
  expect(doc.querySelector("#paper-size")?.textContent).toContain("size: A5")
  select("another.epub")
  await screen.findByTitle(m.preview)
  expect(screen.getByLabelText<HTMLSelectElement>(m.pageSize).value).toBe("A5")
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("about:blank")
})

test("keeps the selected file and exposes an actionable error if native printing is unavailable", async () => {
  mock.prepareBook.mockResolvedValueOnce({ ...book, missing: true })
  const { select } = setup()
  select()
  await screen.findByText(m.missingResources)
  const frame = screen.getByTitle(m.preview)
  Object.defineProperty(frame, "contentDocument", { value: null })
  fireEvent.load(frame)
  fireEvent.click(screen.getByRole("button", { name: m.save }))
  expect(screen.getByRole("alert").textContent).toBe(m.printUnavailable)
  expect(screen.getByText("reading.epub")).toBeTruthy()
})

test("supports drop, explains wrong input, and recovers with a new book", async () => {
  const { container, select } = setup()
  const zone = container.querySelector("section")!
  fireEvent.dragOver(zone, { dataTransfer: { types: ["text/plain"] } })
  expect(zone.classList.contains("border-primary")).toBe(false)
  fireEvent.dragOver(zone, { dataTransfer: { types: ["Files"] } })
  expect(zone.classList.contains("border-primary")).toBe(true)
  fireEvent.dragLeave(zone, { relatedTarget: zone.querySelector("button") })
  fireEvent.dragLeave(zone)
  expect(zone.classList.contains("border-primary")).toBe(false)
  fireEvent.drop(zone, { dataTransfer: { files: [] } })
  fireEvent.drop(zone, {
    dataTransfer: { files: [new File(["x"], "notes.txt")] },
  })
  await screen.findByText(m.unsupported)
  expect(mock.prepareBook).not.toHaveBeenCalled()
  select()
  await screen.findByTitle(m.preview)
  expect(screen.queryByRole("alert")).toBeNull()
})

test.each([
  [new Error("protected"), m.protected],
  [new Error("unsupportedLayout"), m.unsupportedLayout],
  [new Error("corrupt"), m.invalid],
  [null, m.invalid],
])(
  "reports opening failure %s without an old preview",
  async (reason, message) => {
    const { select } = setup()
    select()
    await screen.findByTitle(m.preview)
    mock.prepareBook.mockRejectedValueOnce(reason)
    select("broken.epub")
    await screen.findByText(message)
    expect(screen.queryByTitle(m.preview)).toBeNull()
    expect(screen.getByText("broken.epub")).toBeTruthy()
  }
)

test.each(["resolve", "reject"])(
  "discards a late %s after cancelling",
  async (settlement) => {
    let finish!: () => void
    mock.prepareBook.mockImplementationOnce(
      () =>
        new Promise((resolve, reject) => {
          finish = () =>
            settlement === "resolve"
              ? resolve(book)
              : reject(new Error("invalid"))
        })
    )
    const { select } = setup()
    select()
    await waitFor(() => expect(mock.prepareBook).toHaveBeenCalledOnce())
    const signal = mock.prepareBook.mock.calls[0]![1] as AbortSignal
    fireEvent.click(screen.getByRole("button", { name: m.cancel }))
    await act(async () => finish())
    expect(signal.aborted).toBe(true)
    expect(screen.queryByTitle(m.preview)).toBeNull()
    expect(screen.queryByRole("alert")).toBeNull()
    expect(document.activeElement).toBe(
      screen.getByRole("button", { name: m.open })
    )
  }
)

test.each(["book.fb2", "book.FBZ", "book.fb2.zip"])(
  "prepares %s on the FB2 page",
  async (name) => {
    const { select, input } = setup("fb2")
    expect(input.accept).toContain(".fb2.zip")
    select(name)
    await screen.findByTitle(m.preview)
    expect(mock.prepareBook).toHaveBeenCalledWith(
      expect.objectContaining({ name }),
      expect.any(AbortSignal),
      m,
      "en"
    )
  }
)
