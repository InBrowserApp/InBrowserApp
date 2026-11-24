import {
  PDFArray,
  PDFDict,
  PDFDocument,
  PDFHexString,
  PDFName,
  PDFNumber,
  PDFString,
} from "pdf-lib"
import { expect, test } from "vitest"
import { readPdfBookmarks, writePdfBookmarks } from "./pdf-bookmarks"

const name = PDFName.of

async function sample() {
  const document = await PDFDocument.create()
  document.setTitle("Sample manual")
  for (let index = 0; index < 3; index++) document.addPage([300 + index, 480])
  return document
}

async function reopen(document: PDFDocument) {
  return readPdfBookmarks(new Uint8Array(await document.save()).buffer)
}

test("adds Unicode outline entries and preserves page objects, metadata and sibling links", async () => {
  const pdf = await reopen(await sample())
  expect(pdf.bookmarks).toEqual([])
  const bookmarks = [
    { id: 0, depth: 0, page: 3, title: "第 3 章 🌐" },
    { id: 1, depth: 1, page: 2, title: "Appendix" },
    { id: 2, depth: 0, page: 1, title: "Introduction" },
  ]
  const saved = await readPdfBookmarks(
    new Uint8Array(await writePdfBookmarks(pdf, bookmarks)).buffer
  )
  expect(saved.bookmarks).toEqual(bookmarks)
  expect(saved.document.getTitle()).toBe("Sample manual")
  expect(saved.document.getPages().map((page) => page.getWidth())).toEqual([
    300, 301, 302,
  ])

  const outline = saved.document.catalog.lookup(name("Outlines"), PDFDict)
  const first = outline.lookup(name("First"), PDFDict)
  const last = outline.lookup(name("Last"), PDFDict)
  const child = first.lookup(name("First"), PDFDict)
  expect(first.lookup(name("Next"))).toBe(last)
  expect(last.lookup(name("Prev"))).toBe(first)
  expect(child.lookup(name("Parent"))).toBe(first)
  expect(first.lookup(name("Parent"))).toBe(outline)
  expect(outline.lookup(name("Count"), PDFNumber).asNumber()).toBe(3)
  expect(first.lookup(name("Count"), PDFNumber).asNumber()).toBe(1)
  expect(pdf.document.catalog.get(name("Outlines"))).toBeUndefined()
})

