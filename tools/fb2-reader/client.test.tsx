// @vitest-environment jsdom
import {
  cleanup,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import Client from "./client"
import m from "./messages/en.json"
import type { OpenBook } from "./types"

const mock = vi.hoisted(() => ({ open: vi.fn() }))
vi.mock("./open-book", () => ({ openBook: mock.open }))

function book(title = "Local reading") {
  const result: OpenBook = {
    title,
    author: "A. Reader",
    cover: null,
    missing: false,
    dispose: vi.fn(),
    parsed: {
      sections: [0, 1, 2].map((index) => ({
        id: `chapter${index}.xhtml`,
        linear: index === 1 ? "no" : "yes",
        load: vi.fn(async () => `blob:chapter${index}`),
        unload: vi.fn(),
        resolveHref: (href) => href,
      })),
      toc: [
        {
          label: "Beginning",
          href: "chapter0.xhtml",
          subitems: [{ label: "Notes", href: "chapter1.xhtml" }],
        },
        { label: "Ending", href: "chapter2.xhtml" },
      ],
      resolveHref: (href) => ({
        index: Number(/chapter(\d)/.exec(href)?.[1] ?? -1),
      }),
    },
  }
  return result
}
function choose(name = "reading.fb2") {
  fireEvent.change(screen.getByLabelText(m.open), {
    target: { files: [new File(["FB2"], name)] },
  })
}
beforeEach(() => {
  vi.clearAllMocks()
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
  vi.stubGlobal(
    "fetch",
    vi.fn(
      async () =>
        new Response(
          '<html><head><title>Book</title></head><body><h1>Reading</h1><p>Local chapter.</p><a href="chapter2.xhtml">Continue</a></body></html>'
        )
    )
  )
  mock.open.mockResolvedValue(book())
})
afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("opens a local book, navigates the reading order, and changes reading settings", async () => {
  render(<Client messages={m} />)
  expect(screen.getByText(m.drop)).toBeTruthy()
  choose()
  await screen.findByTitle(m.reader)
  expect(screen.getByRole("heading", { name: "Local reading" })).toBeTruthy()
  expect(screen.getByText("A. Reader")).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "3"
    )
  )
  expect(
    (screen.getByRole("button", { name: m.next }) as HTMLButtonElement).disabled
  ).toBe(true)
  fireEvent.click(screen.getByRole("button", { name: m.previous }))
  await screen.findByTitle(m.reader)
  fireEvent.click(screen.getByRole("button", { name: m.largerText }))
  expect(screen.getByLabelText(m.textSize).textContent).toBe("111%")
  fireEvent.click(screen.getByRole("button", { name: m.smallerText }))
  expect(screen.getByLabelText(m.textSize).textContent).toBe("100%")
  fireEvent.click(screen.getByRole("button", { name: m.readingWidth }))
  expect(
    screen
      .getByRole("button", { name: m.readingWidth })
      .getAttribute("aria-pressed")
  ).toBe("true")
  fireEvent.click(screen.getByRole("button", { name: m.contents }))
  expect(screen.getByRole("navigation", { name: m.contents })).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: "Notes" }))
  await screen.findByTitle(m.reader)
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "2"
    )
  )
  expect(document.activeElement).toBe(
    screen.getByRole("button", { name: m.contents })
  )
  fireEvent.click(screen.getByRole("button", { name: m.contents }))
  fireEvent.keyDown(screen.getByRole("navigation", { name: m.contents }), {
    key: "Escape",
  })
  expect(screen.queryByRole("navigation")).toBeNull()
  fireEvent.change(screen.getByLabelText(m.chapter), { target: { value: "3" } })
  fireEvent.keyDown(screen.getByLabelText(m.chapter), { key: "Enter" })
  await screen.findByTitle(m.reader)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(mock.open.mock.calls[0]![1].aborted).toBe(true)
})

test.each([
  "protected",
  "unsupported",
  "encoding",
  "ambiguous",
  "noBook",
  "empty",
  "resourceLimit",
] as const)("explains %s without exposing parser details", async (key) => {
  mock.open.mockRejectedValueOnce(new Error(key))
  render(<Client messages={m} />)
  choose()
  expect(await screen.findByText(m[key])).toBeTruthy()
  expect(screen.queryByTitle(m.reader)).toBeNull()
})

