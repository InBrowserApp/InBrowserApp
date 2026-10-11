// @vitest-environment jsdom
import { Blob as NodeBlob, File as NodeFile } from "node:buffer"
import { URL as NodeURL } from "node:url"
import { TextReader, Uint8ArrayWriter, ZipWriter } from "@zip.js/zip.js"
import { afterEach, beforeEach, expect, test, vi } from "vitest"
import { openBook } from "./open-book"

const container = `<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>`
const chapter = (body: string) =>
  `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Chapter</title></head><body>${body}</body></html>`
const manifest = `<item id="one" href="one.xhtml" media-type="application/xhtml+xml"/><item id="two" href="two.xhtml" media-type="application/xhtml+xml"/><item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/><item id="cover" href="cover.svg" media-type="image/svg+xml" properties="cover-image"/>`
const metadata = `<dc:title> A local book </dc:title><dc:creator>Ada Reader</dc:creator><dc:creator>Bo Writer</dc:creator><dc:identifier id="id">urn:uuid:12345678-1234-1234-1234-123456789012</dc:identifier><dc:language>en</dc:language>`
const nav = `<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops"><head><title>Contents</title></head><body><nav epub:type="toc"><ol><li><a href="one.xhtml">First chapter</a><ol><li><a href="one.xhtml#note">A note</a></li></ol></li><li><a href="two.xhtml#%E8%AF%BB%E4%B9%A6">Second chapter</a></li></ol></nav></body></html>`
const cover = `<svg xmlns="http://www.w3.org/2000/svg" width="80" height="100"><rect width="80" height="100" fill="navy"/></svg>`

type Fixture = {
  version?: string
  metadata?: string
  manifest?: string
  spine?: string
  extra?: Record<string, string | null>
  password?: string
  corruptCover?: boolean
}
async function book(options: Fixture = {}) {
  const opf = `<package xmlns="http://www.idpf.org/2007/opf" xmlns:dc="http://purl.org/dc/elements/1.1/" version="${options.version ?? "3.0"}" unique-identifier="id"><metadata>${options.metadata ?? metadata}</metadata><manifest>${options.manifest ?? manifest}</manifest><spine toc="ncx">${options.spine ?? '<itemref idref="one"/><itemref idref="two"/>'}</spine></package>`
  const files: Record<string, string | null> = {
    mimetype: "application/epub+zip",
    "META-INF/container.xml": container,
    "EPUB/package.opf": opf,
    "EPUB/nav.xhtml": nav,
    "EPUB/one.xhtml": chapter(
      '<h1>First chapter</h1><p>Local words.</p><img src="cover.svg" alt="Cover"/><a href="two.xhtml#读书">Continue</a><aside id="note">A footnote</aside>'
    ),
    "EPUB/two.xhtml": chapter(
      '<h1 id="读书">Second chapter</h1><a name="legacy">Old anchor</a>'
    ),
    "EPUB/cover.svg": cover,
    ...options.extra,
  }
  const zip = new ZipWriter(new Uint8ArrayWriter(), {
    level: 0,
    useWebWorkers: false,
    password: options.password,
  })
  for (const [path, value] of Object.entries(files)) {
    if (value !== null)
      await zip.add(path, new TextReader(value), {
        level: options.corruptCover && path === "EPUB/cover.svg" ? 6 : 0,
      })
  }
  const bytes = await zip.close()
  if (options.corruptCover) {
    const path = new TextEncoder().encode("EPUB/cover.svg")
    const filename = bytes.findIndex((_, index) =>
      path.every((byte, offset) => bytes[index + offset] === byte)
    )
    const header = new DataView(bytes.buffer, filename - 30)
    const payload = filename + path.length + header.getUint16(28, true)
    // BTYPE=3 is reserved by DEFLATE and must fail during decompression.
    bytes[payload] = 7
  }
  return new File([bytes], "book.EPUB", {
    type: "application/epub+zip",
  })
}
const blobs = new Map<string, Blob>()
const dispose: (() => void)[] = []
async function open(file: File) {
  const opened = await openBook(file, new AbortController().signal)
  dispose.push(opened.dispose)
  return opened
}
beforeEach(() => {
  vi.stubGlobal("Blob", NodeBlob)
  vi.stubGlobal("File", NodeFile)
  vi.stubGlobal("URL", NodeURL)
  let id = 0
  vi.spyOn(URL, "createObjectURL").mockImplementation((blob) => {
    const url = `blob:book-${++id}`
    blobs.set(url, blob as Blob)
    return url
  })
  vi.spyOn(URL, "revokeObjectURL").mockImplementation((url) => {
    blobs.delete(url)
  })
})
afterEach(() => {
  for (const close of dispose.splice(0)) close()
  blobs.clear()
  vi.restoreAllMocks()
  vi.unstubAllGlobals()
})

