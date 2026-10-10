import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { Comic } from "./types"

const mock = vi.hoisted(() => ({ open: vi.fn(), decode: vi.fn() }))
vi.mock("@workspace/cbz", () => ({ openComic: mock.open }))
vi.mock("./image", () => ({ decodeImage: mock.decode }))
let book: Comic
let serial = 0
function makeBook(count = 12): Comic {
  return {
    pages: Array.from({ length: count }, (_, i) => ({
      name: `chapter/page${i + 1}.png`,
      status: "unchecked",
    })),
    read: vi.fn(async () => new Blob(["image"])),
    dispose: vi.fn(async () => {}),
  }
}
function choose(name = "comic.cbz", file = new File(["zip"], name)) {
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
}
function canvas() {
  return screen.getByRole("region", { name: m.reader })
}
async function opened() {
  return screen.findByLabelText(m.page)
}
function go(value: string) {
  fireEvent.change(screen.getByLabelText(m.page), { target: { value } })
  fireEvent.keyDown(screen.getByLabelText(m.page), { key: "Enter" })
}
async function pageIs(value: number) {
  await waitFor(() =>
    expect((screen.getByLabelText(m.page) as HTMLInputElement).value).toBe(
      String(value)
    )
  )
}

beforeEach(() => {
  vi.resetAllMocks()
  book = makeBook()
  serial = 0
  mock.open.mockImplementation(async () => book)
  mock.decode.mockImplementation(async () => ({
    url: `blob:page-${++serial}`,
    width: 700,
    height: 1000,
  }))
  vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {})
  vi.stubGlobal(
    "ResizeObserver",
    class {
      callback: ResizeObserverCallback
      constructor(callback: ResizeObserverCallback) {
        this.callback = callback
      }
      observe() {
        this.callback([], this as unknown as ResizeObserver)
      }
      disconnect() {}
    }
  )
})
afterEach(() => {
  cleanup()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("opens, turns pages, jumps, fits, zooms, reads RTL, replaces and closes", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await opened()
  expect(screen.getByText("of 12")).toBeTruthy()
  await waitFor(() => expect(within(canvas()).getByRole("img")).toBeTruthy())
  fireEvent.click(screen.getByLabelText(m.next))
  await pageIs(2)
  await waitFor(() =>
    expect(within(canvas()).getByRole("img").getAttribute("src")).toBe(
      "blob:page-2"
    )
  )
  fireEvent.click(screen.getByLabelText(m.previous))
  await pageIs(1)
  go("10")
  await pageIs(10)
  go("999")
  await pageIs(10)
  fireEvent.click(screen.getByLabelText(m.fitWidth))
  expect(screen.getByLabelText(m.fitWidth).getAttribute("aria-pressed")).toBe(
    "true"
  )
  fireEvent.change(screen.getByLabelText(m.zoom), { target: { value: "150" } })
  fireEvent.keyDown(screen.getByLabelText(m.zoom), { key: "Enter" })
  await waitFor(() =>
    expect(within(canvas()).getByRole("img").style.width).toBe("1050px")
  )
  fireEvent.click(screen.getByLabelText(m.fitPage))
  expect(screen.getByLabelText(m.fitPage).getAttribute("aria-pressed")).toBe(
    "true"
  )
  fireEvent.keyDown(canvas(), { key: "ArrowRight" })
  await pageIs(11)
  fireEvent.click(screen.getByRole("radio", { name: m.rtl }))
  fireEvent.keyDown(canvas(), { key: "ArrowLeft" })
  await pageIs(12)
  fireEvent.keyDown(canvas(), { key: "ArrowRight" })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "Home" })
  await pageIs(1)
  fireEvent.keyDown(canvas(), { key: "End" })
  await pageIs(12)
  fireEvent.keyDown(canvas(), { key: "PageUp" })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "ArrowDown" })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "Home", ctrlKey: true })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "Home", altKey: true })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "Home", shiftKey: true })
  await pageIs(11)
  fireEvent.keyDown(canvas(), { key: "Home", metaKey: true })
  await pageIs(11)
  fireEvent.keyDown(within(canvas()).getByRole("img"), { key: "Home" })
  await pageIs(11)
  fireEvent.click(screen.getByRole("radio", { name: m.ltr }))
  fireEvent.click(screen.getByLabelText(m.focus))
  expect(screen.getByLabelText(m.exitFocus)).toBeTruthy()
  fireEvent.click(screen.getByLabelText(m.exitFocus))
  const old = book
  book = makeBook(2)
  choose("next.cbz")
  await pageIs(1)
  expect(old.dispose).toHaveBeenCalledOnce()
  fireEvent.click(screen.getByLabelText(m.clear))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(book.dispose).toHaveBeenCalledOnce()
  expect(URL.revokeObjectURL).toHaveBeenCalled()
})

