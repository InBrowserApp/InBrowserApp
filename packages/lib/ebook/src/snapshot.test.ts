// @vitest-environment jsdom
import { Blob as NodeBlob, File as NodeFile } from "node:buffer"
import { URL as NodeURL } from "node:url"
import { readFile } from "node:fs/promises"
import { beforeEach, afterEach, expect, test, vi } from "vitest"
import { snapshotBook, openEbook } from "./index"
import type { ReadingBook } from "./types"
const mock = vi.hoisted(() => ({ readableImage: vi.fn() }))
vi.mock("@workspace/web-document", async (original) => ({
  ...(await original<object>()),
  readableImage: mock.readableImage,
}))
const urls: string[] = []
const m = { chapter: "Chapter", imageUnavailable: "Unavailable image" }
const signal = () => new AbortController().signal
beforeEach(() => {
  vi.stubGlobal("CSS", {
    escape: (value: string) =>
      value.replace(/[^a-zA-Z0-9_-]/g, (character) => "\\" + character),
  })
  mock.readableImage.mockReset().mockResolvedValue(true)
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("File", NodeFile)
  vi.stubGlobal("URL", NodeURL)
})
afterEach(() => {
  for (const url of urls.splice(0)) URL.revokeObjectURL(url)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})
function section(id: string, html: string, extra = {}) {
  const url = URL.createObjectURL(new Blob([html]))
  urls.push(url)
  return { id, load: vi.fn().mockResolvedValue(url), ...extra }
}
function book(sections: ReadingBook["parsed"]["sections"]): ReadingBook {
  return {
    title: "Reading",
    author: "Author",
    cover: null,
    missing: false,
    dispose: vi.fn(),
    parsed: {
      sections,
      resolveHref: (href) => {
        const [name, id] = href.split("#")
        const index = sections.findIndex((s) => s.id === name)
        return index < 0
          ? null
          : { index, anchor: id ? (doc) => doc.getElementById(id) : undefined }
      },
    },
  }
}
test("preserves main reading order and supporting notes while skipping navigation and duplicate spine entries", async () => {
  const a = section(
    "a",
    '<html lang="ar" dir="rtl"><head><title>Book</title><style>body{background:url(https://tracker.test)}</style></head><body><h1 id="same">الفصل</h1><p><a href="notes#same">Footnote</a> <a href="#same">Back</a><a href="b">Next</a><a href="absent#x">Lost</a><a href="https://example.com/">Visit</a></p><script>bad()</script><form>Hidden controls</form><img src="https://tracker.test/pixel"><span data-web-link="javascript:bad()">Text</span></body></html>'
  )
  const nav = section("nav", "Navigation document", { navigation: true })
  const notes = section(
    "notes",
    '<h2 id="same">Notes</h2><p>Footnote text <a href="a#same">Return</a></p>',
    { linear: "no" }
  )
  const b = section("b", "<p>Final reading paragraph</p><math>x+y</math>")
  const result = await snapshotBook(book([a, nav, notes, a, b]), signal(), m)
  expect(result.chapters.map((c) => c.title)).toEqual([
    "الفصل",
    "Chapter 3",
    "Notes",
  ])
  expect(a.load).toHaveBeenCalledOnce()
  expect(nav.load).not.toHaveBeenCalled()
  expect(result.missing).toBe(true)
  expect(result.unresolved).toBe(true)
  const doc = document.implementation.createHTMLDocument("")
  doc.body.innerHTML = result.chapters
    .map((c) => `<section id="${c.id}">${c.html}</section>`)
    .join("")
  expect(
    doc.querySelector("script,style,form,[data-web-link],img[src]")
  ).toBeNull()
  expect(doc.querySelector('[lang="ar"][dir="rtl"]')).not.toBeNull()
  expect(doc.body.textContent).toContain("Unavailable image")
  expect(doc.body.textContent).toContain("x+y")
  for (const a of doc.querySelectorAll('a[href^="#"]'))
    expect(doc.getElementById(a.getAttribute("href")!.slice(1))).not.toBeNull()
  expect(
    doc.querySelector('a[href="https://example.com/"]')!.getAttribute("rel")
  ).toBe("noopener noreferrer")
})
test("never fetches a remote chapter or offers shortened output for missing required content", async () => {
  for (const load of [
    vi.fn().mockResolvedValue(null),
    vi.fn().mockResolvedValue("https://example.com/book"),
    vi.fn().mockRejectedValue(new Error("corrupt")),
  ]) {
    const b = book([{ id: "a", load }])
    await expect(snapshotBook(b, signal(), m)).rejects.toThrow("incomplete")
  }
  await expect(
    snapshotBook({ ...book([]), incomplete: true }, signal(), m)
  ).rejects.toThrow("incomplete")
  await expect(snapshotBook(book([]), signal(), m)).rejects.toThrow("empty")
  await expect(
    snapshotBook(book([section("a", "")]), signal(), m)
  ).rejects.toThrow("incomplete")
  await expect(
    snapshotBook(
      book([
        {
          id: "a",
          load: async () => {
            throw new RangeError("allocation")
          },
        },
      ]),
      signal(),
      m
    )
  ).rejects.toThrow(RangeError)
  const controller = new AbortController()
  controller.abort()
  await expect(
    snapshotBook(book([]), controller.signal, m)
  ).rejects.toMatchObject({ name: "AbortError" })
})
test.each([
  ["mobi", "source.epub"],
  ["mobi", "reading-mobi6.mobi"],
  ["mobi", "reading-kf8.azw3"],
  ["mobi", "reading-combo.mobi"],
  ["fb2", "reading.fb2"],
  ["fb2", "reading.fbz"],
  ["fb2", "utf16be.fb2"],
])(
  "exports genuine %s/%s with resolvable references and embedded images",
  async (format, name) => {
    const file = new File(
      [await readFile(`tools/${format}-reader/fixtures/${name}`)],
      name
    )
    const b = await openEbook(file, signal())
    try {
      const result = await snapshotBook(b, signal(), m)
      expect(result.chapters.length).toBeGreaterThan(1)
      expect(result.unresolved).toBe(false)
      expect(result.missing).toBe(false)
      const html = result.chapters.map((c) => c.html).join("")
      expect(html).toContain("data:image/")
      expect(html).not.toMatch(/(?:href|src)="(?:blob:|filepos:|kindle:)/)
      expect(result.cover).toMatch(/^data:image\//)
    } finally {
      b.dispose()
    }
  }
)
test("rejects unrelated inputs and already-cancelled opening", async () => {
  await expect(openEbook(new File(["x"], "x.txt"), signal())).rejects.toThrow(
    "unsupported"
  )
  const c = new AbortController()
  c.abort()
  await expect(
    openEbook(new File(["x"], "x.epub"), c.signal)
  ).rejects.toMatchObject({ name: "AbortError" })
})

test("includes non-spine EPUB footnotes only for export and rewrites duplicate publisher IDs", async () => {
  const file = new File(
    [await readFile("tools/ebook-text-html-export/fixtures/reading.epub")],
    "reading.epub"
  )
  const { openBook } = await import("./epub/open-book")
  const reader = await openBook(file, signal())
  expect(reader.parsed.sections).toHaveLength(4)
  reader.dispose()
  const opened = await openEbook(file, signal())
  try {
    const snapshot = await snapshotBook(opened, signal(), m)
    expect(snapshot.chapters).toHaveLength(3)
    expect(snapshot.chapters[2]!.supporting).toBe(true)
    expect(snapshot.unresolved).toBe(false)
    const html = snapshot.chapters.map((chapter) => chapter.html).join("")
    expect(html.match(/Paragraph αβγ/g)).toHaveLength(1)
    expect(html.match(/Footnote body preserved once/g)).toHaveLength(1)
    expect(html).toContain('dir="rtl"')
  } finally {
    opened.dispose()
  }
})

test("omits empty pagebreak sections and uses contents labels for books without semantic headings", async () => {
  const b = book([
    section("one", "<p>Actual chapter text</p>"),
    section("blank", "<html><body><p> </p></body></html>"),
  ])
  b.parsed.toc = [{ label: "Named chapter", href: "one" }]
  const result = await snapshotBook(b, signal(), m)
  expect(result.chapters).toHaveLength(1)
  expect(result.chapters[0]!.title).toBe("Named chapter")
  await expect(
    snapshotBook(
      book([section("blank", "<html><body></body></html>")]),
      signal(),
      m
    )
  ).rejects.toThrow("empty")
})

test("retains nested navigation targets after rewriting publisher IDs", async () => {
  const b = book([
    section(
      "a",
      '<h1 id="start">Start</h1><h2 id="inside">Nested</h2><p>Content</p>'
    ),
  ])
  b.parsed.toc = [
    {
      label: "Start",
      href: "a#start",
      subitems: [{ label: "Nested", href: "a#inside" }],
    },
  ]
  const result = await snapshotBook(b, signal(), m)
  expect(result.contents?.[0]?.label).toBe("Start")
  expect(result.contents?.[0]?.subitems?.[0]?.label).toBe("Nested")
  const doc = document.implementation.createHTMLDocument("")
  doc.body.innerHTML = result.chapters[0]!.html
  expect(
    doc.getElementById(result.contents![0]!.subitems![0]!.href.slice(1))!
      .textContent
  ).toBe("Nested")
})