test("reads an actual EPUB 3 archive, nested contents, cover and local chapter assets", async () => {
  const opened = await open(await book())
  expect(opened.title).toBe("A local book")
  expect(opened.author).toBe("Ada Reader, Bo Writer")
  expect(opened.missing).toBe(false)
  expect(opened.parsed.toc).toEqual([
    {
      label: "First chapter",
      href: "EPUB/one.xhtml",
      subitems: [
        { label: "A note", href: "EPUB/one.xhtml#note", subitems: null },
      ],
    },
    { label: "Second chapter", href: "EPUB/two.xhtml#读书", subitems: null },
  ])
  expect(await blobs.get(opened.cover!)?.text()).toBe(cover)
  const section = opened.parsed.sections[0]!
  const url = await section.load()
  const html = await blobs.get(url!)!.text()
  expect(html).toContain("Local words.")
  expect(html).toMatch(/src="blob:book-\d+"/)
  expect(section.resolveHref("two.xhtml#读书")).toBe("EPUB/two.xhtml#读书")
  section.unload()
  expect(blobs.has(url!)).toBe(false)
  opened.dispose()
  expect(blobs.size).toBe(0)
})

test("uses the actual remaining section index and resolves Unicode and legacy anchors", async () => {
  const warn = vi.spyOn(console, "warn").mockImplementation(() => {})
  const opened = await open(
    await book({
      spine:
        '<itemref idref="absent"/><itemref idref="one"/><itemref idref="two"/>',
    })
  )
  expect(warn).toHaveBeenCalled()
  expect(opened.missing).toBe(true)
  const doc = new DOMParser().parseFromString(
    chapter('<h1 id="读书">Read</h1><a name="legacy">Old</a>'),
    "text/html"
  )
  const destination = opened.parsed.resolveHref(
    "EPUB/two.xhtml#%E8%AF%BB%E4%B9%A6"
  )!
  expect(destination.index).toBe(1)
  expect(destination.anchor?.(doc)).toBe(doc.getElementById("读书"))
  expect(opened.parsed.resolveHref("EPUB/one.xhtml")?.anchor?.(doc)).toBe(0)
  expect(
    opened.parsed.resolveHref("EPUB/two.xhtml#legacy")?.anchor?.(doc)
  ).toBe(doc.getElementsByName("legacy")[0])
  expect(
    opened.parsed.resolveHref("EPUB/two.xhtml#missing")?.anchor?.(doc)
  ).toBeNull()
  expect(opened.parsed.resolveHref("EPUB/missing.xhtml")).toBeNull()
  expect(opened.parsed.resolveHref("EPUB/two.xhtml#%invalid")).toBeNull()
  expect(opened.parsed.resolveHref("%invalid")).toBeNull()
})

test("reads EPUB 2 NCX contents when no EPUB 3 nav document exists", async () => {
  const ncx = `<ncx xmlns="http://www.daisy.org/z3986/2005/ncx/" version="2005-1"><navMap><navPoint id="first"><navLabel><text>First</text></navLabel><content src="one.xhtml"/><navPoint id="note"><navLabel><text>Footnote</text></navLabel><content src="one.xhtml#note"/></navPoint></navPoint></navMap></ncx>`
  const opened = await open(
    await book({
      version: "2.0",
      manifest: manifest.replace(
        /<item id="nav"[^>]+\/>/,
        '<item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>'
      ),
      extra: { "EPUB/toc.ncx": ncx },
    })
  )
  expect(opened.parsed.toc?.[0]?.label).toBe("First")
  expect(opened.parsed.toc?.[0]?.subitems?.[0]?.href).toBe(
    "EPUB/one.xhtml#note"
  )
})

test("falls back to the filename when title and author metadata are absent or blank", async () => {
  const opened = await open(await book({ metadata: "<dc:title>  </dc:title>" }))
  expect(opened.title).toBe("book.EPUB")
  expect(opened.author).toBe("")
})

test("uses a language-map title and contributor name", async () => {
  const opened = await open(
    await book({
      metadata:
        '<dc:title xml:lang="fr">Livre</dc:title><dc:creator xml:lang="fr">Autrice</dc:creator>',
    })
  )
  expect(opened.title).toBe("Livre")
  expect(opened.author).toBe("Autrice")
})