test("keeps precise, named, and external destinations and collapsed appearance until a bookmark is retargeted", async () => {
  const document = await sample()
  const { catalog, context } = document
  const page1 = document.getPage(0)
  const page2 = document.getPage(1)
  const page3 = document.getPage(2)
  const urlAction = context.register(
    context.obj({ S: "URI", URI: PDFString.of("https://example.com") })
  )
  const precise = [page2.ref, name("XYZ"), 12, 40, 1.25]
  const named = context.register(context.obj({ D: precise }))
  // Exercise both a PDF 1.x name dictionary and a PDF 2.0 name tree.
  catalog.set(name("Dests"), context.obj({ Legacy: [page3.ref, name("Fit")] }))
  const utf8 = PDFHexString.of("EFBBBFE7AB99")
  const nameTree = context.obj({ Names: [utf8, named] })
  catalog.set(
    name("Names"),
    context.obj({
      Dests: { Kids: [context.register(nameTree), 42] },
    })
  )

  const root = context.obj({ Type: "Outlines" })
  const rootRef = context.register(root)
  const first = context.obj({
    Title: PDFHexString.of("EFBBBFE4B8ADE69687"),
    Parent: rootRef,
    Count: -1,
    F: 2,
    C: [1, 0, 0],
    A: { S: "GoTo", D: utf8 },
  })
  const firstRef = context.register(first)
  const child = context.register(
    context.obj({
      Parent: firstRef,
      Title: PDFString.of("Child"),
      Dest: "Legacy",
    })
  )
  first.set(name("First"), child)
  first.set(name("Last"), child)
  const external = context.register(
    context.obj({
      Parent: rootRef,
      Prev: firstRef,
      Title: PDFString.of("Site"),
      A: urlAction,
    })
  )
  first.set(name("Next"), external)
  root.set(name("First"), firstRef)
  root.set(name("Last"), external)
  catalog.set(name("Outlines"), rootRef)

  const pdf = await reopen(document)
  expect(pdf.bookmarks.map(({ title, page }) => [title, page])).toEqual([
    ["中文", 2],
    ["Child", 3],
    ["Site", null],
  ])
  const section = pdf.bookmarks[0]!
  const detail = pdf.bookmarks[1]!
  const site = pdf.bookmarks[2]!
  const edited = [{ ...section, title: "新标题" }, detail, { ...site, page: 1 }]
  const saved = await readPdfBookmarks(
    new Uint8Array(await writePdfBookmarks(pdf, edited)).buffer
  )
  expect(saved.bookmarks).toEqual(edited)
  const outline = saved.document.catalog.lookup(name("Outlines"), PDFDict)
  const heading = outline.lookup(name("First"), PDFDict)
  const changed = outline.lookup(name("Last"), PDFDict)
  expect(outline.lookup(name("Count"), PDFNumber).asNumber()).toBe(2)
  expect(heading.lookup(name("Count"), PDFNumber).asNumber()).toBe(-1)
  expect(heading.get(name("F"))?.toString()).toBe("2")
  expect(heading.get(name("C"))?.toString()).toBe("[ 1 0 0 ]")
  expect(heading.lookup(name("A"), PDFDict).get(name("D"))?.toString()).toBe(
    utf8.toString()
  )
  expect(heading.get(name("Dest"))).toBeUndefined()
  expect(changed.get(name("A"))).toBeUndefined()
  expect(changed.lookup(name("Dest"), PDFArray).toString()).toBe(
    `[ ${page1.ref} /Fit ]`
  )

  const repeated = await readPdfBookmarks(
    new Uint8Array(await writePdfBookmarks(pdf, [site])).buffer
  )
  expect(repeated.document.context.lookup(firstRef)).toBeUndefined()
  expect(repeated.source.get(0)?.dictionary.get(name("A"))).toBe(urlAction)
  const empty = await readPdfBookmarks(
    new Uint8Array(await writePdfBookmarks(pdf, [])).buffer
  )
  expect(empty.bookmarks).toEqual([])
  expect(empty.document.context.lookup(rootRef)).toBeUndefined()
  expect(empty.document.getPageCount()).toBe(3)
  expect(pdf.bookmarks).toEqual([section, detail, site])
})

test("imports a partial outline with unsupported, numeric and missing destinations", async () => {
  const document = await sample()
  const { catalog, context } = document
  catalog.set(
    name("Names"),
    context.obj({ Dests: { Names: [PDFString.of("First"), [0, name("Fit")]] } })
  )
  const root = context.obj({ Type: "Outlines" })
  catalog.set(name("Outlines"), root)
  const specs = [
    { Title: PDFString.of("First"), Dest: PDFString.of("First") },
    { Title: PDFString.of("Invalid"), Dest: [99, name("Fit")] },
    { Title: PDFString.of("Missing"), Dest: PDFString.of("Missing") },
    { Title: PDFNumber.of(4), A: { S: "GoToR", D: [0, name("Fit")] } },
    { Title: PDFString.of("Empty destination"), Dest: [] },
    {
      Title: PDFString.of("Missing page"),
      Dest: [context.nextRef(), name("Fit")],
    },
  ]
  const refs = specs.map((spec) => context.register(context.obj(spec)))
  for (let i = 0; i < refs.length; i++) {
    const item = context.lookup(refs[i]!, PDFDict)
    item.set(name("Next"), refs[i + 1] ?? refs[1]!)
  }
  root.set(name("First"), context.lookup(refs[0]!, PDFDict))
  const pdf = await reopen(document)
  expect(pdf.bookmarks.map(({ title, page }) => [title, page])).toEqual([
    ["First", 1],
    ["Invalid", null],
    ["Missing", null],
    ["", null],
    ["Empty destination", null],
    ["Missing page", null],
  ])
  const edited = await readPdfBookmarks(
    new Uint8Array(await writePdfBookmarks(pdf, pdf.bookmarks)).buffer
  )
  expect(edited.bookmarks).toEqual(pdf.bookmarks)
})
