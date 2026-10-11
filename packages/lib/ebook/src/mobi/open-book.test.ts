// @vitest-environment jsdom
import { File as NodeFile, Blob as NodeBlob } from "node:buffer"
import { readFile } from "node:fs/promises"
import { URL as NodeURL } from "node:url"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openBook } from "./open-book"

const blobs = new Map<string, Blob>()
const opened: (() => void)[] = []
async function fixture(name = "reading-mobi6.mobi", rename = name) {
  return new File(
    [await readFile(`tools/mobi-reader/fixtures/${name}`)],
    rename
  )
}
beforeEach(() => {
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("File", NodeFile)
  vi.stubGlobal("URL", NodeURL)
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    const url = `blob:mobi-${++id}`
    blobs.set(url, blob as Blob)
    return url
  })
  vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
    blobs.delete(url)
  })
  vi.stubGlobal("CSS", {
    escape: (value: string) => value.replace(/[^\w-]/g, "\\$&"),
  })
})
afterEach(() => {
  for (const close of opened.splice(0)) close()
  blobs.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test.each(["reading-mobi6.mobi", "reading-kf8.azw3", "reading-combo.mobi"])(
  "opens genuine %s with local chapters and engine-owned resource lifetimes",
  async (name) => {
    const controller = new AbortController()
    const book = await openBook(await fixture(name), controller.signal)
    opened.push(book.dispose)
    expect(book.title).toBe("Field Notes on Quiet Places")
    expect(book.author).toBeTruthy()
    expect(book.cover).toMatch(/^blob:/)
    expect(book.parsed.sections.length).toBeGreaterThan(2)
    let html = ""
    for (const section of book.parsed.sections) {
      const url = await section.load()
      html += await blobs.get(url!)!.text()
      expect(await section.load()).toBe(url)
    }
    expect(html).toContain("A slower kind of looking")
    expect(html).toContain("Where the water turns")
    expect(html).toMatch(/src="blob:/)
    const toc = book.parsed.toc!
    expect(toc.length).toBeGreaterThan(0)
    const destination = await book.parsed.resolveHref(toc[0]!.href)
    expect(destination?.index).toBeGreaterThanOrEqual(0)
    const chapter = await book.parsed.sections[destination!.index]!.load()
    const doc = new DOMParser().parseFromString(
      await blobs.get(chapter!)!.text(),
      "text/html"
    )
    expect(() => destination?.anchor?.(doc)).not.toThrow()
    expect(await book.parsed.resolveHref("section:1")).toEqual({ index: 1 })
    expect(await book.parsed.resolveHref("javascript:alert(1)")).toBeNull()
    controller.abort()
    book.dispose()
    expect(blobs.size).toBe(0)
    await expect(book.parsed.sections[0]!.load()).rejects.toThrow("closed")
  }
)

test.each(["BOOK.AZW", "BOOK.PRC", "BOOK.MOBI"])(
  "recognizes the MOBI container with filename alias %s",
  async (name) => {
    const book = await openBook(
      await fixture("reading-mobi6.mobi", name),
      new AbortController().signal
    )
    opened.push(book.dispose)
    expect(book.title).toBeTruthy()
  }
)

test("rejects unrelated filenames, empty files, and cancellation before engine loading", async () => {
  await expect(
    openBook(new File(["x"], "book.kfx"), new AbortController().signal)
  ).rejects.toThrow("unsupportedVariant")
  await expect(
    openBook(new File([], "book.mobi"), new AbortController().signal)
  ).rejects.toThrow("invalid")
  const controller = new AbortController()
  controller.abort()
  await expect(openBook(await fixture(), controller.signal)).rejects.toThrow(
    "aborted"
  )
})

test("resolves first-chapter MOBI6 footnotes after the guide's early text read", async () => {
  const book = await openBook(await fixture(), new AbortController().signal)
  opened.push(book.dispose)
  const url = await book.parsed.sections[0]!.load()
  const doc = new DOMParser().parseFromString(
    await blobs.get(url!)!.text(),
    "text/html"
  )
  const note = Array.from(doc.querySelectorAll("a")).find(
    (a) => a.textContent === "[1]"
  )!
  const destination = await book.parsed.resolveHref(note.getAttribute("href")!)
  expect(destination?.index).toBe(0)
  expect(destination?.anchor?.(doc)).not.toBeNull()
})
