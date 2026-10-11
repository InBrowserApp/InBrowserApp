import { BlobReader, BlobWriter, TextReader, ZipWriter } from "@zip.js/zip.js"
import type { BookSnapshot, ContentsItem } from "../types"
import { languageTag } from "../language"
import { chapterContent } from "./chapter"
import { epubImages } from "./images"
import { packageDocument } from "./package"
import type { PublicationItem } from "./package"
import { EPUB, element, serialize, xhtml } from "./xml"

const style =
  "body{line-height:1.6;margin:1em;overflow-wrap:anywhere}img{max-width:100%;height:auto}table{border-collapse:collapse}td,th{border:1px solid;padding:.4em}pre{white-space:pre-wrap}blockquote{margin-inline:1em}h1,h2,h3{line-height:1.3}"

const container =
  '<?xml version="1.0" encoding="UTF-8"?><container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container"><rootfiles><rootfile full-path="EPUB/package.opf" media-type="application/oebps-package+xml"/></rootfiles></container>'

export async function writeEpub(
  book: BookSnapshot,
  signal: AbortSignal,
  m: { contents: string; cover: string }
) {
  signal.throwIfAborted()
  if (!book.chapters.length) throw new Error("empty")
  const language = languageTag(book.language) || "und"
  const images = epubImages(signal)
  const chapters = book.chapters.map((chapter, index) => {
    const source = document.implementation.createHTMLDocument("")
    source.body.innerHTML = chapter.html
    const { doc, body } = xhtml(chapter.title, language)
    body.id = chapter.id
    body.append(chapterContent(doc, source.body))
    return { ...chapter, doc, body, href: `chapter-${index + 1}.xhtml` }
  })
  const targets = new Map<string, string>()
  const targetOrder = new Map<string, number>()
  for (const chapter of chapters)
    for (const target of chapter.doc.querySelectorAll("[id]")) {
      targets.set(target.id, `${chapter.href}#${target.id}`)
      targetOrder.set(target.id, targetOrder.size)
    }
  const zip = new ZipWriter(new BlobWriter("application/epub+zip"), {
    signal,
    extendedTimestamp: false,
    dataDescriptor: false,
  })
  const items: PublicationItem[] = []
  async function add(
    href: string,
    source: string | Blob,
    item: Omit<PublicationItem, "href">
  ) {
    signal.throwIfAborted()
    await zip.add(
      "EPUB/" + href,
      typeof source === "string"
        ? new TextReader(source)
        : new BlobReader(source)
    )
    items.push({ ...item, href })
  }
  try {
    await zip.add("mimetype", new TextReader("application/epub+zip"), {
      level: 0,
    })
    await zip.add("META-INF/container.xml", new TextReader(container))
    const cover = book.cover ? await images.add(book.cover) : null
    if (
      cover &&
      !chapters.some(({ body }) =>
        Array.from(body.querySelectorAll("img")).some(
          (image) => image.getAttribute("src") === book.cover
        )
      )
    ) {
      const { doc, body } = xhtml(m.cover, language)
      body.append(element(doc, "img", { src: cover, alt: book.title }))
      await add("cover.xhtml", serialize(doc), {
        id: "cover",
        media: "application/xhtml+xml",
        linear: true,
      })
    }
    for (const chapter of chapters) {
      for (const image of chapter.body.querySelectorAll("img"))
        image.setAttribute(
          "src",
          await images.add(image.getAttribute("src") || "")
        )
      for (const link of chapter.body.querySelectorAll("a[href]")) {
        const href = link.getAttribute("href")!
        if (href.startsWith("#")) {
          const target = targets.get(href.slice(1))
          if (!target) throw new Error("incomplete")
          link.setAttribute("href", target)
        } else if (!/^(?:https?:|mailto:)/i.test(href))
          throw new Error("incomplete")
      }
      await add(chapter.href, serialize(chapter.doc), {
        id: chapter.id,
        media: "application/xhtml+xml",
        linear: !chapter.supporting,
      })
    }
    const nav = xhtml(m.contents, language)
    const contents = element(nav.doc, "nav")
    contents.setAttributeNS(EPUB, "epub:type", "toc")
    contents.append(element(nav.doc, "h1", {}, m.contents))
    const list = element(nav.doc, "ol")
    function appendContents(parent: Element, entries: ContentsItem[]) {
      // Supporting notes can move behind the main reading chapters. Keep
      // sibling navigation entries in the emitted spine and document order.
      const ordered = [...entries].sort(
        (a, b) =>
          (targetOrder.get(a.href.slice(1)) ?? Infinity) -
          (targetOrder.get(b.href.slice(1)) ?? Infinity)
      )
      for (const entry of ordered) {
        const href = targets.get(entry.href.slice(1))
        if (!href) continue
        const item = element(nav.doc, "li")
        item.append(element(nav.doc, "a", { href }, entry.label))
        if (entry.subitems?.length) {
          const children = element(nav.doc, "ol")
          appendContents(children, entry.subitems)
          if (children.children.length) item.append(children)
        }
        parent.append(item)
      }
    }
    appendContents(list, book.contents || [])
    // Preserve the source contents. Adding unlisted title/note pages after it
    // would put navigation targets out of reading order.
    if (!list.children.length) {
      for (const chapter of chapters) {
        const item = element(nav.doc, "li")
        item.append(
          element(
            nav.doc,
            "a",
            { href: `${chapter.href}#${chapter.id}` },
            chapter.title
          )
        )
        list.append(item)
      }
    }
    contents.append(list)
    nav.body.append(contents)
    await add("nav.xhtml", serialize(nav.doc), {
      id: "nav",
      media: "application/xhtml+xml",
      properties: "nav",
    })
    await add("style.css", style, { id: "style", media: "text/css" })
    for (const [index, asset] of Array.from(images.assets.values()).entries())
      await add(asset.href, asset.blob, {
        id: `image-${index}`,
        media: asset.blob.type,
        properties: asset.href === cover ? "cover-image" : undefined,
      })
    await zip.add(
      "EPUB/package.opf",
      new TextReader(packageDocument(book, language, items))
    )
    signal.throwIfAborted()
    return await zip.close()
  } catch (error) {
    await zip.close().catch(() => {})
    signal.throwIfAborted()
    throw error
  }
}
