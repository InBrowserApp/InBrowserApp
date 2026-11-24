import { PDFDict, PDFDocument, PDFHexString, PDFNumber, PDFRef } from "pdf-lib"

import type { Bookmark } from "./bookmarks"
import {
  createPageResolver,
  pdfName,
  readText,
  setPage,
} from "./pdf-destinations"

type SourceBookmark = {
  bookmark: Bookmark
  dictionary: PDFDict
  reference: PDFRef | null
}
export type PdfBookmarks = Awaited<ReturnType<typeof readPdfBookmarks>>

export async function readPdfBookmarks(bytes: ArrayBuffer) {
  const document = await PDFDocument.load(bytes, { updateMetadata: false })
  const outline = document.catalog.lookup(pdfName("Outlines"))
  const source = new Map<number, SourceBookmark>()
  const resolvePage = createPageResolver(document)
  const seen = new Set([outline])
  const pending = [
    {
      reference:
        outline instanceof PDFDict ? outline.get(pdfName("First")) : undefined,
      depth: 0,
    },
  ]
  while (pending.length) {
    const { reference, depth } = pending.pop()!
    const item = document.context.lookup(reference)
    if (!(item instanceof PDFDict) || seen.has(item)) continue
    seen.add(item)
    const bookmark = {
      id: source.size,
      depth,
      title: readText(item.lookup(pdfName("Title"))),
      page: resolvePage(item),
    }
    source.set(bookmark.id, {
      bookmark,
      dictionary: item,
      reference: reference instanceof PDFRef ? reference : null,
    })
    pending.push({ reference: item.get(pdfName("Next")), depth })
    pending.push({ reference: item.get(pdfName("First")), depth: depth + 1 })
  }

  return {
    document,
    source,
    bookmarks: Array.from(source.values(), ({ bookmark }) => bookmark),
    pageCount: document.getPageCount(),
  }
}

type OutlineItem = {
  dictionary: PDFDict
  reference: PDFRef
  visibleChildren: number
  open: boolean
  last?: OutlineItem
  parent?: OutlineItem
}

export async function writePdfBookmarks(
  pdf: PdfBookmarks,
  bookmarks: Bookmark[]
) {
  const { document, source } = pdf
  const { catalog, context } = document
  const outlines = pdfName("Outlines")
  const originalOutline = catalog.get(outlines)
  const existing = catalog.lookup(outlines)
  const originals = new Map<PDFRef, PDFDict>()
  if (originalOutline instanceof PDFRef && existing instanceof PDFDict) {
    originals.set(originalOutline, existing)
  }
  for (const { reference, dictionary } of source.values()) {
    if (reference) originals.set(reference, dictionary)
  }
  const nodes = bookmarks.length ? buildOutline(pdf, bookmarks) : []

  try {
    for (const reference of originals.keys()) context.delete(reference)
    for (const { reference, dictionary } of nodes)
      context.assign(reference, dictionary)
    const root = nodes[0]
    if (root) {
      catalog.set(outlines, root.reference)
    } else {
      catalog.delete(outlines)
    }
    return await document.save({
      updateFieldAppearances: false,
      addDefaultPage: false,
    })
  } finally {
    if (originalOutline) catalog.set(outlines, originalOutline)
    else catalog.delete(outlines)
    for (const { reference } of nodes) context.delete(reference)
    for (const [reference, dictionary] of originals)
      context.assign(reference, dictionary)
  }
}

function buildOutline(pdf: PdfBookmarks, bookmarks: Bookmark[]) {
  const { document, source } = pdf
  const { catalog, context } = document
  const existing = catalog.lookup(pdfName("Outlines"))
  const reference = catalog.get(pdfName("Outlines"))
  const dictionary =
    existing instanceof PDFDict
      ? existing.clone()
      : context.obj({ Type: "Outlines" })
  const root: OutlineItem = {
    dictionary,
    reference:
      existing instanceof PDFDict && reference instanceof PDFRef
        ? reference
        : context.nextRef(),
    visibleChildren: 0,
    open: true,
  }
  const nodes = [root]
  const parents = [root]
  const pages = document.getPages()

  for (const bookmark of bookmarks) {
    const original = source.get(bookmark.id)
    const item = original?.dictionary.clone() ?? context.obj({})
    const count = item.lookup(pdfName("Count"))
    for (const key of ["First", "Last", "Prev", "Next", "Count"])
      item.delete(pdfName(key))
    if (!original || bookmark.title !== original.bookmark.title) {
      item.set(pdfName("Title"), PDFHexString.fromText(bookmark.title))
    }
    if (bookmark.page !== null && bookmark.page !== original?.bookmark.page) {
      setPage(item, context, pages[bookmark.page - 1]!.ref)
    }

    const parent = parents[bookmark.depth]!
    const node: OutlineItem = {
      dictionary: item,
      reference: original?.reference ?? context.nextRef(),
      visibleChildren: 0,
      open: !(count instanceof PDFNumber && count.asNumber() < 0),
      parent,
    }
    const previous = parent.last
    item.set(pdfName("Parent"), parent.reference)
    if (previous) {
      previous.dictionary.set(pdfName("Next"), node.reference)
      item.set(pdfName("Prev"), previous.reference)
    } else {
      parent.dictionary.set(pdfName("First"), node.reference)
    }
    parent.dictionary.set(pdfName("Last"), node.reference)
    parent.last = node
    nodes.push(node)
    parents[bookmark.depth + 1] = node
  }

  for (let index = nodes.length - 1; index >= 0; index--) {
    const node = nodes[index]!
    if (node.visibleChildren) {
      node.dictionary.set(
        pdfName("Count"),
        PDFNumber.of(node.open ? node.visibleChildren : -node.visibleChildren)
      )
    }
    if (node.parent)
      node.parent.visibleChildren += 1 + (node.open ? node.visibleChildren : 0)
  }
  return nodes
}
