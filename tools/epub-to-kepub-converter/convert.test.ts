// @vitest-environment jsdom
import {
  BlobReader,
  BlobWriter,
  TextReader,
  TextWriter,
  Uint8ArrayReader,
  ZipReader,
  ZipWriter,
} from "@zip.js/zip.js"
import { expect, test } from "vitest"
import { convertEpub } from "./convert"
import { addKoboMarkup, parseXml } from "./kobo-markup"
import type { Progress } from "./types"

const mime = "application/epub+zip"
const path = "EPUB/book.opf"
const chapter = "EPUB/chapter one.xhtml"
const nav = "EPUB/nav.xhtml"
const content = `<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en">
<head><title>A garden</title><link rel="stylesheet" href="local.css"/></head>
<body><h1 id="kobo.1.1">Moon Garden</h1><p id="reading">First. Second!
中文花园。花の庭！ <a href="nav.xhtml#toc">Contents</a> <em>fragrant</em> flowers.</p>
<p><img alt="Cover" src="../images/garden.jpg"/></p><pre>Preserve  spaces.</pre>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"><text>Original SVG</text></svg>
</body></html>`
const links = `<html xmlns="http://www.w3.org/1999/xhtml"><head><title>Contents</title></head><body><nav id="toc"><ol><li><a href="chapter%20one.xhtml#reading">Garden</a></li></ol></nav></body></html>`
const opf = `<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="id">
<metadata><dc:title xmlns:dc="http://purl.org/dc/elements/1.1/">Moon Garden</dc:title>
<meta name="cover" content="garden"/></metadata>
<manifest>
<item id="one" href="chapter%20one.xhtml" media-type="application/xhtml+xml"/>
<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
<item id="garden" href="../images/garden.jpg" media-type="image/jpeg"/>
<item id="css" href="local.css" media-type="text/css"/>
</manifest>
<spine><itemref idref="one"/></spine></package>`
const container = `<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0">
<rootfiles><rootfile media-type="application/oebps-package+xml" full-path="${path}"/></rootfiles></container>`
const style = "p { line-height: 1.4; }"
const picture = "Original bytes of the garden illustration"

async function epub(
  replacements: Record<string, string | Uint8Array<ArrayBuffer> | null> = {}
) {
  const writer = new ZipWriter(new BlobWriter(mime), { useWebWorkers: false })
  await writer.add("mimetype", new TextReader(mime), { level: 0 })
  const files = {
    "META-INF/container.xml": container,
    [path]: opf,
    [chapter]: content,
    [nav]: links,
    "EPUB/local.css": style,
    "images/garden.jpg": picture,
    ...replacements,
  }
  for (const [name, data] of Object.entries(files))
    if (data !== null)
      await writer.add(
        name,
        typeof data === "string"
          ? new TextReader(data)
          : new Uint8ArrayReader(data)
      )
  return new File([await writer.close()], "garden.epub", { type: mime })
}