test("reports allocation failures and invalid files", async () => {
  mock.open.mockRejectedValueOnce(new RangeError("private allocation detail"))
  render(<Client messages={m} />)
  choose()
  expect(await screen.findByText(m.resourceLimit)).toBeTruthy()
  mock.open.mockRejectedValueOnce(new Error("private parser detail"))
  choose("broken.fb2")
  expect(await screen.findByText(m.invalid)).toBeTruthy()
  expect(screen.queryByText("private parser detail")).toBeNull()
})

test("releases late results and ignores stale failures when replacing files", async () => {
  let finish!: (result: OpenBook) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve
      })
  )
  render(<Client messages={m} />)
  choose("old.epub")
  await waitFor(() => expect(mock.open).toHaveBeenCalledOnce())
  const oldSignal = mock.open.mock.calls[0]![1]
  choose("new.epub")
  await screen.findByTitle(m.reader)
  const old = book("Old book")
  finish(old)
  await waitFor(() => expect(old.dispose).toHaveBeenCalledOnce())
  expect(oldSignal.aborted).toBe(true)
  expect(screen.queryByText("Old book")).toBeNull()
  let reject!: (reason: unknown) => void
  mock.open.mockImplementationOnce(
    () =>
      new Promise((_resolve, fail) => {
        reject = fail
      })
  )
  choose("slow.epub")
  await waitFor(() => expect(mock.open).toHaveBeenCalledTimes(3))
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  reject(new Error("stale"))
  await waitFor(() => expect(screen.queryByRole("alert")).toBeNull())
})

test("keeps a failed chapter navigable and reports missing cover/resources", async () => {
  const opened = book()
  opened.cover = "blob:cover"
  opened.parsed.sections[0]!.load = async () => null
  opened.parsed.toc = undefined
  mock.open.mockResolvedValue(opened)
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.chapterError)
  fireEvent.error(screen.getByAltText(m.cover))
  expect(screen.getByText(m.missingContent)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.contents }))
  fireEvent.click(screen.getByRole("button", { name: "Section 3" }))
  await screen.findByTitle(m.reader)
  fireEvent.click(screen.getByRole("button", { name: m.clear }))
  expect(opened.dispose).toHaveBeenCalledOnce()
})

test("does not let an unfinished chapter overwrite the next chapter", async () => {
  const opened = book()
  let finish!: (url: string) => void
  opened.parsed.sections[0]!.load = vi.fn(
    () =>
      new Promise<string>((resolve) => {
        finish = resolve
      })
  )
  mock.open.mockResolvedValue(opened)
  render(<Client messages={m} />)
  choose()
  await waitFor(() =>
    expect(opened.parsed.sections[0]!.load).toHaveBeenCalledOnce()
  )
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  finish("blob:old")
  await screen.findByTitle(m.reader)
  expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe("3")
  expect(opened.parsed.sections[0]!.unload).toHaveBeenCalledOnce()
  expect(opened.parsed.sections[2]!.load).toHaveBeenCalledOnce()
})

test("explains an allocation failure while opening a chapter", async () => {
  const opened = book()
  opened.parsed.sections[0]!.load = async () => {
    throw new RangeError("unable to allocate chapter")
  }
  mock.open.mockResolvedValue(opened)
  render(<Client messages={m} />)
  choose()
  await screen.findByText(m.resourceLimit)
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await screen.findByTitle(m.reader)
  expect(screen.queryByText(m.resourceLimit)).toBeNull()
})

test("handles reading-frame links only after a deliberate click", async () => {
  const opened = book()
  opened.missing = true
  mock.open.mockResolvedValue(opened)
  const external = vi.spyOn(window, "open").mockImplementation(() => null)
  render(<Client messages={m} />)
  choose()
  const frame = (await screen.findByTitle(m.reader)) as HTMLIFrameElement
  const doc = frame.contentDocument!
  doc.defaultView!.scrollTo = vi.fn()
  doc.defaultView!.scrollBy = vi.fn()
  doc.body.innerHTML =
    '<p>Reading text</p><a role="link" tabindex="0" data-epub-href="https://example.org/book">Web</a><a role="link" tabindex="0" data-epub-href="missing.xhtml">Unavailable</a><a role="link" tabindex="0" data-epub-href="chapter2.xhtml">Next</a>'
  fireEvent.load(frame)
  await waitFor(() => expect(doc.documentElement.style.fontSize).toBe("18px"))
  expect(external).not.toHaveBeenCalled()
  fireEvent.click(doc.querySelector("a")!)
  expect(external).toHaveBeenCalledWith(
    "https://example.org/book",
    "_blank",
    "noopener,noreferrer"
  )
  fireEvent.keyDown(doc.querySelector("a")!, { key: "Enter" })
  expect(external).toHaveBeenCalledTimes(2)
  fireEvent.click(doc.querySelectorAll("a")[1]!)
  expect(await screen.findByText(m.blockedLink)).toBeTruthy()
  fireEvent.click(screen.getByRole("button", { name: m.largerText }))
  expect(Number(doc.documentElement.style.zoom)).toBeCloseTo(20 / 18)
  fireEvent.click(screen.getByRole("button", { name: m.readingWidth }))
  expect(doc.body.style.maxWidth).toBe("100ch")
  fireEvent.click(doc.querySelectorAll("a")[2]!)
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "3"
    )
  )
  expect(screen.queryByText(m.blockedLink)).toBeNull()
  external.mockRestore()
})

