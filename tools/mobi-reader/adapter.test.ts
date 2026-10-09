// @vitest-environment jsdom
import { File as NodeFile } from "node:buffer"
import { readFile } from "node:fs/promises"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openBook } from "./open-book"
import type { MobiBook } from "./types"

const mock = vi.hoisted(() => ({ open: vi.fn() }))
vi.mock("foliate-js/mobi.js", () => ({
  MOBI: class {
    open = mock.open
  },
}))
let file: File
let engine: MobiBook
beforeEach(async () => {
  vi.stubGlobal("File", NodeFile)
  file = new File(
    [await readFile("tools/mobi-reader/fixtures/reading-kf8.azw3")],
    "sample.AZW3"
  )
  engine = {
    sections: [
      { load: async () => "blob:one" },
      { linear: "no" },
      { load: async () => "blob:three" },
    ],
    metadata: {},
    getCover: async () => undefined,
    resolveHref: async () => ({ index: 2, anchor: () => null }),
    destroy: vi.fn(),
  }
  mock.open.mockResolvedValue(engine)
  vi.stubGlobal("URL", {
    createObjectURL: vi.fn(() => "blob:cover"),
    revokeObjectURL: vi.fn(),
  })
})
afterEach(() => {
  vi.clearAllMocks()
  vi.unstubAllGlobals()
})

test("maps available sections and async internal destinations without exposing placeholder chapters", async () => {
  const book = await openBook(file, new AbortController().signal)
  expect(book.title).toBe(file.name)
  expect(book.author).toBe("")
  expect(book.missing).toBe(false)
  expect(book.parsed.sections).toHaveLength(2)
  expect(
    (await book.parsed.resolveHref("kindle:pos:fid:0002:off:0000000000"))?.index
  ).toBe(1)
  engine.resolveHref = async () => ({ index: 1 })
  expect(await book.parsed.resolveHref("filepos:3")).toBeNull()
  engine.resolveHref = async () => undefined
  expect(await book.parsed.resolveHref("filepos:4")).toBeNull()
  book.dispose()
  await expect(book.parsed.sections[0]!.load()).rejects.toThrow("closed")
})

test("reports unreadable content separately from intentional KF8 placeholders", async () => {
  engine.sections.push({})
  const book = await openBook(file, new AbortController().signal)
  expect(book.missing).toBe(true)
  expect(book.parsed.sections).toHaveLength(2)
  book.dispose()
})

test("preserves readable text when a cover fails and reports the missing resource", async () => {
  engine.sections = [engine.sections[0]!]
  engine.getCover = async () => {
    throw new Error("missing image")
  }
  const book = await openBook(file, new AbortController().signal)
  expect(book.missing).toBe(true)
  expect(await book.parsed.sections[0]!.load()).toBe("blob:one")
  book.dispose()
})

test("cleans URLs created by an in-flight chapter after close", async () => {
  let finish!: (value: string) => void
  engine.sections[0]!.load = () =>
    new Promise((resolve) => {
      finish = resolve
    })
  engine.getCover = async () => new Blob(["image"])
  const book = await openBook(file, new AbortController().signal)
  const loading = book.parsed.sections[0]!.load()
  await Promise.resolve()
  book.dispose()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cover")
  finish("blob:late")
  await loading
  expect(engine.destroy).toHaveBeenCalledTimes(2)
})

test("cleans results from cancelled opens, including a cover loaded after cancellation", async () => {
  const controller = new AbortController()
  engine.getCover = async () => {
    controller.abort()
    return new Blob(["image"])
  }
  await expect(openBook(file, controller.signal)).rejects.toThrow("aborted")
  expect(engine.destroy).toHaveBeenCalledOnce()
  expect(URL.revokeObjectURL).toHaveBeenCalledWith("blob:cover")
})

test.each(["empty", "unsupportedLayout"])(
  "rejects %s engine results",
  async (error) => {
    if (error === "empty") engine.sections = [{ linear: "no" }]
    else engine.rendition = { layout: "pre-paginated" }
    await expect(openBook(file, new AbortController().signal)).rejects.toThrow(
      error
    )
    expect(engine.destroy).toHaveBeenCalledOnce()
  }
)

test("reports record corruption separately from allocation exhaustion", async () => {
  mock.open.mockRejectedValueOnce(new RangeError("Record index out of bounds"))
  await expect(openBook(file, new AbortController().signal)).rejects.toThrow(
    "invalid"
  )
  mock.open.mockRejectedValueOnce(
    new RangeError("Array buffer allocation failed")
  )
  await expect(openBook(file, new AbortController().signal)).rejects.toThrow(
    "allocation"
  )
})

test("keeps a damaged chapter distinct from exhausted browser resources", async () => {
  engine.sections[0]!.load = async () => {
    throw new RangeError("Offset outside DataView bounds")
  }
  const book = await openBook(file, new AbortController().signal)
  await expect(book.parsed.sections[0]!.load()).rejects.toThrow("invalid")
  book.dispose()
})

test("serializes KF8 destination resolution with chapter reads and recovers after a failure", async () => {
  let finish!: (value: string) => void
  engine.sections[0]!.load = vi.fn(
    () =>
      new Promise<string>((resolve) => {
        finish = resolve
      })
  )
  engine.resolveHref = vi.fn(async () => ({ index: 2 }))
  const book = await openBook(file, new AbortController().signal)
  const loading = book.parsed.sections[0]!.load()
  await Promise.resolve()
  const navigation = book.parsed.resolveHref(
    "kindle:pos:fid:0002:off:0000000000"
  )
  await Promise.resolve()
  expect(engine.resolveHref).not.toHaveBeenCalled()
  finish("blob:chapter")
  await loading
  expect(await navigation).toEqual({ index: 1 })
  engine.sections[0]!.load = async () => {
    throw new Error("damaged")
  }
  await expect(book.parsed.sections[0]!.load()).rejects.toThrow("damaged")
  expect(await book.parsed.sections[1]!.load()).toBe("blob:three")
  book.dispose()
})
