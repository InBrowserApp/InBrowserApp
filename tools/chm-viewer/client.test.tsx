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
import type { Book } from "./book"

const loaders = vi.hoisted(() => ({ openBook: vi.fn(), loadSample: vi.fn() }))
vi.mock("./book", () => ({ openBook: loaders.openBook }))
vi.mock("./sample", () => ({ loadSample: loaders.loadSample }))

function example() {
  const home = { path: "/home.htm" }
  const next = { path: "/next.htm" }
  const book: Book = {
    home,
    contents: [
      { title: "Overview", destination: home, children: [] },
      {
        title: "Manual",
        children: [{ title: "Preferences", destination: next, children: [] }],
      },
    ],
    topics: [],
    lookupTopic: (path) => path,
    readTopic: vi.fn(async (path) => ({
      html: "<p>Example topic</p>",
      title: path === home.path ? "Overview" : "Preferences",
      dispose: vi.fn(),
    })),
    close: vi.fn(),
  }
  return book
}

function choose(file: File) {
  fireEvent.change(screen.getByLabelText(m.open), { target: { files: [file] } })
}

function press(name: string) {
  fireEvent.click(screen.getByRole("button", { name }))
}

beforeEach(() => {
  vi.resetAllMocks()
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockReturnValue({
      matches: true,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })
  )
  vi.stubGlobal(
    "ResizeObserver",
    class {
      observe() {}
      disconnect() {}
    }
  )
})

afterEach(() => {
  cleanup()
  vi.unstubAllGlobals()
})

test("filters nested topics and navigates back and forward in order", async () => {
  const book = example()
  loaders.openBook.mockResolvedValue(book)
  render(<Client lang="en" messages={m} />)

  choose(new File(["CHM"], "manual.chm"))
  await screen.findByTitle("Overview")
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "xyz" } })
  expect(screen.getByText(m.noMatches)).toBeTruthy()
  fireEvent.change(screen.getByRole("searchbox"), { target: { value: "pref" } })
  press("Preferences")
  await screen.findByTitle("Preferences")
  press(m.back)
  await screen.findByTitle("Overview")
  press(m.forward)
  await screen.findByTitle("Preferences")
  press(m.clear)
  expect(screen.getByText(m.drop)).toBeTruthy()
  expect(book.close).toHaveBeenCalled()
})

test("recovers when the sample fails and when an invalid local file is replaced", async () => {
  const book = example()
  loaders.loadSample.mockRejectedValueOnce(new Error("Unavailable"))
  loaders.loadSample.mockResolvedValue(new File(["CHM"], "putty.chm"))
  loaders.openBook.mockRejectedValueOnce(new Error("Invalid"))
  loaders.openBook.mockResolvedValue(book)
  render(<Client lang="en" messages={m} />)

  press(m.sample)
  await screen.findByText(m.sampleError)
  press(m.sample)
  await screen.findByText(m.invalid)
  choose(new File(["CHM"], "manual.chm"))
  await screen.findByTitle("Overview")
})

test("closes a session that resolves after the user opens another file", async () => {
  const stale = example()
  const current = example()
  let finish!: (book: Book) => void
  loaders.openBook.mockReturnValueOnce(
    new Promise((resolve) => {
      finish = resolve
    })
  )
  loaders.openBook.mockResolvedValue(current)
  render(<Client lang="en" messages={m} />)

  choose(new File(["CHM"], "first.chm"))
  await waitFor(() => expect(loaders.openBook).toHaveBeenCalledTimes(1))
  choose(new File(["CHM"], "second.chm"))
  await screen.findByTitle("Overview")
  finish(stale)
  await waitFor(() => expect(stale.close).toHaveBeenCalled())
  expect(current.close).not.toHaveBeenCalled()
})
