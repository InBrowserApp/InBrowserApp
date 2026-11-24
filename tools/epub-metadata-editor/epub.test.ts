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
import { describe, expect, it } from "vitest"
import { openEpub, saveEpub } from "./epub"
import { parseXml } from "./package-document"

const mime = "application/epub+zip"
const path = "EPUB/book.opf"
const chapter =
  '<html xmlns="http://www.w3.org/1999/xhtml"><body><p>Chapter one.</p><img src="../images/old%20cover.jpg" alt="Cover"/></body></html>'
const container = `<container xmlns="urn:oasis:names:tc:opendocument:xmlns:container" version="1.0"><rootfiles><rootfile media-type="application/oebps-package+xml" full-path="${path}"/></rootfiles></container>`
const coverPath = "images/old cover.jpg"
const coverHref = "../images/old%20cover.jpg"
const originalCover = "Original image bytes"

function opf(version: "2.0" | "3.0", cover: "jpg" | "svg" | null) {
  const isV3 = version === "3.0"
  const coverMeta = !isV3 && cover ? '<meta name="cover" content="old"/>' : ""
  const coverItem = cover
    ? `<item id="old" href="${coverHref}" media-type="${cover === "jpg" ? "image/jpeg" : "image/svg+xml"}"${isV3 ? ' properties="cover-image"' : ""}/>`
    : ""
  return `<?xml version="1.0" encoding="UTF-8"?>
  <package xmlns="http://www.idpf.org/2007/opf" version="${version}" unique-identifier="book-id">
    <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
      <dc:identifier id="book-id">urn:uuid:sample</dc:identifier>
      <dc:title id="subtitle">Subtitle</dc:title>
      ${isV3 ? '<dc:title id="title">Old title</dc:title><meta refines="#title" property="title-type">main</meta>' : ""}
      <dc:creator id="author1">Rita, PhD</dc:creator>
      <dc:creator id="author2">Peter</dc:creator>
      ${isV3 ? '<dc:creator id="art">Nini</dc:creator><meta refines="#art" property="role">ill</meta><meta refines="#author2" property="file-as">Peter, Old</meta>' : '<dc:creator opf:role="ill">Nini</dc:creator>'}
      <dc:language>en</dc:language>
      <dc:publisher>Pocket Press</dc:publisher>
      <dc:subject>History</dc:subject>
      <dc:subject>Culture</dc:subject>
      <dc:rights>Copyright Example</dc:rights>
      ${isV3 ? '<meta property="dcterms:modified">2020-01-01T00:00:00Z</meta>' : coverMeta}
    </metadata>
    <manifest>
      <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
      ${coverItem}
    </manifest>
    <spine><itemref idref="chapter"/></spine>
  </package>`
}

async function archive(
  version: "2.0" | "3.0" = "3.0",
  cover: "jpg" | "svg" | null = "jpg",
  extra: Record<string, string | Uint8Array<ArrayBuffer>> = {},
  source = opf(version, cover)
) {
  const zip = new ZipWriter(new BlobWriter(), { useWebWorkers: false })
  await zip.add("mimetype", new TextReader(mime), { level: 0 })
  const entries = {
    "META-INF/container.xml": container,
    [path]: source,
    "EPUB/chapter.xhtml": chapter,
    ...(cover ? { [coverPath]: originalCover } : {}),
    ...extra,
  }
  for (const [name, text] of Object.entries(entries)) {
    await zip.add(
      name,
      typeof text === "string"
        ? new TextReader(text)
        : new Uint8ArrayReader(text)
    )
  }
  return zip.close()
}

async function contents(blob: Blob) {
  const zip = new ZipReader(new BlobReader(blob))
  try {
    const entries = await zip.getEntries()
    const files = new Map()
    for (const entry of entries) {
      if (!entry.directory)
        files.set(
          entry.filename,
          await entry.getData(new TextWriter(), { checkSignature: true })
        )
    }
    return { entries, files, xml: parseXml(files.get(path)) }
  } finally {
    await zip.close()
  }
}

