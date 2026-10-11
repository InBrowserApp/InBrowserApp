// @vitest-environment jsdom
import { BlobReader, TextWriter, ZipReader } from "@zip.js/zip.js"
import { expect, test, vi } from "vitest"
import type { BookSnapshot } from "../types"
import { writeEpub } from "./index"

const m = { contents: "Contents", cover: "Cover" }
const png = "data:image/png;base64,iVBORw0KGgo="
function sample(): BookSnapshot {
  return {
    contents: [
      {
        label: "Start",
        href: "#chapter-1",
        subitems: [{ label: "Nested note", href: "#note" }],
      },
    ],
    title: "世界 & <Book>",
    author: "A & B",
    language: "zh_CN",
    description: "Readable notes",
    cover: png,
    missing: false,
    unresolved: false,
    chapters: [
      {
        id: "chapter-1",
        title: "开始",
        supporting: false,
        html: `<h1>开始</h1><p id="back">Read <a href="#note">note</a> <a href="https://example.com/">link</a></p><img src="${png}"><font color="red"><b>Old font</b></font>`,
      },
      {
        id: "notes",
        title: "Notes",
        supporting: true,
        html: '<p id="note">Note 世界 <a href="#back">return</a></p>',
      },
    ],
  }
}
async function contents(file: Blob) {
  const reader = new ZipReader(new BlobReader(file))
  try {
    const result = new Map<string, string>()
    for (const entry of await reader.getEntries())
      if (!entry.directory && !entry.filename.startsWith("EPUB/images/"))
        result.set(entry.filename, await entry.getData(new TextWriter()))
    return result
  } finally {
    await reader.close()
  }
}
function xml(text: string) {
  const doc = new DOMParser().parseFromString(text, "application/xml")
  expect(doc.querySelector("parsererror")).toBeNull()
  return doc
}
test("creates an OCF archive with complete metadata, deduplicated assets and usable chapter links", async () => {
  const file = await writeEpub(sample(), new AbortController().signal, m)
  expect(file.type).toBe("application/epub+zip")
  const bytes = new Uint8Array(await file.arrayBuffer())
  const header = new DataView(bytes.buffer)
  expect(header.getUint32(0, true)).toBe(0x04034b50)
  expect(header.getUint16(8, true)).toBe(0) // stored mimetype, first entry
  expect(header.getUint16(28, true)).toBe(0) // no extra fields
  expect(new TextDecoder().decode(bytes.slice(30, 38))).toBe("mimetype")
  expect(new TextDecoder().decode(bytes.slice(38, 58))).toBe(
    "application/epub+zip"
  )
  const files = await contents(file)
  const opf = xml(files.get("EPUB/package.opf")!)
  expect(opf.getElementsByTagNameNS("*", "title")[0]!.textContent).toBe(
    "世界 & <Book>"
  )
  expect(opf.getElementsByTagNameNS("*", "creator")[0]!.textContent).toBe(
    "A & B"
  )
  expect(opf.getElementsByTagNameNS("*", "language")[0]!.textContent).toBe(
    "zh-CN"
  )
  expect(
    opf.querySelector('meta[property="dcterms:modified"]')!.textContent
  ).toMatch(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\dZ$/)
  expect(opf.querySelectorAll('item[media-type="image/png"]')).toHaveLength(1)
  expect(opf.querySelector('item[properties="cover-image"]')).not.toBeNull()
  expect(
    opf.querySelector('itemref[idref="notes"]')!.getAttribute("linear")
  ).toBe("no")
  expect(files.has("EPUB/cover.xhtml")).toBe(false) // already in the book
  const chapter = xml(files.get("EPUB/chapter-1.xhtml")!)
  expect(chapter.querySelector("html")!.getAttribute("lang")).toBe("zh-CN")
  expect(chapter.querySelector("font")).toBeNull()
  expect(chapter.querySelector("b")!.textContent).toBe("Old font")
  expect(chapter.querySelector("img")!.getAttribute("alt")).toBe("")
  expect(chapter.querySelector('a[href="chapter-2.xhtml#note"]')).not.toBeNull()
  const note = xml(files.get("EPUB/chapter-2.xhtml")!)
  expect(note.querySelector('a[href="chapter-1.xhtml#back"]')).not.toBeNull()
  expect(
    xml(files.get("EPUB/nav.xhtml")!).querySelectorAll("nav li")
  ).toHaveLength(2)
  expect(
    xml(files.get("EPUB/nav.xhtml")!).querySelector("ol ol a")!.textContent
  ).toBe("Nested note")
  for (const [path, text] of files) {
    if (/\.(xml|opf|xhtml)$/.test(path)) xml(text)
    expect(text).not.toContain("blob:")
  }
})
test("keeps a separate cover, omits absent metadata and uses und for unknown language", async () => {
  const book = sample()
  book.author = ""
  book.language = "invalid language"
  book.description = undefined
  book.chapters = [
    { id: "one", title: "One", html: "<p>Text</p>", supporting: false },
  ]
  const files = await contents(
    await writeEpub(book, new AbortController().signal, m)
  )
  expect(
    xml(files.get("EPUB/cover.xhtml")!)
      .querySelector("img")!
      .getAttribute("alt")
  ).toBe(book.title)
  const opf = xml(files.get("EPUB/package.opf")!)
  expect(opf.getElementsByTagNameNS("*", "language")[0]!.textContent).toBe(
    "und"
  )
  expect(opf.getElementsByTagNameNS("*", "creator")).toHaveLength(0)
  book.cover = null
  expect(
    (
      await contents(await writeEpub(book, new AbortController().signal, m))
    ).has("EPUB/cover.xhtml")
  ).toBe(false)
})
test("rejects incomplete links and nonlocal resources, and honors cancellation", async () => {
  const book = sample()
  const signal = new AbortController().signal
  for (const html of [
    '<a href="#missing">Lost</a>',
    '<a href="javascript:alert(1)">Unsafe</a>',
    '<img src="https://example.com/a.png">',
  ]) {
    book.chapters[0]!.html = html
    await expect(writeEpub(book, signal, m)).rejects.toThrow("incomplete")
  }
  book.chapters = []
  await expect(writeEpub(book, signal, m)).rejects.toThrow("empty")
  await expect(
    writeEpub(sample(), AbortSignal.abort(), m)
  ).rejects.toMatchObject({ name: "AbortError" })
  const controller = new AbortController()
  const spy = vi.spyOn(globalThis, "fetch").mockImplementation(async () => {
    // Simulate cancellation after a local image response without retaining
    // Node/Undici's native data-URL stream across the test boundary.
    controller.abort()
    return new Response("image bytes", {
      headers: { "Content-Type": "image/png" },
    })
  })
  try {
    await expect(
      writeEpub(sample(), controller.signal, m)
    ).rejects.toMatchObject({ name: "AbortError" })
  } finally {
    spy.mockRestore()
  }
})

test("does not append an unlisted title page after the source contents", async () => {
  const book = sample()
  book.chapters.unshift({
    id: "title-page",
    title: "Title page",
    html: "<p>Title</p>",
    supporting: false,
  })
  const files = await contents(
    await writeEpub(book, new AbortController().signal, m)
  )
  const nav = xml(files.get("EPUB/nav.xhtml")!)
  expect(Array.from(nav.querySelectorAll("a"), (a) => a.textContent)).toEqual([
    "Start",
    "Nested note",
  ])
  expect(nav.querySelector("a")!.getAttribute("href")).toBe(
    "chapter-2.xhtml#chapter-1"
  )
  expect(
    xml(files.get("EPUB/package.opf")!).querySelector(
      'itemref[idref="title-page"]'
    )
  ).not.toBeNull()
})