test("ignores a delayed internal destination after a newer chapter choice", async () => {
  const opened = book()
  let finish!: (value: { index: number }) => void
  opened.parsed.resolveHref = () =>
    new Promise((resolve) => {
      finish = resolve
    })
  mock.open.mockResolvedValue(opened)
  render(<Client messages={m} />)
  choose()
  await screen.findByTitle(m.reader)
  fireEvent.click(screen.getByRole("button", { name: m.contents }))
  fireEvent.click(screen.getByRole("button", { name: "Notes" }))
  fireEvent.click(screen.getByRole("button", { name: m.next }))
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "3"
    )
  )
  finish({ index: 1 })
  await new Promise((resolve) => setTimeout(resolve, 0))
  expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe("3")
})

test("returns from an internal reference to the source section and shows optional description", async () => {
  const opened = book()
  opened.description = "An original local publication."
  mock.open.mockResolvedValue(opened)
  render(<Client messages={m} />)
  choose()
  expect(await screen.findByText(m.description)).toBeTruthy()
  const frame = (await screen.findByTitle(m.reader)) as HTMLIFrameElement
  const doc = frame.contentDocument!
  doc.defaultView!.scrollTo = vi.fn()
  doc.defaultView!.scrollBy = vi.fn()
  doc.body.innerHTML =
    '<p>Reading text</p><a data-epub-href="chapter1.xhtml">Note</a>'
  fireEvent.load(frame)
  await waitFor(() => expect(doc.documentElement.style.fontSize).toBe("18px"))
  fireEvent.click(doc.querySelector("a")!)
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "2"
    )
  )
  fireEvent.click(screen.getByRole("button", { name: m.returnToText }))
  await waitFor(() =>
    expect((screen.getByLabelText(m.chapter) as HTMLInputElement).value).toBe(
      "1"
    )
  )
  expect(screen.queryByRole("button", { name: m.returnToText })).toBeNull()
})

test("reports parser stack failures as damaged content rather than a memory allocation failure", async () => {
  mock.open.mockRejectedValueOnce(
    new RangeError("Maximum call stack size exceeded")
  )
  render(<Client messages={m} />)
  choose()
  expect(await screen.findByText(m.invalid)).toBeTruthy()
})

test("reports artwork that fails after a reading chapter has loaded", async () => {
  render(<Client messages={m} />)
  choose()
  const frame = (await screen.findByTitle(m.reader)) as HTMLIFrameElement
  const doc = frame.contentDocument!
  doc.defaultView!.scrollTo = vi.fn()
  doc.body.innerHTML =
    '<p>Text survives.</p><img src="data:image/png;base64,AA==" />'
  fireEvent.load(frame)
  fireEvent.error(doc.querySelector("img")!)
  expect(await screen.findByText(m.missingContent)).toBeTruthy()
})

test("keeps intentionally removed remote images classified as limited content", async () => {
  vi.mocked(fetch).mockResolvedValueOnce(
    new Response(
      '<html><body><p>Readable text</p><img src="https://example.org/remote.png"/></body></html>'
    )
  )
  render(<Client messages={m} />)
  choose()
  const frame = (await screen.findByTitle(m.reader)) as HTMLIFrameElement
  const doc = frame.contentDocument!
  doc.defaultView!.scrollTo = vi.fn()
  doc.body.innerHTML = "<p>Readable text</p><img />"
  fireEvent.load(frame)
  fireEvent.error(doc.querySelector("img")!)
  expect(await screen.findByText(m.limitedContent)).toBeTruthy()
  expect(screen.queryByText(m.missingContent)).toBeNull()
})