describe("EPUB metadata editing", () => {
  it("reads book details, prioritizes the main title, and excludes illustrators", async () => {
    const book = await openEpub(await archive())
    expect(book.details).toEqual({
      title: "Old title",
      authors: "Rita, PhD\nPeter",
      language: "en",
      publisher: "Pocket Press",
      subjects: "History\nCulture",
      description: "",
    })
    expect(book.coverType).toBe("image/jpeg")
    expect(book.cover?.type).toBe("image/jpeg")
    expect(await book.cover?.text()).toBe(originalCover)
  })

  it("edits metadata and escapes user text while preserving other content and author IDs", async () => {
    const file = await archive()
    const { details } = await openEpub(file)
    const saved = await saveEpub(
      file,
      {
        ...details,
        title: "Birds & <Trees>",
        authors: " Peter \n\n Ada",
        language: "pt-BR",
        publisher: "",
        subjects: "Culture\nNature",
        description: "One line.\nAnother line.",
      },
      null
    )
    const { files, xml, entries } = await contents(saved)
    expect(saved.type).toBe(mime)
    expect(entries[0]).toMatchObject({
      filename: "mimetype",
      compressionMethod: 0,
    })
    expect(files.get("mimetype")).toBe(mime)
    expect(files.get("EPUB/chapter.xhtml")).toBe(chapter)
    expect(files.get(coverPath)).toBe(originalCover)
    expect(xml.getElementById("book-id")?.textContent).toBe("urn:uuid:sample")
    expect(xml.getElementById("subtitle")?.textContent).toBe("Subtitle")
    expect(xml.getElementById("author2")?.textContent).toBe("Peter")
    expect(xml.getElementById("art")?.textContent).toBe("Nini")
    expect(xml.querySelector('[refines="#author2"]')?.textContent).toBe(
      "Peter, Old"
    )
    expect(
      xml.querySelector('[property="dcterms:modified"]')?.textContent
    ).not.toBe("2020-01-01T00:00:00Z")
    expect(xml.getElementsByTagNameNS("*", "rights")[0]?.textContent).toBe(
      "Copyright Example"
    )
    expect((await openEpub(saved)).details).toEqual({
      title: "Birds & <Trees>",
      authors: "Peter\nAda",
      language: "pt-BR",
      publisher: "",
      subjects: "Culture\nNature",
      description: "One line.\nAnother line.",
    })
  })

  it("reuses a same-format cover path and preserves EPUB 2 cover metadata", async () => {
    const file = await archive("2.0")
    const book = await openEpub(file)
    expect(book.details.authors).toBe("Rita, PhD\nPeter")
    const saved = await saveEpub(
      file,
      book.details,
      new Blob(["New cover"], { type: "image/jpeg" })
    )
    const { files, xml } = await contents(saved)
    expect(files.get(coverPath)).toBe("New cover")
    expect(files.get("EPUB/chapter.xhtml")).toBe(chapter)
    expect(
      xml.querySelector('meta[name="cover"]')?.getAttribute("content")
    ).toBe("old")
    expect(xml.querySelector('[property="dcterms:modified"]')).toBeNull()
  })

  it.each([
    ["2.0", null],
    ["3.0", "svg"],
  ] as const)(
    "adds a cover to EPUB %s while preserving a separate original image",
    async (version, cover) => {
      const file = await archive(version, cover, {
        "EPUB/cover-image.png": "Other image",
      })
      const book = await openEpub(file)
      const saved = await saveEpub(
        file,
        book.details,
        new Blob(["New cover"], { type: "image/png" })
      )
      const { files, xml } = await contents(saved)
      expect(files.get("EPUB/cover-image.png")).toBe("Other image")
      expect(files.get("EPUB/cover-image-2.png")).toBe("New cover")
      expect(files.get(coverPath)).toBe(cover ? originalCover : undefined)
      expect(
        xml.querySelector(
          version === "3.0"
            ? '[properties="cover-image"]'
            : 'meta[name="cover"]'
        )
      ).not.toBeNull()
      expect(await (await openEpub(saved)).cover?.text()).toBe("New cover")
    }
  )

  it("preserves font obfuscation and declines protected publications", async () => {
    const encryption = (algorithm: string) =>
      `<encryption><EncryptedData><EncryptionMethod Algorithm="${algorithm}"/></EncryptedData></encryption>`
    const name = "META-INF/encryption.xml"
    const valid = encryption("http://www.idpf.org/2008/embedding")
    const file = await archive("3.0", null, { [name]: valid })
    const { details } = await openEpub(file)
    expect(
      (await contents(await saveEpub(file, details, null))).files.get(name)
    ).toBe(valid)
    const protectedBook = await archive("3.0", null, {
      [name]: encryption("urn:drm"),
    })
    await expect(openEpub(protectedBook)).rejects.toThrow("protected")
  })

  it("opens and updates a UTF-16 OPF at a percent-encoded rootfile URL", async () => {
    const source = opf("3.0", null)
      .replace("UTF-8", "UTF-16")
      .replace("Old title", "L’été à Montréal")
    const packageName = "EPUB/package 3.opf"
    const bytes = new Uint8Array(2 + source.length * 2)
    bytes.set([0xff, 0xfe])
    const view = new DataView(bytes.buffer)
    for (let i = 0; i < source.length; i++)
      view.setUint16(2 + i * 2, source.charCodeAt(i), true)
    const file = await archive("3.0", null, {
      "META-INF/container.xml": container.replace(path, "EPUB/package%203.opf"),
      [packageName]: bytes,
    })
    const book = await openEpub(file)
    expect(book.details.title).toBe("L’été à Montréal")
    const saved = await saveEpub(
      file,
      { ...book.details, title: "Un nouveau titre" },
      null
    )
    expect((await openEpub(saved)).details.title).toBe("Un nouveau titre")
  })

  it("finds the single image referenced from an EPUB 2 guide cover page", async () => {
    const source = opf("2.0", "jpg")
      .replace('<meta name="cover" content="old"/>', "")
      .replace(
        "</package>",
        '<guide><reference type="cover" href="chapter.xhtml"/></guide></package>'
      )
    const file = await archive("2.0", "jpg", {}, source)
    const book = await openEpub(file)
    expect(await book.cover?.text()).toBe(originalCover)
    const saved = await saveEpub(
      file,
      book.details,
      new Blob(["New cover"], { type: "image/jpeg" })
    )
    const { files, xml } = await contents(saved)
    expect(files.get(coverPath)).toBe("New cover")
    expect(
      xml.querySelector('meta[name="cover"]')?.getAttribute("content")
    ).toBe("old")
  })

  it.each([
    () => new Blob(["Text"]),
    () => archive("3.0", null, { "META-INF/container.xml": "<container/>" }),
    () => archive("3.0", null, {}, "<not-a-package/>"),
  ])("rejects files without a readable EPUB package", async (makeFile) => {
    await expect(openEpub(await makeFile())).rejects.toThrow(
      /invalid|file format/i
    )
  })
})
