import type { BookSnapshot, ContentsItem } from "@workspace/ebook"
import type { PdfReflowBlock } from "@workspace/pdf-reader/text-layout"
import type { PDFDocumentProxy } from "pdfjs-dist"
import type { Messages } from "./types"

type WaitForRead = <T>(request: Promise<T>) => Promise<T>
type Outline = NonNullable<Awaited<ReturnType<PDFDocumentProxy["getOutline"]>>>
type Bookmark = { page: number | null; label: string; children: Bookmark[] }
export type ReflowPage = {
  number: number
  blocks: PdfReflowBlock[]
  image?: string
}

const pageId = (page: number) => `pdf-page-${page}`
const blockId = (page: number, index: number) =>
  `${pageId(page)}-block-${index}`

export async function readPdfBookmarks(
  pdf: PDFDocumentProxy,
  wait: WaitForRead
) {
  async function read(items: Outline): Promise<Bookmark[]> {
    const bookmarks: Bookmark[] = []
    for (const item of items) {
      const destination =
        typeof item.dest === "string"
          ? await wait(pdf.getDestination(item.dest))
          : item.dest
      const reference: unknown = destination?.[0]
      let index: number | null = null
      if (typeof reference === "number") index = reference
      else if (
        reference &&
        typeof reference === "object" &&
        "num" in reference &&
        "gen" in reference
      ) {
        index = await wait(
          pdf
            .getPageIndex(
              reference as Parameters<PDFDocumentProxy["getPageIndex"]>[0]
            )
            .catch(() => null)
        )
      }
      const page =
        index !== null && index >= 0 && index < pdf.numPages ? index + 1 : null
      bookmarks.push({
        page,
        label: item.title.trim(),
        children: await read(item.items),
      })
    }
    return bookmarks
  }
  return read((await wait(pdf.getOutline())) ?? [])
}

export function makeBook(
  metadata: Pick<BookSnapshot, "title" | "author" | "language">,
  pages: ReflowPage[],
  bookmarks: Bookmark[],
  m: Pick<Messages, "pageLabel" | "imageAlt">,
  format: (number: number) => string
): BookSnapshot {
  const starts = new Map<number, string>()
  const byPage = new Map(pages.map((page) => [page.number, page]))
  function toc(items: Bookmark[]): ContentsItem[] {
    return items.flatMap(({ page, label, children }) => {
      if (page === null || !label) return toc(children)
      if (!starts.has(page)) starts.set(page, label)
      const index =
        byPage.get(page)?.blocks.findIndex((block) => block.text === label) ??
        -1
      const target = index < 0 ? pageId(page) : blockId(page, index)
      return [{ label, href: "#" + target, subitems: toc(children) }]
    })
  }
  const contents = toc(bookmarks)
  const doc = document.implementation.createHTMLDocument(metadata.title)
  const chapters: BookSnapshot["chapters"] = []
  let section: HTMLElement | undefined
  let chapterStart = 0

  function add(parent: Element, tag: string, text: string) {
    const element = doc.createElement(tag)
    element.dir = "auto"
    element.textContent = text
    parent.append(element)
    return element
  }

  for (const page of pages) {
    const first = page.blocks[0]
    const bookmark = starts.get(page.number)
    const heading = first?.kind === "heading" ? first.text : undefined
    if (
      !section ||
      bookmark ||
      (!starts.size && heading) ||
      page.number - chapterStart >= 24
    ) {
      chapterStart = page.number
      section = doc.createElement("section")
      const title =
        bookmark ||
        heading ||
        (chapters.length
          ? m.pageLabel.replace("{page}", format(page.number))
          : metadata.title)
      chapters.push({
        id: `pdf-chapter-${chapters.length + 1}`,
        title,
        html: "",
        supporting: false,
      })
      doc.body.append(section)
      const titleElement = add(section, "h1", title)
      if (first?.text === title) titleElement.id = blockId(page.number, 0)
    }

    const marker = doc.createElement("span")
    marker.id = pageId(page.number)
    section.append(marker)
    if (page.image) {
      const image = doc.createElement("img")
      image.src = page.image
      image.alt = m.imageAlt.replace("{page}", format(page.number))
      section.append(image)
    }
    for (const [index, block] of page.blocks.entries()) {
      if (
        page.number === chapterStart &&
        block === first &&
        block.text === chapters.at(-1)!.title
      )
        continue
      add(section, block.kind === "heading" ? "h2" : "p", block.text).id =
        blockId(page.number, index)
    }
  }

  for (const [index, chapter] of chapters.entries())
    chapter.html = doc.body.children[index]!.innerHTML

  return {
    ...metadata,
    contents,
    chapters,
    cover: null,
    missing: false,
    unresolved: false,
  }
}