test("opens the first readable page and reports failures without renumbering", async () => {
  book.pages[0]!.status = "unsupportedPage"
  vi.mocked(book.read).mockRejectedValueOnce(new Error("CRC"))
  render(<Client messages={m} />)
  choose()
  await opened()
  await pageIs(3)
  expect(screen.getByText(m.partial.replace("{count}", "2"))).toBeTruthy()
  go("1")
  await screen.findByText(m.unsupportedPage)
  go("2")
  await screen.findByText(m.damagedPage)
  go("4")
  await waitFor(() => expect(within(canvas()).getByRole("img")).toBeTruthy())
})

test("provides a moving thumbnail window covering every page", async () => {
  book.pages[1]!.status = "encryptedPage"
  render(<Client messages={m} />)
  choose()
  await opened()
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  const nav = screen.getByRole("navigation", { name: m.thumbnails })
  expect(within(nav).getByText("Pages 1–9 of 12")).toBeTruthy()
  await waitFor(() => expect(nav.querySelectorAll("img").length).toBe(8))
  fireEvent.click(screen.getByLabelText(m.nextThumbnails))
  expect(screen.getByText("Pages 10–12 of 12")).toBeTruthy()
  fireEvent.click(screen.getByLabelText(m.previousThumbnails))
  fireEvent.click(
    within(nav).getByRole("button", { name: "Page 2 of 12 — Unreadable page" })
  )
  await pageIs(2)
  expect(screen.getByText(m.encryptedPage)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  expect(screen.queryByRole("navigation", { name: m.thumbnails })).toBeNull()
})

test.each(["unsupportedPage", "encryptedPage", "damagedPage"] as const)(
  "keeps wholly unreadable books inspectable: %s",
  async (status) => {
    book = makeBook(1)
    book.pages[0]!.status = status
    render(<Client messages={m} />)
    choose()
    await opened()
    expect(screen.getByText(m[status])).toBeTruthy()
    expect(screen.getByText(m.noReadable)).toBeTruthy()
  }
)

test("reports empty, invalid, corrupt, protected and genuine allocation failures", async () => {
  render(<Client messages={m} />)
  choose("file.cbr")
  await screen.findByText(m.invalid)
  expect(mock.open).not.toHaveBeenCalled()
  book = makeBook(0)
  choose()
  await screen.findByText(m.empty)
  expect(book.dispose).toHaveBeenCalledOnce()
  for (const [reason, message] of [
    [new Error("directory"), m.damaged],
    [new Error("encrypted directory"), m.encrypted],
    [new RangeError("memory"), m.resourceLimit],
  ] as const) {
    mock.open.mockRejectedValueOnce(reason)
    choose(`${message}.cbz`)
    await screen.findByText(message)
  }
  book = makeBook()
  vi.mocked(book.read).mockRejectedValueOnce(new RangeError("allocation"))
  choose("huge.cbz")
  await screen.findByText(m.resourceLimit)
})

test("reports later decode and resource failures while retaining navigation", async () => {
  render(<Client messages={m} />)
  choose()
  await opened()
  mock.decode.mockRejectedValueOnce(new Error("invalid image"))
  go("2")
  await screen.findByText(m.damagedPage)
  vi.mocked(book.read).mockRejectedValueOnce(
    new RangeError("allocation failed")
  )
  go("3")
  await screen.findByText(m.resourceLimit)
  go("4")
  await waitFor(() => expect(within(canvas()).getByRole("img")).toBeTruthy())
})

test("does not impose a file-size cap", async () => {
  render(<Client messages={m} />)
  const large = new File(["zip"], "large.cbz")
  Object.defineProperty(large, "size", { value: 2 ** 32 })
  choose(large.name, large)
  await opened()
  expect(mock.open).toHaveBeenCalledWith(large, expect.any(AbortSignal))
})

test("ignores stale archive opens and releases late handles", async () => {
  let resolve!: (value: Comic) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  choose("old.cbz")
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const old = book
  book = makeBook(3)
  choose("new.cbz")
  await opened()
  await act(async () => resolve(old))
  expect(old.dispose).toHaveBeenCalledOnce()
  expect(screen.getByText("of 3")).toBeTruthy()
})

test("cancels first-page decoding and later-page decoding when closed or superseded", async () => {
  let resolve!: (value: { url: string; width: number; height: number }) => void
  mock.decode.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  render(<Client messages={m} />)
  choose()
  await waitFor(() => expect(mock.decode).toHaveBeenCalledOnce())
  fireEvent.click(screen.getByLabelText(m.clear))
  await act(async () =>
    resolve({ url: "blob:late-first", width: 1, height: 1 })
  )
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:late-first")
  book = makeBook()
  choose("again.cbz")
  await opened()
  mock.decode.mockImplementationOnce(
    () =>
      new Promise((done) => {
        resolve = done
      })
  )
  go("2")
  await waitFor(() => expect(mock.decode).toHaveBeenCalledTimes(3))
  go("3")
  await waitFor(() => expect(mock.decode).toHaveBeenCalledTimes(4))
  await act(async () => resolve({ url: "blob:late-next", width: 1, height: 1 }))
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:late-next")
  await pageIs(3)
})

test("ignores failures from cancelled page operations", async () => {
  let reject!: (reason: Error) => void
  render(<Client messages={m} />)
  choose()
  await opened()
  vi.mocked(book.read).mockImplementationOnce(
    () =>
      new Promise((_, fail) => {
        reject = fail
      })
  )
  go("2")
  await waitFor(() => expect(book.read).toHaveBeenCalledTimes(2))
  go("3")
  await act(async () => reject(new Error("cancelled")))
  await pageIs(3)
  expect(screen.queryByText(m.damagedPage)).toBeNull()
})

test("returns the strip to the selected page after browsing distant thumbnails", async () => {
  book = makeBook(30)
  render(<Client messages={m} />)
  choose()
  await opened()
  fireEvent.click(screen.getByRole("button", { name: m.thumbnails }))
  fireEvent.click(screen.getByLabelText(m.nextThumbnails))
  fireEvent.click(screen.getByLabelText(m.nextThumbnails))
  expect(screen.getByText("Pages 19–27 of 30")).toBeTruthy()
  fireEvent.click(screen.getByLabelText(m.next))
  await pageIs(2)
  expect(screen.getByText("Pages 1–9 of 30")).toBeTruthy()
  expect(
    screen
      .getByRole("button", { name: "Page 2 of 30" })
      .getAttribute("aria-current")
  ).toBe("page")
  fireEvent.click(screen.getByLabelText(m.zoomIn))
  expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("26")
  fireEvent.click(screen.getByLabelText(m.zoomOut))
  expect((screen.getByLabelText(m.zoom) as HTMLInputElement).value).toBe("25")
})
