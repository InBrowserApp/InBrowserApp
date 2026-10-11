import type { BookSection, ContentsItem, ReadingBook } from "./types"

export type LoadedChapter = {
  id: string
  section: BookSection
  document: Document
  title: string
}

/** Resolve against original IDs/selectors before any sanitizer rewrites them. */
export async function bookLinks(
  book: ReadingBook,
  chapters: LoadedChapter[],
  indices: Map<number, LoadedChapter>,
  signal: AbortSignal
) {
  const targets = new Map<Element, string>()
  let unresolved = false
  const targetId = (element: Element) => {
    let id = targets.get(element)
    if (!id) {
      id = `ebook-target-${targets.size}`
      targets.set(element, id)
    }
    return id
  }
  for (const chapter of chapters) {
    for (const link of chapter.document.querySelectorAll("a[href]")) {
      signal.throwIfAborted()
      const href = link.getAttribute("href")!.trim()
      if (/^(?:https?:\/\/|mailto:)/i.test(href)) continue
      link.removeAttribute("href")
      if (!href) continue
      let id: string | undefined
      try {
        // Fragment-only references in MOBI chapters can use ordinary HTML IDs.
        const local = href.startsWith("#")
          ? chapter.document.getElementById(decodeURIComponent(href.slice(1)))
          : null
        if (local) id = targetId(local)
        else {
          const resolved = await book.parsed.resolveHref(
            chapter.section.resolveHref?.(href) ?? href
          )
          const destination = resolved && indices.get(resolved.index)
          if (destination) {
            const anchor = resolved.anchor?.(destination.document)
            if (!resolved.anchor || anchor === 0) id = destination.id
            else if (
              anchor instanceof Element &&
              destination.document.body.contains(anchor)
            )
              id = targetId(anchor)
          }
        }
      } catch (error) {
        signal.throwIfAborted()
        if (error instanceof RangeError) throw error
      }
      if (id) link.setAttribute("href", `#${id}`)
      else unresolved = true
    }
  }
  async function contents(items: ContentsItem[]): Promise<ContentsItem[]> {
    const output: ContentsItem[] = []
    for (const item of items) {
      signal.throwIfAborted()
      let id: string | undefined
      try {
        const resolved = await book.parsed.resolveHref(item.href)
        const destination = resolved && indices.get(resolved.index)
        if (destination) {
          const anchor = resolved.anchor?.(destination.document)
          if (!resolved.anchor || anchor === 0) id = destination.id
          else if (
            anchor instanceof Element &&
            destination.document.body.contains(anchor)
          )
            id = targetId(anchor)
        }
      } catch (error) {
        signal.throwIfAborted()
        if (error instanceof RangeError) throw error
      }
      const subitems = await contents(item.subitems || [])
      if (id && item.label.trim())
        output.push({ label: item.label.trim(), href: `#${id}`, subitems })
      else output.push(...subitems)
    }
    return output
  }
  const navigation = await contents(book.parsed.toc || [])
  // Publisher IDs may collide across chapters or with the export's own IDs.
  for (const chapter of chapters) {
    for (const element of chapter.document.querySelectorAll("[id],[name]")) {
      element.removeAttribute("id")
      element.removeAttribute("name")
    }
  }
  for (const [element, id] of targets) element.id = id
  return { unresolved, contents: navigation }
}

/** MOBI 6 may encode headings as styled paragraphs; use its contents labels. */
export async function chapterTitles(
  book: ReadingBook,
  indices: Map<number, LoadedChapter>,
  signal: AbortSignal
) {
  const items = [...(book.parsed.toc || [])]
  const titled = new Set<LoadedChapter>()
  for (const item of items) {
    signal.throwIfAborted()
    for (const child of item.subitems || []) items.push(child)
    if (!item.label.trim()) continue
    try {
      const destination = await book.parsed.resolveHref(item.href)
      const chapter = destination && indices.get(destination.index)
      if (
        chapter &&
        !titled.has(chapter) &&
        !chapter.document.body.querySelector("h1,h2,h3,h4,h5,h6")
      ) {
        chapter.title = item.label.trim()
        titled.add(chapter)
      }
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof RangeError) throw error
    }
  }
}
