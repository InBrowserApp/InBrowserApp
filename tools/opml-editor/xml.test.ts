// @vitest-environment jsdom
import { expect, test } from "vitest"
import {
  addOutline,
  documentTitle,
  isFeed,
  newOutline,
  outlineMoves,
  outlineName,
  outlineRows,
  parseOpml,
  readOpmlFile,
  serializeOpml,
  setDocumentTitle,
  setOutlineName,
  setOutlineAddress,
  validFeedAddress,
} from "./xml"

test("preserves the OPML version, other head fields and namespaced attributes on round-trip", () => {
  const source = `<?xml version="1.0"?>
    <!-- retained -->
    <opml version="1.0" xmlns:ext="urn:vendor">
      <head><title>Before</title><ownerName>Åsa</ownerName></head>
      <body>
        <outline text="Tech" ext:flag="x">
          <outline type="rss" text="Old name" title="Old name" xmlUrl="https://example.test/rss?q=1&amp;lang=ja" ext:date="2026"/>
        </outline>
      </body>
    </opml>`
  const doc = parseOpml(source)
  expect(documentTitle(doc)).toBe("Before")
  setDocumentTitle(doc, "Feeds & friends")
  const feed = outlineRows(doc)[1]!.node
  expect(isFeed(feed)).toBe(true)
  setOutlineName(feed, "日本語のニュース")
  const exported = serializeOpml(doc)
  expect(exported).toContain('encoding="UTF-8"')
  expect(exported).toContain("<!-- retained -->")
  const reread = parseOpml(exported)
  expect(reread.root.getAttribute("version")).toBe("1.0")
  expect(documentTitle(reread)).toBe("Feeds & friends")
  expect(reread.root.querySelector("ownerName")?.textContent).toBe("Åsa")
  const [folder, nested] = outlineRows(reread)
  expect(folder!.node.getAttributeNS("urn:vendor", "flag")).toBe("x")
  expect(nested!.depth).toBe(1)
  expect(nested!.node.getAttributeNS("urn:vendor", "date")).toBe("2026")
  expect(nested!.node.getAttribute("title")).toBe("Old name")
  expect(outlineName(nested!.node)).toBe("日本語のニュース")
  expect(nested!.node.getAttribute("xmlUrl")).toBe(
    "https://example.test/rss?q=1&lang=ja"
  )
})

test("moves, indents and outdents entries without losing descendants or nesting into feeds", () => {
  const doc = newOutline()
  const a = addOutline(doc, null, "A", false)
  const b = addOutline(doc, null, "B", false)
  const c = addOutline(doc, b, "C", true)
  expect(outlineMoves(a, doc.body).moveUp).toBeUndefined()
  expect(outlineMoves(a, doc.body).outdent).toBeUndefined()
  outlineMoves(b, doc.body).indent!()
  expect(
    outlineRows(doc).map(({ node, depth }) => [outlineName(node), depth])
  ).toEqual([
    ["A", 0],
    ["B", 1],
    ["C", 2],
  ])
  outlineMoves(b, doc.body).outdent!()
  outlineMoves(b, doc.body).moveUp!()
  expect(outlineRows(doc).map(({ node }) => outlineName(node))).toEqual([
    "B",
    "C",
    "A",
  ])
  outlineMoves(b, doc.body).moveDown!()
  expect(outlineRows(doc).map(({ node }) => outlineName(node))).toEqual([
    "A",
    "B",
    "C",
  ])
  const d = addOutline(doc, c, "D", true)
  expect(outlineMoves(d, doc.body).indent).toBeUndefined()
  expect(d.parentElement).toBe(b)
})

test("creates missing head metadata, handles declared encodings and validates document shape", async () => {
  const doc = parseOpml('<opml><body><outline title="Fallback"/></body></opml>')
  expect(documentTitle(doc)).toBe("")
  expect(outlineName(outlineRows(doc)[0]!.node)).toBe("Fallback")
  setDocumentTitle(doc, "New title")
  expect(doc.root.firstElementChild?.localName).toBe("head")
  expect(documentTitle(doc)).toBe("New title")

  const raw =
    '<?xml version="1.0" encoding="iso-8859-1"?><opml><head><title>Café</title></head><body/></opml>'
  const bytes = Uint8Array.from(raw, (char) => char.charCodeAt(0)).buffer
  const fromFile = await readOpmlFile({
    arrayBuffer: async () => bytes,
  } as Blob)
  expect(documentTitle(fromFile)).toBe("Café")
  const utf16 = new Uint8Array([
    0xff,
    0xfe,
    ...Array.from("<opml><body/></opml>").flatMap((char) => [
      char.charCodeAt(0),
      0,
    ]),
  ]).buffer
  expect(
    (await readOpmlFile({ arrayBuffer: async () => utf16 } as Blob)).body
      .localName
  ).toBe("body")

  for (const input of [
    "<opml><body>",
    "<opml><head/></opml>",
    "<opml><body/><body/></opml>",
    '<opml><body/><parsererror xmlns="http://www.w3.org/1999/xhtml"/></opml>',
    "<rss/>",
    "<!DOCTYPE opml><opml><body/></opml>",
  ]) {
    expect(() => parseOpml(input)).toThrow("invalid")
  }
})

test("keeps an independent feed title and exports valid XML after editing unusual text", () => {
  const doc = parseOpml(
    '<opml version="2.0"><body><outline text="My feed" title="Publisher title" xmlUrl="https://example.test" htmlUrl="https://example.test"/></body></opml>'
  )
  const feed = outlineRows(doc)[0]!.node
  setDocumentTitle(doc, "Feeds\u0000 and updates")
  setOutlineName(feed, "Alias \u0001 & 🚀")
  setOutlineAddress(feed, "xmlUrl", "https://example.test/rss?a=1&b=2")
  setOutlineAddress(feed, "htmlUrl", "")
  const reread = parseOpml(serializeOpml(doc))
  const node = outlineRows(reread)[0]!.node
  expect(documentTitle(reread)).toBe("Feeds and updates")
  expect(outlineName(node)).toBe("Alias  & 🚀")
  expect(node.getAttribute("title")).toBe("Publisher title")
  expect(node.getAttribute("xmlUrl")).toBe("https://example.test/rss?a=1&b=2")
  expect(node.hasAttribute("htmlUrl")).toBe(false)
})

test("recognizes RSS and Atom entries with missing or malformed addresses", () => {
  const doc = parseOpml(
    '<opml><body><outline type="rss" text="No address"/><outline type="Atom" text="Broken" xmlUrl="not a URL"/></body></opml>'
  )
  const [rss, atom] = outlineRows(doc).map(({ node }) => node)
  expect(doc.root.getAttribute("version")).toBe("2.0")
  expect(isFeed(rss!)).toBe(true)
  expect(isFeed(atom!)).toBe(true)
  expect(validFeedAddress(rss!)).toBe(false)
  expect(validFeedAddress(atom!)).toBe(false)
  setOutlineAddress(atom!, "xmlUrl", "https://example.test/feed")
  expect(validFeedAddress(atom!)).toBe(true)
})
