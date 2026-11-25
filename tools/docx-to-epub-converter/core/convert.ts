import { DocxDocument } from "@silurus/ooxml/docx"
import type { DocNote } from "@silurus/ooxml/docx"
import {
  isDocumentLimitError,
  officeLoadOptions,
} from "@workspace/document-reader"
import type { BookSnapshot, ContentsItem } from "@workspace/ebook"
import { readingDocument, readingPreview } from "@workspace/ebook/document"
import { bookImages } from "@workspace/ebook/images"
import { writeEpub } from "@workspace/ebook/write-epub"
import { readArchive } from "./archive"
import { renderBlocks } from "./render"
import type { RenderContext } from "./render"
import { extension } from "../types"
import type { Messages } from "../types"

export function failure(reason: unknown) {
  if (isDocumentLimitError(reason) || reason instanceof RangeError)
    return "resourceLimit"
  if (
    reason instanceof Error &&
    ["protected", "empty"].includes(reason.message)
  )
    return reason.message === "protected" ? "protected" : "empty"
  return "invalid"
}

function imageSource(
  source: DocxDocument,
  entries: Set<string>,
  signal: AbortSignal
) {
  const images = bookImages(signal)
  const byPath = new Map<string, string | null>()
  return {
    images,
    async load(path: string | undefined, type: string) {
      if (!path || /[:?#\\]/.test(path) || !entries.has(path)) return null
      if (byPath.has(path)) return byPath.get(path)!
      let url: string | undefined
      try {
        const blob = await source.getImage(path, type)
        signal.throwIfAborted()
        url = URL.createObjectURL(blob)
        const result = await images.embed(url)
        byPath.set(path, result)
        return result
      } catch (reason) {
        signal.throwIfAborted()
        if (isDocumentLimitError(reason) || reason instanceof RangeError)
          throw reason
        byPath.set(path, null)
        return null
      } finally {
        if (url) URL.revokeObjectURL(url)
      }
    },
  }
}

type Section = { node: HTMLElement; title: string; supporting: boolean }
function heading(node: Element) {
  return /^h[1-6]$/.test(node.localName) ? Number(node.localName[1]) : 0
}

function sections(doc: Document, title: string): Section[] {
  const children = Array.from(doc.body.children)
  const level = children.reduce((best, node) => {
    const current = heading(node)
    return current ? Math.min(best, current) : best
  }, 7)
  const result: Section[] = []
  let section: Section | undefined
  for (const child of children) {
    if (!section || heading(child) === level) {
      const node = doc.createElement("section")
      node.id = `word-chapter-${result.length + 1}`
      section = {
        node,
        title: (heading(child) && child.textContent?.trim()) || title,
        supporting: false,
      }
      result.push(section)
      doc.body.append(node)
    }
    section.node.append(child)
  }
  return result
}

function contents(section: Section): ContentsItem[] {
  const headings = Array.from(section.node.children).filter((node) =>
    heading(node)
  )
  if (section.supporting || !headings.length)
    return [{ label: section.title, href: `#${section.node.id}` }]
  const items: ContentsItem[] = []
  const parents: { level: number; children: ContentsItem[] }[] = []
  for (const [index, node] of headings.entries()) {
    const level = heading(node)
    node.id = `${section.node.id}-heading-${index + 1}`
    while (parents.length && parents.at(-1)!.level >= level) parents.pop()
    const children: ContentsItem[] = []
    const target = parents.at(-1)?.children ?? items
    target.push({
      label: node.textContent?.trim() || section.title,
      href: `#${node.id}`,
      subitems: children,
    })
    parents.push({ level, children })
  }
  return items
}

async function snapshot(
  source: DocxDocument,
  properties: ReturnType<typeof readArchive>,
  file: File,
  signal: AbortSignal,
  m: Messages
): Promise<BookSnapshot> {
  const model = source.document
  if (model.parseError) throw new Error("invalid")
  const title =
    properties.title || file.name.replace(extension, "").trim() || file.name
  const doc = document.implementation.createHTMLDocument(title)
  const asset = imageSource(source, properties.entries, signal)
  const notes = new Map<string, DocNote>()
  for (const note of model.footnotes ?? [])
    notes.set(`footnote-${note.id}`, note)
  for (const note of model.endnotes ?? []) notes.set(`endnote-${note.id}`, note)
  const references = new Map<
    string,
    { id: string; label: string; note: DocNote }
  >()
  const ctx: RenderContext = {
    doc,
    signal,
    async image(run) {
      return (
        (await asset.load(run.svgImagePath, "image/svg+xml")) ??
        (await asset.load(run.imagePath, run.mimeType))
      )
    },
    note(kind, id) {
      const key = `${kind}-${id}`
      const previous = references.get(key)
      if (previous) return previous
      const source = notes.get(key)
      if (!source) return undefined
      const label = String(references.size + 1)
      const reference = { id: `word-note-${label}`, label, note: source }
      references.set(key, reference)
      return reference
    },
    imageUnavailable: m.imageUnavailable,
    anchors: new Set(),
    missing: false,
  }
  await renderBlocks(doc.body, model.body, ctx)
  if (!doc.body.textContent?.trim() && !doc.body.querySelector("img"))
    throw new Error("empty")
  const parts = sections(doc, title)
  if (references.size) {
    const node = doc.createElement("section")
    node.id = "word-notes"
    const heading = doc.createElement("h1")
    heading.textContent = m.supportingSections
    const list = doc.createElement("ol")
    node.append(heading, list)
    for (const ref of references.values()) {
      const row = doc.createElement("li")
      row.id = ref.id
      await renderBlocks(row, ref.note.content, ctx, false)
      list.append(row)
    }
    doc.body.append(node)
    parts.push({ node, title: m.supportingSections, supporting: true })
  }
  const toc = parts.flatMap(contents)
  let unresolved = false
  for (const link of doc.querySelectorAll('a[href^="#"]')) {
    if (!doc.getElementById(link.getAttribute("href")!.slice(1))) {
      link.removeAttribute("href")
      unresolved = true
    }
  }
  return {
    title,
    author: properties.author,
    description: properties.description,
    language: properties.language,
    contents: toc,
    chapters: parts.map(({ node, title, supporting }) => ({
      id: node.id,
      title,
      html: node.innerHTML,
      supporting,
    })),
    missing: ctx.missing || asset.images.missing,
    unresolved,
    cover: null,
  }
}

export async function convert(
  input: File,
  signal: AbortSignal,
  m: Messages,
  saving: () => void
) {
  const bytes = await input.arrayBuffer()
  signal.throwIfAborted()
  const properties = readArchive(bytes)
  const source = await DocxDocument.load(bytes, officeLoadOptions)
  try {
    signal.throwIfAborted()
    const book = await snapshot(source, properties, input, signal, m)
    saving()
    const file = await writeEpub(book, signal, m)
    const { doc, notes } = readingDocument(book, {
      ...m,
      styleNotice: m.layoutNotice,
    })
    return { file, preview: readingPreview(doc), notes }
  } finally {
    source.destroy()
  }
}