test("keeps missing chapter slots and permits another available chapter", async () => {
  const opened = await open(
    await book({ extra: { "EPUB/one.xhtml": null, "EPUB/cover.svg": null } })
  )
  expect(opened.missing).toBe(true)
  expect(opened.cover).toBeNull()
  expect(opened.parsed.sections).toHaveLength(2)
  expect(await opened.parsed.sections[0]!.load()).toBeNull()
  const url = await opened.parsed.sections[1]!.load()
  expect(await blobs.get(url!)?.text()).toContain("Second chapter")
})

test("opens an ordinary book without a cover or navigation document", async () => {
  const opened = await open(
    await book({
      manifest: manifest.replace(/<item id="(?:nav|cover)"[^>]+\/>/g, ""),
    })
  )
  expect(opened.cover).toBeNull()
  expect(opened.parsed.toc).toBeUndefined()
  expect(opened.missing).toBe(false)
})

test("a corrupt compressed cover does not prevent reading available chapters", async () => {
  const opened = await open(await book({ corruptCover: true }))
  expect(opened.cover).toBeNull()
  expect(opened.missing).toBe(true)
  const url = await opened.parsed.sections[1]!.load()
  expect(await blobs.get(url!)?.text()).toContain("Second chapter")
})

test.each([
  {
    metadata: `${metadata}<meta property="rendition:layout">pre-paginated</meta>`,
  },
  {
    spine:
      '<itemref idref="one"/><itemref idref="two" properties="rendition:layout-pre-paginated"/>',
  },
  {
    extra: {
      "META-INF/com.apple.ibooks.display-options.xml":
        '<display_options><platform name="*"><option name="fixed-layout">true</option></platform></display_options>',
    },
  },
])("rejects fixed and mixed layouts explicitly: %j", async (options) => {
  await expect(open(await book(options))).rejects.toThrow("unsupportedLayout")
})

test("reports an empty spine without pretending the book is readable", async () => {
  await expect(open(await book({ spine: "" }))).rejects.toThrow("empty")
})

test("rejects encrypted ZIP entries and protected EPUB resources", async () => {
  await expect(open(await book({ password: "secret" }))).rejects.toThrow(
    "protected"
  )
  await expect(
    open(
      await book({
        extra: {
          "META-INF/encryption.xml":
            '<encryption xmlns:enc="http://www.w3.org/2001/04/xmlenc#"><enc:EncryptedData><enc:EncryptionMethod Algorithm="http://www.w3.org/2001/04/xmlenc#aes256-cbc"/></enc:EncryptedData></encryption>',
        },
      })
    )
  ).rejects.toThrow("protected")
})

test("allows font obfuscation, which is distinct from copy protection", async () => {
  const opened = await open(
    await book({
      extra: {
        "META-INF/encryption.xml":
          '<encryption xmlns:enc="http://www.w3.org/2001/04/xmlenc#"><enc:EncryptedData><enc:EncryptionMethod Algorithm="http://www.idpf.org/2008/embedding"/><enc:CipherData><enc:CipherReference URI="EPUB/font.ttf"/></enc:CipherData></enc:EncryptedData></encryption>',
      },
    })
  )
  expect(opened.parsed.sections).toHaveLength(2)
})

test.each([
  new File(["text"], "book.txt"),
  new File([], "empty.epub"),
  new File(["broken zip"], "bad.epub"),
])("rejects unrelated, empty and broken archives: $name", async (file) => {
  await expect(open(file)).rejects.toThrow(Error)
})

test("rejects missing package documents and invalid XML", async () => {
  const cases: Record<string, string | null>[] = [
    { "META-INF/container.xml": null },
    { "EPUB/package.opf": null },
    { "META-INF/container.xml": "<container><broken></container>" },
    { "META-INF/encryption.xml": "<encryption><broken></encryption>" },
  ]
  for (const extra of cases)
    await expect(open(await book({ extra }))).rejects.toThrow(Error)
})

test("aborted reads fail without leaving cover or chapter URLs", async () => {
  const controller = new AbortController()
  controller.abort()
  await expect(openBook(await book(), controller.signal)).rejects.toMatchObject(
    { name: "AbortError" }
  )
  expect(blobs.size).toBe(0)
})

test("releases a cover when a book is cancelled after decoding", async () => {
  const controller = new AbortController()
  vi.mocked(URL.createObjectURL).mockImplementationOnce((image) => {
    blobs.set("blob:cancelled", image as Blob)
    controller.abort()
    return "blob:cancelled"
  })
  await expect(openBook(await book(), controller.signal)).rejects.toMatchObject(
    { name: "AbortError" }
  )
  expect(blobs.size).toBe(0)
})