test("adds Kobo positions without changing native text, navigation or artwork", async () => {
  const progress: Progress[] = []
  const result = await convertEpub(
    await epub(),
    new AbortController().signal,
    (step) => progress.push(step)
  )
  expect(result.title).toBe("Moon Garden")
  expect(result.file.type).toBe(mime)
  expect(progress).toEqual([{ current: 1, total: 1 }, "saving"])
  const reader = new ZipReader(new BlobReader(result.file))
  try {
    const entries = await reader.getEntries()
    expect(entries[0]?.filename).toBe("mimetype")
    expect(entries[0]?.compressionMethod).toBe(0)
    const files = new Map<string, string>()
    for (const entry of entries) {
      if (!entry.directory)
        files.set(
          entry.filename,
          await entry.getData(new TextWriter(), {
            checkSignature: true,
          })
        )
    }
    const doc = parseXml(files.get(chapter)!, "damaged")
    const original = parseXml(content, "damaged")
    expect(doc.querySelector("body")?.textContent).toBe(
      original.querySelector("body")?.textContent
    )
    expect(
      doc.querySelector("body > #book-columns > #book-inner")
    ).not.toBeNull()
    expect(doc.querySelector("head > #kobostylehacks")).not.toBeNull()
    expect(doc.querySelector("span.koboSpan > img")?.getAttribute("src")).toBe(
      "../images/garden.jpg"
    )
    expect(doc.querySelector("#reading a")?.getAttribute("href")).toBe(
      "nav.xhtml#toc"
    )
    expect(doc.querySelector("pre span, svg span")).toBeNull()
    const markers = Array.from(doc.querySelectorAll("span.koboSpan"))
    expect(markers.length).toBeGreaterThan(8)
    expect(markers.map((marker) => marker.textContent)).toEqual(
      expect.arrayContaining(["First. ", "中文花园。", "花の庭！"])
    )
    const ids = Array.from(doc.querySelectorAll("[id]"), (node) => node.id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(files.get(nav)).toBe(links)
    expect(files.get("EPUB/local.css")).toBe(style)
    expect(files.get("images/garden.jpg")).toBe(picture)
    expect(
      parseXml(files.get(path)!, "damaged")
        .getElementById("garden")
        ?.getAttribute("properties")
    ).toBe("cover-image")
  } finally {
    await reader.close()
  }
})

test("adds positions to a navigation document that is part of reading order", async () => {
  const source = await epub({
    [path]: opf.replace("</spine>", '<itemref idref="nav"/></spine>'),
  })
  const { file } = await convertEpub(
    source,
    new AbortController().signal,
    () => {}
  )
  const reader = new ZipReader(new BlobReader(file))
  try {
    const entry = (await reader.getEntries()).find(
      (entry) => entry.filename === nav
    )
    expect(entry?.directory).toBe(false)
    if (!entry || entry.directory)
      throw new Error("Missing navigation document")
    const source = await entry.getData(new TextWriter())
    const toc = parseXml(source, "damaged").getElementById("toc")
    expect(toc?.querySelector("a")?.getAttribute("href")).toBe(
      "chapter%20one.xhtml#reading"
    )
    expect(toc?.querySelector(".koboSpan")?.textContent).toBe("Garden")
  } finally {
    await reader.close()
  }
})

test("uses XHTML 1.1-compatible style markup for EPUB 2", () => {
  const doc = parseXml(content, "incomplete")
  addKoboMarkup(doc, false)
  expect(doc.querySelector("head > style")?.getAttribute("type")).toBe(
    "text/css"
  )
  expect(doc.querySelector("head > style")?.hasAttribute("id")).toBe(false)
})

test("marks CDATA text and leaves preformatted-only sections intact", () => {
  const doc = parseXml(
    '<html xmlns="http://www.w3.org/1999/xhtml"><head/><body><![CDATA[Text & syntax.]]><pre>Original  code.</pre></body></html>',
    "incomplete"
  )
  addKoboMarkup(doc, true)
  expect(doc.querySelector("span.koboSpan")?.textContent).toBe("Text & syntax.")
  expect(doc.querySelector("pre")?.innerHTML).toBe("Original  code.")
})

test("normalizes the XML declaration of a rewritten UTF-16 package", async () => {
  const utf16 = new Uint16Array(
    Array.from(
      '\ufeff<?xml version="1.0" encoding="UTF-16"?>' +
        opf.replace("Moon Garden", "中文花园"),
      (character) => character.charCodeAt(0)
    )
  )
  const source = await epub({ [path]: new Uint8Array(utf16.buffer) })
  const { file } = await convertEpub(
    source,
    new AbortController().signal,
    () => {}
  )
  const reader = new ZipReader(new BlobReader(file))
  try {
    const entry = (await reader.getEntries()).find(
      (entry) => entry.filename === path
    )
    if (!entry || entry.directory) throw new Error("Missing package document")
    const written = await entry.getData(new TextWriter())
    expect(written).toContain("中文花园")
    expect(written).not.toContain('encoding="UTF-16"')
  } finally {
    await reader.close()
  }
})

test.each([
  [
    "protected",
    {
      "META-INF/encryption.xml":
        '<encryption><EncryptionMethod Algorithm="http://example.com/drm"/></encryption>',
    },
  ],
  [
    "unsupportedLayout",
    {
      [path]: opf.replace(
        "<metadata>",
        '<metadata><meta property="rendition:layout">pre-paginated</meta>'
      ),
    },
  ],
  ["incomplete", { [chapter]: null }],
  ["incomplete", { [nav]: null }],
  ["incomplete", { "images/garden.jpg": null }],
  [
    "alreadyKepub",
    {
      [chapter]: content.replace(
        "<p id=",
        '<span class="koboSpan" id="kobo.2.1">Reading in Kobo.</span><p id='
      ),
    },
  ],
] as const)("reports %s input", async (code, replacements) => {
  await expect(
    convertEpub(
      await epub(replacements),
      new AbortController().signal,
      () => {}
    )
  ).rejects.toMatchObject({ code })
})

test("can cancel before writing a book section", async () => {
  const controller = new AbortController()
  const progress: Progress[] = []
  await expect(
    convertEpub(await epub(), controller.signal, (step) => {
      progress.push(step)
      controller.abort()
    })
  ).rejects.toMatchObject({ name: "AbortError" })
  expect(progress).toEqual([{ current: 1, total: 1 }])
})
