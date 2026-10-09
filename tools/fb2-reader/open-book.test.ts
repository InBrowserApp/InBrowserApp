// @vitest-environment jsdom
import { File as NodeFile, Blob as NodeBlob } from "node:buffer"
import { readFile } from "node:fs/promises"
import { URL as NodeURL } from "node:url"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openBook } from "./open-book"
import { normalize } from "./normalize"

const blobs = new Map<string, Blob>()
const closes: (() => void)[] = []
const signal = () => new AbortController().signal
const simple = (body: string, rest = "") =>
  `<FictionBook>${rest}<body>${body}</body></FictionBook>`
const section =
  "<section><title><p>Chapter</p></title><p>Reading text</p></section>"
const bytes = (text: string) => new TextEncoder().encode(text)
async function fixture(name: string) {
  return new File([await readFile(`tools/fb2-reader/fixtures/${name}`)], name)
}
async function open(file: File) {
  const book = await openBook(file, signal())
  closes.push(book.dispose)
  return book
}
beforeEach(() => {
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("File", NodeFile)
  vi.stubGlobal("URL", NodeURL)
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    const url = `blob:fb2-${Math.random()}`
    blobs.set(url, blob as Blob)
    return url
  })
  vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
    blobs.delete(url)
  })
})
afterEach(() => {
  closes.splice(0).forEach((close) => close())
  expect(blobs.size).toBe(0)
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test.each(["reading.fb2", "utf16le.fb2", "utf16be.fb2"])(
  "reads genuine %s with nested sections, images, poetry, notes, and body order",
  async (name) => {
    const book = await open(await fixture(name))
    expect(book.title).toBe("Field Notes in FictionBook")
    expect(book.author).toBe("Alex Reader")
    expect(book.description).toContain("no backlink")
    expect(book.cover).toMatch(/^blob:/)
    expect(book.missing).toBe(false)
    expect(book.parsed.sections.map((s) => s.linear)).toEqual([
      undefined,
      undefined,
      "no",
      undefined,
    ])
    expect(book.parsed.toc![0]!.subitems![0]!.subitems![0]!.label).toBe(
      "The smallest details"
    )
    const html = await blobs
      .get((await book.parsed.sections[0]!.load())!)!
      .text()
    expect(html).toContain("Привет, мир")
    expect(html).toContain("data:image/jpeg;base64,")
    const rendered = new DOMParser().parseFromString(html, "text/html")
    expect(rendered.querySelector(".stanza em")?.textContent).toBe("quiet")
    expect(rendered.querySelector(".poem h2")?.textContent).toBe("A verse")
    const destination = await book.parsed.resolveHref("#note-one")
    expect(destination?.index).toBe(2)
    const note = new DOMParser().parseFromString(
      await blobs.get((await book.parsed.sections[2]!.load())!)!.text(),
      "text/html"
    )
    expect(destination?.anchor?.(note)).toBe(note.getElementById("note-one"))
    expect(await book.parsed.resolveHref("#absent")).toBeNull()
    expect(await book.parsed.resolveHref("https://example.org/")).toBeNull()
    expect(await book.parsed.resolveHref("100")).toBeNull()
    expect((await book.parsed.resolveHref("1"))?.index).toBe(1)
    book.dispose()
    await expect(book.parsed.sections[0]!.load()).rejects.toThrow("closed")
  }
)

test("opens independently generated calibre FictionBook and Windows-1251 text", async () => {
  const calibre = await open(await fixture("calibre.fb2"))
  expect(calibre.title).toBe("Field Notes on Quiet Places")
  expect(calibre.parsed.sections.length).toBeGreaterThan(1)
  const cyrillic = await open(await fixture("cyrillic.fb2"))
  expect(cyrillic.title).toBe("Кириллица")
  const html = await blobs
    .get((await cyrillic.parsed.sections[0]!.load())!)!
    .text()
  expect(html).toContain("Русский текст сохранён")
})

test("normalizes prefixes, CDATA, nicknames, missing metadata, and UTF-8 BOM", async () => {
  const text = `<?xml version="1.0" encoding="UTF-8"?><f:FictionBook xmlns:f="http://www.gribuser.ru/xml/fictionbook/2.0"><f:description><f:title-info><f:author><f:nickname>Pen name</f:nickname></f:author></f:title-info></f:description><f:body><f:section id="fb2-section-0"><f:p><![CDATA[Readable <markup>]]></f:p><f:section><f:p>Nested</f:p></f:section></f:section></f:body></f:FictionBook>`
  const book = await open(
    new File([new Uint8Array([239, 187, 191]), text], "prefixed.fb2")
  )
  expect(book.title).toBe("prefixed.fb2")
  expect(book.author).toBe("Pen name")
  const html = await blobs.get((await book.parsed.sections[0]!.load())!)!.text()
  expect(html).toContain("Readable &lt;markup&gt;")
  expect(book.parsed.toc![0]!.subitems![0]!.href).toBe("#fb2-section-1")
})

test("removes remote and unsafe images before conversion without network calls", async () => {
  const fetch = vi.spyOn(globalThis, "fetch")
  const xml = `<FictionBook xmlns:l="http://www.w3.org/1999/xlink"><description><title-info><coverpage><image l:href="https://example.org/cover.jpg"/></coverpage></title-info></description><body><section><p>Still readable</p><image l:href="https://example.org/image.png"/><image l:href="#svg"/><image l:href="#missing"/><script>bad</script><x:foreign xmlns:x="urn:other"/></section></body><binary id="svg" content-type="image/svg+xml">PHN2Zy8+</binary></FictionBook>`
  const book = await open(new File([xml], "safe.fb2"))
  expect(book.cover).toBeNull()
  expect(book.missing).toBe(true)
  expect(fetch).not.toHaveBeenCalled()
  const html = await blobs.get((await book.parsed.sections[0]!.load())!)!.text()
  expect(html).not.toContain("example.org")
  expect(html).not.toContain("script")
})

test.each([
  ["", "invalid"],
  ["<html/>", "invalid"],
  ["<FictionBook>", "invalid"],
  ['<FictionBook xmlns="urn:other"/>', "invalid"],
  [
    '<!DOCTYPE FictionBook [<!ENTITY x SYSTEM "https://example.org/">]><FictionBook/>',
    "invalid",
  ],
  [
    '<?xml version="1.0" encoding="not-an-encoding"?><FictionBook/>',
    "encoding",
  ],
  ["<FictionBook/>", "empty"],
  [simple(" "), "empty"],
  [simple("<p>Wrong hierarchy</p>"), "empty"],
  [
    simple('<section id="same"><p id="same">Duplicate</p></section>'),
    "invalid",
  ],
])("rejects malformed/unsupported XML %s", (text, error) => {
  expect(() => normalize(bytes(text!))).toThrow(error)
})

test("handles invalid binary data and image IDs without hiding text", () => {
  const xml = `<FictionBook xmlns:l="http://www.w3.org/1999/xlink"><body><section><image id="valid" l:href="#valid"/><p onclick="attack()">Text</p></section><unknown>Lost</unknown></body><binary id="valid" content-type="image/png">AA==</binary><binary id="valid" content-type="image/png">AA==</binary><binary content-type="image/png">AA==</binary><binary id="bad" content-type="image/png">!!</binary><binary id="empty" content-type="image/png"/></FictionBook>`
  const result = normalize(bytes(xml))
  expect(result.missing).toBe(true)
  expect(result.doc.querySelectorAll("binary")).toHaveLength(1)
  expect(result.doc.querySelector("image")?.id).toBe("valid")
  expect(result.doc.querySelector("p")?.hasAttribute("onclick")).toBe(false)
})

test.each(["illustration", "artwork"])(
  "preserves image destinations when the anchor ID is %s",
  async (id) => {
    const xml = `<FictionBook xmlns:l="http://www.w3.org/1999/xlink"><body><section><p><a l:href="#${id}">See illustration</a></p></section><section><image id="${id}" l:href="#artwork"/></section></body><binary id="artwork" content-type="image/png">AA==</binary></FictionBook>`
    const book = await open(new File([xml], "illustrated.fb2"))
    expect(book.missing).toBe(false)
    const destination = await book.parsed.resolveHref(`#${id}`)
    expect(destination?.index).toBe(1)
    const html = await blobs
      .get((await book.parsed.sections[1]!.load())!)!
      .text()
    const doc = new DOMParser().parseFromString(html, "text/html")
    const target = destination?.anchor?.(doc) as Element
    expect(target.localName).toBe("img")
    expect(target.id).toBe(id)
  }
)

test("reads later bodies when the first is empty and reports missing metadata", async () => {
  const book = await open(
    new File(
      [`<FictionBook><body/><body>${section}</body></FictionBook>`],
      "minimal.fb2"
    )
  )
  expect(book.title).toBe("minimal.fb2")
  expect(book.author).toBe("")
  expect(book.cover).toBeNull()
  expect(book.parsed.sections).toHaveLength(1)
})

test("does not cap a book at 1,000 sections and honors cancellation", async () => {
  const book = await open(new File([simple(section.repeat(1001))], "large.fb2"))
  expect(book.parsed.sections).toHaveLength(1001)
  expect((await book.parsed.resolveHref("1000"))?.index).toBe(1000)
  const controller = new AbortController()
  controller.abort()
  await expect(
    openBook(await fixture("reading.fb2"), controller.signal)
  ).rejects.toThrow("aborted")
}, 15000)

test("rejects invalid UTF-8 instead of replacing broken characters", () => {
  expect(() => normalize(new Uint8Array([60, 255, 62]))).toThrow("encoded data")
})

test("releases generated chapter URLs when opening is cancelled after parsing", async () => {
  const controller = new AbortController()
  const create = vi.mocked(URL.createObjectURL).getMockImplementation()!
  vi.mocked(URL.createObjectURL).mockImplementation((blob) => {
    const url = create(blob)
    controller.abort()
    return url
  })
  await expect(
    openBook(await fixture("reading.fb2"), controller.signal)
  ).rejects.toThrow("aborted")
  expect(blobs.size).toBe(0)
})

test("cleans chapters when cover allocation fails", async () => {
  const create = vi.mocked(URL.createObjectURL).getMockImplementation()!
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    if (blob instanceof Blob && blob.type === "image/jpeg")
      throw new RangeError("allocation failed")
    return create(blob)
  })
  await expect(
    openBook(await fixture("reading.fb2"), signal())
  ).rejects.toThrow("allocation failed")
  expect(blobs.size).toBe(0)
})
