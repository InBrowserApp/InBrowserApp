import { makeFB2 } from "foliate-js/fb2.js"
import type { ContentsItem } from "@workspace/ui/lib/book-reader"
import { readBook } from "./archive"
import { normalize } from "./normalize"
import type { Fb2Book, OpenBook } from "./types"

function contents(doc: Document) {
  const items: ContentsItem[] = []
  const bodies = Array.from(doc.querySelectorAll("FictionBook > body"))
  let index = 0
  for (const [bodyIndex, body] of bodies.entries()) {
    const roots = bodyIndex ? [body] : Array.from(body.children)
    for (const root of roots) {
      const item: ContentsItem = {
        label:
          root.querySelector(":scope > title")?.textContent?.trim() ||
          root.getAttribute("name") ||
          String(index + 1),
        href: String(index++),
        subitems: [],
      }
      const pending: { element: Element; item: ContentsItem }[] = [
        { element: root, item },
      ]
      while (pending.length) {
        const current = pending.pop()!
        for (const section of Array.from(current.element.children).filter(
          (child) => child.localName === "section"
        )) {
          const child: ContentsItem = {
            label:
              section.querySelector(":scope > title")?.textContent?.trim() ||
              String(current.item.subitems!.length + 1),
            href: `#${section.id}`,
            subitems: [],
          }
          current.item.subitems!.push(child)
          pending.push({ element: section, item: child })
        }
      }
      items.push(item)
    }
  }
  return items
}

export async function openBook(
  file: File,
  signal: AbortSignal
): Promise<OpenBook> {
  const bytes = await readBook(file, signal)
  signal.throwIfAborted()
  const normalized = normalize(bytes)
  let engine: Fb2Book | undefined
  let cover: string | null = null
  try {
    engine = await makeFB2(
      new Blob([new XMLSerializer().serializeToString(normalized.doc)])
    )
    signal.throwIfAborted()
    if (!engine.sections.length) throw new Error("empty")
    if (normalized.cover) cover = URL.createObjectURL(normalized.cover)
    const parsed = engine
    let closed = false
    const bodies = Array.from(
      normalized.doc.querySelectorAll("FictionBook > body")
    )
    const firstCount = bodies[0]!.children.length
    return {
      title: parsed.metadata.title?.trim() || file.name,
      author:
        parsed.metadata.author
          ?.map((author) => (typeof author === "string" ? author : author.name))
          .filter(Boolean)
          .join(", ") ?? "",
      description: normalized.doc
        .querySelector("title-info > annotation")
        ?.textContent?.trim(),
      cover,
      missing: normalized.missing,
      parsed: {
        sections: parsed.sections.map((section, index) => ({
          id: String(index),
          linear:
            index < firstCount ||
            !/^(?:notes|comments)$/i.test(
              bodies[index - firstCount + 1]?.getAttribute("name") ?? ""
            )
              ? undefined
              : section.linear,
          async load() {
            signal.throwIfAborted()
            if (closed) throw new Error("closed")
            return section.load()
          },
        })),
        toc: contents(normalized.doc),
        resolveHref(href) {
          if (!/^(?:\d+|#[^#]+)$/.test(href)) return null
          const destination = parsed.resolveHref(href)
          return Number.isInteger(destination.index) &&
            destination.index >= 0 &&
            destination.index < parsed.sections.length
            ? destination
            : null
        },
      },
      dispose() {
        closed = true
        parsed.destroy()
        if (cover) URL.revokeObjectURL(cover)
      },
    }
  } catch (error) {
    engine?.destroy()
    if (cover) URL.revokeObjectURL(cover)
    throw error
  }
}
