import { bookImages } from "./resources"
import { bookLinks, chapterTitles } from "./links"
import type { LoadedChapter } from "./links"
import { cleanChapter } from "./chapter"
import type { ReadingBook } from "./types"

type SnapshotMessages = { chapter: string; imageUnavailable: string }

/** Materialize a complete reading copy while the caller owns the open book. */
export async function snapshotBook(
  book: ReadingBook,
  signal: AbortSignal,
  m: SnapshotMessages
) {
  signal.throwIfAborted()
  if (book.incomplete) throw new Error("incomplete")
  const chapters: LoadedChapter[] = []
  const byId = new Map<string, LoadedChapter>()
  const indices = new Map<number, LoadedChapter>()
  const images = bookImages(signal)
  for (const [index, section] of book.parsed.sections.entries()) {
    signal.throwIfAborted()
    if (section.navigation) continue
    const existing = byId.get(section.id)
    if (existing) {
      indices.set(index, existing)
      continue
    }
    let source: string
    try {
      const url = await section.load()
      signal.throwIfAborted()
      if (!url?.startsWith("blob:")) throw new Error("incomplete")
      const response = await fetch(url, { signal })
      if (!response.ok) throw new Error("incomplete")
      source = await response.text()
      if (!source.trim()) throw new Error("incomplete")
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof RangeError) throw error
      throw new Error("incomplete", { cause: error })
    }
    // A detached document has no browsing context; original selectors remain
    // available to the engine's internal-link resolver until links are mapped.
    const doc = document.implementation.createHTMLDocument("")
    doc.documentElement.innerHTML = source
    const opening = source.match(/<html(?=[\s>])[^>]*>/i)?.[0]
    if (opening) {
      const holder = doc.createElement("div")
      holder.innerHTML = opening.replace(/^<html/i, "<div") + "</div>"
      for (const attribute of ["lang", "dir"]) {
        const value = holder.firstElementChild?.getAttribute(attribute)
        if (value) doc.body.setAttribute(attribute, value)
      }
    }
    const chapter = {
      id: `ebook-chapter-${chapters.length}`,
      section,
      document: doc,
      title:
        doc.body.querySelector("h1,h2,h3,h4,h5,h6")?.textContent?.trim() ||
        doc.title.trim() ||
        `${m.chapter} ${chapters.length + 1}`,
    }
    chapters.push(chapter)
    byId.set(section.id, chapter)
    indices.set(index, chapter)
    // Let cancellation and replacement events run between chapters.
    await new Promise<void>((resolve) => setTimeout(resolve, 0))
  }
  if (!chapters.length) throw new Error("empty")
  await chapterTitles(book, indices, signal)
  let unresolved = await bookLinks(book, chapters, indices, signal)
  const output: {
    id: string
    title: string
    html: string
    supporting: boolean
  }[] = []
  for (const chapter of chapters) {
    signal.throwIfAborted()
    const body = await cleanChapter(
      chapter.document,
      images,
      m.imageUnavailable
    )
    if (!body.textContent?.trim() && !body.querySelector("img[src],table"))
      continue
    output.push({
      id: chapter.id,
      title: chapter.title,
      html: body.outerHTML
        .replace(/^<body/, "<div")
        .replace(/<\/body>$/, "</div>"),
      supporting: chapter.section.linear === "no",
    })
  }
  if (!output.length) throw new Error("empty")
  // A target removed by sanitization must not leave a broken clickable link.
  const doc = document.implementation.createHTMLDocument("")
  for (const chapter of output) {
    const section = doc.createElement("section")
    section.id = chapter.id
    section.innerHTML = chapter.html
    doc.body.append(section)
  }
  for (const link of doc.querySelectorAll('a[href^="#"]')) {
    if (!doc.getElementById(link.getAttribute("href")!.slice(1))) {
      link.removeAttribute("href")
      unresolved = true
    }
  }
  for (const [index, section] of Array.from(doc.body.children).entries())
    output[index]!.html = section.innerHTML
  const cover = book.cover ? await images.embed(book.cover) : null
  signal.throwIfAborted()
  return {
    title: book.title,
    author: book.author,
    description: book.description,
    chapters: [
      ...output.filter((chapter) => !chapter.supporting),
      ...output.filter((chapter) => chapter.supporting),
    ],
    cover,
    missing: book.missing || images.missing,
    unresolved,
  }
}
